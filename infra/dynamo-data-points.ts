const AotDatPoints = new sst.aws.Dynamo("AOT-DataPoints", {
  fields: {
    PK: "string",
    SK: "string",
  },
  primaryIndex: {
    hashKey: "PK",
    rangeKey: "SK",
  },
});

export default AotDatPoints;
