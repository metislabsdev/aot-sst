import AotDatPoints from "./dynamo-data-points";
import { COIN_MARKET_CAP_API_KEY } from "./secrets";
import worker from "./worker";

export const AotApi = new sst.aws.Function("AotApi", {
  url: true,
  handler: "packages/functions/src/api.handler",
  link: [worker, AotDatPoints, COIN_MARKET_CAP_API_KEY],
});
