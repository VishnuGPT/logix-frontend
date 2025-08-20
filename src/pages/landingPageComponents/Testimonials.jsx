import { FaStar } from "react-icons/fa";

// Best Practice: Data is extracted into arrays for easier updates.
const testimonials = [
  {
    name: "Ravi Verma",
    role: "Transporter (Lucknow)",
    quote: "With LogiXjunction, I receive more consistent loads and faster payments. No more endless calls!",
    rating: 5,
  },
  {
    name: "Ankita Sharma",
    role: "Shipper (Indore)",
    quote: "Their tracking system and route planning saved us 15% in logistics costs in 3 months!",
    rating: 5,
  },
];

const stats = [
  {
    value: "500+",
    label: "Trusted Fleet Owners",
    desc: "Reliable partnerships across India’s logistics ecosystem.",
  },
  {
    value: "15 States",
    label: "Shipper Coverage",
    desc: "Pan-India presence with smart regional matching.",
  },
  {
    value: "4.8★",
    label: "Platform Rating",
    desc: "Based on verified user feedback from our partners.",
  },
];

const StarRating = ({ count }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }, (_, i) => (
      <FaStar key={i} className="text-yellow-400" />
    ))}
  </div>
);

export default function Testimonials() {
  return (
    // UPDATED: Section styling is now consistent with other components.
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* ADDED: A section header for context and better visual flow. */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
            Trusted by the Best in the Business
          </h2>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            Our partners trust us to streamline their operations and drive growth.
          </p>
        </div>

        {/* --- Testimonials Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div key={item.name} className="bg-white p-8 rounded-lg border border-black/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-headings/10 rounded-full flex-shrink-0"></div> {/* Placeholder for an avatar */}
                <div>
                  <h3 className="text-lg font-semibold text-headings">{item.name}</h3>
                  <p className="text-sm text-text/70">{item.role}</p>
                </div>
              </div>
              <p className="text-text/90 italic">“{item.quote}”</p>
            </div>
          ))}
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-lg border border-black/5">
              <p className="text-4xl font-extrabold text-interactive mb-2">{stat.value}</p>
              <p className="font-semibold text-headings">{stat.label}</p>
              <p className="text-sm text-text/70 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}