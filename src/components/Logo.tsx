import { Button } from "antd/lib";
// import { useRouter } from "next/router";

export default function Logo() {
  //   const router = useRouter();
  return (
    <Button
      onClick={async () => {
        // await router.push("/");
        // window.location = "/"
        // window.location.replace("/");
      }}
    >
      <p className="text-center text-4xl font-extrabold text-white">
        🎅 SECRET SANTA 🎅
      </p>
    </Button>
  );
}
