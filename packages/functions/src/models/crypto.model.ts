import { ASSET_DATA_POINTS } from "./asset.model";
import { DATA_SOURCES } from "./data-sources";

export enum CRYPTO_MARKET_DATA_POINTS {
  FEAR_AND_GREED_INDEX = "FEAR_AND_GREED_INDEX",
  TETHER_MARKET_CAP = "TETHER_MARKET_CAP",
  COIN_GECKO_TOTAL_MARKET_CAP = "COIN_GECKO_TOTAL_MARKET_CAP",
  BTC_24_HOUR_VOLUME = "BTC_24_HOUR_VOLUME",
}

export const CRYPTO_MACRO_DATA_SOURCES = new Map<
  CRYPTO_MARKET_DATA_POINTS,
  { sources: DATA_SOURCES[] }
>([
  [
    CRYPTO_MARKET_DATA_POINTS.FEAR_AND_GREED_INDEX,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP] },
  ],
  [
    CRYPTO_MARKET_DATA_POINTS.TETHER_MARKET_CAP,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP] },
  ],
  [
    CRYPTO_MARKET_DATA_POINTS.COIN_GECKO_TOTAL_MARKET_CAP,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP] },
  ],
  [
    CRYPTO_MARKET_DATA_POINTS.BTC_24_HOUR_VOLUME,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP] },
  ],
]);

export const CRYPTO_ASSET_DATA_SOURCES = new Map<
  ASSET_DATA_POINTS,
  { sources: DATA_SOURCES[] }
>([
  [
    ASSET_DATA_POINTS.PRICE,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP, DATA_SOURCES.ALPACA] },
  ],
  [
    ASSET_DATA_POINTS.VOLUME,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP, DATA_SOURCES.ALPACA] },
  ],
  [
    ASSET_DATA_POINTS.MARKET_CAP,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP, DATA_SOURCES.ALPACA] },
  ],
  [
    ASSET_DATA_POINTS.PERCENT_CHANGE,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP, DATA_SOURCES.ALPACA] },
  ],
]);
