import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import { useEffect } from "react";
import { Button } from "~/components/Button";
import LayoutPage from "~/layouts/LayoutPage";
import { api } from "~/utils/api";

interface TypeQuery {
  id?: string;
}

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

  // useEffects
  useEffect(() => {
    if (id) {
      receiver
        .mutateAsync({ id, hintsOnly: true })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.error(e));
    }
  }, [id]);
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
