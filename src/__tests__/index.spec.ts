import { setupServer } from "../";
import nodeFetch, { Response } from "node-fetch";
import fetchAbsolute from "fetch-absolute";
import { request } from "graphql-request";

const fetch = fetchAbsolute(nodeFetch)("http://localhost");
global.fetch = fetch;

const data = require("./db.json");
let server = setupServer(data);
beforeEach(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());
// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("simple rest server", () => {
  it("will work with nothing passed in", () => {
    const fakeServer = setupServer();

    expect(fakeServer).toBeDefined();
  })
  it("will create a GET", async () => {
    const results = await fetch("/posts");
    expect(await results.json()).toEqual([
      {
        id: 1,
        title: "json-server",
        author: "typicode",
      },
    ]);
  });

  it("will create a POST", async () => {
    const results = await fetch("/posts", {
      method: "POST",
      body: JSON.stringify({ title: "foo", author: "bar" }),
    });

    expect(await results.json()).toEqual({
      id: 2,
      title: "foo",
      author: "bar",
    });

    const results2 = await fetch("/posts");
    expect(await results2.json()).toEqual([
      {
        id: 1,
        title: "json-server",
        author: "typicode",
      },
      { id: 2, title: "foo", author: "bar" },
    ]);
  });

  it("will create a PUT", async () => {
    const results = await fetch("/posts/1", {
      method: "PUT",
      body: JSON.stringify({ title: "grievances", author: "costanza" }),
    });

    expect(await results.json()).toEqual({
      id: 1,
      title: "grievances",
      author: "costanza",
    });

    const results2 = await fetch("/posts");
    expect(await results2.json()).toEqual([
      {
        id: 1,
        title: "grievances",
        author: "costanza",
      },
    ]);
  });

  it("will create a DELETE", async () => {
    const results = await fetch("/posts/1", {
      method: "DELETE",
    });

    expect(await results.json()).toEqual({});

    const results2 = await fetch("/posts");
    expect(await results2.json()).toEqual([]);

    // const results3 = await fetch("/comments");
    // expect(await results3.json()).toBe([])
  });
});

describe("simple gql server", () => {
  xit("will create a Posts query with comments", async () => {
    const query = `
    query GetPosts {
      posts { 
        title
        comments {
          body
        }
      } 
    }`;

    const results = await request("/", query);

    expect(results).toEqual({ posts: [{ title: "json-server" }] });
  });
  it("will create a Posts query", async () => {
    const query = `
    query GetPosts {
      posts { 
        title
      } 
    }`;

    const results = await request("/", query);

    expect(results).toEqual({ posts: [{ title: "json-server" }] });
  });

  xit("will create a mutation", async () => {
    const query = `
    mutation Posts($title: String) {
      posts {
        title
      }
    }`;

    const variables = { title: "a series of unfortunate events" };
    const results = await request("/", query, variables);

    expect(results).toEqual({
      posts: [{ title: "a series of unfortunate events" }],
    });

    const query2 = `
    query GetPosts {
      posts { 
        title
      } 
    }`;

    const results2 = await request("/", query2);

    expect(results2).toEqual({
      posts: [{ title: "a series of unfortunate events" }],
    });
  });
});
