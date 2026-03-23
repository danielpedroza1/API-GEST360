import express from "express";

import {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario
} from "../controllers/usuariosController.js";

const router = express.Router();

// 👑 SOMENTE ADMIN
router.post("/", criarUsuario);
router.delete("/:id", deletarUsuario);

// 🔒 ADMIN pode gerenciar
router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.put("/:id", atualizarUsuario);

export default router;