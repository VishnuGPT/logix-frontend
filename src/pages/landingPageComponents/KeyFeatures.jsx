import { FaTruckMoving, FaMapMarkedAlt, FaRoute, FaGavel } from "react-icons/fa";

// UPDATED: Icons now use the "interactive" theme color directly.
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
    // UPDATED: Simplified section styling for natural page flow.
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* UPDATED: Typography uses theme colors for consistency. */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
          Key Features
        </h2>
        <p className="text-lg text-text/70 max-w-2xl mx-auto mb-16">
          Explore our core offerings that make freight smarter, faster, and fairer.
        </p>

        {/* UPDATED: Grid is now more responsive for large screens. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            // UPDATED: Card styling is now cleaner and uses a subtle border.
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