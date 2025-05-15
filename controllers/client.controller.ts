import { Request, Response } from "express";
import pool from "../config/db";
import { Client } from "../models/client.model";
import { logAction } from "../utils/logAction";

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
    const err = error as Error;
    await logAction({
      message: `Failed to create client: ${err.message}`,
      action: "create_client",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Failed to create client" });
  }
};
export const getAllClientsIncludingDeleted = async (
  _req: Request,
  res: Response
) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM client_master ORDER BY id ASC;"
    );
    res.status(200).json(rows);
  } catch (error) {
    const err = error as Error;
    await logAction({
      message: `Failed to fetch all clients: ${err.message}`,
      action: "get_clients",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

export const getAllClients = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(
    "SELECT * FROM client_master WHERE deleted_at IS NULL ORDER BY id ASC;"
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
    const err = error as Error;
    await logAction({
      message: `Failed to update client: ${err.message}`,
      action: "update_client",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE client_master SET deleted_at = NOW() WHERE id = ?",
      [id]
    );
    res.json({ message: "Client deleted" });
  } catch (error) {
    const err = error as Error;
    await logAction({
      message: `Failed to delete client: ${err.message}`,
      action: "delete_client",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Delete failed" });
  }
};

export const getClientDocuments = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    console.log(`Fetching client with ID: ${id}`);

    // Fetch client data
    const [clients] = await pool.query(
      "SELECT * FROM client_master WHERE id = ? AND deleted_at IS NULL",
      [id]
    );

    if ((clients as any[]).length === 0) {
      console.log(`Client not found or deleted with ID: ${id}`);
      return res
        .status(404)
        .json({ error: "Client not found or has been deleted" });
    }

    console.log(`Client found: ${JSON.stringify(clients)}`);

    // Fetch documents for the client
    const [documents] = await pool.query(
      "SELECT * FROM documents WHERE client_id = ? ORDER BY created_at DESC",
      [id]
    );

    console.log(`Documents fetched: ${JSON.stringify(documents)}`);

    res.status(200).json(documents);
  } catch (error) {
    const err = error as Error;
    await logAction({
      message: `Failed to fetch client documents: ${err.message}`,
      action: "get_client_documents",
      status: "fail",
      user_id: 1111,
    });
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};
