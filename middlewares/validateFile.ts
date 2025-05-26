import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { logAction } from "../utils/logAction";

export const validateFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    await logAction({
      message: "No files uploaded in request",
      action: "validate_file",
      status: "fail",
      user_id: 1111,
    });
    return res.status(400).json({ error: "At least one file is required" });
  }

  try {
    // Get clientId from clientName in request
    const clientName = req.body.clientName || req.query.clientName;
    let clientId;

    try {
      const [rows] = await pool.query(
        "SELECT id FROM client_master WHERE name = ? LIMIT 1",
        [clientName]
      );

      if ((rows as any[]).length === 0) {
        await logAction({
          message: `Client not found: ${clientName}`,
          action: "validate_file",
          status: "fail",
          user_id: 1111,
        });
        return res.status(404).json({ error: "Client not found" });
      }

      clientId = (rows as any[])[0].id;
    } catch (error: any) {
      console.error("Database query error:", error.message || error);
      await logAction({
        message: `Database query error during client lookup: ${error.message}`,
        action: "validate_file",
        status: "fail",
        user_id: 1111,
      });
      return res
        .status(500)
        .json({ error: "Internal server error during client lookup" });
    }

    // Validate each file
    for (const file of files) {
      const fileExt = "." + file.originalname.split(".").pop()?.toLowerCase();
      const fileType = file.mimetype;
      const fileSize = file.size;

      const [configResult] = await pool.query(
        `SELECT * FROM file_configs 
         WHERE client_id = ? 
           AND FIND_IN_SET(?, extensions) > 0 
           AND FIND_IN_SET(?, types) > 0`,
        [clientId, fileExt, fileType]
      );

      if ((configResult as any[]).length === 0) {
        await logAction({
          message: `Invalid file type or extension: ext=${fileExt}, type=${fileType}`,
          action: "validate_file",
          status: "fail",
          user_id: 1111,
        });
        return res.status(400).json({
          error: `Invalid file type or extension for file ${file.originalname}`,
        });
      }

      const config = (configResult as any[])[0];

      if (fileSize < config.min_size || fileSize > config.max_size) {
        await logAction({
          message: `File size out of range: size=${fileSize}, allowed=${config.min_size}-${config.max_size}`,
          action: "validate_file",
          status: "fail",
          user_id: 1111,
        });
        return res.status(400).json({
          error: `File ${file.originalname} size must be between ${config.min_size} and ${config.max_size} bytes`,
        });
      }
    }

    await logAction({
      message: `All files passed validation checks for client ${clientName}`,
      action: "validate_file",
      status: "success",
      user_id: 1111,
    });

    next();
  } catch (error: any) {
    console.error("Validation error:", error.message || error);
    await logAction({
      message: `Unexpected validation error: ${error.message}`,
      action: "validate_file",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Internal server error during validation" });
  }
};