import { useNavigate } from "react-router-dom";
import Hero from "./landingPageComponents/hero.jsx";
import KeyFeatures from "./landingPageComponents/KeyFeatures.jsx";
import News from "./landingPageComponents/news.jsx";
import CaseStudyShowcase from "./landingPageComponents/caseStudy.jsx";
import Testimonials from "./landingPageComponents/testimonials.jsx";
import ContactCTASection from "./landingPageComponents/contact.jsx";
import FAQ from "./landingPageComponents/FAQ.jsx";
import CitiesChart from "./landingPageComponents/CitiesChart.jsx";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />
      <KeyFeatures />
      <Testimonials />
      <CaseStudyShowcase />
      <FAQ />
      <CitiesChart />
      <News />
      <ContactCTASection />
    </div>
  );
}