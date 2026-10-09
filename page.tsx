import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroZoomSequence } from "@/components/HeroZoomSequence";
import { Deliverables } from "@/components/sections/Deliverables";
import { FinalCta } from "@/components/sections/FinalCta";
import { Process } from "@/components/sections/Process";
import { Regional } from "@/components/sections/Regional";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroZoomSequence next={<Regional />} />
        <Services />
        <Process />
        <Deliverables />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
