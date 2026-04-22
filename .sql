-- =========================================
-- CRIAR BANCO DE DADOS
-- =========================================
CREATE DATABASE IF NOT EXISTS gestao_pedidos;
USE gestao_pedidos;

-- =========================================
-- TABELA DE USUÁRIOS
-- =========================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'funcionario', 'cliente') NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expira DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA DE PRODUTOS
-- =========================================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    categoria VARCHAR(50),
    descricao TEXT
);

-- =========================================
-- TABELA DE PEDIDOS
-- =========================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    data_pedido DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL
);

-- =========================================
-- TABELA DE ITENS DO PEDIDO
-- =========================================
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (produto_id) REFERENCES produtos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- DADOS DE TESTE - USUÁRIOS
-- =========================================
INSERT INTO usuarios (nome, email, senha, tipo)
VALUES
('Administrador', 'admin@email.com', '123456', 'admin'),
('Daniel', 'daniel@email.com', '123456', 'funcionario');

-- =========================================
-- DADOS DE TESTE - PRODUTOS
-- =========================================
INSERT INTO produtos (nome, preco, estoque, categoria, descricao)
VALUES
('Notebook Dell', 3500.00, 10, 'Eletrônicos', 'Notebook i5 8GB RAM'),
('Mouse Gamer', 120.00, 25, 'Periféricos', 'Mouse RGB'),
('Teclado Mecânico', 250.00, 15, 'Periféricos', 'Switch Blue');

-- =========================================
-- DADOS DE TESTE - PEDIDOS
-- =========================================
INSERT INTO pedidos (cliente, data_pedido, total)
VALUES
('Carlos Silva', '2026-04-08', 3740.00),
('Maria Souza', '2026-04-08', 250.00);

-- =========================================
-- DADOS DE TESTE - ITENS DOS PEDIDOS
-- =========================================
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES
(1, 1, 1, 3500.00),
(1, 2, 2, 120.00),
(2, 3, 1, 250.00);