import HeroSection from "@/components/packages/HeroSection";
import PackagesFilter from "@/components/packages/PackagesFilter";
import PackagesGrid from "@/components/packages/PackagesGrid";
import DestinationsSection from "@/components/packages/DestinationsSection";
import { getAllOffers } from "@/services/apiOffers";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return generatePageMetadata("packages");
}

export default async function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Best Offers */}
      <HeroSection />

      {/* Main Content */}
      <div className="py-8">
        {/* Filters Section */}

        {/* Packages Grid */}
        <div>
          <PackagesGrid />
        </div>

        {/* Destinations Section */}
        <DestinationsSection />
      </div>
    </div>
  );
}
