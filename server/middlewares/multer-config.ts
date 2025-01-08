import multer from "multer";

const multerStorage = multer.memoryStorage();

export const uploadSingleFile = multer({
  storage: multerStorage
}).single("file");

export const uploadMultipleFiles = multer({
  storage: multerStorage
}).array("files");
