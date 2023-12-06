import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import SpinFC from "antd/lib/spin";
import CheckAuth from "~/components/CheckAuth";

interface linkType {
  link: string;
  password: string;
}
export default function link() {
  // const group = api.group.
  const router = useRouter();
  const id = router.query.id as unknown as string;
  const group = api.group.get.useQuery(
    { id: id ?? "" },
    { enabled: id ? true : false, staleTime: Infinity },
  );
  const [link, setLink] = useState<linkType>();
  useEffect(() => {
    if (group.data?.id && group.data?.password) {
      setLink({
        link: `https://santa.maravian.com/group/final?id=${group.data.id}`,
        password: group.data.password,
      });
    }
  }, [group.data]);
  return (
    <div className="container flex flex-col items-center justify-start text-center text-white">
      <CheckAuth />
      <div className="text-center text-white">
        <p className="py-2.5  text-2xl text-white">Create new link</p>
        <p className="py-2.5 font-light">
          Please copy and keep this link to view the details later.
        </p>
      </div>
      <div className="h-50 w-50 flex flex-col items-center rounded-md border p-2">
        <SpinFC spinning={group.data ? false : true}>
          <p className="mb-0">Link:</p>
          <p className="mt-0 font-light">{link?.link}</p>
          <p className="mb-0">Password:</p>
          <p className="mt-0 font-light">
            {link?.password ?? `AnnieAreYouOkay`}
          </p>
          <div className="mt-2">
            <CopyToClipboard
              text={`Secret Santa Link (Only for link maker) Link: ${link?.link} Password: ${link?.password}`}
              onCopy={() => {
                console.log("done");
                toast.success("Link Copied to clipboard");
              }}
            >
              <Button
                isDisabled={link ? false : true}
                text="Copy Link"
                isInverted
                onClick={async () => {
                  // await router.push("/make/link");
                  // await navigator?.clipboard?.writeText("sdsd");
                }}
              />
            </CopyToClipboard>
          </div>{" "}
        </SpinFC>
      </div>
      <p className="font-light">
        This is only for the <span className="font-semibold">link maker</span>
      </p>
      <p>😉</p>
      <div className="m-2">
        <Button
          text="Add People"
          onClick={async () => {
            await router.push("/group/match");
          }}
        />
      </div>
    </div>
  );
}
