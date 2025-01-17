import multer from "multer";
import path from "node:path";
import ApiError from "../utils/api-error";

const multerStorage = multer.memoryStorage();

const ALLOWED_MIME_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];

export const uploadImages = multer({
  storage: multerStorage,
  fileFilter: (_req, file, callback) => {
    const ext = path.extname(file.originalname);

    if (ext && !ALLOWED_MIME_EXTENSIONS.includes(ext)) {
      return callback(
        new ApiError(400, undefined, {
          [file.fieldname]: `Only ${ALLOWED_MIME_EXTENSIONS.join(", ")} files are allowed`
        })
      );
    }
    callback(null, true);
  }
});
