const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers');
const createSales = require('./createSales');

async function migrationsRun() {
    try {
        const db = await sqliteConnection();

        await db.exec(createUsers);
        console.log("Tabela users criada com sucesso.");

        await db.exec(createSales);
        console.log("Tabela sales criada com sucesso.");
        
    } catch (error) {
        console.error("Error running migrations:", error);
    }
}

module.exports = migrationsRun;
