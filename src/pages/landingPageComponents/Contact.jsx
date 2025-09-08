import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactCTASection() {
  const { t } = useTranslation("contact"); // using contact.json namespace

  const contactDetails = [
    {
      icon: <Mail className="w-6 h-6 text-interactive" />,
      text: t("contact@logixjunction.com"),
      href: "mailto:contact@logixjunction.com",
    },
    {
      icon: <Phone className="w-6 h-6 text-interactive" />,
      text: t("details.phone"),
      href: "tel:+918799782389",
    },
    {
      icon: <MapPin className="w-6 h-6 text-interactive" />,
      text: t("details.address"),
    },
  ];

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings leading-tight">
            {t("header.title")}
          </h2>
          <p className="mt-4 text-lg text-text/70">
            {t("header.subtitle")}
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mt-12">
          {contactDetails.map((detail) => (
            <div key={detail.text} className="flex items-center gap-3 font-medium">
              {detail.icon}
              {detail.href ? (
                <a href={detail.href} target="_blank" rel="noopener noreferrer" className="text-headings hover:text-interactive transition">
                  {detail.text}
                </a>
              ) : (
                <span className="text-text">{detail.text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Button asChild variant="cta" size="lg">
            <Link to="/sign-up">{t("buttons.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
