import { atom, selector } from "recoil";
// export const stateColors = ["#742B80", "#2B8043", "#322B80", "#80772B"];
export const stateColors = atom({
  key: "colors", // unique ID (with respect to other atoms/selectors)
  default: ["#742B80", "#2B8043", "#322B80", "#80772B"], // default value (aka initial value)
});

export const stateColorIndex = atom({
  key: "colorIndex", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

export const stateColorsLength = selector({
  key: "colorLength", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const colors = get(stateColors);
    return colors.length ?? 0;
  },
});

export const stateColor = selector({
  key: "color", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const colorIndex = get(stateColorIndex);
    const colors = get(stateColors);
    return colors[colorIndex];
  },
});
