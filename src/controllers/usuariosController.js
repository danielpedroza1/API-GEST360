import db from "../config/database.js";
import bcrypt from "bcrypt";

// ==========================
// 📄 LISTAR USUÁRIOS
// ==========================
export const listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      "SELECT id, nome, email, tipo FROM usuarios WHERE empresa_id = ?",
      [req.session.usuario.empresa_id]
    );

    res.json(usuarios);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao listar usuários" });
  }
};

// ==========================
// 🔍 BUSCAR USUÁRIO
// ==========================
export const buscarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [usuario] = await db.query(
      "SELECT id, nome, email, tipo FROM usuarios WHERE id = ? AND empresa_id = ?",
      [id, req.session.usuario.empresa_id]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
};

// ==========================
// ➕ CRIAR USUÁRIO (ADMIN)
// ==========================
export const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Dados obrigatórios faltando" });
    }

    // 🔥 evita email duplicado
    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [
        nome,
        email,
        hash,
        tipo,
      ]
    );

    res.status(201).json({ mensagem: "Usuário criado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
};

// ==========================
// ✏️ ATUALIZAR USUÁRIO
// ==========================
export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    let query = "UPDATE usuarios SET nome=?, email=?";
    let params = [nome, email];

    if (senha) {
      const hash = await bcrypt.hash(senha, 10);
      query += ", senha=?";
      params.push(hash);
    }

    query += " WHERE id=? AND empresa_id=?";
    params.push(id, req.session.usuario.empresa_id);

    const [resultado] = await db.query(query, params);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário atualizado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
};

// ==========================
// 🗑️ DELETAR USUÁRIO
// ==========================
export const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      "DELETE FROM usuarios WHERE id=? AND empresa_id=?",
      [id, req.session.usuario.empresa_id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário deletado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
};