import { Request, Response } from "express";
import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { insertDocument } from "../models/document.model";
import { uploadFileToS3 } from "../services/s3Upload.service";
export const handleUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { clientName } = req.body;
  const file = req.file;
  const uuid = uuidv4();

  try {
    console.log(
      `Starting upload for client: ${clientName}, file: ${file.originalname}`
    );

    const [clientRows] = await pool.query(
      "SELECT id FROM client_master WHERE name = ?",
      [clientName]
    );

    if ((clientRows as any[]).length === 0) {
      console.log(`Client not found: ${clientName}`);
      return res.status(404).json({ error: "Client not found" });
    }

    const client_id = (clientRows as any[])[0].id;
    const s3Key = `${clientName}/${file.originalname}`;

    let s3Result;
    try {
      console.log(`Attempting to upload file to S3 with key: ${s3Key}`);
      s3Result = await uploadFileToS3(file.buffer, s3Key);
      console.log(`File successfully uploaded to S3: ${s3Result.Location}`);
    } catch (err) {
      if (err instanceof Error) {
        console.log(
          `Upload to CDN failed for file: ${file.originalname}. Error: ${err.message}`
        );
      } else {
        console.log(
          `Upload to CDN failed for file: ${file.originalname}. Unknown error:`,
          err
        );
      }
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

    console.log(
      `Document metadata saved. Document ID: ${(result as any).insertId}`
    );
    res.status(200).json({
      message: "File metadata saved to documents table",
      documentId: (result as any).insertId,
    });
  } catch (error) {
    console.log("Upload failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
