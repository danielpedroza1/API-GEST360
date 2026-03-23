import express from "express";
// import { verificarLogin, somenteAdmin } from "../middlewares/authMiddleware.js";

import {
  criarPedido,
  listarPedidos,
  deletarPedido
} from "../controllers/pedidosController.js";

const router = express.Router();

// 👤 Funcionário ou admin
router.post("/", criarPedido);
router.get("/", listarPedidos);

// 👑 Apenas admin pode deletar
router.delete("/:id", deletarPedido);

export default router;