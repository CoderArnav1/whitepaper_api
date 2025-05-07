import { Request, Response } from "express";
import pool from "../config/db";
import { Client } from "../models/client.model";

export const createClient = async (
  req: Request<{}, {}, Client>,
  res: Response
) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO client_master (name) VALUES (?)",
      [name]
    );
    res.status(201).json({ id: (result as any).insertId, name });
  } catch (error) {
    res.status(500).json({ error: "Failed to create client" });
  }
};

export const getAllClients = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(
    "SELECT * FROM client_master ORDER BY id ASC;"
  );
  res.status(200).json(rows);
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await pool.query("UPDATE client_master SET name = ? WHERE id = ?", [
      name,
      id,
    ]);
    res.json({ message: "Client updated" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM client_master WHERE id = ?", [id]);
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};
