import { AlertTriangle, Lightbulb, Rocket, TrendingDown, TrendingUp } from "lucide-react";

// Data is extracted into an object for cleaner code.
const caseStudyData = {
  title: "Optimizing Freight in Madhya Pradesh",
  challenge: {
    icon: <AlertTriangle className="h-6 w-6 text-accent-cta" />,
    title: "The Challenge",
    text: "A regional FMCG distributor was losing valuable time and customer trust due to haphazard load matching and last-minute route changes, which inflated their operating costs.",
  },
  solution: {
    icon: <Lightbulb className="h-6 w-6 text-interactive" />,
    title: "Our Solution",
    text: "We built a dynamic route-optimization engine that evaluated live traffic, load weight, and vehicle availability, paired with a smart, real-time bidding module for carriers.",
  },
  results: {
    icon: <Rocket className="h-6 w-6 text-interactive" />,
    title: "The Results",
    metrics: [
      {
        icon: <TrendingUp className="h-8 w-8 text-interactive" />,
        value: "+23%",
        label: "Increase in On-Time Delivery",
      },
      {
        icon: <TrendingDown className="h-8 w-8 text-interactive" />,
        value: "-18%",
        label: "Reduction in Logistics Costs",
      },
    ],
  },
};

export default function CaseStudyShowcase() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-left md:text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
            See Our Platform in Action
          </h2>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            Here's how we solved a real-world logistics challenge for a valued partner.
          </p>
        </div>

        {/* Main two-column layout for the case study */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column: Narrative (Challenge & Solution) */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-3xl font-bold text-headings -mb-4">{caseStudyData.title}</h3>
            {/* Challenge Card */}
            <div className="bg-white p-6 rounded-lg border border-black/5">
              <div className="flex items-center gap-3 mb-3">
                {caseStudyData.challenge.icon}
                <h4 className="text-2xl font-bold text-headings">{caseStudyData.challenge.title}</h4>
              </div>
              <p className="text-text/90">{caseStudyData.challenge.text}</p>
            </div>
            
            {/* Solution Card */}
            <div className="bg-white p-6 rounded-lg border border-black/5">
              <div className="flex items-center gap-3 mb-3">
                {caseStudyData.solution.icon}
                <h4 className="text-2xl font-bold text-headings">{caseStudyData.solution.title}</h4>
              </div>
              <p className="text-text/90">{caseStudyData.solution.text}</p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-black/5 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                {caseStudyData.results.icon}
                <h4 className="text-2xl font-bold text-headings">{caseStudyData.results.title}</h4>
              </div>
              <div className="space-y-6">
                {caseStudyData.results.metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center gap-4">
                    <div className="bg-interactive/10 p-3 rounded-lg">{metric.icon}</div>
                    <div>
                      <p className="text-3xl font-bold text-headings">{metric.value}</p>
                      <p className="text-text/90">{metric.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}