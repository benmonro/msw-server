import Head from "next/head";
import { useState, useRef } from "react";
import { useQuery, queryCache, useMutation } from "react-query";

const ENTER_KEY = 13;
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const { setupWorker } = require("../../dist/browser");
  const worker = setupWorker({ todos: [{ text: "xxx" }, { text: "foo" }] });
  worker.start();
}

const fetchTodos = async () => {
  const results = await fetch("/todos");
  const todos = await results.json();

  return todos;
};

const addTodo = async (text, ...args) => {
  const results = await fetch("/todos", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  const todos = await results.json();

  return todos;
};

export default function Home() {
  const [mutate] = useMutation(addTodo, {
    onSuccess: () => {
      queryCache.invalidateQueries("todos");
    },
  });
  const { data: todos, status } = useQuery("todos", fetchTodos);
  const textbox = useRef(null);
  // const [todos, setTodos] = useState([{text:"hello"},{text:"foo"}]);

  console.log({ status });
  if (status === "loading") {
    return <span>Loading...</span>;
  }

  async function onNewTodoType(evt) {
    if (event.which === ENTER_KEY) {
      const text = evt.target.value;
      // let results = await fetch("/todos")
      // let json = await results.json();
      // setTodos([...todos, {text}]);
      mutate(text);
      textbox.current.value = "";
    }
  }
  console.log({ todos });
  return (
    todos && (
      <div className="container">
        <Head>
          <title>Example App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="title">Example App</h1>

          <p className="description">
            Get started by editing <code>pages/index.js</code>
          </p>

          <div className="grid">
            {todos?.map((todo) => (
              <div key={todo.text} className="card">
                <h3>{todo.text}</h3>
              </div>
            ))}

            <label>
              <span>text</span>
              <input type="text" ref={textbox} onKeyPress={onNewTodoType} />
            </label>
            <button>add todo</button>
          </div>
        </main>

        <style jsx>{`
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            max-width: 800px;
            margin-top: 3rem;
          }

          .card {
            margin: 1rem;
            flex-basis: 45%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            transition: color 0.15s ease, border-color 0.15s ease;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }

          .logo {
            height: 1em;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    )
  );
}
