const createSales = `
    CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_nome VARCHAR(100) NOT NULL,
        quantidade INTEGER NOT NULL,
        preco VARCHAR(100) NOT NULL,
        data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

module.exports = createSales;
