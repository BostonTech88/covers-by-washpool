import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Covers by Washpool",
  description:
    "Cubiertas térmicas a medida para albercas en todo México. Reduce la evaporación, conserva el calor y protege tu inversión. Envío a toda la República.",
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

  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    gtag('event', 'conversion', {
      'send_to': 'AW-18207597682/08rECP3y5rccEPLIh-pD',
      'value': 1.0,
      'currency': 'MXN',
      'event_callback': callback
    });
    return false;
  }
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
