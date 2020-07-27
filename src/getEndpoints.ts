import lodashId from "lodash-id";
import mixins from "json-server/lib/server/mixins";
import { RequestHandlersList } from "msw/lib/types/setupWorker/glossary";
import { rest, graphql as mswGraphql } from "msw";
import low from "lowdb";
import _ from "lodash";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { jsonToSchema } from "@walmartlabs/json-to-simple-graphql-schema/lib";
import Memory from "lowdb/adapters/Memory";
import { graphql } from "graphql";

// declare const hammerhead: number;
declare global {
  interface Window {
    "%hammerhead%": {
      utils: {
        url: {
          getProxyUrl: (url: string) => string;
        };
      };
    };
  }
}
function withUrl(url: string) {
  if (process.env.NEXT_PUBLIC_IS_TESTCAFE) {
    const getProxyUrl = window["%hammerhead%"].utils.url.getProxyUrl;

    return getProxyUrl(url);
  }
  return url;
}
export function getEndpointsFor(data: object): RequestHandlersList {
  const db = low(new Memory()).setState(JSON.parse(JSON.stringify(data)));
  db._.mixin(lodashId);
  db._.mixin(mixins);

  const schemaString = jsonToSchema({
    baseType: "Query",
    jsonInput: JSON.stringify(data),
  });

  const schema = makeExecutableSchema({ typeDefs: schemaString.value });
  const handlers: RequestHandlersList = [];
  _.forEach(data, (value: any, key: string) => {
    handlers.push(
      rest.get(withUrl(`/${key}`), (req, res, ctx) => {
        // rest.get((`*/${key}`), (req, res, ctx) => {
        return res(ctx.json(db.get(key).value()));
      })
    );

    handlers.push(
      rest.post(withUrl(`/${key}`), (req, res, ctx) => {
        const body = JSON.parse(req.body as string);

        const collection = db.get(key);

        const newResource = collection.insert(body).write();

        return res(ctx.json(collection.getById(newResource.id).value()));
      })
    );
    handlers.push(
      rest.put(withUrl(`/${key}/:id`), (req, res, ctx) => {
        const { id } = req.params;

        const resource = db.get(key).getById(id).value();

        const result = db
          .get(key)
          .replaceById(id, JSON.parse(req.body as string))
          .write();
        return res(ctx.json(result));
      })
    );

    handlers.push(
      rest.delete(withUrl(`/${key}/:id`), (req, res, ctx) => {
        const resource = db.get(key).removeById(req.params.id).write();

        // Remove dependents documents
        // const removable = db._.getRemovable(db.getState(), {})
        // removable.forEach((item:any) => {
        //   console.log(item)
        //   db.get(item.name)
        //     .removeById(item.id)
        //     .write()
        // })
        return res(ctx.json({}));
      })
    );
    handlers.push(
      //@ts-ignore https://github.com/mswjs/msw/issues/296
      mswGraphql.query(`Get${_.startCase(key)}`, async (req, res, ctx) => {
        // console.log

        //@ts-ignore https://github.com/mswjs/msw/issues/297
        const result = await graphql(schema, req.body?.query, db.getState());

        return res(ctx.data(result.data));
      })
    );

    handlers.push(
      mswGraphql.mutation(_.startCase(key), (req, res, ctx) => {
        db.set(key, req.variables).write();
        console.log({ key }, req.variables);
        const results = db.get(key).value();
        console.log(results);
        return res(ctx.data({ [key]: [results] }));
      })
    );
  });

  // handlers.push(
  //   // @ts-ignore
  //   rest.get("*", (req,res,ctx) => {}),
  //   // @ts-ignore
  //   rest.post("*", (req,res,ctx) => {})
  // )
  return handlers;
}
