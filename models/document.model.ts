import pool from "../config/db";

export const insertDocument = async ({
  uuid,
  original_name,
  // cdn_path,
  // s3_path,
  client_id,
  uploaded_by,
}: {
  uuid: string;
  original_name: string;
  // cdn_path: string;
  // s3_path: string;
  client_id: number;
  uploaded_by: string;
}) => {
  const query = `
    INSERT INTO documents (uuid, original_name, client_id, uploaded_by)
VALUES (?,?, ?, ?);
  `;

  const values = [
    uuid,
    original_name,
    //    cdn_path,
    //    s3_path,
    client_id,
    uploaded_by,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("Error inserting document:", error);
    throw new Error("Database insert failed");
  }
};
