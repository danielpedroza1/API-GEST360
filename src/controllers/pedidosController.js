import db from "../config/database.js";

// ==========================
// 🧾 CRIAR PEDIDO (COM TRANSACTION)
// ==========================
export const criarPedido = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { cliente, itens } = req.body;

    if (!cliente || !itens || itens.length === 0) {
      return res.status(400).json({ erro: "Pedido inválido" });
    }

    await connection.beginTransaction();

    const [pedido] = await connection.query(
      "INSERT INTO pedidos (cliente, data, total, usuario_id) VALUES (?, NOW(), 0, ?)",
      [cliente, req.session.usuario.id]
    );

    let total = 0;

    for (let item of itens) {
      const [prod] = await connection.query(
        "SELECT * FROM produtos WHERE id=?",
        [item.produto_id]
      );

      if (prod.length === 0) {
        throw new Error("Produto não encontrado");
      }

      const produto = prod[0];

      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}`);
      }

      const preco = produto.preco;
      total += preco * item.quantidade;

      await connection.query(
        "INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)",
        [pedido.insertId, item.produto_id, item.quantidade, preco]
      );

      await connection.query(
        "UPDATE produtos SET estoque = estoque - ? WHERE id=?",
        [item.quantidade, item.produto_id]
      );
    }

    await connection.query(
      "UPDATE pedidos SET total=? WHERE id=?",
      [total, pedido.insertId]
    );

    await connection.commit();

    res.status(201).json({ mensagem: "Pedido criado com sucesso" });

  } catch (erro) {
    await connection.rollback(); // 🔥 DESFAZ TUDO

    console.error(erro);
    res.status(500).json({ erro: erro.message || "Erro ao criar pedido" });

  } finally {
    connection.release();
  }
};

// ==========================
// 📄 LISTAR PEDIDOS
// ==========================
export const listarPedidos = async (req, res) => {
  try {
    const [dados] = await db.query(`
      SELECT p.*, u.nome AS usuario_nome
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.data DESC
    `);

    res.json(dados);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
};

// ==========================
// 🗑️ DELETAR PEDIDO
// ==========================
export const deletarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      "DELETE FROM pedidos WHERE id=?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json({ mensagem: "Pedido deletado com sucesso" });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao deletar pedido" });
  }
};