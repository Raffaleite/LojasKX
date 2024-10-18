const AppError = require('../utils/AppError')
const sqliteConnection = require("../database/sqlite")

class UsersController {
  async create(request, response) {
    const { name, email, cpf, celular, status } = request.body
    
    const database = await sqliteConnection();
    const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    const checkCpfExist = await database.get("SELECT * FROM users WHERE cpf = (?)", [cpf])

    if(checkUserExist) {
      throw new AppError("Este e-mail já esta em uso")
    }

    if(checkCpfExist){
      throw new AppError("Este CPF já existe")
    }

    await database.run("INSERT INTO users (name, email, cpf, celular, status) VALUES (?, ?, ?, ?, ?)", [name, email, cpf, celular, status])
    
    return response.status(201).json()

  }

  async update(request, response) {
    const { name, email, cpf, celular, status } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if(!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    const userWithUpdatedCPF = await database.get("SELECT * FROM users WHERE cpf = (?)", [cpf])

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este e-mail já esta em uso")
    }

    if(userWithUpdatedCPF && userWithUpdatedCPF.id !== user.id){
      throw new AppError("Este CPF já existe")
    }

    user.name = name ?? user.name; 
    user.email = email ?? user.email;
    user.cpf = cpf ?? user.cpf;
    user.celular = celular ?? user.celular;
    user.status = status ?? user.status; 

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      cpf = ?,
      celular=?,
      status=?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.cpf, user.celular, user.status, id]
    );

    return response.status(200).json();
  }


  async delete(request, response) {
    const { id } = request.params;
  
    const database = await sqliteConnection();
  
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
  
    if (!user) {
      throw new AppError("Usuário não encontrado");
    }
  
    await database.run("DELETE FROM users WHERE id = ?", [id]);
  
    return response.status(200).json({ message: "Usuário deletado com sucesso" });
  }


  async index(request, response) {
    const database = await sqliteConnection();
  
    const users = await database.all("SELECT * FROM users");
  
    return response.status(200).json(users);
  }


  async show(request, response) {
    const { id } = request.params;
  
    const database = await sqliteConnection();
  
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
  
    if (!user) {
      throw new AppError("Usuário não encontrado");
    }
  
    return response.status(200).json(user);
  }
  
  
  
}

module.exports = UsersController
