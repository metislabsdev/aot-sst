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
    await import("./infra/storage");
    await import("./infra/worker");
    const api = await import("./infra/api");
    const web = await import("./infra/frontend");
    const queue = await import("./infra/queue");
    queue.AotQueue.subscribe("./src/worker.handler");
    return {
      api: api.AotApi.url,
    };
  },
});
