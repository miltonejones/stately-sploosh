import AWS from "aws-sdk";
import { AWS_CONFIG } from "./config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

export const getTracks = async () => {
  const jsonParams = {
    Bucket: process.env.REACT_APP_S3_BUCKET,
    Key: "curated.json",
  };

  const jsonData = await s3.getObject(jsonParams).promise();
  const jsonObject = JSON.parse(jsonData.Body.toString());
  console.log({ jsonObject });
  return jsonObject;
};
