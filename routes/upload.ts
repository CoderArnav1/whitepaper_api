import express from "express";
import multer from "multer";
import { handleUpload } from "../controllers/upload.controller";
import { validateFile } from "../middlewares/validateFile";

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload routes
 */

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
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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

const router = express.Router();

router.post("/", upload.array("files"), validateFile, handleUpload);
router.get("/", (req, res) => {
  res.send("Upload page");
});

export default router;