import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3,
  Plus,
  Mail,
  Phone,
  MapPin,
  Send,
  Package,
  Truck,
  PackageCheck,
  PackageX,
  Timer,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

// --- SAMPLE DATA (fix for undefined error) ---
const clientData = {
  name: "Vishnu Gupta",
  company: "Logix Pvt Ltd",
  email: "vishnu@example.com",
  phone: "+91 9876543210",
  address: "Delhi, India",
  avatar: "https://i.pravatar.cc/150?img=12",
  tags: ["Premium", "Priority", "International"],
};

const shipmentsByStatus = {
  ongoing: [
    { id: 1, description: "Shipment to Mumbai", trackingNumber: "LXJ123", destination: "Mumbai", estimatedDelivery: "2025-08-20" },
  ],
  completed: [
    { id: 2, description: "Shipment to Bangalore", trackingNumber: "LXJ456", destination: "Bangalore", date: "2025-08-10" },
  ],
  upcoming: [
    { id: 3, description: "Shipment to Hyderabad", trackingNumber: "LXJ789", destination: "Hyderabad", date: "2025-08-25" },
  ],
  rejected: [
    { id: 4, description: "Shipment to Chennai", trackingNumber: "LXJ101", destination: "Chennai", date: "2025-08-05" },
  ],
};

// --- COMPONENTS ---
const DashboardHeader = () => (
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-extrabold text-headings">Dashboard</h1>
    <Button asChild variant="cta">
      <Link to="/shipment-registration">
        <Send className="w-4 h-4 mr-2" />
        Request Shipment
      </Link>
    </Button>
  </div>
);

const ClientSidebar = ({ client }) => {
  if (!client) return null;

  return (
    <aside className="w-full md:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg border border-black/5 p-6 space-y-6">
        <div className="text-center">
          <img
            src={client.avatar}
            alt={client.name}
            className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-md -mt-16"
          />
          <h2 className="text-xl font-bold text-headings mt-4">{client.name}</h2>
          <p className="text-sm text-text/60">{client.company}</p>
        </div>
        <div className="space-y-2">
          <InfoItem icon={<Mail size={14} />} text={client.email} />
          <InfoItem icon={<Phone size={14} />} text={client.phone} />
          <InfoItem icon={<MapPin size={14} />} text={client.address} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-headings mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {client.tags &&
              client.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium bg-accent-highlight/40 text-text rounded-full"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

const InfoItem = ({ icon, text }) => (
  <div className="flex items-start gap-3 text-sm">
    <span className="text-interactive mt-0.5">{icon}</span>
    <span className="text-text/80">{text}</span>
  </div>
);

const MainContent = ({ shipments }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "shipments", "documents", "billing"];

  return (
    <div className="flex-1 bg-white rounded-lg border border-black/5">
      <div className="border-b border-black/5 flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold capitalize transition-colors focus:outline-none ${
              activeTab === tab
                ? "text-interactive border-b-2 border-interactive"
                : "text-text/60 hover:text-headings"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeTab === "overview" && <OverviewTab shipments={shipments} />}
        {activeTab === "shipments" && <ShipmentsTab shipments={shipments} />}
      </div>
    </div>
  );
};

// --- Tabs ---
const OverviewTab = ({ shipments }) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-bold text-headings mb-4">Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Ongoing" value={shipments.ongoing.length} icon={<Truck />} color="interactive" />
        <StatCard title="Completed" value={shipments.completed.length} icon={<PackageCheck />} color="green" />
        <StatCard title="Upcoming" value={shipments.upcoming.length} icon={<Timer />} color="yellow" />
        <StatCard title="Rejected" value={shipments.rejected.length} icon={<PackageX />} color="red" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-bold text-headings mb-4">Recent Shipments</h3>
      <div className="space-y-3">
        {Object.values(shipments).flat().slice(0, 3).map((shipment) => (
          <ShipmentListItem key={shipment.id} shipment={shipment} />
        ))}
      </div>
    </div>
  </div>
);

const ShipmentsTab = ({ shipments }) => {
  const [activeStatus, setActiveStatus] = useState("ongoing");
  const shipmentTabs = [
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "upcoming", label: "Upcoming" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {shipmentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
              activeStatus === tab.id
                ? "bg-headings text-white"
                : "bg-background text-text/80 hover:bg-black/10"
            }`}
          >
            {tab.label} ({shipments[tab.id].length})
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {shipments[activeStatus].map((shipment) => (
          <ShipmentListItem key={shipment.id} shipment={shipment} status={activeStatus} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    interactive: "bg-interactive/10 text-interactive",
    green: "bg-green-500/10 text-green-600",
    yellow: "bg-yellow-500/10 text-yellow-600",
    red: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="bg-background border border-black/5 p-4 rounded-lg">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-headings mt-4">{value}</p>
      <p className="text-sm text-text/60">{title}</p>
    </div>
  );
};

const ShipmentListItem = ({ shipment }) => (
  <div className="border border-black/5 rounded-lg p-4 flex items-center justify-between hover:bg-background transition-colors">
    <div>
      <p className="font-semibold text-headings">{shipment.description}</p>
      <p className="text-sm text-text/60">Tracking: {shipment.trackingNumber}</p>
    </div>
    <div className="text-sm text-text/80 text-right">
      <p>{shipment.destination}</p>
      <p className="text-xs text-text/60">{shipment.estimatedDelivery || shipment.date}</p>
    </div>
  </div>
);

// --- MAIN ---
export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <ClientSidebar client={clientData} />
          <MainContent shipments={shipmentsByStatus} />
        </div>
      </div>
    </div>
  );
}
