import { Request, Response } from "express";
import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { insertDocument } from "../models/document.model";

export const handleUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { clientName } = req.body;
  const file = req.file;
  const uuid = uuidv4();

  try {
    const [clientRows] = await pool.query(
      "SELECT id FROM client_master WHERE name = ?",
      [clientName]
    );

    if ((clientRows as any[]).length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const client_id = (clientRows as any[])[0].id;

    const result = await insertDocument({
      uuid,
      original_name: file.originalname,
      client_id,
      uploaded_by: "admin",
    });

    res.status(200).json({
      message: "File metadata saved to documents table",
      documentId: (result as any).insertId,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
