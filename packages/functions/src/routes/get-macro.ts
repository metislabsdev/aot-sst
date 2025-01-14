import { DataPointDynamoService } from "../clients/dynamo/services/data-point.service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { convertTimestampToISO } from "../lib/utils/date";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const dataPointService = new DataPointDynamoService();

    // Query macro data points (daily frequency)
    const result = await dataPointService.getMacroDataPoints();

    // Convert timestamps in the items array
    const formattedResult = {
      ...result,
      items: result.items.map((item) => ({
        ...item,
        timestamp: convertTimestampToISO(item.timestamp),
      })),
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(formattedResult),
    };
  } catch (error) {
    console.error("Error fetching macro data:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
