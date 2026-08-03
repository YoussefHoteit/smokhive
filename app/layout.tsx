import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmokHive | 3D-Printed Organizers",
  description: "Bold 3D-printed desk organizers, trays, containers, and kits made to order.",
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
