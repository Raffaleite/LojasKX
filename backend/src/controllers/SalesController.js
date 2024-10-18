const AppError = require('../utils/AppError');
const sqliteConnection = require("../database/sqlite");

class SalesController {
    async create(request, response) {
        const { produto_nome, quantidade, preco } = request.body;

        const database = await sqliteConnection();

        await database.run(`
            INSERT INTO vendas (produto_nome, quantidade, preco)
            VALUES (?, ?, ?)`, 
            [produto_nome, quantidade, preco]
        );

        return response.status(201).json();
    }

    async update(request, response) {
        const { produto_nome, quantidade, preco } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
        const sale = await database.get("SELECT * FROM vendas WHERE id = ?", [id]);

        if (!sale) {
            throw new AppError("Venda não encontrada");
        }

        await database.run(`
            UPDATE vendas SET
            produto_nome = ?,
            quantidade = ?,
            preco = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`, 
            [produto_nome ?? sale.produto_nome, quantidade ?? sale.quantidade, preco ?? sale.preco, id]
        );

        return response.status(200).json();
    }

    async delete(request, response) {
        const { id } = request.params;

        const database = await sqliteConnection();

        const sale = await database.get("SELECT * FROM vendas WHERE id = ?", [id]);

        if (!sale) {
            throw new AppError("Venda não encontrada");
        }

        await database.run("DELETE FROM vendas WHERE id = ?", [id]);

        return response.status(200).json({ message: "Venda deletada com sucesso" });
    }

    async index(request, response) {
        const database = await sqliteConnection();

        const sales = await database.all("SELECT * FROM vendas");

        return response.status(200).json(sales);
    }

    async show(request, response) {
        const { id } = request.params;

        const database = await sqliteConnection();

        const sale = await database.get("SELECT * FROM vendas WHERE id = ?", [id]);

        if (!sale) {
            throw new AppError("Venda não encontrada");
        }

        return response.status(200).json(sale);
    }
}

module.exports = SalesController;
