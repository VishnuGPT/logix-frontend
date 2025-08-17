import React, { useState, useEffect } from 'react';
import { Twitter, Linkedin, Instagram, ArrowUp, Send } from 'lucide-react';
import { Input } from './Input'; // Assuming you have these
import { Button } from './Button'; // Assuming you have these
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/LOGO.png'; // Adjust the path as necessary

// --- Data for easy management ---
const footerLinks = [
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about-us' },
            { label: 'Careers', href: '/careers' },
            { label: 'News', href: '/news' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Contact Us', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Get Started', href: '/sign-up' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    },
];

const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
    { icon: <Instagram className="h-5 w-5" />, href: '#' },
];


// --- Main Footer Component ---
export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });
    const [showScroll, setShowScroll] = useState(false);

    // --- Logic for showing/hiding the scroll-to-top button ---
    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScroll && window.pageYOffset > 400) {
                setShowScroll(true);
            } else if (showScroll && window.pageYOffset <= 400) {
                setShowScroll(false);
            }
        };
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScroll]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setStatus({ message: 'Please enter a valid email.', type: 'error' });
            return;
        }

        // Replace with your actual API endpoint
        // Simulating API call for now
        setStatus({ message: 'Subscribing...', type: 'loading' });
        setTimeout(() => {
            setStatus({ message: "Thank you for subscribing!", type: 'success' });
            setEmail('');
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        }, 1500);
    };

    return (
        <>
            <footer className="w-full bg-headings text-background/70 pt-16 pb-8 px-6 md:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        {/* Logo & Tagline Section */}
                        <div className="lg:col-span-2">
                            <img src={Logo} alt="LogiXjunction Logo" className="h-16 w-auto mb-4" />
                            <p className="max-w-xs">India's smartest digital freight network, built for the future.</p>
                        </div>
                        {/* Links Sections */}
                        {footerLinks.map((section) => (
                            <div key={section.title}>
                                <h4 className="font-bold text-white mb-4">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className="hover:text-interactive transition-colors">{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <p className="text-sm text-background/50 order-2 md:order-1">
                            © {new Date().getFullYear()} LogiXjunction. All rights reserved.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4 order-1 md:order-2">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.href} className="text-background/70 hover:text-white transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* --- Scroll to Top Button --- */}
            <AnimatePresence>
                {showScroll && (
                    <motion.button
                        onClick={scrollToTop}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        className="fixed bottom-6 right-6 bg-interactive text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:bg-headings transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-interactive"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}