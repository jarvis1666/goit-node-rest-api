import multer from "multer";
import {fileURLToPath} from "url"
import path from "path";

//Отримання шляху до поточної директорії
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tempDir = path.join(__dirname, "..", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

export default upload;