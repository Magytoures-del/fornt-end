import HeroSection from "@/components/hotels/HeroSection";
import FeaturesSection from "@/components/hotels/FeaturesSection";
import PartnersSection from "@/components/hotels/PartnersSection";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return generatePageMetadata("hotels");
}

function HotelsPage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <PartnersSection />
      <FeaturesSection />
    </div>
  );
}

export default HotelsPage;
