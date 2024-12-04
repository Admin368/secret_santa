import Button from "antd/lib/button";
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
      }}
      style={{
        height: "fit-content",
        display: "flex",
        alignItems: "center", // Center align vertically
        justifyContent: "center", // Center align horizontally
      }}
    >
      <p
        className="text-center text-3xl font-extrabold text-white"
        style={{
          color: props.textColor ?? undefined,
          width: "fit-content", // Ensures the text takes only the space it needs
          maxWidth: "98vw", // Limits width to 90% of the viewport width
          overflowWrap: "break-word", // Ensure long words break appropriately
          wordWrap: "break-word", // For legacy browsers
          whiteSpace: "normal", // Allows text to wrap instead of staying in one line
          textAlign: "center", // Center the text
        }}
      >
        🎅SECRET SANTA🎅
        {group_name.data && group_name.data.group_name ? (
          <span
            style={{
              paddingTop: 5,
              fontSize: 24,
              display: "block", // Ensures the span takes a new line
              width: "100%",
              overflow: "hidden",
              wordWrap: "break-word",
            }}
          >
            -{group_name.data.group_name?.toLocaleUpperCase()}-
          </span>
        ) : null}
      </p>
    </Button>
  );
}
