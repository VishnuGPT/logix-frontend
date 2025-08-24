import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, Plus, ChevronDown, ChevronUp, BarChart2, FileText, DollarSign, LogOut, Package, MapPin, Calendar, Truck, Clipboard, Clock, AlertCircle, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Assuming these are in separate files as per the original structure
import { ShipmentRequestForm } from '../components/CreateShipment'; 
import { ShipmentRequestsPage } from '../components/ShipmentRequestPage';

// --- MOCK DATA (Augmented for Detailed Status View) ---
const shipperData = {
  user: { name: 'Priya Sharma', company: 'Indus Enterprises' },
  requests: [
    // ... existing request data
  ],
  // Updated status data to power the new detailed UI
  status: [
    { 
      id: 'SH001', 
      route: 'Mumbai → Delhi', 
      progress: 65, 
      status: 'in-transit', 
      expectedPickupDate: "2025-08-18",
      expectedDeliveryDate: '20 Aug, 2025',
      pickupAddressLine1: "Andheri East",
      pickupAddressLine2: "Mumbai",
      pickupPincode: "400069",
      dropAddressLine1: "Connaught Place",
      dropAddressLine2: "Delhi",
      dropPincode: "110001",
      weightKg: 5500,
      lengthFt: 22,
      widthFt: 8,
      heightFt: 7,
      truckSize: "22ft",
      bodyType: "Open Body",
      transportMode: "Road Transport",
      materialType: "Electronics",
      materialValue: 1200000,
      // Timestamps to control the progress tracker
      createdAt: "2025-08-17T10:00:00Z",
      confirmedAt: "2025-08-17T14:30:00Z",
      pickedUpAt: "2025-08-18T09:00:00Z",
      inTransitAt: "2025-08-18T11:00:00Z",
    },
    { 
      id: 'SH004', 
      route: 'Bengaluru → Chennai', 
      progress: 25, 
      status: 'pickup-scheduled',
      expectedPickupDate: "2025-08-21",
      expectedDeliveryDate: '22 Aug, 2025',
      pickupAddressLine1: "Koramangala",
      pickupAddressLine2: "Bengaluru",
      dropAddressLine1: "T. Nagar",
      dropAddressLine2: "Chennai",
      weightKg: 3000,
      truckSize: "19ft",
      bodyType: "Closed",
      createdAt: "2025-08-20T18:00:00Z",
      confirmedAt: "2025-08-21T08:00:00Z",
    },
    { 
      id: 'SH005', 
      route: 'Pune → Hyderabad', 
      progress: 95, 
      status: 'out-for-delivery',
      expectedPickupDate: "2025-08-17",
      expectedDeliveryDate: '19 Aug, 2025',
      pickupAddressLine1: "Hinjewadi",
      pickupAddressLine2: "Pune",
      dropAddressLine1: "Gachibowli",
      dropAddressLine2: "Hyderabad",
      weightKg: 8000,
      truckSize: "32ft",
      bodyType: "Container",
      createdAt: "2025-08-16T12:00:00Z",
      confirmedAt: "2025-08-16T16:00:00Z",
      pickedUpAt: "2025-08-17T10:00:00Z",
      inTransitAt: "2025-08-17T12:30:00Z",
      outForDeliveryAt: "2025-08-19T08:00:00Z",
    },
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


// --- REBUILT ShipmentStatusPage WITH DYNAMIC UI ---

const getProgressSteps = (shipment) => {
  return [
    { id: 'requested', label: 'Request Placed', icon: Clipboard, completed: !!shipment.createdAt, timestamp: shipment.createdAt },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, completed: !!shipment.confirmedAt, timestamp: shipment.confirmedAt },
    { id: 'pickup-scheduled', label: 'Pickup Scheduled', icon: Calendar, completed: !!shipment.confirmedAt, timestamp: shipment.expectedPickupDate},
    { id: 'picked-up', label: 'Picked Up', icon: Package, completed: !!shipment.pickedUpAt, timestamp: shipment.pickedUpAt },
    { id: 'in-transit', label: 'In Transit', icon: Truck, completed: !!shipment.inTransitAt, timestamp: shipment.inTransitAt },
    { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck, completed: !!shipment.outForDeliveryAt, timestamp: shipment.outForDeliveryAt },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, completed: shipment.status === 'delivered', timestamp: shipment.deliveredAt || shipment.expectedDeliveryDate },
  ];
};

const ProgressTracker = ({ steps, currentProgress }) => {
    // Find the index of the last completed step
    const lastCompletedIndex = steps.map(step => step.completed).lastIndexOf(true);
    const progressPercentage = lastCompletedIndex >= 0 ? ((lastCompletedIndex + 1) / steps.length) * 100 : 0;
  
    return (
      <div className="w-full py-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-interactive transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {steps.map((step) => {
            const IconComponent = step.icon;
            const isCompleted = step.completed;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 text-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-interactive border-interactive text-white' : 'bg-white border-gray-300 text-gray-400'}
                `}>
                  <IconComponent size={18} />
                </div>
                <p className={`mt-2 text-xs font-medium w-20 ${isCompleted ? 'text-interactive' : 'text-gray-500'}`}>
                  {step.label}
                </p>
                 {step.timestamp && isCompleted && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(step.timestamp).toLocaleDateString()}
                    </p>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'requested': 'bg-yellow-100 text-yellow-700',
    'confirmed': 'bg-purple-100 text-purple-700',
    'pickup-scheduled': 'bg-purple-100 text-purple-700',
    'picked-up': 'bg-cyan-100 text-cyan-700',
    'in-transit': 'bg-blue-100 text-blue-700',
    'out-for-delivery': 'bg-indigo-100 text-indigo-700',
    'delivered': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
      {status?.replace('-', ' ') || 'Unknown'}
    </span>
  );
};


const ShipmentStatusPage = ({ statuses }) => {
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCard = (id) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
      <div className="space-y-4">
        {statuses.map(item => {
          const isExpanded = expandedCards[item.id];
          const progressSteps = getProgressSteps(item);

          return (
            <div key={item.id} className="bg-white border border-black/5 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
              {/* Collapsed View */}
              <div className="p-4 cursor-pointer" onClick={() => toggleCard(item.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <p className="font-semibold text-headings">{item.route}</p>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={item.status} />
                    {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                  </div>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div className="bg-interactive h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-text/70 mt-2">
                  <span>Progress: {item.progress}%</span>
                  <span>Est. Delivery: {item.expectedDeliveryDate}</span>
                </div>
              </div>

              {/* Expanded View */}
              {isExpanded && (
                <div className="border-t border-black/5 bg-gray-50/50 p-6">
                    <h4 className="text-md font-semibold mb-2 text-headings">Shipment Progress</h4>
                    <ProgressTracker steps={progressSteps} currentProgress={item.progress} />
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* Route Information */}
                        <div>
                            <h5 className="font-semibold text-headings mb-2 flex items-center gap-2"><MapPin size={16}/> Route Information</h5>
                            <div className="bg-white p-4 rounded-lg border border-black/5 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-sm">Pickup Location</p>
                                        <p className="text-xs text-text/70">{item.pickupAddressLine1}, {item.pickupAddressLine2} - {item.pickupPincode}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-sm">Delivery Location</p>
                                        <p className="text-xs text-text/70">{item.dropAddressLine1}, {item.dropAddressLine2} - {item.dropPincode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipment Details */}
                        <div>
                            <h5 className="font-semibold text-headings mb-2 flex items-center gap-2"><Clipboard size={16}/> Shipment Details</h5>
                            <div className="bg-white p-4 rounded-lg border border-black/5 text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-text/70">Tracking ID:</span> <span className="font-medium">TRK{item.id}</span></div>
                                <div className="flex justify-between"><span className="text-text/70">Weight:</span> <span className="font-medium">{item.weightKg} kg</span></div>
                                <div className="flex justify-between"><span className="text-text/70">Truck Size:</span> <span className="font-medium">{item.truckSize}</span></div>
                                <div className="flex justify-between"><span className="text-text/70">Material Value:</span> <span className="font-medium">₹{item.materialValue?.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        <Button variant="outline"><Phone size={14} className="mr-2"/> Contact Driver</Button>
                        <Button variant="destructive"><AlertCircle size={14} className="mr-2"/> Report Issue</Button>
                    </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    );
};


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
              {/* This StatusBadge is for billing, different from the shipment one */}
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${inv.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' : inv.status === 'paid' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>{inv.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD EXPORT ---
export default function ShipperDashboard() {
  const [activeView, setActiveView] = useState('Status'); // Default to 'Status' to show the new component
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