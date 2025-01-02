// First define your base types
interface DynamoRecord {
  pk: string;
  sk: string;
  gsi1pk?: string;
  gsi1sk?: string;
  createdAt: number;
  updatedAt: number;
  ttl?: number;
}

// Define your specific record type
interface UserRecord extends DynamoRecord {
  userId: string;
  email: string;
  status: UserStatus;
  metadata?: Record<string, unknown>;
}

// Create a builder class
class DynamoRecordBuilder<T extends DynamoRecord> {
  private record: Partial<T>;

  constructor() {
    this.record = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  withPrimaryKey(pk: string, sk: string): this {
    this.record.pk = pk;
    this.record.sk = sk;
    return this;
  }

  withGSI1(pk: string, sk: string): this {
    this.record.gsi1pk = pk;
    this.record.gsi1sk = sk;
    return this;
  }

  withTTL(ttlInDays: number): this {
    this.record.ttl = Math.floor(Date.now() / 1000) + ttlInDays * 86400;
    return this;
  }

  withData(data: Partial<T>): this {
    this.record = {
      ...this.record,
      ...data,
    };
    return this;
  }

  build(): T {
    // Validate required fields
    if (!this.record.pk || !this.record.sk) {
      throw new Error("Primary key fields are required");
    }

    return this.record as T;
  }
}

// Example usage for a specific record type
class UserRecordBuilder extends DynamoRecordBuilder<UserRecord> {
  withUserId(userId: string): this {
    return this.withData({ userId });
  }

  withEmail(email: string): this {
    return this.withData({ email });
  }

  withStatus(status: UserStatus): this {
    return this.withData({ status });
  }

  withMetadata(metadata: Record<string, unknown>): this {
    return this.withData({ metadata });
  }
}

// Helper function to write to DynamoDB
async function putRecord<T extends DynamoRecord>(
  tableName: string,
  record: T
): Promise<void> {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  await dynamodb
    .put({
      TableName: tableName,
      Item: record,
    })
    .promise();
}

// Example usage:
async function createUser(userId: string, email: string): Promise<void> {
  const record = new UserRecordBuilder()
    .withPrimaryKey(`USER#${userId}`, `METADATA#${userId}`)
    .withGSI1("USER", email)
    .withUserId(userId)
    .withEmail(email)
    .withStatus(UserStatus.ACTIVE)
    .withTTL(90) // 90 days TTL
    .build();

  await putRecord("UsersTable", record);
}
