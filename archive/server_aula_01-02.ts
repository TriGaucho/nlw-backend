import express, { request, response } from 'express';

const app = express();

//indica ao EXPRESS como tratar json
app.use(express.json());

const users = [
    'Diogo',
    'Kayene',
    'Izadora',
    'Kali'
];

app.get('/users', (request, response) => {
    //requisição com QUERY
    const search  = String(request.query.search);

    //if ternario para saber se o conteudo de USER atende o search
    const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

    return response.json(filteredUsers);
});

//resquisição com PARAMS :id
app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
});

app.post('/users', (request, response) => {
    const data = request.body;

    const user = {
        name: data.name,
        email: data.email
    }

    return response.json(user);
});

app.listen(3333)