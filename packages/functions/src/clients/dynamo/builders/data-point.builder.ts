import { DataPoint, FREQUENCY } from "../../../models/data-point.model";
import { ASSET_DATA_POINTS } from "../../../models/asset.model";
import { CRYPTO_MARKET_DATA_POINTS } from "../../../models/crypto.model";
import {
  ASSET_CLASSES,
  INVESTMENT_DATA_TYPES,
} from "../../../models/investments.model";
import { DATA_SOURCES } from "../../../models/data-sources";

interface DynamoKeys {
  PK: string; // "MACRO" | "ASSET#{ASSET_CLASS}"
  SK: string; // "#{NAME}#${TIMESTAMP}"
  GSI1PK: string; // "#{ASSET_CLASS}#${NAME}" | "MACRO#${INDICATOR_NAME}"
  GSI1SK: string; // "#{TIMESTAMP}"
  GSI2PK: string; // "#{FREQUENCY}#${METRIC_TYPE}"
  GSI2SK: string; // "#{TIMESTAMP}"
}

export type DynamoRecord = DataPoint &
  DynamoKeys & {
    ttl?: number; // Optional TTL for DynamoDB record expiration
  };

export class DataPointBuilder {
  private dataPoint: DataPoint & DynamoKeys;

  constructor() {
    this.dataPoint = {} as DataPoint & DynamoKeys;
  }

  // Helper method to build DynamoDB keys
  private buildKeys(): void {
    const isMacro = this.dataPoint.metricType.includes(
      INVESTMENT_DATA_TYPES.MACRO
    );
    const timestamp = this.dataPoint.timestamp.toString();

    // Build Primary Key
    this.dataPoint.PK = isMacro
      ? "MACRO"
      : `ASSET#${this.dataPoint.assetClass[0]}`;

    this.dataPoint.SK = isMacro
      ? `${this.dataPoint.name}#${timestamp}`
      : `${this.dataPoint.assetId}#${timestamp}`;

    // Build GSI1
    this.dataPoint.GSI1PK = isMacro
      ? `MACRO#${this.dataPoint.name}`
      : `${this.dataPoint.assetClass[0]}#${this.dataPoint.assetId}`;
    this.dataPoint.GSI1SK = timestamp;

    // Build GSI2
    this.dataPoint.GSI2PK = `${this.dataPoint.frequency}#${this.dataPoint.metricType[0]}`;
    this.dataPoint.GSI2SK = timestamp;
  }

  public setTTL(ttl: number): void {
    this.dataPoint.ttl = ttl;
  }

  //   // Example builder for CoinMarketCap price data
  //   public fromCoinMarketCapPrice(
  //     response: any,
  //     assetId: string
  //   ): DataPointBuilder {
  //     this.dataPoint.name = ASSET_DATA_POINTS.PRICE;
  //     this.dataPoint.value = response.data[assetId].quote.USD.price;
  //     this.dataPoint.timestamp = Math.floor(
  //       new Date(response.data[assetId].last_updated).getTime() / 1000
  //     );
  //     this.dataPoint.frequency = FREQUENCY.HOURLY;
  //     this.dataPoint.metricType = [INVESTMENT_DATA_TYPES.ASSET];
  //     this.dataPoint.assetClass = [ASSET_CLASSES.CRYPTO];
  //     this.dataPoint.source = DATA_SOURCES.COIN_MARKET_CAP;
  //     this.dataPoint.assetId = assetId;

  //     this.buildKeys();
  //     return this;
  //   }

  //   // Example builder for CoinMarketCap Fear & Greed Index
  //   public fromCoinMarketCapFearGreedIndex(response: any): DataPointBuilder {
  //     this.dataPoint.name = CRYPTO_MARKET_DATA_POINTS.FEAR_AND_GREED_INDEX;
  //     this.dataPoint.value = response.data.fear_and_greed_value;
  //     this.dataPoint.timestamp = Math.floor(
  //       new Date(response.data.timestamp).getTime() / 1000
  //     );
  //     this.dataPoint.frequency = FREQUENCY.DAILY;
  //     this.dataPoint.metricType = [INVESTMENT_DATA_TYPES.MACRO];
  //     this.dataPoint.assetClass = [ASSET_CLASSES.CRYPTO];
  //     this.dataPoint.source = DATA_SOURCES.COIN_MARKET_CAP;

  //     this.buildKeys();
  //     return this;
  //   }

  //   // Example builder for Alpaca stock price
  //   public fromAlpacaPrice(response: any, assetId: string): DataPointBuilder {
  //     this.dataPoint.name = ASSET_DATA_POINTS.PRICE;
  //     this.dataPoint.value = response.trade.price;
  //     this.dataPoint.timestamp = Math.floor(
  //       new Date(response.trade.timestamp).getTime() / 1000
  //     );
  //     this.dataPoint.frequency = FREQUENCY.HOURLY;
  //     this.dataPoint.metricType = [INVESTMENT_DATA_TYPES.ASSET];
  //     this.dataPoint.assetClass = [ASSET_CLASSES.STOCK];
  //     this.dataPoint.source = DATA_SOURCES.ALPACA;
  //     this.dataPoint.assetId = assetId;

  //     this.buildKeys();
  //     return this;
  //   }

  public build(): DataPoint & DynamoKeys {
    return this.dataPoint;
  }

  /**
   * Creates a DynamoDB record from a DataPoint
   * @param dataPoint The DataPoint to convert
   * @param ttl Optional TTL in seconds from now
   * @returns DynamoDB formatted record
   */
  public static toDynamoRecord(
    dataPoint: DataPoint,
    ttl?: number
  ): DynamoRecord {
    const timestamp = dataPoint.timestamp.toString();
    const isMacro = dataPoint.metricType.includes(INVESTMENT_DATA_TYPES.MACRO);

    const record: DynamoRecord = {
      ...dataPoint,
      // Primary Key
      PK: isMacro ? "MACRO" : `ASSET#${dataPoint.assetClass[0]}`,
      SK: isMacro
        ? `${dataPoint.name}#${timestamp}`
        : `${dataPoint.assetId}#${timestamp}`,

      // GSI1 - Asset/Macro specific queries
      GSI1PK: isMacro
        ? `MACRO#${dataPoint.name}`
        : `${dataPoint.assetClass[0]}#${dataPoint.assetId}`,
      GSI1SK: timestamp,

      // GSI2 - Frequency based queries
      GSI2PK: `${dataPoint.frequency}#${dataPoint.metricType[0]}`,
      GSI2SK: timestamp,
    };

    // Add TTL if provided
    if (ttl) {
      record.ttl = Math.floor(Date.now() / 1000) + ttl;
    }

    return record;
  }

  /**
   * Creates multiple DynamoDB records from an array of DataPoints
   * @param dataPoints Array of DataPoints to convert
   * @param ttl Optional TTL in seconds from now
   * @returns Array of DynamoDB formatted records
   */
  public static toDynamoRecords(
    dataPoints: DataPoint[],
    ttl?: number
  ): DynamoRecord[] {
    return dataPoints.map((dp) => DataPointBuilder.toDynamoRecord(dp, ttl));
  }
}
