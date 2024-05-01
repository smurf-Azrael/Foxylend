import {
  Bebas_Neue as FontBebas,
  Exo_2 as FontExo2,
  Inria_Sans as FontInria,
  JetBrains_Mono as FontMono,
  DM_Sans as FontSans,
} from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontInria = FontInria({
  subsets: ["latin"],
  variable: "--font-inria",
  weight: "400",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontBebas = FontBebas({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
})

export const fontExo2 = FontExo2({
  subsets: ["latin"],
  variable: "--font-exo2",
  weight: "400",
})
