import { Resource } from "sst";
import { HttpService } from "../../../clients/http/http.service";
import { DATA_SOURCES } from "../../../models/data-sources";
import {
  ASSET_CLASSES,
  INVESTMENT_DATA_TYPES,
} from "../../../models/investments.model";
import { FREQUENCY } from "../../../models/data-point.model";
import { CRYPTO_MARKET_DATA_POINTS } from "../../../models/crypto.model";
import { convertISOToTimestamp } from "../../utils/date";
import { DataPointBuilder } from "../../../clients/dynamo/builders/data-point.builder";
import { DataPointDynamoService } from "../../../clients/dynamo/services/data-point.service";
import { FearGreedResponse } from "./coin-market-cap.interface";

export class CoinMarketCap extends HttpService {
  private readonly baseUrl = "https://pro-api.coinmarketcap.com";
  private readonly method = "GET";
  private readonly headers = {
    "X-CMC_PRO_API_KEY": Resource.CoinMarketCapApiKey.value,
  };
  private readonly params = {};
  public readonly DATA_SOURCE = DATA_SOURCES.COIN_MARKET_CAP;
  private readonly dynamoDbService = new DataPointDynamoService();

  constructor() {
    super();
  }

  public async getFearGreedIndex(): Promise<FearGreedResponse> {
    const response = await this.get<FearGreedResponse>(
      `${this.baseUrl}/v3/fear-and-greed/latest`,
      {
        headers: this.headers,
      }
    );

    const dataPoint = DataPointBuilder.toDynamoRecord({
      name: CRYPTO_MARKET_DATA_POINTS.FEAR_AND_GREED_INDEX,
      metricType: [INVESTMENT_DATA_TYPES.MACRO, INVESTMENT_DATA_TYPES.ASSET],
      assetClass: ASSET_CLASSES.CRYPTO,
      frequency: FREQUENCY.DAILY,
      source: DATA_SOURCES.COIN_MARKET_CAP,
      value: response.data.value,
      assetId: "BTC",
      timestamp: convertISOToTimestamp(response.data.update_time),
    });

    await this.dynamoDbService.saveDataPoint(dataPoint);

    return response;
  }
}
