import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "usbw",
  database: "gestao360",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // 🔥 IMPORTANTE (evita erro com data)
  timezone: "Z"
});

// 🔥 FUNÇÃO DE TESTE (melhor prática)
export const connectDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Banco de dados conectado com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1); // 🔥 derruba o servidor se falhar
  }
};

export default db;