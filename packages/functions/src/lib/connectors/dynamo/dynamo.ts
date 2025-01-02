// types.ts
interface DynamoDbConfig {
  tableName: string;
  region: string;
}

interface QueryParams {
  index?: string;
  limit?: number;
  startKey?: Record<string, any>;
  filterExpression?: string;
  expressionValues?: Record<string, any>;
}

// dynamodb.service.ts
class DynamoDbService {
  private readonly client: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor(config: DynamoDbConfig) {
    this.client = new AWS.DynamoDB.DocumentClient({ region: config.region });
    this.tableName = config.tableName;
  }

  async get<T>(pk: string, sk: string): Promise<T | null> {
    const result = await this.client
      .get({
        TableName: this.tableName,
        Key: { pk, sk },
      })
      .promise();

    return (result.Item as T) || null;
  }

  async put<T extends Record<string, any>>(item: T): Promise<void> {
    await this.client
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async query<T>(
    keyCondition: string,
    params: QueryParams = {}
  ): Promise<{ items: T[]; lastKey?: Record<string, any> }> {
    const result = await this.client
      .query({
        TableName: this.tableName,
        IndexName: params.index,
        KeyConditionExpression: keyCondition,
        FilterExpression: params.filterExpression,
        ExpressionAttributeValues: params.expressionValues,
        Limit: params.limit,
        ExclusiveStartKey: params.startKey,
      })
      .promise();

    return {
      items: result.Items as T[],
      lastKey: result.LastEvaluatedKey,
    };
  }

  async batchWrite<T extends Record<string, any>>(items: T[]): Promise<void> {
    const batches = chunk(items, 25).map((batch) => ({
      RequestItems: {
        [this.tableName]: batch.map((item) => ({
          PutRequest: { Item: item },
        })),
      },
    }));

    await Promise.all(
      batches.map((batch) => this.client.batchWrite(batch).promise())
    );
  }

  async update(
    pk: string,
    sk: string,
    updateExpression: string,
    expressionValues: Record<string, any>
  ): Promise<void> {
    await this.client
      .update({
        TableName: this.tableName,
        Key: { pk, sk },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionValues,
      })
      .promise();
  }

  async delete(pk: string, sk: string): Promise<void> {
    await this.client
      .delete({
        TableName: this.tableName,
        Key: { pk, sk },
      })
      .promise();
  }
}

// users.repository.ts
class UserRepository {
  private readonly db: DynamoDbService;

  constructor(config: DynamoDbConfig) {
    this.db = new DynamoDbService(config);
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.db.get<User>(`USER#${userId}`, `METADATA#${userId}`);
  }

  async getUsersByEmail(email: string): Promise<User[]> {
    const result = await this.db.query<User>("gsi1pk = :pk AND gsi1sk = :sk", {
      index: "gsi1",
      expressionValues: {
        ":pk": "USER",
        ":sk": email,
      },
    });

    return result.items;
  }

  async createUser(user: User): Promise<void> {
    const record = new UserRecordBuilder()
      .withPrimaryKey(`USER#${user.id}`, `METADATA#${user.id}`)
      .withGSI1("USER", user.email)
      .withData(user)
      .build();

    await this.db.put(record);
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
    await this.db.update(
      `USER#${userId}`,
      `METADATA#${userId}`,
      "SET #status = :status, updatedAt = :now",
      {
        ":status": status,
        ":now": Date.now(),
      }
    );
  }
}

// Example usage:
async function handleUserRegistration(userData: UserInput) {
  const userRepo = new UserRepository({
    tableName: process.env.USERS_TABLE!,
    region: process.env.AWS_REGION!,
  });

  // Check if email exists
  const existingUsers = await userRepo.getUsersByEmail(userData.email);
  if (existingUsers.length > 0) {
    throw new Error("Email already exists");
  }

  // Create user
  await userRepo.createUser({
    id: uuid(),
    ...userData,
    status: UserStatus.PENDING,
  });
}
