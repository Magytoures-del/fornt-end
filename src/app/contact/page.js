import ContactHero from "@/components/contact/HeroSection";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return generatePageMetadata("contact");
}

export default function ContactPage() {
  return (
    <div className="">
      <ContactHero />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
      {/* <ContactMap /> */}
    </div>
  );
}
