import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromptExample from "@/components/PromptExample";
import LookbookStrip from "@/components/LookbookStrip";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PromptExample />
        <LookbookStrip />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
