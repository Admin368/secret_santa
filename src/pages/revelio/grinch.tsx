import { LoadingOutlined } from "@ant-design/icons";
import type { member } from "@prisma/client";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/Button";
import LayoutPage from "~/layouts/LayoutPage";
import { api } from "~/utils/api";

interface PropsTextDisplay {
  name: string;
  // santa_id: string;
  // santa_name: string;
  members: string[];
  santa: member;
  isAuto?: boolean;
}
function TextDisplay(props: PropsTextDisplay) {
  const santa_seen_link = api.group.member_link_seen.useMutation();
  const revealing = [
    <span>
      <strong>Welcome {props.santa.name}</strong>
      <br />
      You are about to discover
      <br />
      The person you will be gifting this year.
    </span>,
    // <span>
    //   <br />
    //   Are you ready to
    //   <br />
    //   find out Whose
    //   <br />
    //   Secret Santa you are?
    // </span>,
    <span>
      <br />
      Your group has:
      {props.members.map((member, index) => (
        <span key={index}>
          <br />
          {index + 1}.{props.name === member ? "You" : member},
        </span>
      ))}
    </span>,
    <span>
      {`${props.santa.name}`}
      <br />
      You are the
      <br />
      Secret Santa for
      <br />
      <strong style={{ fontSize: 32 }}>{props.name}</strong>
    </span>,
    <span>
      🤫
      <br />
      Now, This its a secret,
      <br />
      No one can know it,
      <br />
    </span>,
    <span>
      You can go now,
      <br />
      There is nothing
      <br />
      to see here
      <br />
      🙃
    </span>,
  ];
  const [text, setText] = useState(revealing[0]);
  const [isSeen, setIsSeen] = useState(false);
  const [index, setIndex] = useState(0);
  // let index = 0;
  const [showText, setShowText] = useState(false);
  const changeText = useCallback(() => {
    const newIndex = index + 1;
    // index++;
    // console.log(`newIndex: ${newIndex}, lenght: ${revealing.length}`);
    if (newIndex === revealing.length - 2) {
      setIsSeen(true);
      if (!props.santa.link_is_seen) {
        const { id } = props.santa;
        santa_seen_link
          .mutateAsync({ id })
          .then((res) => {
            toast.info(res.message);
          })
          .catch((e) => {
            console.error(e);
          });
      }
      //   index = 0;
    }
    setShowText(false);
    const timeout = setTimeout(() => {
      setShowText(true);
      setIndex(newIndex);
      setText(revealing[newIndex]);
      clearTimeout(timeout);
    }, 1000);
    return;
  }, [isSeen, index, props.santa]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowText(true);
      clearTimeout(timeout);
    }, 1000);
  }, []);
  //   useEffect(() => {
  //     const timer = !isSeen && setInterval(changeText, 3000);
  //     return () => clearInterval(timer);
  //   }, [isSeen]);
  function GetNextButtonText(index: number) {
    switch (index) {
      case 0:
        return "Continue & Revelio";
      case 1:
        return "Whose Secret Santa Am I?";
      case 2:
        return "I Accept 🙂";
      default:
        return "Continue";
    }
  }
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
        opacity: showText ? 1 : 0,
        transition: "1s ease-in-out",
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
            // text={`${GetNextButtonText(index) ?? "Continue"} - ${index + 1} / ${
            text={`${GetNextButtonText(index) ?? "Continue"}`}
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
    if (
      santa.data &&
      !santa.data.link_is_seen &&
      !receiver.data?.receiver_name
    ) {
      receiver
        .mutateAsync({ id: santa.data.id })
        .then(() => {
          // console.log(res);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [id, receiver.data, santa.data]);
  return (
    // <div className=" container flex min-h-screen flex-col items-center justify-center text-center text-white">
    <LayoutPage logoIsTop pageTitle="Revelio - Grinch">
      {receiver.data?.receiver_name && receiver.data?.members && santa.data ? (
        <TextDisplay
          name={receiver.data?.receiver_name}
          santa={santa.data}
          members={receiver.data?.members}
          // isAuto
        />
      ) : santa.data?.link_is_seen ? (
        <>
          <span style={{ fontSize: 21 }}>
            Sorry, <br />
            🤷‍♀️ We already told you 🤷‍♀️
          </span>
          If you didn't see the link ask
          <br />
          The link maker to resend the email
        </>
      ) : (
        <LoadingOutlined />
      )}
    </LayoutPage>
  );
}
