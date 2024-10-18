# Lojas KX

Este é um projeto que combina um backend em Node.js e um frontend em React. Abaixo estão as instruções para executar ambos os lados da aplicação.

### Tecnologias Utilizadas

#### Backend
- **Node.js**: Um ambiente de execução JavaScript que permite a criação de aplicações escaláveis e de alta performance.
- **Express**: Um framework minimalista para Node.js que facilita a criação de APIs e a manipulação de requisições HTTP.
- **SQLite3**: Um banco de dados leve que armazena dados em arquivos locais, ideal para protótipos e pequenos projetos.

#### Frontend
- **React (Vite)**: Uma biblioteca JavaScript para construir interfaces de usuário, utilizando Vite como ferramenta de construção e desenvolvimento, que proporciona uma experiência de desenvolvimento rápida e moderna.
- **Tailwind CSS**: Um framework CSS utilitário que permite estilizar rapidamente componentes com classes pré-definidas, resultando em um design responsivo e personalizável.
- **React Query**: Uma biblioteca para gerenciar o estado e o cache de dados assíncronos, facilitando a busca e a manipulação de dados no frontend.

### Descrição da Aplicação

A aplicação é um sistema de gestão que permite aos usuários cadastrar e gerenciar informações de clientes e vendas. Os principais recursos incluem:

- **Cadastro de Usuários**: Permite adicionar novos usuários ao sistema, validando dados como e-mail e CPF para evitar duplicidades.
- **Gerenciamento de Vendas**: Facilita o registro de vendas, permitindo inserir informações sobre produtos, quantidade e preços.
- **Visualização de Dados**: Os usuários podem visualizar listas de clientes e vendas, com opções de edição e exclusão.


## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/get-npm) (geralmente já incluído com o Node.js)

## Comandos

Tanto para o backend e para o frontend execute esse comando em ambos terminais

```bash
  npm install
```

Após isso execute este comando no terminal do backend e frontend respectivamente
```bash
  npm run dev
```

### Interação entre Backend e Frontend
Certifique-se de que o backend está rodando antes de iniciar o frontend.
O frontend irá fazer chamadas para o backend utilizando a URL http://localhost:3333 para acessar os dados da API.

