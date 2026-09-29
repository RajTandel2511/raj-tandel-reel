import type { Config } from "tailwindcss";

// Colours read the RGB channel variables in app/globals.css, so opacity
// modifiers work: `bg-bone/10`, `border-void/20`.
const channel = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: channel("void"),
        space: channel("space"),
        panel: channel("panel"),
        line: channel("line"),
        mist: channel("mist"),
        bone: channel("bone"),
        ash: channel("ash"),
        flame: channel("flame"),
        ember: channel("ember"),
        ion: channel("ion"),
        leaf: channel("leaf"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        snap: "var(--ease-snap)",
      },
    },
  },
  plugins: [],
};

export default config;
