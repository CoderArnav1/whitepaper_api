import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: "https://us-sea-1.linodeobjects.com",
  accessKeyId: process.env.CDN_ACCESS_KEY as string,
  secretAccessKey: process.env.CDN_SECRET_KEY as string,
  region: "us-east-1",
  signatureVersion: "v4",
});

export default s3;
