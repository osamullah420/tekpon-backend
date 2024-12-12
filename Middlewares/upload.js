import multer from "multer";
import { storage } from "../Config/cloudinaryConfig.js";

// Create a multer instance with the Cloudinary storage
const upload = multer({ storage });

export default upload;
