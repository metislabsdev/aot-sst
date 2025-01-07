import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({ region: "us-east-1" });

export const handler: Handler = async (_event) => {
  console.log("Starting Task");
  await client.send(
    new SendMessageCommand({
      QueueUrl: Resource.AotQueue.url,
      MessageBody: JSON.stringify({
        message: "Hello, World!",
      }),
    })
  );
  return {
    statusCode: 200,
    body: "Task started",
  };
};
