import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PaginatedResponse,
  PaginationParams,
} from "../../../lib/types/common.types";
import { DynamoRecord } from "../builders/data-point.builder";
import { DynamoDBService, DynamoDBServiceConfig } from "../dynamo.service";
import { Resource } from "sst/resource";

export class DataPointDynamoService extends DynamoDBService {
  constructor() {
    super(Resource["AOT-DataPoints"].name);
  }

  /**
   * Save a single data point
   */
  public async saveDataPoint(record: DynamoRecord): Promise<void> {
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
   * Query macro data points
   */
  async getMacroDataPoints(): Promise<PaginatedResponse<DynamoRecord>> {
    return this.query({
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "MACRO",
      },
    });
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
        KeyConditionExpression: "GSI2PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `${frequency}#${metricType}`,
        },
      },
      paginationParams
    );
  }
}
