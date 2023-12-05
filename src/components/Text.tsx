interface TextProps {
  text: string;
}
export function Text(props: TextProps) {
  return (
    <span
      style={{
        color: "white",
        textAlign: "center",
        fontSize: `20px`,
        fontWeight: 300,
      }}
    >
      {props.text}
    </span>
  );
}
