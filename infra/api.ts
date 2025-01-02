import worker from "./worker";

export const AotApi = new sst.aws.Function("AotApi", {
  url: true,
  handler: "packages/functions/src/api.handler",
  link: [worker],
});
