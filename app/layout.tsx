import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Covers by Washpool",
  description:
    "Premium protective covers engineered for the long haul. Precision fit, serious protection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18207597682" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18207597682');
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
