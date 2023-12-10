import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "~/components/Logo";

interface PropsLayoutPage {
  children: React.ReactNode;
  logoIsTop?: boolean;
  pageTitle?: string;
}
export default function LayoutPage(props: PropsLayoutPage) {
  const router = useRouter();
  return (
    <div
      className="flex text-white"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>{`Secret Santa${
          props.pageTitle ? ` - ${props.pageTitle}` : ""
        }`}</title>
        <meta
          name="description"
          content="Randomly assign Secret Santas with your friends"
        />
      </Head>
      <div
        className="text-center font-extrabold"
        style={{
          maxWidth: 1200,
          minWidth: 320,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          flexDirection: "column",
          padding: 20,
          transition: `background-color 0.5s ease`,
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
              padding: 10,
              fontWeight: 200,
              color: "white",
              textAlign: "center",
              width: "fit-content",
              whiteSpace: "nowrap",
              alignSelf: "center",
            }}
          >
            Create your own{" "}
            <strong style={{ fontWeight: 800 }}>Secret Santa</strong> list
            <br />
            Santa.Maravian.com
          </p>
        ) : null}
      </Link>
      <Link href={"/creators"}>
        {router.pathname !== "/" ? (
          <p
            style={{
              padding: 10,
              fontWeight: 200,
              color: "white",
              textAlign: "center",
              width: "fit-content",
              whiteSpace: "nowrap",
              alignSelf: "center",
            }}
          >
            
            <strong style={{ fontWeight: 800 }}>About Us</strong> 
          </p>
        ) : null}
      </Link>
      
    </div>
  );
}
