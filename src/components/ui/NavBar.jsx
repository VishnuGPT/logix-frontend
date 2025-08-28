import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import i18n from "../../i18n";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about-us" },
  { label: "Join Us", href: "/join-us" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ben", label: "বাংলা" },
  { code: "mar", label: "मराठी" },
  { code: "tam", label: "தமிழ்" },
  { code: "tel", label: "తెలుగు" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setCurrentLang(code);
    localStorage.setItem("i18nextLng", code); // persist choice
    setLangMenuOpen(false);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang && savedLang !== currentLang) {
      i18n.changeLanguage(savedLang);
      setCurrentLang(savedLang);
    }
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-black/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="hover:text-interactive transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4 relative">
            {/* Language Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 rounded-full hover:bg-black/10 transition"
              >
                <Globe className="h-5 w-5 text-text" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-black/10 w-40">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-black/5 ${
                        currentLang === lang.code ? "font-semibold text-interactive" : ""
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* Auth Buttons */}
            <Button asChild variant="ghost">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="cta">
              <Link to="/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle menu" className="p-2 -mr-2">
              <Menu className="h-6 w-6 text-text" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={toggleMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 w-full max-w-sm h-full bg-background shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-black/10">
                <Link to="/" onClick={toggleMenu}>
                  <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-9 w-auto" />
                </Link>
                <button onClick={toggleMenu} aria-label="Close menu" className="p-2">
                  <X className="h-6 w-6 text-text" />
                </button>
              </div>

              <ul className="flex flex-col gap-6 text-lg font-semibold text-headings p-6">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="hover:text-interactive transition-colors"
                      onClick={toggleMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Language Picker
              <div className="px-6">
                <h3 className="text-sm text-text/70 mb-2">Select Language</h3>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-black/5 ${
                        currentLang === lang.code ? "font-semibold text-interactive" : ""
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div> */}

              <div className="mt-auto p-6 border-t border-black/10 flex flex-col gap-4">
                <Button asChild variant="ghost" size="lg" onClick={toggleMenu}>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="cta" size="lg" onClick={toggleMenu}>
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
