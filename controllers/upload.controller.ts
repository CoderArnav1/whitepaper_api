import { Request, Response } from "express";
import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { insertDocument } from "../models/document.model";
import { uploadFileToS3 } from "../services/s3Upload.service";
import { logAction } from "../utils/logAction"; // import your logging helper

export const handleUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    await logAction({
      message: "No file uploaded",
      action: "upload_file",
      status: "fail",
      user_id: 1111,
    });
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { clientName } = req.body;
  const file = req.file;
  const uuid = uuidv4();

  try {
    await logAction({
      message: `Starting upload for client: ${clientName}, file: ${file.originalname}`,
      action: "upload_file",
      status: "start",
      user_id: 1111,
    });

    const [clientRows] = await pool.query(
      "SELECT id FROM client_master WHERE name = ?",
      [clientName]
    );

    if ((clientRows as any[]).length === 0) {
      await logAction({
        message: `Client not found: ${clientName}`,
        action: "upload_file",
        status: "fail",
        user_id: 1111,
      });
      return res.status(404).json({ error: "Client not found" });
    }

    const client_id = (clientRows as any[])[0].id;
    const s3Key = `${clientName}/${file.originalname}`;

    let s3Result;
    try {
      await logAction({
        message: `Attempting to upload file to S3 with key: ${s3Key}`,
        action: "upload_to_s3",
        status: "start",
        user_id: 1111,
      });

      s3Result = await uploadFileToS3(file.buffer, s3Key);

      await logAction({
        message: `File successfully uploaded to S3: ${s3Result.Location}`,
        action: "upload_to_s3",
        status: "success",
        user_id: 1111,
      });
    } catch (err) {
      await logAction({
        message:
          err instanceof Error
            ? `Upload to CDN failed for file: ${file.originalname}. Error: ${err.message}`
            : `Upload to CDN failed for file: ${file.originalname}. Unknown error`,
        action: "upload_to_s3",
        status: "fail",
        user_id: 1111,
      });
      return res.status(500).json({ error: "Upload to CDN failed" });
    }

    const result = await insertDocument({
      uuid,
      original_name: file.originalname,
      cdn_path: s3Result.Location,
      s3_path: s3Key,
      client_id,
      uploaded_by: "admin",
    });

    await logAction({
      message: `Document metadata saved. Document ID: ${
        (result as any).insertId
      }`,
      action: "save_document",
      status: "success",
      user_id: 1111,
      doc_id: (result as any).insertId,
    });

    res.status(200).json({
      message: "File metadata saved to documents table",
      documentId: (result as any).insertId,
    });
  } catch (error) {
    await logAction({
      message: `Upload failed: ${(error as Error).message}`,
      action: "upload_file",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};
