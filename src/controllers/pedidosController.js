import db from "../config/database.js";

// ==========================
// 🧾 CRIAR PEDIDO (COM TRANSACTION)
// ==========================
export const criarPedido = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { cliente, itens, data_pedido } = req.body;

    if (!cliente || !itens || itens.length === 0) {
      return res.status(400).json({
        erro: "Pedido inválido"
      });
    }

    await connection.beginTransaction();

    // 🔥 usa a data enviada pelo front
    const dataPedidoFinal = data_pedido || new Date();

    const [pedido] = await connection.query(
      "INSERT INTO pedidos (cliente, data_pedido, total) VALUES (?, ?, 0.0)",
      [cliente, dataPedidoFinal]
    );

    let total = 0;

    for (let item of itens) {
      const [prod] = await connection.query(
        "SELECT * FROM produtos WHERE id = ?",
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
        "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)",
        [pedido.insertId, item.produto_id, item.quantidade, preco]
      );

      await connection.query(
        "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
        [item.quantidade, item.produto_id]
      );
    }

    await connection.query(
      "UPDATE pedidos SET total = ? WHERE id = ?",
      [total, pedido.insertId]
    );

    await connection.commit();

    res.status(201).json({
      mensagem: "Pedido criado com sucesso"
    });

  } catch (erro) {
    await connection.rollback();

    console.error(erro);

    res.status(500).json({
      erro: erro.message || "Erro ao criar pedido"
    });

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
      SELECT 
        p.id,
        p.cliente,
        p.data_pedido,
        p.total,
        ip.quantidade,
        pr.nome AS produto_nome
      FROM pedidos p
      LEFT JOIN itens_pedido ip
        ON p.id = ip.pedido_id
      LEFT JOIN produtos pr
        ON ip.produto_id = pr.id
      ORDER BY p.data_pedido DESC
    `);

    const pedidosFormatados = [];

    dados.forEach(row => {
      let pedido = pedidosFormatados.find(p => p.id === row.id);

      if (!pedido) {
        pedido = {
          id: row.id,
          cliente: row.cliente,
          data_pedido: row.data_pedido,
          total: row.total,
          itens: []
        };

        pedidosFormatados.push(pedido);
      }

      if (row.produto_nome) {
        pedido.itens.push({
          nome: row.produto_nome,
          quantidade: row.quantidade
        });
      }
    });

    res.json(pedidosFormatados);

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Erro ao listar pedidos"
    });
  }
};

// ==========================
// 🗑️ DELETAR PEDIDO
// ==========================
export const deletarPedido = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // 🔥 primeiro remove os itens
    await connection.query(
      "DELETE FROM itens_pedido WHERE pedido_id = ?",
      [id]
    );

    // 🔥 depois remove o pedido
    const [resultado] = await connection.query(
      "DELETE FROM pedidos WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      await connection.rollback();

      return res.status(404).json({
        erro: "Pedido não encontrado"
      });
    }

    await connection.commit();

    res.json({
      mensagem: "Pedido deletado com sucesso"
    });

  } catch (erro) {
    await connection.rollback();

    console.error(erro);

    res.status(500).json({
      erro: "Erro ao deletar pedido"
    });

  } finally {
    connection.release();
  }
};