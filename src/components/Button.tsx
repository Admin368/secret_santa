// import Input from "antd/lib/input";
import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";
import AntButton from "antd/lib/button";
import { CheckOutlined, MenuOutlined } from "@ant-design/icons";
import { Menu, Popover } from "antd/lib";
import { useState } from "react";
export interface ButtonProps {
  id?: string;
  text: string;
  subText?: string;
  onClick?: () => void;
  isInverted?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string;
  menuOptions?: {
    key: string;
    label: string;
    onClick: (args: { id: string }) => void;
  }[];
  isSeen?: boolean;
}

export function Button(props: ButtonProps) {
  const color = useRecoilValue(stateColor);
  const [menuOpen, setMenuOpen] = useState(false);
  const ButtonMenu = () => {
    return (
      <Menu
        items={props.menuOptions?.map((item) => ({
          key: item.key,
          label: item.label,
        }))}
        onClick={({ key }) => {
          const menuOption = props.menuOptions?.find(
            (item) => item.key === key,
          );
          if (menuOption && props.id) {
            menuOption.onClick({ id: props.id });
            setMenuOpen(false);
          } else {
            console.error(`Please give your Buttons id props`);
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
        width: props.width ?? "fit-content",
        minWidth: "180px",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        color: props.isInverted ? color : "white",
        backgroundColor: props.isInverted ? "white" : "transparent",
        // border: "1px solid white",
        // borderRadius: 10,
        display: "flex",
        // flexDirection: "column",
        height: "fit-content",
        minHeight: 40,
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
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontWeight: "900",
            display: "flex",
            gap: 5,
          }}
        >
          {props.text}
          {props.isSeen === true ? (
            <CheckOutlined style={{ fontSize: 12, opacity: 0.7, color }} />
          ) : null}
        </span>
        <span>{props.subText}</span>
      </div>
      {props.menuOptions ? (
        <Popover
          content={ButtonMenu}
          trigger={"click"}
          open={menuOpen}
          onOpenChange={(state) => {
            setMenuOpen(state);
          }}
        >
          <MenuOutlined />
        </Popover>
      ) : null}
    </AntButton>
  );
}
