import pool from "../config/db";
import { logAction } from "../utils/logAction";

export const insertDocument = async ({
  uuid,
  original_name,
  cdn_path,
  s3_path,
  client_id,
  uploaded_by,
}: {
  uuid: string;
  original_name: string;
  cdn_path: string;
  s3_path: string;
  client_id: number;
  uploaded_by: string;
}) => {
  const query = `
    INSERT INTO documents (uuid,
    original_name,
    cdn_path,
    s3_path,
    client_id,
    uploaded_by)
VALUES (?,?,?,?,?,?);
  `;

  const values = [
    uuid,
    original_name,
    cdn_path,
    s3_path,
    client_id,
    uploaded_by,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("Error inserting document:", error);

    const err = error as Error;

    await logAction({
      message: `Failed to insert document: ${err.message}`,
      action: "insert_document",
      status: "fail",
      user_id: 1111,
    });

    throw new Error("Database insert failed");
  }
};
