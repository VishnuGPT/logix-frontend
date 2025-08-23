import React from "react";
import { useTranslation } from "react-i18next";

const cities = [
  { key: "ahmedabad", img: "/cities/ahmedabad.jpg" },
  { key: "bangalore", img: "/cities/bangalore.jpg" },
  { key: "chandigarh", img: "/cities/chandigarh.jpg" },
  { key: "chennai", img: "/cities/chennai.jpg" },
  { key: "coimbatore", img: "/cities/coimbatore.jpg" },
  { key: "hyderabad", img: "/cities/hyderabad.jpg" },
  { key: "delhi", img: "/cities/delhi.jpg" },
  { key: "indore", img: "/cities/indore.jpg" },
  { key: "kanpur", img: "/cities/kanpur.jpg" },
  { key: "jaipur", img: "/cities/jaipur.jpg" },
  { key: "kochi", img: "/cities/kochi.jpg" },
  { key: "lucknow", img: "/cities/lucknow.jpg" },
  { key: "kolkata", img: "/cities/kolkata.jpg" },
  { key: "ludhiana", img: "/cities/ludhiana.jpg" },
  { key: "mumbai", img: "/cities/mumbai.jpg" },
  { key: "nagpur", img: "/cities/nagpur.jpg" },
  { key: "nashik", img: "/cities/nashik.jpg" },
  { key: "pune", img: "/cities/pune.jpg" },
  { key: "surat", img: "/cities/surat.jpg" },
  { key: "trivandrum", img: "/cities/trivandrum.jpg" },
  { key: "vadodara", img: "/cities/vadodara.jpg" },
  { key: "visakhapatnam", img: "/cities/visakhapatnam.jpg" },
];

export default function CitiesChart() {
  const { t } = useTranslation("citiesChart");

  return (
    <section className="snap-start min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-background">
      {/* Headline + Subtext */}
      <div className="text-center max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-headings mb-3">
          {t("citiesChart.headline")}
        </h2>
        <p className="text-text/70 text-lg">{t("citiesChart.subtext")}</p>
      </div>

      {/* Grid of Cities */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 w-full max-w-6xl">
        {cities.map((city) => (
          <div
            key={city.key}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-36 h-36 rounded-xl overflow-hidden shadow-md border border-black/10 mb-3">
              <img
                src={city.img}
                alt={t(`citiesChart.cities.${city.key}`)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm font-medium text-text">
              {t(`citiesChart.cities.${city.key}`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
