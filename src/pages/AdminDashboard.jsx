import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, FileText, Package, Edit3, CheckCircle, LogOut, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have this from ShadCN UI
import { LoaderOne } from '@/components/ui/loader';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {AdminRequestsRequests} from '../components/AdminShipmentRequests';
import {AdminModificationRequests} from '../components/AdminModificationRequests'
import { AdminConfirmedRequests } from '@/components/AdminConfirmedShipments';
import { AdminOfferedShipments } from '@/components/AdminOfferedShipments';
// --- HELPER & DASHBOARD PAGE COMPONENTS ---

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  // Define navigation items specific to the Admin dashboard
  const navItems = [
    { name: 'Profile', icon: <User size={18} /> },
    { name: 'Shipment Requests', icon: <FileText size={18} /> },
    { name: 'Offered Shipments', icon: <Package size={18} /> },
    { name: 'Modification Requests', icon: <Edit3 size={18} /> },
    { name: 'Confirmed Requests', icon: <CheckCircle size={18} /> },
  ];

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
      />
      {/* Sidebar Panel */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-black/10 flex flex-col z-40 transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-black/10">
          <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button 
              key={item.name} 
              onClick={() => { setActivePage(item.name); setSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors ${activePage === item.name ? 'bg-interactive/10 text-interactive' : 'text-text/80 hover:bg-black/5'}`}
            >
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

const DashboardHeader = ({ activePage, setSidebarOpen }) => (
  <header className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2">
        <Menu className="h-6 w-6 text-text" />
      </button>
      <h1 className="text-2xl font-bold text-headings">{activePage}</h1>
    </div>
    {/* Admin dashboard might not need a "New Request" button, so it's removed */}
  </header>
);

// --- PLACEHOLDER PAGE CONTENT COMPONENTS ---
// These are simple placeholders. You would replace these with your actual page components.

const AdminProfilePage = ({ user }) => (
  <div className="bg-white p-6 rounded-lg border border-black/5">
    <h2 className="text-xl font-bold text-headings mb-4">Admin Profile</h2>
    <div className="space-y-2">
      <p><strong className="font-semibold">Name:</strong> {user.name || 'Admin User'}</p>
      <p><strong className="font-semibold">Role:</strong> {user.role || 'Administrator'}</p>
    </div>
  </div>
);

const AdminShipmentRequests = () => (
    <div className="bg-white p-6 rounded-lg border border-black/5">
        <h2 className="text-xl font-bold text-headings mb-4 flex items-center gap-2">
            <FileText className="text-interactive"/> New Shipment Requests
        </h2>
        <p className="text-text/80">
            This is where you'll review, approve, or reject new shipment requests submitted by shippers. Each request will contain details like pickup/drop locations, material type, dimensions, and special instructions.
        </p>
        {/* You would map over and display a list of requests here */}
    </div>
);





// --- MAIN ADMIN DASHBOARD EXPORT ---

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("Shipment Requests"); // Default view for admin
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    user: { name: "Admin", role: "Administrator" },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin/sign-in"); // Redirect to admin sign-in
          return;
        }

        const config = { headers: { authorization: `Bearer ${token}` } };
        
        // Use the appropriate API endpoint for admin verification
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/verify`, 
          config
        );

        if (res.status !== 200) {
          navigate("/admin/sign-in");
          return;
        }
        
        // Assuming the API returns an adminProfile object
        setAdminData({ user: res.data.adminProfile });
        console.log("Admin verified:", res.data);

      } catch (error) {
        console.error("Auth or data fetch error:", error);
        if (error.response?.status === 401) {
          navigate("/admin/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [navigate]);

  const renderContent = () => {
    switch (activeView) {
      case 'Profile':
        return <AdminProfilePage user={adminData.user} />;
      case 'Shipment Requests':
        return <AdminRequestsRequests />;
      case 'Offered Shipments':
        return <AdminOfferedShipments />;
      case 'Modification Requests':
        return <AdminModificationRequests />;
      case 'Confirmed Requests':
        return <AdminConfirmedRequests />;
      default:
        return <AdminShipmentRequests />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <LoaderOne />
        <span className="text-lg font-medium text-gray-600">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="relative md:flex bg-background font-sans min-h-screen">
      <Sidebar 
        activePage={activeView} 
        setActivePage={setActiveView} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          activePage={activeView}
          setSidebarOpen={setSidebarOpen}
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