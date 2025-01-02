import { DATA_SOURCES } from "./connectors/dynamo/models/data-sources";
import { INVESTMENT_DATA_TYPES } from "./connectors/dynamo/models/investments.model";

export interface DataPoint {
  name: string; // enum name for the data point
  value: number;
  timestamp: number;
  frequency: Frequency;
  InvestmentType: INVESTMENT_DATA_TYPES;
  source: DATA_SOURCES;
  type: INVESTMENT_DATA_TYPES;
  dataSource: DATA_SOURCES;
  payload: string; // json blob of api response if needed
}

enum Frequency {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
