import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectsCommand,
  ObjectIdentifier,
  S3Client
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "node:crypto";
import sharp from "sharp";
import {
  AWS_ACCESS_KEY,
  AWS_ACCESS_SECRET_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME
} from "../../settings/config";
import { TPhotoUploadParam } from "../../validationSchemas/services";

if (!AWS_ACCESS_KEY || !AWS_ACCESS_SECRET_KEY || !AWS_REGION) {
  throw new Error("Missing required AWS credentials");
}

const s3Client = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_ACCESS_SECRET_KEY
  },
  region: AWS_REGION,
  maxAttempts: 3
});

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  resize?: TPhotoUploadParam,
  fileName?: string
): Promise<CompleteMultipartUploadCommandOutput> => {
  if (!file.buffer) {
    throw new Error("Invalid file buffer");
  }

  let buffer: Buffer = file.buffer;

  if (resize) {
    try {
      buffer = await sharp(buffer)
        .resize({
          width: resize.width,
          height: resize.height,
          fit: "inside",
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 }) // Optimize JPEG quality
        .withMetadata()
        .toBuffer();
    } catch (err) {
      throw new Error(`Image processing failed: ${(err as Error).message}`);
    }
  }

  try {
    return (await new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key:
          fileName ||
          `${crypto.randomUUID()}.${file.originalname.split(".").pop()}`,
        Body: buffer,
        ACL: "private",
        ContentType: file.mimetype,
        CacheControl: "max-age=31536000" // 1 year cache
      }
    }).done()) as CompleteMultipartUploadCommandOutput;
  } catch (err) {
    throw new Error(`S3 upload failed: ${(err as Error).message}`);
  }
};

export const removeFilesFromS3 = async (keys: string | string[]) => {
  try {
    keys = Array.isArray(keys) ? keys : [keys];

    const objectsToDelete: ObjectIdentifier[] = keys.map((key) => {
      return { Key: decodeURIComponent(key) };
    });

    const command = new DeleteObjectsCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: { Objects: objectsToDelete }
    });

    await s3Client.send(command);
  } catch (err) {
    throw new Error(
      (err as Error).message || "Couldn't remove files from amazon s3"
    );
  }
};
