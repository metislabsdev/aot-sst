const worker = new sst.aws.Function("AotWorker", {
  url: true,
  handler: "packages/functions/src/worker.handler",
});

export default worker;
