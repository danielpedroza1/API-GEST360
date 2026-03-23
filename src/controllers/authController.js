import db from "../config/database.js";
import bcrypt from "bcrypt";

// ==========================
// 🔐 LOGIN (COM SESSION)
// ==========================
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const [users] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const user = users[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    // 🔥 SALVA NA SESSION
    req.session.usuario = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo
    };

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario: req.session.usuario
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no login" });
  }
};

// ==========================
// 🚪 LOGOUT
// ==========================
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ mensagem: "Logout realizado com sucesso" });
  });
};

// ==========================
// 🔁 ESQUECI SENHA (CÓDIGO FIXO)
// ==========================
export const esqueciSenha = async (req, res) => {
  try {
    const { email, codigo_empresa } = req.body;

    if (!email || !codigo_empresa) {
      return res.status(400).json({ erro: "Email e código são obrigatórios" });
    }

    const [empresa] = await db.query(
      "SELECT * FROM empresa WHERE codigo = ?",
      [codigo_empresa]
    );

    if (empresa.length === 0) {
      return res.status(403).json({ erro: "Código inválido" });
    }

    const [users] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // 🔥 NÃO GERA TOKEN, SÓ VALIDA
    res.json({ mensagem: "Código válido, pode redefinir a senha" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao validar código" });
  }
};

// ==========================
// 🔄 RESETAR SENHA
// ==========================
export const resetarSenha = async (req, res) => {
  try {
    const { email, novaSenha } = req.body;

    if (!email || !novaSenha) {
      return res.status(400).json({ erro: "Email e nova senha são obrigatórios" });
    }

    const hash = await bcrypt.hash(novaSenha, 10);

    await db.query(
      "UPDATE usuarios SET senha=? WHERE email=?",
      [hash, email]
    );

    res.json({ mensagem: "Senha atualizada com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao resetar senha" });
  }
};