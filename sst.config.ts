/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aot-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    await import("./infra/cron");
    await import("./infra/storage");
    await import("./infra/worker");
    await import("./infra/dynamo-data-points");
    const api = await import("./infra/api");
    const web = await import("./infra/frontend");
    const queue = await import("./infra/queue");
    return {
      api: api.AotApi.url,
    };
  },
});
