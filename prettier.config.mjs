/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  // Auto-urutkan class Tailwind. tailwindStylesheet menunjuk ke entry CSS
  // (Tailwind v4 memakai konfigurasi berbasis CSS, bukan tailwind.config.js).
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
};

export default config;
