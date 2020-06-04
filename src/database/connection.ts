import knex from 'knex';
import path from 'path';


//configurações do banco de dados
const conexao = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') //padroniza caminhos de repositorio para os Sistemas Operacionais.
    },
    useNullAsDefault: true,
});

export default conexao;