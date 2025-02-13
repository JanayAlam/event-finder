export const getAWSLinkFromKey = (key?: string | null) =>
  key
    ? `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${
        process.env.NEXT_PUBLIC_AWS_REGION
      }.amazonaws.com/${key}`
    : null;
