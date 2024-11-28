import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          600: '#1D4ED8',
          700: '#1E3A8A',
        },
        navy: {
          700: '#1a365d',
          800: '#153e75',
          900: '#1a202c',
        }
      },
    },
  },
  plugins: [],
};
export default config;
