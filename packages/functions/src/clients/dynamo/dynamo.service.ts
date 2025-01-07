import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  BatchWriteCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommandInput,
  BatchWriteCommandInput,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { CustomError } from "../../lib/errors/custom-error";
import {
  PaginationParams,
  PaginatedResponse,
} from "../../lib/types/common.types";

export class DynamoDBError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, "DYNAMODB_ERROR", 500, details);
  }
}

export interface DynamoDBServiceConfig {
  tableName: string;
  clientConfig?: DynamoDBClientConfig;
}

export class DynamoDBService {
  private static instance: DynamoDBService;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  protected constructor(tableName: string) {
    const client = new DynamoDBClient();
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;

    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      },
    });
  }

  /**
   * Put a single item into DynamoDB
   */
  protected async putItem<T>(item: T): Promise<void> {
    try {
      const params: PutCommandInput = {
        TableName: this.tableName,
        Item: item as Record<string, any>,
      };

      await this.docClient.send(new PutCommand(params));
    } catch (error) {
      throw new DynamoDBError("Failed to put item", error);
    }
  }

  /**
   * Batch write items to DynamoDB
   */
  protected async batchWrite<T>(items: T[]): Promise<void> {
    try {
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [this.tableName]: items.map((item) => ({
            PutRequest: {
              Item: item as Record<string, any>,
            },
          })),
        },
      };

      await this.docClient.send(new BatchWriteCommand(params));
    } catch (error) {
      throw new DynamoDBError("Failed to batch write items", error);
    }
  }

  /**
   * Query items with pagination
   */
  protected async query<T>(
    params: Omit<QueryCommandInput, "TableName">,
    paginationParams?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    try {
      const queryParams: QueryCommandInput = {
        ...params,
        TableName: this.tableName,
        Limit: paginationParams?.limit,
        ExclusiveStartKey: paginationParams?.nextToken
          ? JSON.parse(
              Buffer.from(paginationParams.nextToken, "base64").toString()
            )
          : undefined,
      };

      const response = await this.docClient.send(new QueryCommand(queryParams));

      return {
        items: (response.Items || []) as T[],
        nextToken: response.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString(
              "base64"
            )
          : undefined,
      };
    } catch (error) {
      throw new DynamoDBError("Failed to query items", error);
    }
  }

  /**
   * Get a single item by key
   */
  protected async getItem<T>(key: Record<string, any>): Promise<T | null> {
    try {
      const response = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: key,
        })
      );

      return (response.Item as T) || null;
    } catch (error) {
      throw new DynamoDBError("Failed to get item", error);
    }
  }

  /**
   * Delete an item by key
   */
  protected async deleteItem(key: Record<string, any>): Promise<void> {
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: key,
        })
      );
    } catch (error) {
      throw new DynamoDBError("Failed to delete item", error);
    }
  }

  /**
   * Update an item
   */
  protected async updateItem(
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<void> {
    try {
      await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: key,
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ExpressionAttributeNames: expressionAttributeNames,
        })
      );
    } catch (error) {
      throw new DynamoDBError("Failed to update item", error);
    }
  }

  protected getDocumentClient(): DynamoDBDocumentClient {
    return this.docClient;
  }
}
