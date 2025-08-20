import { useNavigate } from "react-router-dom";
import KeyFeatures from "./landingPageComponents/KeyFeatures.jsx";
import News from "./landingPageComponents/news.jsx";
import CaseStudyShowcase from "./landingPageComponents/caseStudy.jsx";
import Testimonials from "./landingPageComponents/testimonials.jsx";
import ContactCTASection from "./landingPageComponents/contact.jsx";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* --- HERO SECTION --- */}
      <section className="bg-headings text-background">
        <div className="max-w-7xl mx-auto flex items-center min-h-screen px-6 py-24">
          <div className="sm:px-20 max-w-2xl"> 
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Junction to Smarter Logistics
            </h1>
            <p className="text-xl text-background/80 mb-10"> {/* text-background/80 makes it slightly transparent */}
            India's First Unified Logistics Solution Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/sign-up")}
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