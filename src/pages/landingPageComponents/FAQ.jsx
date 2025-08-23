import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t } = useTranslation("faq"); // using faq.json namespace
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = t("faqs", { returnObjects: true }); // returns the array from faq.json

  return (
    <section className="relative min-h-screen snap-start bg-lxj-softWhite px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          {t("header.title")}
        </h2>
        <p className="text-center text-gray-500 mb-10">
          {t("header.subtitle")}
        </p>

        <div className="space-y-4">
          {faqs.map((question, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium text-gray-700">
                  {question}
                </h3>
                <span className="text-gray-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <div className="mt-3 text-gray-600 text-sm min-h-[40px]">
                  {/* You can add translated answers later in faq.json if needed */}
                  <span className="text-gray-400">[ {t("answerPlaceholder", { defaultValue: "Add your answer here" })} ]</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
