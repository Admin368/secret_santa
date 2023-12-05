import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";

export interface ButtonProps {
  text: string;
  onClick?: () => void;
  isInverted?: boolean;
}

export function Button(props: ButtonProps) {
  const color = useRecoilValue(stateColor);
  return (
    <button
      onClick={props.onClick}
      style={{
        padding: 10,
        width: "fit-content",
        minWidth: "180px",
        color: props.isInverted ? color : "white",
        backgroundColor: props.isInverted ? "white" : "transparent",
        border: "1px solid white",
        borderRadius: 10,
      }}
    >
      {props.text}
    </button>
  );
}
