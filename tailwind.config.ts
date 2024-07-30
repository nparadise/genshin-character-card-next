import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /bg-(red|green|blue|yellow|cyan|purple|emerald)-950/,
    },
    {
      pattern: /from-(red|green|blue|yellow|cyan|purple|emerald)-400/,
    },
    "cursor-none",
    "cursor-default",
    "col-span-1",
    "col-span-2",
    "hidden",
    "block",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        "n-myeongjo": ['var(--font-nanum-myeongjo)'],
        "noto-kr": ['var(--font-noto-sans-kr)'],
      },
      textShadow: {
        DEFAULT: "0 0 0.5rem var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
export default config;
