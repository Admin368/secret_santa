import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { Popconfirm } from "antd/lib";
import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";

interface HintCardProps {
  hint: string;
  index: number;
  onDelete?: () => void;
}

/**
 * Readable card for a single gift hint. Hints are free-text sentences, so they
 * wrap, keep the line breaks the receiver typed, and are left-aligned.
 */
export function HintCard(props: HintCardProps) {
  const color = useRecoilValue(stateColor);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "white",
        color,
        borderRadius: 10,
        padding: "12px 14px",
        textAlign: "left",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
          marginTop: 1,
        }}
      >
        {props.index + 1}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: "clamp(15px, 0.5vw + 13px, 18px)",
          lineHeight: 1.5,
          fontWeight: 700,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {props.hint}
      </span>
      {props.onDelete ? (
        <Popconfirm
          title="Delete this hint?"
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={props.onDelete}
        >
          <button
            type="button"
            aria-label="Delete hint"
            style={{
              flexShrink: 0,
              color,
              opacity: 0.7,
              padding: 4,
              lineHeight: 1,
              cursor: "pointer",
              background: "transparent",
              border: "none",
            }}
          >
            <DeleteOutlined style={{ fontSize: 16 }} />
          </button>
        </Popconfirm>
      ) : null}
    </div>
  );
}
