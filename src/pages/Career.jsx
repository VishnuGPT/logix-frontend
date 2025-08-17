import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ChevronDown, ArrowRight } from 'lucide-react';
import { careers } from '../data/careers'; // Assuming your data is here
import { Button } from '@/components/ui/button'; // Assuming you have this

// --- Helper Component: Hero Section ---
const CareersHero = () => (
    <div className="bg-headings text-background text-center py-20 px-6">
        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold"
        >
            Build the Future of Freight
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-4 text-lg text-background/80"
        >
            Join us in our mission to modernize one of India's most crucial sectors with smart, scalable technology.
        </motion.p>
    </div>
);

// --- Helper Component: Job Listings Section ---
const JobListings = () => {
    const [activeDept, setActiveDept] = useState(careers[0]?.name || '');
    const [selectedRole, setSelectedRole] = useState(null);

    const activeRoles = useMemo(() => {
        return careers.find(dept => dept.name === activeDept)?.data || [];
    }, [activeDept]);
    
    const handleDeptChange = (deptName) => {
        setActiveDept(deptName);
        setSelectedRole(null);
    };

    const selectStyles = "w-full px-4 py-3 bg-white border border-black/20 rounded-lg font-semibold text-headings focus:outline-none focus:ring-2 focus:ring-interactive appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%27http%3a//www.w3.org/2000/svg%27%20fill%3d%27none%27%20viewBox%3d%270%200%2020%2020%27%3e%3cpath%20stroke%3d%27%233e92cc%27%20stroke-linecap%3d%27round%27%20stroke-linejoin%3d%27round%27%20stroke-width%3d%271.5%27%20d%3d%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center]";

    return (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                {/* Mobile Dropdown */}
                <div className="w-full md:hidden mb-4">
                    <label className="block text-sm font-bold uppercase text-text/50 mb-2">
                        Select Department
                    </label>
                    <select
                        value={activeDept}
                        onChange={(e) => handleDeptChange(e.target.value)}
                        className={selectStyles}
                    >
                        {careers.map(dept => (
                            <option key={dept.name} value={dept.name}>{dept.name}</option>
                        ))}
                    </select>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-full md:w-1/4 sticky top-24">
                    <h3 className="text-sm font-bold uppercase text-text/50 mb-4">Departments</h3>
                    <ul className="space-y-2">
                        {careers.map(dept => (
                            <li key={dept.name}>
                                <button
                                    onClick={() => handleDeptChange(dept.name)}
                                    className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeDept === dept.name ? 'bg-interactive text-white' : 'hover:bg-black/5 text-headings'}`}
                                >
                                    {dept.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Roles & Details */}
                <main className="w-full md:w-3/4 space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDept}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeRoles.length > 0 ? (
                                activeRoles.map(role => (
                                    <JobCard
                                        key={role.name}
                                        role={role}
                                        isSelected={selectedRole?.name === role.name}
                                        onSelect={() => setSelectedRole(selectedRole?.name === role.name ? null : role)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-text/70 border border-black/10 rounded-lg">
                                    <p>No open roles in this department at the moment.</p>
                                    <p className="text-sm mt-1">Please check back later.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// --- Helper Component: Individual Job Card ---
const JobCard = ({ role, isSelected, onSelect }) => (
    <div className="border border-black/10 rounded-lg overflow-hidden">
        <button onClick={onSelect} className="w-full p-6 text-left flex items-center justify-between hover:bg-background transition-colors">
            <div>
                <h4 className="font-bold text-lg text-headings">{role.name}</h4>
                <div className="flex items-center gap-4 text-sm text-text/70 mt-1">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {role.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {role.type}</span>
                </div>
            </div>
            <motion.div animate={{ rotate: isSelected ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={20} className="text-text/50" />
            </motion.div>
        </button>

        <AnimatePresence>
            {isSelected && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                    className="bg-background"
                >
                    <div className="p-6 border-t border-black/10 space-y-6">
                        <div>
                            <h5 className="font-semibold text-headings mb-2">About the Role</h5>
                            {role.description.map((p, i) => <p key={i} className="text-text/90 mb-2">{p}</p>)}
                        </div>
                        <div>
                            <h5 className="font-semibold text-headings mb-2">Requirements</h5>
                            <ul className="list-disc list-inside space-y-1 text-text/90">
                                {role.requirement.map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                        </div>
                        <Button variant="cta">Apply Now <ArrowRight size={16} className="ml-2" /></Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


// --- Main Exported Careers Page Component ---
export default function Careers() {
    return (
        <div className="bg-background">
            <CareersHero />
            <JobListings />
        </div>
    );
}