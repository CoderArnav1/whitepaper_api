import { Request, Response } from "express";
import pool from "../config/db";
import { logAction } from "../utils/logAction";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const [logs] = await pool.query(
      "SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100"
    );
    res.json(logs);
  } catch (error) {
    const err = error as Error;
    await logAction({
      message: `Failed to fetch logs: ${err.message}`,
      action: "get_logs",
      status: "fail",
      user_id: 1111,
    });
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
