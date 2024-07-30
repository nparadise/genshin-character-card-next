import type { Metadata } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const n_myeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nanum-myeongjo",
  weight: ["400", "700", "800"],
});

const noto_kr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Genshin Character Card",
  description: "Create your Genshin Character Card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${n_myeongjo.variable} ${noto_kr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
