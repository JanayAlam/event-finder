import multer from "multer";
import path from "node:path";
import ApiError from "../utils/api-error.util";

const ALLOWED_MIME_EXTENSIONS = ["image/png", "image/jpg", "image/jpeg"];

const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const crateImageUploadMiddleware = () => {
  return multer({
    storage: localStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, callback) => {
      const mimeType = file.mimetype.toLowerCase();

      if (!ALLOWED_MIME_EXTENSIONS.includes(mimeType)) {
        return callback(
          new ApiError(400, "Invalid file type", {
            [file.fieldname]: `Only ${ALLOWED_MIME_EXTENSIONS.map(
              (mt) => mt.split("/")[1]
            ).join(", ")} files are allowed`
          })
        );
      }
      callback(null, true);
    }
  });
};

export const imageUpload = crateImageUploadMiddleware();
