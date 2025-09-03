import React, { useState } from 'react';
import { User, Building } from 'lucide-react';

// --- Helper components ---
const InfoSection = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 text-blue-600">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-slate-500">{label}</label>
    <p className="font-semibold text-slate-800 min-h-[40px] flex items-center">{value || '-'}</p>
  </div>
);

// --- Main profile ---
export default function ProfilePage({ user }) {
  const [profileData] = useState(user);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
        <InfoSection title="Owner Information" icon={<User />}>
          <InfoItem label="Owner Name" value={profileData.ownerName} />
          <InfoItem label="Owner Contact" value={profileData.ownerContactNumber} />
        </InfoSection>

        <div className="border-t border-slate-200" />

        <InfoSection title="Company Information" icon={<Building />}>
          <InfoItem label="Company Name" value={profileData.companyName} />
          <InfoItem label="Company Email" value={profileData.email} />
          <div className="md:col-span-2">
            <InfoItem label="Company Address" value={profileData.companyAddress} />
          </div>
          <InfoItem label="GST Number" value={profileData.gstNumber} />
        </InfoSection>
      </div>
    </div>
  );
}
