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
        sm: "280px",
        md: "768px",
        lg: "1393px",
        xl: "1440px",
      },
      colors: {
        index: {
          black_btn: "rgba(0, 0, 0, 0.76);",
          logo_orange1: "#FEB55E",
          logo_orange2: "#FF7343",
        },
        page: {
          cream: "#f5f5f5",
          light: "#fcfafa",
        },
        home: {
          light_white: "#f9fafb",
          stroke: "#F2F3F6",
          light_gray: "#EAECF0",
          gray: "#fbfbfa",
          hover_gray: "#5e5e5e",
        },
        table: {
          bg_table: "#f8f8f8",
        },
        modal: {
          modal_bg: "#999999",
        },
        hover: {
          dropdown: "#f9f9f9",
        },
        showcase_bg: {
          show_bg: "#fafafa",
        },
      },
    },
  },
  plugins: [],
};
export default config;
