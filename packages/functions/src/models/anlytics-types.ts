import { CRYPTO_MARKET_DATA_POINTS } from "./crypto.model";
import { DATA_SOURCES } from "./data-sources";

export const CRYPTO_MACRO_DATA_SOURCES = new Map<
  CRYPTO_MARKET_DATA_POINTS,
  { sources: DATA_SOURCES[] }
>([
  [
    CRYPTO_MARKET_DATA_POINTS.FEAR_AND_GREED_INDEX,
    { sources: [DATA_SOURCES.COIN_MARKET_CAP] },
  ],
]);
