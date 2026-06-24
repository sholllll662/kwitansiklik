import { Font } from "@react-pdf/renderer";

export const PDF_FONT_FAMILY = "Inter";

let registered = false;

/** Daftarkan font Inter (statis, bukan variable font) untuk render react-pdf. */
export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      { src: "/fonts/inter/Inter-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/inter/Inter-Medium.ttf", fontWeight: 500 },
      { src: "/fonts/inter/Inter-Bold.ttf", fontWeight: 700 },
    ],
  });

  // Mesin hyphenation default react-pdf memakai kamus Bahasa Inggris dan bisa
  // memotong kata Bahasa Indonesia di tempat yang salah — matikan saja.
  Font.registerHyphenationCallback((word) => [word]);
}
