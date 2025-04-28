import * as mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();
async function testConnection() {
  const pool = mysql.createPool({
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("Database connection successful:", rows);
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

testConnection();
