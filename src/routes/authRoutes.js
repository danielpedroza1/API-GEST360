import express from "express";

import {
  login,
  logout,
  esqueciSenha,
  resetarSenha
} from "../controllers/authController.js";

const router = express.Router();

// 🔓 Rotas públicas
router.post("/login", login);
router.post("/esqueci-senha", esqueciSenha);
router.post("/resetar-senha", resetarSenha);

// 🔐 Logout (usuário logado)
router.post("/logout", logout);

export default router;