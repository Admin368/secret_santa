import React from "react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body className=" flex min-h-screen flex-col items-center justify-center bg-green-700">
          <div
            style={{
              border: `1px solid white`,
              maxWidth: 1200,
              minWidth: 320,
              width: "100%",
              height: "100%",
            }}
          >
            <p className="text-center text-9xl font-extrabold text-white">
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
