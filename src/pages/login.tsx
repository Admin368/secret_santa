import { useRouter } from "next/router";
import CheckAuth from "~/components/CheckAuth";
import LayoutPage from "~/layouts/LayoutPage";

export default function Page() {
  return (
    <LayoutPage pageTitle="Login">
      <div style={{ height: 20 }} />
      <CheckAuth
        isModal={false}
        isIdEditble
        onSuccess={{ redirectUrl: "/group/match" }}
      />
    </LayoutPage>
  );
}
