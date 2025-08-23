import { FaTruckMoving, FaMapMarkedAlt, FaRoute, FaGavel } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function KeyFeatures() {
  const { t } = useTranslation("keyFeatures");

  // Ensure translation returns objects
  const features = t("features", { returnObjects: true }) || [];

  const icons = [
    <FaTruckMoving key="truck" className="h-8 w-8 text-interactive" />,
    <FaMapMarkedAlt key="map" className="h-8 w-8 text-interactive" />,
    <FaRoute key="route" className="h-8 w-8 text-interactive" />,
    <FaGavel key="gavel" className="h-8 w-8 text-interactive" />,
  ];

  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
          {t("header.title")}
        </h2>
        <p className="text-lg text-text/70 max-w-2xl mx-auto mb-16">
          {t("header.subtitle")}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title || index}
              className="bg-white p-6 rounded-2xl border border-black/5 text-left 
                         transition-all duration-300 hover:-translate-y-1 hover:border-black/10"
            >
              <div className="flex flex-col items-start gap-4">
                {icons[index % icons.length]} {/* safe fallback */}
                <h3 className="text-xl font-semibold text-headings">
                  {feature.title}
                </h3>
                <p className="text-text/90">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
