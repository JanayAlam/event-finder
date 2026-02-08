import fs from "fs/promises";
import { assert } from "node:console";
import path from "node:path";
import sharp from "sharp";
import ApiError from "../../utils/api-error.util";
import logger from "../../utils/winston.util";

export type FileCategory =
  | "profile-photo"
  | "account-verification"
  | "event-cover"
  | "event-additional-photos";

interface FileUploadResponse {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

class FileUploadService {
  private static readonly UPLOAD_DIR = "uploads";
  private static readonly CATEGORY_DIRS: Record<FileCategory, string> = {
    "profile-photo": "profile",
    "account-verification": "verification",
    "event-cover": "event/cover",
    "event-additional-photos": "event/additional-photos"
  };

  static getImagePath(filename: string, category: FileCategory): string {
    assert(
      Object.keys(this.CATEGORY_DIRS).includes(category),
      `Invalid category: ${category}`
    );
    const categoryDir = this.CATEGORY_DIRS[category];
    return path.join(this.UPLOAD_DIR, categoryDir, filename);
  }

  static async upload(
    file: Express.Multer.File,
    category: FileCategory
  ): Promise<FileUploadResponse> {
    assert(!!file, "No file provided");
    assert(
      Object.keys(this.CATEGORY_DIRS).includes(category),
      `Invalid category: ${category}`
    );

    const categoryDir = this.CATEGORY_DIRS[category];

    try {
      // create category directory if it doesn't exist
      const categoryPath = path.join(this.UPLOAD_DIR, categoryDir);
      await fs.mkdir(categoryPath, { recursive: true });

      // move file from temp location to category directory
      const oldPath = file.path;
      const newFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const newPath = path.join(categoryPath, newFilename);

      await fs.rename(oldPath, newPath);

      return {
        filename: newFilename,
        path: newPath,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch {
      if (file.path) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          logger.error(
            "Error while removing the file which was failed to upload",
            err
          );
        }
      }

      throw new ApiError(500, "Failed to upload image");
    }
  }

  static async remove(filePath: string): Promise<boolean> {
    assert(!!filePath, "No file path provided");

    try {
      // validate that the file is within the uploads directory (security check)
      const resolvedPath = path.resolve(filePath);
      const uploadsPath = path.resolve(this.UPLOAD_DIR);

      if (!resolvedPath.startsWith(uploadsPath)) {
        throw new ApiError(403, "Invalid file path");
      }

      await fs.unlink(resolvedPath);
      return true;
    } catch (error) {
      // file doesn't exist
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return false;
      }

      throw new ApiError(500, "Failed to remove image");
    }
  }

  static async uploadAndCropToSquare(
    file: Express.Multer.File,
    category: FileCategory,
    size: number = 512
  ): Promise<FileUploadResponse> {
    assert(!!file, "No file provided");
    assert(
      Object.keys(this.CATEGORY_DIRS).includes(category),
      `Invalid category: ${category}`
    );

    const categoryDir = this.CATEGORY_DIRS[category];

    try {
      // create category directory if it doesn't exist
      const categoryPath = path.join(this.UPLOAD_DIR, categoryDir);
      await fs.mkdir(categoryPath, { recursive: true });

      // Generate new filename
      const newFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      const newPath = path.join(categoryPath, newFilename);

      // Process image with sharp: resize to square, crop from center
      const metadata = await sharp(file.path).metadata();
      const minDimension = Math.min(metadata.width || size, metadata.height || size);

      await sharp(file.path)
        .resize(minDimension, minDimension, {
          fit: "cover",
          position: "center"
        })
        .resize(size, size)
        .jpeg({ quality: 90 })
        .toFile(newPath);

      // Remove original temp file
      try {
        await fs.unlink(file.path);
      } catch (err) {
        logger.error("Error while removing temp file", err);
      }

      return {
        filename: newFilename,
        path: newPath,
        size: (await fs.stat(newPath)).size,
        mimetype: "image/jpeg"
      };
    } catch (error) {
      // Clean up temp file if it exists
      if (file.path) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          logger.error(
            "Error while removing the file which was failed to upload",
            err
          );
        }
      }

      throw new ApiError(500, "Failed to upload and process image");
    }
  }
}

export default FileUploadService;
