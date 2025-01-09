import { S3 } from "@aws-sdk/client-s3";

if (
  !process.env.AWS_ACCESS_KEY ||
  !process.env.AWS_ACCESS_SECRET_KEY ||
  !process.env.AWS_ACCESS_REGION
) {
  throw new Error("Missing required AWS credentials");
}

const s3Config = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
  },
  region: process.env.AWS_ACCESS_REGION,
  maxAttempts: 3
});

export default s3Config;
