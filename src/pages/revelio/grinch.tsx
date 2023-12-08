import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import { api } from "~/utils/api";

interface PropsTextDisplay {
  name: string;
}
function TextDisplay(props: PropsTextDisplay) {
  const revealing = [
    "Welcome,You are about to discover the identity of the person you will be gifting this year.",
    "The moment of truth has arrived!Are you ready to find out who your Secret Santa is ? ",
    `You have been chosen to be the Secret Santa for`,
    props.name,
  ];
  const [text, setText] = useState(revealing[0]);

  let index = 0;

  function changeText(): void {
    setText(revealing[index]);

    index++;
    if (index >= revealing.length) {
      index = 0;
    }
  }

  useEffect(() => {
    const timer = setInterval(changeText, 3000);
    return () => clearInterval(timer);
  }, []);

  return <p className=" py-2.5 text-2xl font-bold text-white">{text}</p>;
}
export default function revelio() {
  const router = useRouter();
  const id = router.query.id as string;
  const santa = api.group.member_get.useQuery(
    { id: id },
    { enabled: id ? true : false, staleTime: 0 },
  );
  const receiver = api.group.member_get_my_receiver.useMutation();
  useEffect(() => {
    if (santa.data && !receiver.data?.receiver_name) {
      receiver
        .mutateAsync({ id: santa.data.id })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [id, receiver.data, santa.data]);
  return (
    <div className=" container flex min-h-screen flex-col items-center justify-center text-center text-white">
      {receiver.data?.receiver_name ? (
        <TextDisplay name={receiver.data?.receiver_name} />
      ) : (
        <LoadingOutlined />
      )}
    </div>
  );
}
