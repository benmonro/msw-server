import { setupServer } from "msw/node";
import { getEndpointsFor } from "..";
import nodeFetch, { Response } from 'node-fetch';
import fetchAbsolute from 'fetch-absolute';


const fetch = fetchAbsolute(nodeFetch)("http://localhost");

const data = {foo:{bar:"baz"}};

const server = setupServer(...getEndpointsFor(data))
describe("simple rest server", () => {
    beforeAll(() => server.listen())

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



    const results2 = await fetch("/foo");
    expect(await results2.json()).toEqual({bar:"qux"})
  })
});

