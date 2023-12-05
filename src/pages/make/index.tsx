import { Button } from "~/components/Button";
import { Text } from "~/components/Text";
import { useRouter } from "next/router";
export default function Page() {
  const router = useRouter();
  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        // border: "1px solid red",
        width: "100%",
        height: "100%",
        paddingTop: 20,
        gap: 20,
        alignItems: "center",
      }}
    >
      <Text text="Randomly assign your friends to for secret santa" />
      <Text text="List the names of the people participating  and we’ll randomly assign their secret santa." />
      <Text text="And they will receive their secret receiver by emails" />
      <Button
        text="Create Santa List"
        isInverted
        onClick={async () => {
          await router.push("/make/link");
        }}
      />
    </div>
  );
}
