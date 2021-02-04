import { themes } from "mdx-deck"

export default {
  ...themes.notes,
  css: {
    ...themes.notes.css,
    pre: {
      padding: "0.5em",
    },
    // Ensure graph elements are correctly sized
    svg: {
      fontSize: "16px",
      textAlign: "left",
      display: "block",
      marginLeft: 65,
    },
    ".sr-only": {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    },
  },
};
