import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analog Future — Design & Product Studio",
  description:
    "Analog Future is an independent studio creating brand systems, digital products, and visual communication.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
