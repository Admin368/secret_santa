import { useRouter } from "next/router";
import { Button } from "~/components/Button";

export default function Index() {
  const router = useRouter();
  return (
    <div className="container flex flex-col justify-start text-center text-white">
      <p
        className="py-2.5 text-4xl font-bold text-white"
        style={{
          lineHeight: 1.5,
        }}
      >
        👀 Santa,
        <br />
        We Dont know you
        <br />
        <Button
          text="Make a new secret santa group with your friends"
          isInverted
          onClick={async () => {
            await router.push("/");
          }}
        />
      </p>
    </div>
  );
}
