import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

const MyDocument = () => (
  <Html lang="en">
    <Head />
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

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
