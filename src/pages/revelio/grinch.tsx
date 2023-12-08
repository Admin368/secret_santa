import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { api } from "~/utils/api";

interface PropsTextDisplay {
  name: string;
}
function TextDisplay(props: PropsTextDisplay) {
  const revealing = [
    <p>
      Welcome
      <br />
      You are about to discover
      <br />
      The person you will be gifting this year.
    </p>,
    <p>
      The moment of truth has arrived!
      <br />
      Are you ready to find out
      <br />
      Whose Secret Santa you are?
    </p>,
    // <p>You have been chosen to be the Secret Santa for</p>,
    <p>
      You
      <br />
      are the
      <br />
      Secret Santa for
      <br />
      <strong>{props.name}</strong>
    </p>,
  ];
  const [text, setText] = useState(revealing[0]);
  const [isSeen, setIsSeen] = useState(false);
  let index = 0;

  const changeText = useCallback(() => {
    setText(revealing[index]);

    index++;
    if (index >= revealing.length) {
      setIsSeen(true);
      //   index = 0;
    }
  }, [isSeen]);

  //   useEffect(() => {
  //     const timer = !isSeen && setInterval(changeText, 3000);
  //     return () => clearInterval(timer);
  //   }, [isSeen]);
  useEffect(() => {
    let timer: NodeJS.Timeout | false = false;
    if (!isSeen) {
      timer = setInterval(changeText, 3000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isSeen]);

  return (
    <p
      className=" py-2.5 text-2xl font-bold text-white"
      style={{
        transition: "2s",
      }}
    >
      {text}
    </p>
  );
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
