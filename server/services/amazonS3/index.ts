import {
  CompleteMultipartUploadCommandOutput,
  ObjectIdentifier,
  S3
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "node:crypto";
import sharp from "sharp";
import {
  AWS_ACCESS_KEY,
  AWS_ACCESS_REGION,
  AWS_ACCESS_SECRET_KEY,
  AWS_S3_BUCKET_NAME
} from "../../settings/config";

const s3Config = new S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY || "",
    secretAccessKey: AWS_ACCESS_SECRET_KEY || ""
  },
  region: AWS_ACCESS_REGION || ""
});

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  resize?: {
    width: number;
  },
  fileName?: string,
  isPrivate = false
): Promise<CompleteMultipartUploadCommandOutput> => {
  let buffer: Buffer = file.buffer;

  if (resize) {
    buffer = await sharp(buffer)
      .resize({
        width: resize.width,
        fit: "inside",
        withoutEnlargement: true
      })
      .toFormat("jpeg")
      .withMetadata()
      .toBuffer();
  }

  const s3Response = (await new Upload({
    client: s3Config,
    params: {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileName || crypto.randomBytes(20).toString("hex"),
      Body: buffer,
      ACL: isPrivate ? "private" : "public-read",
      ContentType: file.mimetype
    }
  }).done()) as CompleteMultipartUploadCommandOutput;

  return s3Response;
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
