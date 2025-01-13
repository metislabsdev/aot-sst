/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "AOT-DataPoints": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "AotApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "AotBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "AotQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "AotStaticSite": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "AotWorker": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "CoinMarketCapApiKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
  }
}
