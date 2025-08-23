import { useTranslation } from "react-i18next";
import { AlertTriangle, Lightbulb, Rocket, TrendingDown, TrendingUp } from "lucide-react";

export default function CaseStudyShowcase() {
  const { t } = useTranslation("caseStudy");
 

  const caseStudyData = {
    title: t("title"),
    challenge: {
      icon: <AlertTriangle className="h-6 w-6 text-accent-cta" />,
      title: t("challenge.title"),
      text: t("challenge.text"),
    },
    solution: {
      icon: <Lightbulb className="h-6 w-6 text-interactive" />,
      title: t("solution.title"),
      text: t("solution.text"),
    },
    results: {
      icon: <Rocket className="h-6 w-6 text-interactive" />,
      title: t("results.title"),
      metrics: [
        {
          icon: <TrendingUp className="h-8 w-8 text-interactive" />,
          value: t("results.metrics.0.value"),
          label: t("results.metrics.0.label"),
        },
        {
          icon: <TrendingDown className="h-8 w-8 text-interactive" />,
          value: t("results.metrics.1.value"),
          label: t("results.metrics.1.label"),
        },
      ],
    },
  };

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-left md:text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
            {t("sectionHeader.title")}
          </h2>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            {t("sectionHeader.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-3xl font-bold text-headings -mb-4">{caseStudyData.title}</h3>

            {/* Challenge Card */}
            <div className="bg-white p-6 rounded-lg border border-black/5">
              <div className="flex items-center gap-3 mb-3">
                {caseStudyData.challenge.icon}
                <h4 className="text-2xl font-bold text-headings">
                  {caseStudyData.challenge.title}
                </h4>
              </div>
              <p className="text-text/90">{caseStudyData.challenge.text}</p>
            </div>

            {/* Solution Card */}
            <div className="bg-white p-6 rounded-lg border border-black/5">
              <div className="flex items-center gap-3 mb-3">
                {caseStudyData.solution.icon}
                <h4 className="text-2xl font-bold text-headings">
                  {caseStudyData.solution.title}
                </h4>
              </div>
              <p className="text-text/90">{caseStudyData.solution.text}</p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-black/5 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                {caseStudyData.results.icon}
                <h4 className="text-2xl font-bold text-headings">
                  {caseStudyData.results.title}
                </h4>
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
