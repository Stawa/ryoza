import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { FinalCta } from "@/components/landing/final-cta";
import { Games } from "@/components/landing/games";
import { Hero } from "@/components/landing/hero";
import { Locations } from "@/components/landing/locations";
import { PanelPreview } from "@/components/landing/panel-preview";
import { Pricing } from "@/components/landing/pricing";
import { TrustStrip } from "@/components/landing/trust-strip";
import { Reviews } from "@/components/landing/reviews";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Games />
      <Features />
      <PanelPreview />
      <Reviews />
      <Pricing />
      <Locations />
      <Faq />
      <FinalCta />
    </>
  );
}
