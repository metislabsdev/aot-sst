import AotDatPoints from "./dynamo-data-points";
import { COIN_MARKET_CAP_API_KEY } from "./secrets";
import worker from "./worker";

export const AotApi = new sst.aws.ApiGatewayV2("AotApi", {
  link: [worker, AotDatPoints, COIN_MARKET_CAP_API_KEY],
});

AotApi.route("GET /macro", "packages/functions/src/routes/get-macro.handler");
