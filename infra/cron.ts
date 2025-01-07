import { AotApi } from "./api";
import AotDatPoints from "./dynamo-data-points";
import { COIN_MARKET_CAP_API_KEY } from "./secrets";

const dailyCron = new sst.aws.Cron("AOT-DailyCron", {
  job: {
    handler: "packages/functions/src/crons/daily-cron.handler",
    link: [AotApi, AotDatPoints, COIN_MARKET_CAP_API_KEY],
  },
  schedule: "rate(1 minute)",
});

export default dailyCron;
