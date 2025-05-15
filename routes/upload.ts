import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload routes
 */
import { handleUpload } from "../controllers/upload.controller";
import { validateFile } from "../middlewares/validateFile";

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file with client-specific validation
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               clientName:
 *                 type: string
 *               entityid:
 *                 type: string
 *                 description: The ID of the entity
 *               entityType:
 *                 type: string
 *                 description: The type of entity (e.g., Client, User)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Missing file or validation failed
 *       404:
 *         description: Client not found
 */
router.post("/", upload.single("file"), validateFile, handleUpload);
router.get("/", (req, res) => {
  res.send("Upload page");
});

export default router;
