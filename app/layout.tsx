import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";


export const metadata: Metadata = {
  title: "Price Sensitivity Dashboard",
  description: "Interactive price sensitivity simulation and scenario explorer",
  applicationName: "Price Sensitivity Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className ?? ""} ${GeistMono.className ?? ""}`.trim()}
    >
      <body>
  <main>{children}</main>
      </body>
    </html>
  );
}
