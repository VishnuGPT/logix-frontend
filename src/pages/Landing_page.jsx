import { useNavigate } from "react-router-dom";
import KeyFeatures from "./landingPageComponents/KeyFeatures.jsx";
import News from "./landingPageComponents/news.jsx";
import CaseStudyShowcase from "./landingPageComponents/caseStudy.jsx";
import Testimonials from "./landingPageComponents/testimonials.jsx";
import ContactCTASection from "./landingPageComponents/contact.jsx";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    // UPDATED: Removed snap-scroll for a more traditional and professional flow.
    <div>
      {/* --- HERO SECTION --- */}
      {/* UPDATED: Replaced the truck image with a clean, modern background color from the theme. */}
      <section className="bg-headings text-background">
        <div className="max-w-7xl mx-auto flex items-center min-h-screen px-6 py-24">
          <div className="max-w-3xl"> {/* Constrained width for better readability */}
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Transforming India’s Freight with Smart, Scalable Tech
            </h1>
            <p className="text-lg text-background/80 mb-10"> {/* text-background/80 makes it slightly transparent */}
              Built for fleet owners, shippers, and mid-sized logistics players
              across Tier-2 & Tier-3 cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* UPDATED: Buttons now use consistent theme colors. */}
              <button
                onClick={() => navigate("/signup-otp")}
                className="px-8 py-3 bg-accent-cta text-white rounded-full font-semibold transition hover:opacity-80"
              >
                Get Started for Free
              </button>
              <a
                href="/about-us"
                className="px-8 py-3 border-2 border-background/50 rounded-full text-background font-semibold transition hover:bg-background hover:text-headings"
              >
                Explore Features →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- OTHER SECTIONS --- */}
      <KeyFeatures />
      <Testimonials />
      <CaseStudyShowcase />
      <News />
      <ContactCTASection />
    </div>
  );
}