import { Request, Response } from "express";
import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { insertDocument } from "../models/document.model";
import { uploadFileToS3 } from "../services/s3Upload.service";
import { logAction } from "../utils/logAction"; // import your logging helper

export const handleUpload = async (req: Request, res: Response) => {
  const { clientName } = req.body;
  const files = req.files as Express.Multer.File[];
  const user_id = 1111;

  if (!files || files.length === 0) {
    await logAction({
      message: "No files uploaded",
      action: "upload_file",
      status: "fail",
      user_id,
    });
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const [clientRows] = await pool.query(
      "SELECT id FROM client_master WHERE name = ?",
      [clientName]
    );

    if ((clientRows as any[]).length === 0) {
      await logAction({
        message: `Client not found: ${clientName}`,
        action: "upload_file",
        status: "fail",
        user_id,
      });
      return res.status(404).json({ error: "Client not found" });
    }

    const client_id = (clientRows as any[])[0].id;
    const results = [];

    for (const file of files) {
      const uuid = uuidv4();
      const s3Key = `${clientName}/${file.originalname}`;

      try {
        await logAction({
          message: `Attempting to upload file to S3 with key: ${s3Key}`,
          action: "upload_to_s3",
          status: "start",
          user_id,
        });

        const s3Result = await uploadFileToS3(file.buffer, s3Key);

        await logAction({
          message: `File successfully uploaded to S3: ${s3Result.Location}`,
          action: "upload_to_s3",
          status: "success",
          user_id,
        });

        const result = await insertDocument({
          uuid,
          original_name: file.originalname,
          cdn_path: s3Result.Location,
          s3_path: s3Key,
          client_id,
          uploaded_by: "admin",
        });

        await logAction({
          message: `Document metadata saved. Document ID: ${(result as any).insertId}`,
          action: "save_document",
          status: "success",
          user_id,
          doc_id: (result as any).insertId,
        });

        results.push({
          file: file.originalname,
          documentId: (result as any).insertId,
          cdn_path: s3Result.Location,
        });
      } catch (err) {
        await logAction({
          message: `Failed to upload or save file: ${file.originalname}`,
          action: "upload_file",
          status: "fail",
          user_id,
        });
      }
    }

    const mergedResponse = {
      statusCode: "BIR.2000",
      data: {
        documentIds: results.map(r => r.documentId).join(","),
        staticFileLinks: results.map(r => r.cdn_path),
      },
      message: results.length > 1 ? "Files uploaded successfully" : "File uploaded successfully",
    };

    res.status(200).json(mergedResponse);
  } catch (error) {
    await logAction({
      message: `Upload failed: ${(error as Error).message}`,
      action: "upload_file",
      status: "fail",
      user_id,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};
