import { ArrowUpRight } from "lucide-react";

// Data for news articles is now in an array for easy management.
const articles = [
  {
    title: "How Tier-2 Logistics is the Next Big Opportunity in India",
    source: "Times of India",
    url: "#", // Replace with actual URL
  },
  {
    title: "Telematics and Driver Safety: What You Must Know",
    source: "The Hindu",
    url: "#", // Replace with actual URL
  },
  {
    title: "Digital Freight Platforms vs Traditional Brokers",
    source: "Hindustan Times",
    url: "#", // Replace with actual URL
  },
];

export default function News() {
  return (
    // UPDATED: Section styling is now consistent.
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* UPDATED: Section header uses theme colors. */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
            Top Reads & Insights
          </h2>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            Explore the latest insights and trends shaping logistics and freight.
          </p>
        </div>

        {/* UPDATED: Mapping over the articles array. */}
        <div className="space-y-4">
          {articles.map((article) => (
            // UPDATED: Card style is now minimalist and consistent.
            <div
              key={article.title}
              className="bg-white p-6 rounded-lg border border-black/5 transition hover:border-black/10"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-headings hover:text-interactive transition">
                    {article.title}
                  </a>
                  <p className="text-sm text-text/70 mt-1">— {article.source}</p>
                </div>
                {/* UPDATED: Button is now a cleaner link style. */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-semibold text-interactive whitespace-nowrap group"
                >
                  Read More
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}