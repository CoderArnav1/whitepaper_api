import express from "express";
import { handleUpload } from "../controllers/upload.controller";
import { validateFile } from "../middlewares/validateFile";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), validateFile, handleUpload);
router.get("/", (req, res) => {
  res.send("Upload page");
});

export default router;
