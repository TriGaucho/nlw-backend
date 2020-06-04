import express, { request, response } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';


const app = express();


app.use(cors());
//indica ao EXPRESS como tratar json
app.use(express.json());
app.use(routes);

//função do express que disponiniliza arquivos estaticos, como imagens.
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);