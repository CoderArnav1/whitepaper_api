import s3 from "../config/s3";

export const uploadFileToS3 = async (fileBuffer: Buffer, s3Key: string) => {
  const uploadParams = {
    Bucket: "cdn-content",
    Key: s3Key,
    Body: fileBuffer,
    ACL: "public-read",
  };

  return s3.upload(uploadParams).promise();
};
