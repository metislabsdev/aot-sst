import { DATA_SOURCES } from "./connectors/dynamo/models/data-sources";
import { INVESTMENT_DATA_TYPES } from "./connectors/dynamo/models/investments.model";

export interface DataPoint {
  value: number;
  timestamp: number;
  frequency: Frequency;
  InvestmentType: INVESTMENT_DATA_TYPES;
  source: DATA_SOURCES;
  type: INVESTMENT_DATA_TYPES;
}

enum Frequency {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum DATA_POINT_TYPES {}
