import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, Plus, ChevronDown, ChevronUp, BarChart2, FileText,Edit, DollarSign, LogOut, Package, MapPin, Calendar, Truck, Clipboard, Clock, AlertCircle, Phone, CheckCircle, Bell } from 'lucide-react'; // <-- Add Bell
import { Button } from '@/components/ui/button';
import { LoaderOne } from '@/components/ui/loader';
import axios from 'axios';
import { useRef } from 'react';
import {ShipmentRequestForm} from '../components/CreateShipment'
import {ShipmentRequestsPage} from '../components/ShipmentRequestPage';
import { useNavigate } from "react-router-dom";
import ProfilePage from '../components/ProfilePage'
import  {GetModificationRequests}  from '@/components/GetModificationRequests';
import { OffersPage } from '../components/OfferRequests'; // <--- 1. IMPORT THE NEW COMPONENT
import { toast } from 'react-hot-toast'; // Add this if using react-hot-toast or use your own toast/snackbar

// --- MOCK DATA (Shipper Only) ---
// const shipperData = {
//   user: { name: 'Priya Sharma', company: 'Indus Enterprises' },
//   requests: [
//   {
//     id: 1,
//     shipperId: 22,
//     pickupAddressLine2: "Vadodara",
//     dropAddressLine2: "Indore",
//     pickupAddressLine1: "Sayajigunj",
//     pickupState: "Uttar Pradesh",
//     pickupPincode: "390001",
//     dropAddressLine1: "Rajendra Nagar",
//     dropState: "Madhya Pradesh",
//     dropPincode: "452001",
//     expectedPickupDate: "2025-08-16",
//     expectedDeliveryDate: "2025-08-20",
//     materialType: "Others",
//     customMaterialType:"Bomb",
//     weightKg: 1200,
//     lengthFt: 18,
//     widthFt: 7,
//     heightFt: 6,
//     truckSize: "19",
//     bodyType: "Closed",
//     shipmentType: "FTL",
//     noOfLabours: 5,
//     manpower: "yes",
//     transportMode: "Road Transport",
//     coolingType: "Ambient temperature/Non-Refrigerated",
//     materialValue: 500000,
//     additionalNotes: "Handle with extreme care. Flammable.",
//     status: "REQUESTED"
//   }
// ],
//   status: [
//     { id: 'SH001', route: 'Mumbai → Delhi', progress: 65, delivery: '20 Aug, 2025', status: 'in-transit' },
//     { id: 'SH004', route: 'Bengaluru → Chennai', progress: 10, delivery: '22 Aug, 2025', status: 'pickup-scheduled' },
//     { id: 'SH005', route: 'Pune → Hyderabad', progress: 95, delivery: '19 Aug, 2025', status: 'out-for-delivery' },
//   ],
//   billing: {
//     summary: { pending: '₹3.5 Lakhs', paid: '₹2.3 Lakhs', overdue: '₹1.8 Lakhs' },
//     invoices: [
//       { id: 'INV001', amount: '₹3.5 Lakhs', status: 'pending', dueDate: '14 Sep, 2025' },
//       { id: 'INV002', amount: '₹2.3 Lakhs', status: 'paid', dueDate: '09 Sep, 2025' },
//       { id: 'INV003', amount: '₹1.8 Lakhs', status: 'overdue', dueDate: '04 Sep, 2025' },
//     ],
//   },
// };

// --- HELPER & DASHBOARD PAGE COMPONENTS ---

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { name: 'Profile', icon: <User size={18} /> },
    { name: 'Requests', icon: <Plus size={18} /> },
    { name: 'Offers', icon: <DollarSign size={18} /> },
    { name: 'Modification Requests', icon: <Edit size={18} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-black/10 flex flex-col z-40
          transform transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:h-screen
        `}
        style={{ minHeight: '100vh' }} // Ensures sidebar stretches to bottom
      >
        <div className="p-4 border-b border-black/10 flex-shrink-0">
          <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors ${
                activePage === item.name
                  ? 'bg-interactive/10 text-interactive'
                  : 'text-text/80 hover:bg-black/5'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-black/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text/80 hover:bg-black/5"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const DashboardHeader = ({ activePage, setSidebarOpen, onNewRequestClick, offerCount, onNotificationClick }) => (
  <header className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2"><Menu className="h-6 w-6 text-text" /></button>
      <h1 className="text-2xl font-bold text-headings">{activePage}</h1>
    </div>
    <div className="flex items-center gap-4">
      {/* Show bell only on Profile page */}
      {activePage === 'Profile' && (
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Bell 
              size={24} 
              className={`cursor-pointer transition-colors duration-200 ${
                offerCount > 0 ? 'text-blue-600' : 'text-gray-600'
              }`} 
              onClick={onNotificationClick} 
            />
          </button>
          {offerCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold rounded-full px-1 shadow-lg border-2 border-white">
              {offerCount > 99 ? '99+' : offerCount}
            </span>
          )}
        </div>
      )}
      {activePage === 'Requests' && (
        <Button onClick={onNewRequestClick}><Plus size={16} className="mr-2 hover:cursor-pointer" />New Request</Button>
      )}
    </div>
  </header>
);
  const handleLogout = () => {
    try{
      localStorage.removeItem('token');
      // Redirect to login or show a success message
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  return (
    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text/80 hover:bg-black/5">
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
};



// --- MAIN DASHBOARD EXPORT ---
export default function ShipperDashboard() {
  const [loading, setLoading] = useState(true);       
  const [activeView, setActiveView] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipperData, setShipperData] = useState({
    user: { name: "", company: "" },
    requests: [], // Add requests array
  });
  
  const navigate = useNavigate();

useEffect(() => {
  const verifyAndFetch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/sign-in");
        return;
      }

      const config = { headers: { authorization: `Bearer ${token}` } };

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shipper/verify`,
        config
      );

      if (res.status !== 200) {
        navigate("/sign-in");
        return;
      }
      setShipperData((prev) => ({
        ...prev,
        user: res.data.shipperProfile,
      }));
      console.log("Shipper verified:", res.data);

      // Fetch requests using the correct endpoint
      const requestsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shipment/get-all-for-shipper`,
        config
      );
      
      // Update to use 'shipments' instead of 'requests'
      setShipperData((prev) => ({
        ...prev,
        requests: requestsRes.data.shipments || [],
      }));

    } catch (error) {
      console.error("Auth or data fetch error:", error);
      if (error.response?.status === 401) {
        navigate("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  verifyAndFetch();
}, [navigate]);

  // Calculate offer notifications count using map - looking for "OFFER_SENT" status
  const offerNotifications = shipperData.requests
    .map(request => request.status && request.status === 'OFFER_SENT' ? 1 : 0)
    .reduce((total, count) => total + count, 0);

  // Handle notification click
  const handleNotificationClick = () => {
    const offersReceived = shipperData.requests
      .filter(request => request.status && request.status === 'OFFER_SENT')
      .map(request => ({
        text: `• Offer received for shipment from ${request.pickupAddressLine2} to ${request.dropAddressLine2}`,
        shipmentId: request.id
      }));
    
    if (offersReceived.length > 0) {
      // Show clickable toast notifications
      toast.success(
        <div className="space-y-2">
          {offersReceived.map((offer, index) => (
            <div 
              key={index}
              onClick={() => {
                setActiveView('Offers');
                toast.dismiss(); // Close the toast
              }}
              className="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
            >
              {offer.text}
            </div>
          ))}
          <div className="text-xs text-gray-500 mt-2">
            Click on any notification to view offers
          </div>
        </div>,
        {
          position: 'top-right',
          duration: 6000, // Show for 6 seconds
          style: {
            marginTop: '60px',
            marginRight: '20px',
            color: '#3b82f6',
            backgroundColor: '#eff6ff',
            border: '1px solid #dbeafe',
            maxWidth: '400px'
          }
        }
      );
    } else {
      toast("No new offers available.", {
        position: 'top-right',
        style: {
          marginTop: '60px',
          marginRight: '20px',
          color: '#3b82f6',
          backgroundColor: '#eff6ff',
          border: '1px solid #dbeafe',
        }
      });
    }
  };

  // loader handling
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <LoaderOne />
        <span className="text-lg font-medium text-gray-600">Loading...</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'Requests':
        return <ShipmentRequestsPage />;
      case 'Modification Requests':
        return <GetModificationRequests />;
      case 'New Request':
        return <ShipmentRequestForm onComplete={() => setActiveView('Requests')} />;
      case 'Profile':
        return (
          <div className="relative">
            <ProfilePage user={shipperData.user} />
          </div>
        );
      case 'Offers':
        return <OffersPage />;
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
          offerCount={offerNotifications}
          onNotificationClick={handleNotificationClick}
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