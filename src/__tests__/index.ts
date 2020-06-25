import { setupServer } from "../";
import nodeFetch, { Response } from 'node-fetch';
import fetchAbsolute from 'fetch-absolute';
import { request } from 'graphql-request'

const fetch = fetchAbsolute(nodeFetch)("http://localhost");
global.fetch = fetch;
const data = {foo:{bar:"baz"}};

let server = null as any;


describe("simple rest server", () => {


  beforeEach(() => {
    server = setupServer(data);
    return server.listen();
  })
  
  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers())
      // Disable API mocking after the tests are done.
  afterAll(() => server.close())

  it("will create a GET", async () => {

    const results = await fetch("/foo");
    expect(await results.json()).toEqual({bar:"baz"})
  });

  it("will create a POST", async () => {
    const results = await fetch("/foo", {method:"POST", body:JSON.stringify({bar:"qux"})});


    expect(await results.json()).toEqual({bar:"qux"})

    const results2 = await fetch("/foo");
    expect(await results2.json()).toEqual({bar:"qux"})
  })
});

describe("simple gql server", () => {
  beforeEach(() => {
    server = setupServer(data);
    return server.listen();
  })
  
  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers())
      // Disable API mocking after the tests are done.
  afterAll(() => server.close())
  it("will create a query", async () => {
    const query = `
    query GetFoo {
      foo {
        bar
      }
    }`;

    const results = await request("http://localhost", query);

    expect(results).toEqual({bar:"baz"})
  })
})
