// import Input from "antd/lib/input";
import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";
import AntButton from "antd/lib/button";
export interface ButtonProps {
  text: string;
  onClick?: () => void;
  isInverted?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function Button(props: ButtonProps) {
  const color = useRecoilValue(stateColor);
  return (
    <AntButton
      disabled={props.isDisabled}
      loading={props.isLoading}
      onClick={props.onClick}
      style={{
        // padding: 10,
        width: "fit-content",
        minWidth: "180px",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        color: props.isInverted ? color : "white",
        backgroundColor: props.isInverted ? "white" : "transparent",
        // border: "1px solid white",
        // borderRadius: 10,
      }}
    >
      {/* <Input /> */}
      {props.text}
    </AntButton>
  );
}
