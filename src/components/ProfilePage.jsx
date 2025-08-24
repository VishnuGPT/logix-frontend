import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


// --- HELPER COMPONENTS ---
const InfoSection = ({ title, icon, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-interactive">{icon}</div>
            <h3 className="text-lg font-bold text-headings">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value, name, isEditing, onChange, placeholder }) => (
    <div>
        <label className="block mb-1.5 text-sm font-medium text-text/70">{label}</label>
        {isEditing ? (
            <Input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            />
        ) : (
            <p className="font-semibold text-text min-h-[40px] flex items-center">{value || '-'}</p> // Added min-h for alignment
        )}
    </div>
);

// --- MAIN PROFILE PAGE COMPONENT ---
export default function ProfilePage({ user }) {
    const [profileData, setProfileData] = useState(user);

    return (
        <div>
            <div className="bg-white rounded-lg border border-black/10 shadow-sm p-6 sm:p-8 space-y-8">
                <InfoSection title="Owner Information" icon={<User />}>
                    <InfoItem label="Owner Name" name="ownerName" value={profileData.ownerName}  />
                    <InfoItem label="Owner Contact" name="ownerContactNumber" value={profileData.ownerContactNumber}  />
                </InfoSection>

                <div className="border-t border-black/5"></div>

                <InfoSection title="Company Information" icon={<Building />}>
                    <InfoItem label="Company Name" name="companyName" value={profileData.companyName}  />
                    <InfoItem label="Company Email" name="email" value={profileData.email}  />
                    <div className="md:col-span-2">
                        <InfoItem label="Company Address" name="companyAddress" value={profileData.companyAddress}  />
                    </div>
                    <InfoItem label="GST Number" name="gstNumber" value={profileData.gstNumber}  />
                </InfoSection>
            </div>
        </div>
    );
}