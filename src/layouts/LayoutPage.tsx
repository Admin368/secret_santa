import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Logo from "~/components/Logo";

interface PropsLayoutPage {
  children: React.ReactNode;
  logoIsTop?: boolean;
  pageTitle?: string;
}
export default function LayoutPage(props: PropsLayoutPage) {
  const router = useRouter();
  return (
    // <div className="container flex flex-col items-center justify-start text-center text-white">
    <div
      className="flex text-white"
      style={{
        display: "flex",
        flexDirection: "column",
        // border: "10px solid black",
        width: "100%",
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>{`Secret Santa${
          props.pageTitle && ` - ${props.pageTitle}`
        }`}</title>
      </Head>
      <div
        className="text-center font-extrabold"
        style={{
          //   border: `1px solid white`,
          maxWidth: 1200,
          minWidth: 320,
          width: "100%",
          // height: props.isFullHeight ? "100%" : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          flexDirection: "column",
          padding: 20,
          // transition: "1s",
          transition: `background-color 0.5s ease`,
          //   overflow: "hidden",
          position: "relative",
        }}
      >
        <span
          style={{
            position: props.logoIsTop ? "absolute" : undefined,
            top: props.logoIsTop ? 10 : undefined,
          }}
        >
          <Logo />
        </span>
        {props.children}
      </div>
      <Link href={"/"}>
        {router.pathname !== "/" ? (
          <p
            style={{
              // position: "absolute",
              padding: 10,
              // bottom: 30,
              fontWeight: 200,
              color: "white",
              // textAlign: "center",
              width: "fit-content",
              whiteSpace: "nowrap",
              alignSelf: "center",
            }}
          >
            Create your own <strong>Secret Santa</strong> list
          </p>
        ) : null}
      </Link>
    </div>
  );
}
