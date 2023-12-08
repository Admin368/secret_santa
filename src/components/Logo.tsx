import { Button } from "antd/lib";
import { useRouter } from "next/router";

export default function Logo() {
  const router = useRouter();
  return (
    <Button
      type="text"
      onClick={async () => {
        await router.push("/");
        // window.location = "/"
        // window.location.replace("/");
      }}
      style={{
        height: "fit-content",
      }}
    >
      <p className="text-center text-3xl font-extrabold text-white">
        🎅SECRET SANTA🎅
      </p>
    </Button>
  );
}
