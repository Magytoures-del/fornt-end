import HeroSection from "@/components/flights/HeroSection";
import FeaturesSection from "@/components/flights/FeaturesSection";
import PartnersSection from "@/components/flights/PartnersSection";
import { generatePageMetadata } from "@/utils/metadata";
import { LAYOUT } from "@/constants/flights";

/**
 * Generates metadata for the flights page
 * Used by Next.js for SEO and social media sharing
 *
 * @returns {Promise<Object>} Metadata object containing title, description, and OpenGraph data
 */
export async function generateMetadata() {
  return generatePageMetadata("flights");
}

/**
 * Flights Page Component
 *
 * Main landing page for flight search and booking functionality.
 * Comprises three main sections:
 * - Hero section with search functionality
 * - Partners section showcasing airline partners
 * - Features section highlighting key benefits
 *
 * @returns {JSX.Element} The flights page component
 */
export default function FlightsPage() {
  return (
    <main className={LAYOUT.spacing.section} role="main">
      <HeroSection />
      <PartnersSection />
      <FeaturesSection />
    </main>
  );
}
