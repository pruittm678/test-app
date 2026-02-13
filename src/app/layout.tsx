import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Marquee — Rank the Pictures",
  description:
    "A head-to-head movie ranking experience, styled in the grandeur of Old Hollywood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
