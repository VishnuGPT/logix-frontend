import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, Users, X,Edit , Plus,ChevronDown , BarChart2, FileText, DollarSign, LogOut, Package, MapPin, Calendar, Truck, Scale, Ruler, Upload, Edit3, CheckCircle, File, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRef } from 'react';
import {ShipmentRequestForm} from '../components/CreateShipment'
import {ShipmentRequestsPage} from '../components/ShipmentRequestPage';

// --- MOCK DATA (Shipper Only) ---
const shipperData = {
  user: { name: 'Priya Sharma', company: 'Indus Enterprises' },
  requests: [
  {
    id: 1,
    pickupAddressLine2: "Vadodara",
    dropAddressLine2: "Indore",
    pickupAddressLine1: "Sayajigunj",
    pickupState: "Uttar Pradesh",
    pickupPincode: "390001",
    dropAddressLine1: "Rajendra Nagar",
    dropState: "Madhya Pradesh",
    dropPincode: "452001",
    expectedPickupDate: "2025-08-16",
    expectedDeliveryDate: "2025-08-20",
    materialType: "Fragile Items",
    weightKg: 1200,
    lengthFt: 18,
    widthFt: 7,
    heightFt: 6,
    truckSize: "19",
    bodyType: "Closed",
    shipmentType: "FTL",
    manpower: "no",
    transportMode: "Road Transport",
    coolingType: "Ambient temperature/Non-Refrigerated",
    materialValue: 500000,
    additionalNotes: "Handle with extreme care. Flammable.",
    status: "REQUESTED"
  }
],
  status: [
    { id: 'SH001', route: 'Mumbai → Delhi', progress: 65, delivery: '20 Aug, 2025', status: 'in-transit' },
    { id: 'SH004', route: 'Bengaluru → Chennai', progress: 10, delivery: '22 Aug, 2025', status: 'pickup-scheduled' },
    { id: 'SH005', route: 'Pune → Hyderabad', progress: 95, delivery: '19 Aug, 2025', status: 'out-for-delivery' },
  ],
  billing: {
    summary: { pending: '₹3.5 Lakhs', paid: '₹2.3 Lakhs', overdue: '₹1.8 Lakhs' },
    invoices: [
      { id: 'INV001', amount: '₹3.5 Lakhs', status: 'pending', dueDate: '14 Sep, 2025' },
      { id: 'INV002', amount: '₹2.3 Lakhs', status: 'paid', dueDate: '09 Sep, 2025' },
      { id: 'INV003', amount: '₹1.8 Lakhs', status: 'overdue', dueDate: '04 Sep, 2025' },
    ],
  },
};

// --- HELPER & DASHBOARD PAGE COMPONENTS ---

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { name: 'Profile', icon: <User size={18} /> },
    { name: 'Requests', icon: <Plus size={18} /> },
    { name: 'Status', icon: <BarChart2 size={18} /> },
    { name: 'Billing', icon: <FileText size={18} /> },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-black/10 flex flex-col z-40 transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-black/10">
          <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button key={item.name} onClick={() => { setActivePage(item.name); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors ${activePage === item.name ? 'bg-interactive/10 text-interactive' : 'text-text/80 hover:bg-black/5'}`}>
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-black/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text/80 hover:bg-black/5">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const DashboardHeader = ({ activePage, setSidebarOpen, onNewRequestClick }) => (
  <header className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2"><Menu className="h-6 w-6 text-text" /></button>
      <h1 className="text-2xl font-bold text-headings">{activePage}</h1>
    </div>
    {activePage === 'Requests' && (
      <Button onClick={onNewRequestClick}><Plus size={16} className="mr-2 hover:cursor-pointer" />New Request</Button>
    )}
  </header>
);



const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    interactive: 'bg-interactive/10 text-interactive',
    green: 'bg-green-500/10 text-green-600',
    red: 'bg-red-500/10 text-red-600',
  };
  return (
    <div className="bg-white border border-black/5 p-4 rounded-lg">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>{icon}</div>
      <p className="text-2xl font-bold text-headings mt-4">{value}</p>
      <p className="text-sm text-text/60">{title}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    approved: 'bg-interactive/10 text-interactive',
    'in-transit': 'bg-blue-500/10 text-blue-600',
    'pickup-scheduled': 'bg-purple-500/10 text-purple-600',
    'out-for-delivery': 'bg-indigo-500/10 text-indigo-600',
    paid: 'bg-green-500/10 text-green-600',
    overdue: 'bg-red-500/10 text-red-600',
  };
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles[status] || 'bg-black/10 text-text'}`}>{status.replace('-', ' ')}</span>;
};


// --- PAGE CONTENT COMPONENTS ---


const ShipmentStatusPage = ({ statuses }) => (
  <div className="space-y-4">
    {statuses.map(item => (
      <div key={item.id} className="bg-white border border-black/5 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <p className="font-semibold text-headings">{item.route}</p>
          <StatusBadge status={item.status} />
        </div>
        <div className="w-full bg-black/10 rounded-full h-2"><div className="bg-interactive h-2 rounded-full" style={{ width: `${item.progress}%` }}></div></div>
        <div className="flex justify-between text-sm text-text/70 mt-2">
          <span>Progress: {item.progress}%</span>
          <span>Est. Delivery: {item.delivery}</span>
        </div>
      </div>
    ))}
  </div>
);

const BillingPage = ({ billing }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Pending" value={billing.summary.pending} icon={<DollarSign />} color="interactive" />
      <StatCard title="Overdue" value={billing.summary.overdue} icon={<DollarSign />} color="red" />
      <StatCard title="Paid" value={billing.summary.paid} icon={<DollarSign />} color="green" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-headings mb-4">Invoices</h3>
      <div className="space-y-3">
        {billing.invoices.map(inv => (
          <div key={inv.id} className="bg-white border border-black/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-headings">Invoice {inv.id}</p>
              <p className="text-sm text-text/70">Due: {inv.dueDate}</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              <span className="text-sm font-medium text-text">{inv.amount}</span>
              <StatusBadge status={inv.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);



// --- MAIN DASHBOARD EXPORT ---
export default function ShipperDashboard() {
  const [activeView, setActiveView] = useState('Requests');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'Requests':
        return <ShipmentRequestsPage requests={shipperData.requests} />;
      case 'Status':
        return <ShipmentStatusPage statuses={shipperData.status} />;
      case 'Billing':
        return <BillingPage billing={shipperData.billing} />;
      case 'New Request':
        return <ShipmentRequestForm onComplete={() => setActiveView('Requests')} />;
      case 'Profile':
        return <div>Profile Page Content</div>;
      case 'Modification Requests':
        return <div>Modification Requests Page Content</div>;
      default:
        return <ShipmentRequestsPage requests={shipperData.requests} />;
    }
  };

  return (
    <div className="relative md:flex bg-background font-sans min-h-screen">
      <Sidebar activePage={activeView} setActivePage={setActiveView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          activePage={activeView === 'New Request' ? 'Create New Shipment Request' : activeView}
          setSidebarOpen={setSidebarOpen}
          onNewRequestClick={() => setActiveView('New Request')}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}






