// import Input from "antd/lib/input";
import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";
import AntButton from "antd/lib/button";
import { MenuOutlined } from "@ant-design/icons";
import { Menu, Popover } from "antd/lib";
export interface ButtonProps {
  id?: string;
  text: string;
  subText?: string;
  onClick?: () => void;
  isInverted?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  menuOptions?: {
    key: string;
    label: string;
    onClick: (args: { id: string }) => void;
  }[];
}

export function Button(props: ButtonProps) {
  const color = useRecoilValue(stateColor);
  const ButtonMenu = () => {
    return (
      <Menu
        items={props.menuOptions?.map((item) => ({
          key: item.key,
          label: item.label,
        }))}
        onClick={({ key }) => {
          console.log(key);
          const menuOption = props.menuOptions?.find(
            (item) => item.key === key,
          );
          if (menuOption && props.id) {
            console.log(menuOption);
            menuOption.onClick({ id: props.id });
          } else {
            console.log(`Please give your Buttons id props`);
          }
          // if(props.menuOptions[keyPath].)
          // switch(key) {
          //   case '':
          //     beak
          //   default:
          // }
        }}
      />
    );
  };
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
        display: "flex",
        // flexDirection: "column",
        height: "fit-content",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Input /> */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span style={{ fontWeight: "900" }}>{props.text}</span>
        <span>{props.subText}</span>
      </div>
      {props.menuOptions ? (
        <Popover content={ButtonMenu}>
          <MenuOutlined />
        </Popover>
      ) : null}
    </AntButton>
  );
}
