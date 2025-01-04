import { ASSET_DATA_POINTS } from "./asset.model";
import { CRYPTO_MARKET_DATA_POINTS } from "./crypto.model";
import { DATA_SOURCES } from "./data-sources";
import { INVESTMENT_DATA_TYPES } from "./investments.model";

export interface DataPoint {
  name: DataPointName; // enum name for the data point
  value: number; // value of API endpoint returned
  timestamp: number; // unix timestamp
  frequency: Frequency;
  InvestmentType: [INVESTMENT_DATA_TYPES]; // market, asset, macro
  type: [INVESTMENT_DATA_TYPES]; // market, asset, macro
  source: DATA_SOURCES; // api, webhook, etc
  payload: string; // json blob of api response if needed
}

type DataPointName = CRYPTO_MARKET_DATA_POINTS | ASSET_DATA_POINTS;

enum Frequency {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
