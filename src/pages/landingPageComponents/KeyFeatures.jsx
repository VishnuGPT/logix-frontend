import { FaTruckMoving, FaMapMarkedAlt, FaRoute, FaGavel } from "react-icons/fa";

const features = [
  {
    icon: <FaTruckMoving className="h-8 w-8 text-interactive" />,
    title: "Digital Freight Marketplace",
    desc: "Post, match & move loads with intelligent logistics algorithms.",
  },
  {
    icon: <FaMapMarkedAlt className="h-8 w-8 text-interactive" />,
    title: "Fleet Telematics & Tracking",
    desc: "Monitor real-time location, performance, and efficiency of your vehicles.",
  },
  {
    icon: <FaRoute className="h-8 w-8 text-interactive" />,
    title: "Route Optimization",
    desc: "Minimize fuel costs and delivery times with AI-powered route planning.",
  },
  {
    icon: <FaGavel className="h-8 w-8 text-interactive" />,
    title: "Transparent Bidding System",
    desc: "Fair, fast, and visible bidding between shippers and transporters.",
  },
];

export default function KeyFeatures() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
          Key Features
        </h2>
        <p className="text-lg text-text/70 max-w-2xl mx-auto mb-16">
          Explore our core offerings that make freight smarter, faster, and fairer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-black/5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-black/10"
            >
              <div className="flex flex-col items-start gap-4">
                {feature.icon}
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