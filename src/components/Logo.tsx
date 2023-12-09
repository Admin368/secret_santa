import { Button } from "antd/lib";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

interface PropsLogo {
  textColor?: string;
  id?: string;
}
export default function Logo(props: PropsLogo) {
  const router = useRouter();
  const id = router.query.id as string;
  const group_name = api.group.get_name.useQuery(
    {
      id: id ?? "",
      is_member_id: router.pathname.includes("revelio") ? true : false,
    },
    { enabled: id ? true : false, staleTime: Infinity },
  );
  return (
    <Button
      type="text"
      onClick={async () => {
        await router.push("/");
        // window.location = "/"
        // window.location.replace("/");
      }}
      style={{
        height: "fit-content",
      }}
    >
      <p
        className="text-center text-3xl font-extrabold text-white"
        style={{
          color: props.textColor ?? undefined,
        }}
      >
        🎅SECRET SANTA🎅
        {group_name.data && group_name.data.group_name ? (
          <span style={{ fontSize: 24 }}>
            <br />-{group_name.data.group_name?.toLocaleUpperCase()}-
          </span>
        ) : null}
      </p>
    </Button>
  );
}
