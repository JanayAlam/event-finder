import {
  CompleteMultipartUploadCommandOutput,
  ObjectIdentifier
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "node:crypto";
import sharp from "sharp";
import { AWS_S3_BUCKET_NAME } from "../../settings/config";
import s3Config from "../../settings/secure-s3-configuration";
import { TPhotoUploadParam } from "../../validationSchemas/services";

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  resize?: TPhotoUploadParam,
  fileName?: string,
  isPrivate = false
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
      client: s3Config,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key:
          fileName ||
          `${crypto.randomUUID()}.${file.originalname.split(".").pop()}`,
        Body: buffer,
        ACL: isPrivate ? "private" : "public-read",
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
      const splittedKey = key.split("amazonaws.com/");
      if (splittedKey.length !== 2) {
        throw new Error(`Invalid AWS file key: ${key}`);
      }
      return { Key: decodeURIComponent(splittedKey[1]) };
    });

    await s3Config.deleteObjects({
      Bucket: AWS_S3_BUCKET_NAME,
      Delete: { Objects: objectsToDelete }
    });
  } catch (err) {
    throw new Error(
      (err as Error).message || "Couldn't remove files from amazon s3"
    );
  }
};
