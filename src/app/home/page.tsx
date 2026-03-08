import HeroSection from "../_components/HeroSection";
import STEMSection from "../_components/STEMSection";
import CareerGuideSection from "../_components/CareerGuideSection";
import RoleModelsSection from "../_components/RoleModelsSection";
import CTASection from "../_components/CTASection";
import Footer from "../_components/Footer";
import SplashCursor from "@/components/SplashCursor";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <SplashCursor />
      <HeroSection />
      <STEMSection />
      <CareerGuideSection />
      <RoleModelsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
