import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (file.mimetype !== "text/csv") {
    req.fileValidationError = "Invalid file type. Please upload a CSV file.";
    return callback(null, false);
  }
  callback(null, true);
};
