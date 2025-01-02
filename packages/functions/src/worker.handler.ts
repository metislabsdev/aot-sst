import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { Example } from "@aot-sst/core/example";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

const client = new LambdaClient({ region: "us-east-1" });

export const handler: Handler = async (_event) => {
  console.log("Starting Task");
  await client.send(
    new InvokeCommand({
      FunctionName: Resource.AotWorker.name,
      Payload: JSON.stringify({
        message: "Hello, World!",
      }),
      InvocationType: "Event",
    })
  );
  return {
    statusCode: 200,
    body: "Hello, i'm doing work.",
  };
};
