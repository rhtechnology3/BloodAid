import mysql from "mysql2/promise";

const globalForMySQL = globalThis as unknown as {
  bloodAidPool?: mysql.Pool;
};

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "bloodaid_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    decimalNumbers: true,
  });
}

export const pool = globalForMySQL.bloodAidPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForMySQL.bloodAidPool = pool;

export function jsonError(message: string, status = 400) {
  return Response.json({ message }, { status });
}
