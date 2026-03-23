import db from "../config/database.js";

// ==========================
// 📦 LISTAR PRODUTOS (COM BUSCA)
// ==========================
export const listarProdutos = async (req, res) => {
  try {
    const { nome } = req.query;

    let query = "SELECT * FROM produtos";
    let params = [];

    if (nome) {
      query += " WHERE nome LIKE ?";
      params.push(`%${nome}%`);
    }

    const [produtos] = await db.query(query, params);

    res.json(produtos);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao listar produtos" });
  }
};

// ==========================
// 🔍 BUSCAR PRODUTO POR ID
// ==========================
export const buscarProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const [produto] = await db.query(
      "SELECT * FROM produtos WHERE id=?",
      [id]
    );

    if (produto.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar produto" });
  }
};

// ==========================
// ➕ CRIAR PRODUTO
// ==========================
export const criarProduto = async (req, res) => {
  try {
    const { nome, preco, estoque, categoria, descricao } = req.body;

    if (!nome || preco == null) {
      return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
    }

    await db.query(
      `INSERT INTO produtos 
      (nome, preco, estoque, categoria, descricao)
      VALUES (?, ?, ?, ?, ?)`,
      [nome, preco, estoque ?? 0, categoria ?? null, descricao ?? null]
    );

    res.status(201).json({ mensagem: "Produto criado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

// ==========================
// ✏️ ATUALIZAR PRODUTO
// ==========================
export const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, estoque, categoria, descricao } = req.body;

    const [resultado] = await db.query(
      `UPDATE produtos 
      SET nome=?, preco=?, estoque=?, categoria=?, descricao=? 
      WHERE id=?`,
      [nome, preco, estoque, categoria, descricao, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({ mensagem: "Produto atualizado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
};

// ==========================
// 🗑️ DELETAR PRODUTO
// ==========================
export const deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      "DELETE FROM produtos WHERE id=?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({ mensagem: "Produto deletado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao deletar produto" });
  }
};