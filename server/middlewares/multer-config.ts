import multer from "multer";
import ApiError from "../utils/api-error";

const multerStorage = multer.memoryStorage();

const ALLOWED_MIME_EXTENSIONS = ["image/png", "image/jpg", "image/jpeg"];

export const uploadImages = multer({
  storage: multerStorage,
  fileFilter: (_req, file, callback) => {
    const mimeType = file.mimetype.toLowerCase();

    if (!ALLOWED_MIME_EXTENSIONS.includes(mimeType)) {
      return callback(
        new ApiError(400, undefined, {
          [file.fieldname]: `Only ${ALLOWED_MIME_EXTENSIONS.map((mt) => mt.split("/")[1]).join(", ")} files are allowed`
        })
      );
    }
    callback(null, true);
  }
});
