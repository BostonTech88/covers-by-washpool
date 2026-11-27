import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import FeatureList from "@/components/FeatureList";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import SafetyCover from "@/components/SafetyCover";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const title = "Cubiertas térmicas para albercas a medida | Covers by Washpool";
const description =
  "Cubiertas térmicas hechas a la medida de tu alberca. Calcula tu precio estimado y cotiza por WhatsApp. Atención en Querétaro y pedidos en México.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/`,
    siteName: "Covers by Washpool",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/images/share-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Cubierta térmica azul a medida en una alberca rectangular",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/share-cover.jpg"],
  },
};
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Covers by Washpool",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo.webp`,
      sameAs: [
        "https://www.instagram.com/coversbywp/",
        "https://www.facebook.com/profile.php?id=61591902690026",
      ],
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#thermal-cover`,
      name: "Cubierta térmica para alberca hecha a medida",
      description:
        "Cubierta térmica a medida para ayudar a conservar la temperatura del agua y reducir la evaporación. No sustituye una cubierta de seguridad.",
      image: `${SITE_URL}/images/thermal-hero.webp`,
      url: `${SITE_URL}/`,
      brand: { "@type": "Brand", name: "Covers by Washpool" },
      category: "Cubiertas térmicas para albercas",
    },
  ],
};
export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Hero />
        <FeatureList />
        <Calculator />
        <Process />
        <Gallery />
        <FAQ />
        <CTA />
        <SafetyCover />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
