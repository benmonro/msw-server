import { RequestHandlersList } from "msw/lib/types/setupWorker/glossary";
import { rest, graphql } from "msw";
import Memory from "lowdb/adapters/Memory";
import low from "lowdb";
import _ from "lodash";
import { setupServer as mswSetupServer } from "msw/node";
import lodashId from 'lodash-id';
import mixins from 'json-server/lib/server/mixins'

export function getEndpointsFor(data: object): RequestHandlersList {
  const db = low(new Memory()).setState(JSON.parse(JSON.stringify(data)));
  db._.mixin(lodashId)
  db._.mixin(mixins);

  const handlers: RequestHandlersList = [];
  _.forEach(data, (value: any, key: string) => {
    handlers.push(
      rest.get(`/${key}`, (req, res, ctx) => {
        return res(ctx.json(db.get(key).value()));
      })
    );



    handlers.push(
      rest.post(`/${key}`, (req, res, ctx) => {
        const body = JSON.parse(req.body as string)

        const collection = db.get(key);

        const newResource = collection.insert(body).write();

        return res(ctx.json(collection.getById(newResource.id).value()));
      })
    );
    handlers.push(
      rest.put(`/${key}/:id`, (req,res,ctx) => {

        const { id } = req.params;

        const resource = db
        .get(key)
        .getById(id)
        .value();

      const result = db.get(key).replaceById(id, JSON.parse(req.body as string)).write();
      return res(ctx.json(result))
  }))

    handlers.push(
      rest.delete(`/${key}/:id`, (req,res,ctx) => {

        const resource = db
        .get(key)
        .removeById(req.params.id)
        .write()

      // Remove dependents documents
      // const removable = db._.getRemovable(db.getState(), {})
      // removable.forEach((item:any) => {
      //   console.log(item)
      //   db.get(item.name)
      //     .removeById(item.id)
      //     .write()
      // })
        return res(ctx.json({}))
      })
    )
    handlers.push(
      graphql.query(`Get${_.startCase(key)}`, (req, res, ctx) => {
        return res(ctx.data(db.get(key).value()));
      })
    );

    handlers.push(
      graphql.mutation(_.startCase(key), (req, res, ctx) => {
        db.set(key, req.variables).write();
        return res(ctx.data(db.get(key).value()));
      })
    );
  });

  return handlers;
}

export function setupServer(data: object) {
  const server = mswSetupServer(...getEndpointsFor(data));

  return {
    listen: server.listen,
    resetHandlers() {
      server.resetHandlers(...getEndpointsFor(data));
    },
    close: server.close,
  };
}
