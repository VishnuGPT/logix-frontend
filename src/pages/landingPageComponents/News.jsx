import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function News() {
  const { t } = useTranslation("news");

  const articles = t("articles", { returnObjects: true });

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings mb-4">
            {t("header.title")}
          </h2>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            {t("header.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-black/5 transition hover:border-black/10"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-headings hover:text-interactive transition"
                  >
                    {article.title}
                  </a>
                  <p className="text-sm text-text/70 mt-1">— {article.source}</p>
                </div>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-semibold text-interactive whitespace-nowrap group"
                >
                  {t("buttons.readMore")}
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
