import express from "express";
// import { verificarLogin, somenteAdmin } from "../middlewares/authMiddleware.js";

import {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from "../controllers/produtosController.js";

const router = express.Router();

// 🔒 TODAS PROTEGIDAS
router.get("/", listarProdutos);
router.get("/:id", buscarProduto);

// 👤 Funcionário ou admin
router.post("/", criarProduto);
router.put("/:id", atualizarProduto);

// 👑 Só admin pode deletar
router.delete("/:id", deletarProduto);

export default router;