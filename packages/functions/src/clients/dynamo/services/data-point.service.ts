import {
  PaginatedResponse,
  PaginationParams,
} from "../../../lib/types/common.types";
import { DynamoRecord } from "../builders/data-point.builder";
import { DynamoDBService, DynamoDBServiceConfig } from "../dynamo.service";

export class DataPointDynamoService extends DynamoDBService {
  private constructor(config: DynamoDBServiceConfig) {
    super(config);
  }

  public static getInstance(
    config: DynamoDBServiceConfig
  ): DataPointDynamoService {
    return super.getInstance(config) as DataPointDynamoService;
  }

  /**
   * Save a single data point
   */
  async saveDataPoint(record: DynamoRecord): Promise<void> {
    await this.putItem(record);
  }

  /**
   * Save multiple data points
   */
  async batchSaveDataPoints(records: DynamoRecord[]): Promise<void> {
    await this.batchWrite(records);
  }

  /**
   * Query data points by asset
   */
  async queryAssetDataPoints(
    assetClass: string,
    assetId: string,
    paginationParams?: PaginationParams
  ): Promise<PaginatedResponse<DynamoRecord>> {
    return this.query(
      {
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `${assetClass}#${assetId}`,
        },
      },
      paginationParams
    );
  }

  /**
   * Query data points by frequency
   */
  async queryByFrequency(
    frequency: string,
    metricType: string,
    paginationParams?: PaginationParams
  ): Promise<PaginatedResponse<DynamoRecord>> {
    return this.query(
      {
        IndexName: "GSI2",
        KeyConditionExpression: "GSI2PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `${frequency}#${metricType}`,
        },
      },
      paginationParams
    );
  }
}
