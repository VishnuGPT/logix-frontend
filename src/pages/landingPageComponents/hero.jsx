import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation("hero"); // using hero namespace

  return (
    <section className="bg-headings text-background">
      <div className="max-w-7xl mx-auto flex items-center min-h-screen px-6 py-24">
        <div className="sm:px-20 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-background/80 mb-10">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/sign-up")}
              className="px-8 py-3 bg-accent-cta hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80"
            >
              {t("cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
