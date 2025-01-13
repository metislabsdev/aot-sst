import { DataPointDynamoService } from "../clients/dynamo/services/data-point.service";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const dataPointService = new DataPointDynamoService();

    // Query macro data points (daily frequency)
    const result = await dataPointService.getMacroDataPoints();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error fetching macro data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
