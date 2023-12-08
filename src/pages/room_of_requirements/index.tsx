import { LoadingOutlined } from "@ant-design/icons";
import type { member } from "@prisma/client";
import { useEffect } from "react";
import { Button } from "~/components/Button";
import LayoutPage from "~/layouts/LayoutPage";
// import Hints from "~/pages/revelio/hints";
import { api } from "~/utils/api";

// export default Hints;
interface TypeQuery {
  id?: string;
  receiver?: member;
}
// interface TypeHintData {
//   santa_name?: string;
//   hints: string[];
// }
export async function getServerSideProps(context: { query: TypeQuery }) {
  const query = context.query;
  const id = query.id ?? null;
  return {
    props: {
      id: id ?? null,
    },
  };
}
export default function RoomOfRequirements({ id }: { id: string }) {
  const receiver = api.group.member_get_my_receiver.useMutation();
  // useEffect
  useEffect(() => {
    console.log("id", id);
    console.log("receiver", receiver.data);

    if (id) {
      receiver
        .mutateAsync({ id, hintsOnly: true })
        .then((res) => {
          //   const hints = receiver.data?.hints;
          console.log(res);
        })
        .catch((e) => console.error(e));
    }
  }, [id]);
  useEffect(() => {
    console.log(receiver.isSuccess);
  }, [receiver]);
  return (
    <LayoutPage pageTitle="Room of Requirements">
      <span style={{ padding: 20, width: "100%" }}>
        {id ? (
          receiver.data && receiver.data.hints ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // border: "1px solid black",
                // padding: 10,
                gap: 5,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 800 }}>
                Santa {receiver.data.santa_name}
              </span>
              Here are the hints provided by your receiver
              <br />
              <div
                style={{
                  border: "1px solid white",
                  borderRadius: 5,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                {receiver.data?.hints.length < 1
                  ? "Your receiver hasn't provided hints"
                  : receiver.data?.hints.map((hint, index) => {
                      return (
                        <Button
                          text={hint}
                          key={index}
                          isInverted
                          width="100%"
                        />
                      );
                    })}
              </div>
            </div>
          ) : receiver.isLoading ? (
            <LoadingOutlined />
          ) : (
            "Couldnt find your hints"
          )
        ) : (
          "Please provide Id"
        )}
      </span>
    </LayoutPage>
  );
}
