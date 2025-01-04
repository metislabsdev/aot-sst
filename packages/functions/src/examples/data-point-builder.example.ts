// import { DataPointBuilder } from "../builders/data-point.builder";

// // Example usage with CoinMarketCap API response
// const cmcResponse = {
//   data: {
//     BTC: {
//       quote: {
//         USD: {
//           price: 45000,
//         },
//       },
//       last_updated: "2024-01-20T12:00:00Z",
//     },
//   },
// };

// const btcDataPoint = new DataPointBuilder()
//   .fromCoinMarketCapPrice(cmcResponse, "BTC")
//   .build();

// // Example usage with Alpaca API response
// const alpacaResponse = {
//   trade: {
//     price: 180.25,
//     timestamp: "2024-01-20T12:00:00Z",
//   },
// };

// const aaplDataPoint = new DataPointBuilder()
//   .fromAlpacaPrice(alpacaResponse, "AAPL")
//   .build();

// // Example usage with Fear & Greed Index
// const fearGreedResponse = {
//   data: {
//     fear_and_greed_value: 65,
//     timestamp: "2024-01-20T12:00:00Z",
//   },
// };

// const fearGreedDataPoint = new DataPointBuilder()
//   .fromCoinMarketCapFearGreedIndex(fearGreedResponse)
//   .build();

// // The resulting objects will include both the DataPoint interface fields
// // and the DynamoDB keys ready for storage
// console.log(btcDataPoint);
// /* Output example:
// {
//   name: 'PRICE',
//   value: 45000,
//   timestamp: 1705752000,
//   frequency: 'HOURLY',
//   metricType: ['ASSET'],
//   assetClass: ['CRYPTO'],
//   source: 'COIN_MARKET_CAP',
//   assetId: 'BTC',
//   PK: 'ASSET#CRYPTO',
//   SK: 'BTC#1705752000',
//   GSI1PK: 'CRYPTO#BTC',
//   GSI1SK: '1705752000',
//   GSI2PK: 'HOURLY#ASSET',
//   GSI2SK: '1705752000'
// }
// */
