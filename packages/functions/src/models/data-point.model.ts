import { ASSET_DATA_POINTS } from "./asset.model";
import { CRYPTO_MARKET_DATA_POINTS } from "./crypto.model";
import { DATA_SOURCES } from "./data-sources";
import { ASSET_CLASSES, INVESTMENT_DATA_TYPES } from "./investments.model";

export interface DataPoint {
  name: DataPointName; // enum name for the data point
  value: number; // value of API endpoint returned
  timestamp: number; // unix timestamp
  frequency: FREQUENCY;
  metricType: [INVESTMENT_DATA_TYPES]; // asset, macro
  assetClass: [ASSET_CLASSES]; // Stock, CRYPTO, REAL_ESTATE
  source: DATA_SOURCES; // 3rd party API provider, webhook, etc
  assetId: string; // id of the asset if it is an asset
  ttl: number; // unix timestamp for when the data point expires
}

type DataPointName = CRYPTO_MARKET_DATA_POINTS | ASSET_DATA_POINTS;

export enum FREQUENCY {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
