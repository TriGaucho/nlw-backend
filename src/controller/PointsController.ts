import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        //Query Params quando queremos filtros
        const { city, uf, items } = request.query;


        const parseItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.id_point')
            .whereIn('point_items.id_item', parseItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points)
    };
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point){
            return response.status(400).json({message: 'Ponto não encontrado!'});
        };

        //busca os items do ID do ponto pesquisado.
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.id_item')
            .where('point_items.id_point', id)
            .select('items.title');

        return response.json({point, items});
    };

    async create(request: Request, response: Response) {
        //deserializção em javascrip mesmo que >>> const name = request.body.name
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        //transactions = aguardar uma execução no banco anterior terminar antes de iniciar a proxima.
        const trx = await knex.transaction();


        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        //propriedades com mesmo nome do parametro.
        //KNEX retorna o IDs dos dados inseridos...
        const insertIds = await trx('points').insert(point);
        

        //criando uma propriedade com mesmo nome usado em pointItems
        const id_point = insertIds[0];

        //...pega o id do item cadastrado em points(retorno do knex) e cria um objeto
        const pointItems = items.map((id_item: number) => {
            return {
                id_item,
                id_point //mesmo nome da prpriedade.
            }
        })

        
        //salva os items e o point na tabela items_point
        await trx('point_items').insert(pointItems);

        //commit as trx
        await trx.commit();

        return response.json({
            id: id_point,
            ...point
        });
    }
};

export default PointsController;