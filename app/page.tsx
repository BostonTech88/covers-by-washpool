import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeatureList from "@/components/FeatureList";
import Specs from "@/components/Specs";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <FeatureList />
      <Specs />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
}
