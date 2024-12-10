import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import Spin from "antd/lib/spin";
import CheckAuth from "~/components/CheckAuth";
import LayoutPage from "~/layouts/LayoutPage";
import { env } from "~/env";

interface linkType {
  link: string;
  password: string;
}
export async function getServerSideProps() {
  return {
    props: {
      BASE_URL: env.BASE_URL,
    },
  };
}
export default function Link(props: { BASE_URL?: string }) {
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
        link: `${
          props.BASE_URL ?? "https://santa.maravian.com"
        }/group/link?id=${group.data.id}`,
        password: group.data.password,
      });
    }
  }, [group.data]);
  return (
    <LayoutPage pageTitle="Group - Link">
      <CheckAuth />
      {group.data?.is_matched ? (
        <div className="text-center text-white">
          <p className="py-2.5  text-2xl text-white">
            Matched Group Management
          </p>
          <p className="py-2.5 font-light">
            This group is Already matched.
            <br />
            Use this link and click the "Manage Group" to see if emails are
            checked, resend emails, hints and more
          </p>
        </div>
      ) : (
        <div className="text-center text-white">
          <p className="py-2.5  text-2xl text-white">
            We created a new
            <br />
            Secret Santa link
          </p>
          <p className="py-2.5 font-light">
            Please copy and keep this link to view the details later.
            <br />
            The link has also been sent to your email if you need to edit or
            resend emails to santas later
          </p>
        </div>
      )}
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
          text={
            !group.data?.is_matched ? "> 2.Continue Add People" : "Manage Group"
          }
          isInverted
          onClick={async () => {
            await router.push({ pathname: "/group/match", query: { id, pwd } });
          }}
        />
      </div>
    </LayoutPage>
  );
}
