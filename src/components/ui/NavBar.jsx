import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/about-us" },
    { label: "Join Us", href: "/join-us" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* KEPT: Your preferred fixed, full-width navbar style. */}
            {/* THEMED: Updated colors to match your website's theme. z-index is set to 40. */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-black/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* --- Logo --- */}
                    <Link to="/" className="flex-shrink-0">
                        <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-10 w-auto" />
                    </Link>

                    {/* --- Desktop Nav Links --- */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text">
                        {navLinks.map((link) => (
                            <Link key={link.label} to={link.href} className="hover:text-interactive transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* --- Desktop Auth Buttons --- */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button asChild variant="ghost">
                            <Link to="/sign-in">Sign In</Link>
                        </Button>
                        {/* FIXED: Button now correctly uses Link component for navigation */}
                        <Button asChild variant="cta">
                            <Link to="/signup-otp">Get Started</Link>
                        </Button>
                    </div>

                    {/* --- Mobile Menu Button --- */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} aria-label="Toggle menu" className="p-2 -mr-2">
                            <Menu className="h-6 w-6 text-text" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* NEW: Integrated the smooth, slide-in mobile menu panel. */}
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
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                                        <Link to={link.href} className="hover:text-interactive transition-colors" onClick={toggleMenu}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto p-6 border-t border-black/10 flex flex-col gap-4">
                                <Button asChild variant="ghost" size="lg" onClick={toggleMenu}>
                                    <Link to="/sign-in">Sign In</Link>
                                </Button>
                                <Button asChild variant="cta" size="lg" onClick={toggleMenu}>
                                    <Link to="/signup-otp">Get Started</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}