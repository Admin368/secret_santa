import { atom, selector } from "recoil";

export const stateColors = atom({
  key: "colors", // unique ID (with respect to other atoms/selectors)
  default: ["#742B80", "#2B8043", "#322B80", "#80772B"], // default value (aka initial value)
});

export const stateColorIndex = atom({
  key: "colorIndex",
  default: 0,
});

export const stateColorsLength = selector({
  key: "colorLength",
  get: ({ get }) => {
    const colors_ = get(stateColors);
    return colors_.length ?? 0;
  },
});

export const stateColor = selector({
  key: "color",
  get: ({ get }) => {
    const colorIndex_ = get(stateColorIndex);
    const colors_ = get(stateColors);
    return colors_[colorIndex_];
  },
});
