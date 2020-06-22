import { RequestHandlersList } from "msw/lib/types/setupWorker/glossary";
import {rest} from 'msw';
import Memory from "lowdb/adapters/Memory";
import low from 'lowdb';
import _ from 'lodash';


export function getEndpointsFor(data:object): RequestHandlersList {
    const db = low(new Memory()).setState(data);
    const handlers : RequestHandlersList = [];
    _.forEach(data,(value:any, key:string) => {

        handlers.push(rest.get(`/${key}`, (req,res,ctx) => {
            return res(ctx.json(db.get(key).value()))
        }));

        handlers.push(rest.post(`/${key}`, (req,res,ctx) => {
            db.set(key, JSON.parse(req.body as string)).write(); 
            return res(ctx.json(db.get(key).value()))
        }))
    })


    return handlers;
}
