import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

export const validateFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }

  try {
    const fileExt = "." + file.originalname.split(".").pop()?.toLowerCase();
    const fileType = file.mimetype;
    const fileSize = file.size;

    //  const clientId =
    //    req.body.client_id || req.query.client_id || req.params.client_id;
    //
    //  if (!clientId) {
    //    return res
    //      .status(400)
    //      .json({ error: "client_id is required for validation" });
    //  }

    //  FETCHING THE CLIENT ID FROM THE CLEINT MASTER BY THE NAME OF THE CLIENT PROVIDED IN THE INPUT
    const clientName = req.body.clientName || req.query.clientName;
    let clientId;

    try {
      const [rows] = await pool.query(
        "SELECT id FROM client_master WHERE name = ? LIMIT 1",
        [clientName]
      );

      if ((rows as any[]).length === 0) {
        return res.status(404).json({ error: "Client not found" });
      }

      clientId = (rows as any[])[0].id;
    } catch (error: any) {
      console.error("Database query error:", error.message || error);
      return res
        .status(500)
        .json({ error: "Internal server error during client lookup" });
    }

    const [configResult] = await pool.query(
      `SELECT * FROM file_configs 
   WHERE client_id = ? 
     AND FIND_IN_SET(?, extensions) > 0 
     AND FIND_IN_SET(?, types) > 0`,
      [clientId, fileExt, fileType]
    );

    if ((configResult as any[]).length === 0) {
      return res.status(400).json({ error: "Invalid file type or extension" });
    }

    const config = (configResult as any[])[0];

    if (fileSize < config.min_size || fileSize > config.max_size) {
      return res.status(400).json({
        error: `File size must be between ${config.min_size} and ${config.max_size} bytes`,
      });
    }

    next();
  } catch (error: any) {
    console.error("Validation error:", error.message || error);
    res.status(500).json({ error: "Internal server error during validation" });
  }
};
