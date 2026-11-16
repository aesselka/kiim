import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import Cursor from "@/components/Cursor";
import Providers from "@/components/Providers";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Kiim — your stylist, wearing you",
  description:
    "Tell Kiim where you're going — and see yourself in three looks. An AI stylist built on Higgsfield Soul ID.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${instrumentSerif.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Cursor />
      </body>
    </html>
  );
}
