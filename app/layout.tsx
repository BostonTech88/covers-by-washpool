import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Covers by Washpool",
  description:
    "Premium protective covers engineered for the long haul. Precision fit, serious protection.",
  icons: {
    icon: "/covers_icon.png",
    apple: "/covers_icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
