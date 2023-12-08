import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { Spin } from "antd/lib";
import CheckAuth from "~/components/CheckAuth";
import LayoutPage from "~/layouts/LayoutPage";
// import { env } from "~/env";

interface linkType {
  link: string;
  password: string;
}
export default function link() {
  // const group = api.group.
  const router = useRouter();
  const id = router.query.id as string;
  const pwd = router.query.pwd as string;
  const group = api.group.get.useQuery(
    { id, pwd },
    { enabled: id ? true : false && pwd ? true : false, staleTime: Infinity },
  );
  const [link, setLink] = useState<linkType>();
  useEffect(() => {
    if (group.data?.id && group.data?.password) {
      setLink({
        link: `https://santa.maravian.com/group/link?id=${group.data.id}`,
        password: group.data.password,
      });
    }
  }, [group.data]);
  return (
    <LayoutPage pageTitle="Group - Link">
      <CheckAuth />
      <div className="text-center text-white">
        <p className="py-2.5  text-2xl text-white">
          We created a new santa link
        </p>
        <p className="py-2.5 font-light">
          Please copy and keep this link to view the details later.
        </p>
      </div>
      <div className="h-50 w-50 flex flex-col items-center rounded-md border p-2">
        <Spin spinning={group.data ? false : true}>
          <p className="mb-0">Link:</p>
          <p className="mt-0 font-light">{link?.link}</p>
          <p className="mb-0">Password:</p>
          <p className="mt-0 font-light">
            {link?.password ?? `AnnieAreYouOkay`}
          </p>
          <div
            className="mt-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CopyToClipboard
              text={`Secret Santa Link (Only for link maker) Link: ${link?.link} Password: ${link?.password}`}
              onCopy={() => {
                toast.success("Link Copied to clipboard");
              }}
            >
              <Button
                isDisabled={link ? false : true}
                text="1.Copy Link"
                isInverted
                onClick={async () => {
                  // await router.push("/make/link");
                  // await navigator?.clipboard?.writeText("sdsd");
                }}
              />
            </CopyToClipboard>
          </div>{" "}
        </Spin>
      </div>
      <p className="font-light">
        This is only for the <span className="font-semibold">link maker</span>
      </p>
      <p style={{ fontSize: 32 }}>😉</p>
      <div className="m-2">
        <Button
          isDisabled={group.data ? false : true}
          text="> 2.Continue Add People"
          isInverted
          onClick={async () => {
            await router.push({ pathname: "/group/match", query: { id, pwd } });
          }}
        />
      </div>
    </LayoutPage>
  );
}
