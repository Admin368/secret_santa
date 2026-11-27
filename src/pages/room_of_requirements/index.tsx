import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import { useEffect } from "react";
import { HintCard } from "~/components/HintCard";
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
              <span style={{ fontSize: 24, fontWeight: 800 }}>
                Santa {receiver.data.santa_name}
              </span>
              <span style={{ fontSize: 17 }}>
                Here are the hints provided by your receiver
              </span>
              <div
                style={{
                  border: "1px solid white",
                  borderRadius: 12,
                  width: "100%",
                  maxWidth: 760,
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                }}
              >
                {receiver.data?.hints.length < 1
                  ? "Your receiver hasn't provided hints"
                  : receiver.data?.hints.map((hint, index) => (
                      <HintCard hint={hint} index={index} key={index} />
                    ))}
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
