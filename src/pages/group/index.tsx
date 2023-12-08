import { Button } from "~/components/Button";
import { Text } from "~/components/Text";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import LayoutPage from "~/layouts/LayoutPage";
export default function Page() {
  const router = useRouter();

  const groupCreate = api.group.create.useMutation();
  async function handleGroupCreate() {
    await groupCreate
      .mutateAsync()
      .then(async (res) => {
        await router.push(`/group/link?id=${res.id}&pwd=${res.password}`);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to create link");
      });
  }
  return (
    <LayoutPage>
      <div
        style={{
          // flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          // border: "1px solid red",
          width: "100%",
          // height: "fit-content",
          paddingTop: 20,
          gap: 20,
          alignItems: "center",
        }}
      >
        <Text text="Randomly assign your friends to for secret santa" />
        <Text text="List the names of the people participating  and we’ll randomly assign their secret santa." />
        <Text text="And they will receive their secret receiver by emails" />
        <Button
          isLoading={groupCreate.isLoading}
          isDisabled={groupCreate.isLoading}
          text="Create Santa List"
          isInverted
          onClick={async () => {
            await handleGroupCreate();
          }}
        />
        {/* <Input /> */}
      </div>
    </LayoutPage>
  );
}
