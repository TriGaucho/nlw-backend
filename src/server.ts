import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Listagem de usuarios');

    response.json(
        [
            'Diogo',
            'Kayene',
            'Izadora',
            'Kali'
        ]
    );
});

app.listen(3333)