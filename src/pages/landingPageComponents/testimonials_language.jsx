import React from "react";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation("testimonials");

  return (
    <section className="py-12 px-6 lg:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title & Subtitle */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("testimonials.title")}
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          {t("testimonials.subtitle")}
        </p>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Ravi */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-700 italic mb-4">
              “{t("testimonials.users.ravi.quote")}”
            </p>
            <h4 className="font-semibold text-gray-900">
              – {t("testimonials.users.ravi.role")}
            </h4>
          </div>

          {/* Ankita */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-700 italic mb-4">
              “{t("testimonials.users.ankita.quote")}”
            </p>
            <h4 className="font-semibold text-gray-900">
              – {t("testimonials.users.ankita.role")}
            </h4>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("stats.trustedFleetOwners.label")}
            </h3>
            <p className="text-gray-600">
              {t("stats.trustedFleetOwners.desc")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("stats.shipperCoverage.label")}
            </h3>
            <p className="text-gray-600">
              {t("stats.shipperCoverage.desc")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("stats.platformRating.label")}
            </h3>
            <p className="text-gray-600">
              {t("stats.platformRating.desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
