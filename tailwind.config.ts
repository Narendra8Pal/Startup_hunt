import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        index: {
          black_btn: "rgba(0, 0, 0, 0.76);",
          logo_orange1: "#FEB55E",
          logo_orange2: "#FF7343",
        },
        home: {
          light_white: "#f9fafb",
          stroke: "#F2F3F6",
          light_gray: "#EAECF0",
          gray: "#fbfbfa",
        },
        modal: {
          modal_bg: "#999999",
        },
      },
    },
  },
  plugins: [],
};
export default config;
