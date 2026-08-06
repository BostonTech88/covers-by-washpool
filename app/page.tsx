import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import FeatureList from "@/components/FeatureList";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Calculator />
      <FeatureList />
      <Process />
      <CTA />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
