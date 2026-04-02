import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuariosRoutes.js";
import produtoRoutes from "./routes/produtosRoutes.js";
import pedidoRoutes from "./routes/pedidosRoutes.js";

import { connectDB } from "./config/database.js";

dotenv.config();

const app = express();

// ==========================
// 🔧 MIDDLEWARES
// ==========================

// 🔥 CORS COM CREDENCIAIS (IMPORTANTE)
app.use(cors())

app.use(express.json());

// 🔥 SESSION (ESSENCIAL)
app.use(session({
  secret: "segredo_super",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true só em HTTPS
    httpOnly: true
  }
}));

// ==========================
// 📌 ROTAS
// ==========================
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/pedidos", pedidoRoutes);

// ==========================
// ❌ ROTA NÃO ENCONTRADA
// ==========================
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// ==========================
// 🚀 START SERVER
// ==========================
const PORT = process.env.PORT || 3000;

// 🔥 CONECTA BANCO ANTES
connectDB();

app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});