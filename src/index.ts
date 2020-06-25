import { RequestHandlersList } from "msw/lib/types/setupWorker/glossary";
import {rest, graphql} from 'msw';
import Memory from "lowdb/adapters/Memory";
import low from 'lowdb';
import _ from 'lodash';
import {setupServer as mswSetupServer} from 'msw/node';

export function getEndpointsFor(data:object): RequestHandlersList {
    const db = low(new Memory()).setState(JSON.parse(JSON.stringify(data)));
    const handlers : RequestHandlersList = [];
    _.forEach(data,(value:any, key:string) => {

        handlers.push(rest.get(`/${key}`, (req,res,ctx) => {
            return res(ctx.json(db.get(key).value()))
        }));

        handlers.push(rest.post(`/${key}`, (req,res,ctx) => {
            db.set(key, JSON.parse(req.body as string)).write(); 
            return res(ctx.json(db.get(key).value()))
        }));

        handlers.push(graphql.query(`Get${_.startCase(key)}`, (req,res,ctx) => {
            return res(ctx.data(db.get(key).value()))
        }))

        // handlers.push(graphql.mutation(_.startCase(key), (req,res,ctx) => {

        // }))


    })


    return handlers;
}

export function setupServer(data: object) {
    const server = mswSetupServer(...getEndpointsFor(data));

    return {
        listen: server.listen,
        resetHandlers() {
            server.resetHandlers(...getEndpointsFor(data));
        },
        close: server.close
    }
}
