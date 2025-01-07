import { Handler } from "aws-lambda";
import { CoinMarketCap } from "../lib/providers/coin-market-cap/coin-market-cap.service";
const coinMarketCap = new CoinMarketCap();

export const handler: Handler = async (event) => {
  console.log("Starting Daily Cron Task");

  try {
    // Fetch Fear & Greed Index
    const fearGreedResponse = await coinMarketCap.getFearGreedIndex();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully processed daily tasks",
        fearAndGreedIndex: fearGreedResponse.data,
      }),
    };
  } catch (error) {
    console.error("Error in daily cron:", error);
    throw error;
  }
};
