import Contact from "@/components/about-us/Contact";
import HeroSection from "@/components/about-us/HeroSection";
import Services from "@/components/about-us/Services";
import Vision from "@/components/about-us/Vision";
import Statistics from "@/components/about-us/Statistics";
import Introduction from "@/components/about-us/Introduction";
import WhyChooseUs from "@/components/about-us/WhyChooseUs";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return generatePageMetadata("about");
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <Statistics />

      {/* Introduction Section */}
      <Introduction />

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Vision/Mission Section */}
      <Vision />

      {/* Call to Action Section */}
      <Contact />
    </div>
  );
}
