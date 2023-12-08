import React from "react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <title>Secret Santa</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body className=" flex min-h-screen flex-col items-center justify-center bg-purple-700">
          <div
            className="text-center font-extrabold"
            style={{
              border: `1px solid white`,
              maxWidth: 1200,
              minWidth: 320,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flex: 1,
              flexDirection: "column",
              padding: 20,
              // transition: "1s",
              transition: `background-color 0.5s ease`,
            }}
          >
            <p className="text-center text-4xl font-extrabold text-white">
              SECRET SANTA
            </p>
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
