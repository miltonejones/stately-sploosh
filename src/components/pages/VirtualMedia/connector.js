import AWS from "aws-sdk";
import { AWS_CONFIG } from "./config";
AWS.config.update(AWS_CONFIG);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const API_ENDPOINT = "https://3bax4cg6w7.execute-api.us-east-1.amazonaws.com";

export const fetchRows = async (lastEvaluatedKey) => {
  const tableName = "VR-Media";
  const scanParams = {
    TableName: tableName,
    Select: "COUNT",
  };
  const countResult = await dynamodb.scan(scanParams).promise();
  const totalCount = countResult.Count;

  const params = {
    TableName: tableName,
    Limit: 30,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  return new Promise((resolve, reject) => {
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.log(
          "Unable to scan the table. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        resolve({
          rows: data.Items,
          key: data.LastEvaluatedKey,
          count: totalCount,
        });
        // setRows((prevRows) => [...prevRows, ...newRows]);
        // setLastEvaluatedKey(data.LastEvaluatedKey);
      }
    });
  });
};
export const getModelsByName = async (name) => {
  const response = await fetch(API_ENDPOINT + `/model-name/${name}`);
  return await response.json();
};
