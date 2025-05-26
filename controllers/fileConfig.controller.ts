import { Request, Response } from "express";
import db from "../config/db";

export const getFormatsByClientName = async (req: Request, res: Response) => {
  const clientName = req.params.clientName;

  try {
    const [clientRows] = await db.query(
      "SELECT id FROM client_master WHERE name = ?",
      [clientName]
    );

    if ((clientRows as any[]).length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const clientId = (clientRows as any[])[0].id;

    const [formatRows] = await db.query(
      "SELECT DISTINCT format FROM file_configs WHERE client_id = ?",
      [clientId]
    );

    const formats = (formatRows as any[]).map((row) => row.format);
    res.json({ clientId, formats });
  } catch (err) {
    console.error("Error fetching formats:", err);
    res.status(500).json({ error: "Failed to fetch formats" });
  }
};

export const getRulesByClientIdAndFormat = async (req: Request, res: Response) => {
  const { clientId, format } = req.params;

  try {
    const [ruleRows] = await db.query(
      "SELECT types, max_size FROM file_configs WHERE client_id = ? AND format = ?",
      [clientId, format]
    );

    if ((ruleRows as any[]).length === 0) {
      return res.status(404).json({ error: "No rules found" });
    }

    const types = (ruleRows as any[])[0].types.split(",");
    const maxSize = parseInt((ruleRows as any[])[0].max_size, 10);

    res.json({ allowedTypes: types, maxSize });
  } catch (err) {
    console.error("Error fetching rules:", err);
    res.status(500).json({ error: "Failed to fetch rules" });
  }
};