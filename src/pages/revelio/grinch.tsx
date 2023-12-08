import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { Button } from "~/components/Button";
import LayoutPage from "~/layouts/LayoutPage";
import { api } from "~/utils/api";

interface PropsTextDisplay {
  name: string;
  santa_name?: string;
  isAuto?: boolean;
}
function TextDisplay(props: PropsTextDisplay) {
  const revealing = [
    <span>
      <strong>Welcome {props.santa_name}</strong>
      <br />
      You are about to discover
      <br />
      The person you will be gifting this year.
    </span>,
    <span>
      The moment of truth has arrived!
      <br />
      Are you ready to find out
      <br />
      Whose Secret Santa you are?
    </span>,
    // <p>You have been chosen to be the Secret Santa for</p>,
    <span>
      {`${props.santa_name ?? " You"}`}
      <br />
      are the
      <br />
      Secret Santa for
      <br />
      <strong style={{ fontSize: 32 }}>{props.name}</strong>
    </span>,
  ];
  const [text, setText] = useState(revealing[0]);
  const [isSeen, setIsSeen] = useState(false);
  const [index, setIndex] = useState(0);
  // let index = 0;

  const changeText = useCallback(() => {
    const newIndex = index + 1;
    // index++;
    if (newIndex < revealing.length) {
      setIndex(newIndex);
      setText(revealing[newIndex]);
      return;
      //   index = 0;
    }
    setIsSeen(true);
  }, [isSeen, index]);

  //   useEffect(() => {
  //     const timer = !isSeen && setInterval(changeText, 3000);
  //     return () => clearInterval(timer);
  //   }, [isSeen]);
  useEffect(() => {
    let timer: NodeJS.Timeout | false = false;
    if (props.isAuto) {
      if (!isSeen) {
        timer = setInterval(changeText, 3000);
      }
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }
  }, [isSeen, props.isAuto, changeText, index, isSeen]);

  return (
    <p
      className=" py-2.5 text-2xl font-bold text-white"
      style={{
        transition: "2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text}
      {props.isAuto ? null : index < revealing.length - 1 ? (
        <>
          <br />
          <Button
            text={`Continue - ${index} / ${revealing.length - 1}`}
            onClick={() => {
              changeText();
            }}
          />
        </>
      ) : null}
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
    // <div className=" container flex min-h-screen flex-col items-center justify-center text-center text-white">
    <LayoutPage logoIsTop pageTitle="Revelio - Grinch">
      {receiver.data?.receiver_name ? (
        <TextDisplay
          name={receiver.data?.receiver_name}
          santa_name={santa.data?.name}
          // isAuto
        />
      ) : (
        <LoadingOutlined />
      )}
    </LayoutPage>
  );
}
