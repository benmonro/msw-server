import React, {useEffect, useState} from 'react';

export default function MyApp({ Component, pageProps }) {

    const [isMswReady, setMswReady] = useState(false);
  useEffect(() => {
    if (!isMswReady && typeof window !== "undefined") {
        const { setupWorker } = require("../../dist/browser");
        const worker = setupWorker({
          todos: [
            { id: 1, text: "foo" },
            { id: 2, text: "bar" },
          ],
        });
        worker.start().then(() => {
          setMswReady(true)
        });
      }

      
  }, [])

  if(!isMswReady) {
      return null;
  }

  return <Component {...pageProps} />

}
