import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, Plus, Edit, DollarSign, LogOut, Bell, Building, Mail, Phone, Check, Calendar, Scale, MapPin, Package, Ruler, Truck, Users, Airplay, Loader2, Image as ImageIcon, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoaderOne from "@/components/ui/LoadingScreen";
import axios from 'axios';
import { ShipmentRequestForm } from '../components/CreateShipment';
import { ShipmentRequestsPage } from '../components/ShipmentRequestPage';
import { useNavigate } from "react-router-dom";
import { GetModificationRequests } from '@/components/GetModificationRequests';
import { OffersPage } from '../components/OfferRequests';
import { toast } from 'react-hot-toast';
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmedRequests } from '@/components/ConfirmedRequests';

const ProfileQuickView = ({ user }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
      <User size={20} className="text-white" />
    </div>
    <div className="hidden sm:block">
      <p className="text-sm font-semibold text-slate-800">{user.ownerName || 'User'}</p>
      <p className="text-xs text-slate-500 truncate max-w-32">{user.companyName || 'Company'}</p>
    </div>
  </div>
);

const DashboardOverview = ({ user, requests, offerCount, onViewOffers }) => {
  console.log(offerCount);
  const activeRequests = requests.filter(
    req => req.status !== 'COMPLETED' && req.status !== 'REJECTED'
  ).length;
  const completedRequests = requests.filter(req => req.status == 'COMPLETED').length;
  const modificationRequests = requests.filter(req => req.status == 'MODIFICATION_REQUESTED').length;

  const stats = [
    { label: 'Active Shipments', value: activeRequests, color: 'bg-blue-500', icon: <Plus size={20} /> },
    { label: 'Completed', value: completedRequests, color: 'bg-green-500', icon: <DollarSign size={20} /> },
    { label: 'Modifications', value: modificationRequests, color: 'bg-yellow-500', icon: <Edit size={20} /> },
    {
      label: 'New Offers',
      value: offerCount,
      color: 'bg-purple-500',
      icon: <Bell size={20} />,
      clickable: true,
      onClick: onViewOffers
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section with Profile Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Welcome back, {user.ownerName || 'User'}! 👋
            </h2>
            <p className="text-slate-600 mb-4">Here's what's happening with your shipments today.</p>

            {/* Quick Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Building size={16} className="text-blue-600" />
                <span className="text-sm text-slate-700 font-medium">{user.companyName || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                <span className="text-sm text-slate-700">{user.email || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600" />
                <span className="text-sm text-slate-700">{user.ownerContactNumber || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 ${stat.clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
              }`}
            onClick={stat.clickable ? stat.onClick : undefined}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
            {stat.clickable && stat.value > 0 && (
              <p className="text-xs text-slate-500 mt-2">Click to view offers</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
        {requests.length > 0 ? (
          <div className="space-y-3">
            {[...requests]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // sort by created_at DESC
              .slice(0, 3)
              .map((request, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {request.pickupAddressLine2} → {request.dropAddressLine2}
                    </p>
                    <p className="text-sm text-slate-500">
                      Status:{" "}
                      <span className="capitalize">
                        {request.status?.toLowerCase()}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === "ACTIVE"
                        ? "bg-blue-100 text-blue-700"
                        : request.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : request.status === "OFFER_SENT"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {request.status}
                  </div>
                </div>
              ))}
            {requests.length > 3 && (
              <p className="text-sm text-slate-500 text-center pt-2">
                And {requests.length - 3} more shipments...
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500">No shipment requests yet</p>
            <p className="text-sm text-slate-400">
              Create your first shipment request to get started
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen, onLogout }) => {
  const navItems = [
    { name: 'Dashboard', icon: <User size={20} /> },
    { name: 'Requests', icon: <Plus size={20} /> },
    { name: 'Offers', icon: <DollarSign size={20} /> },
    { name: 'Modifications', icon: <Edit size={20} /> },
    { name: 'Confirmed Shipments', icon: <Check size={20} /> }, // <-- Add this line
  ];

  return (
    <>                            
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-40
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:h-screen md:flex-shrink-0
            `}>
        <div className="p-6 border-b border-slate-200 flex items-center h-[73px]">
          <img src="/LOGO.png" alt="LogiXjunction Logo" className="h-12 w-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activePage === item.name
                ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const DashboardHeader = ({ activePage, setSidebarOpen, onNewRequestClick, offerCount, onNotificationClick, user }) => {
  const getPageTitle = (page) => {
    switch (page) {
      case 'Dashboard': return 'Dashboard';
      case 'Requests': return 'Shipment Requests';
      case 'Offers': return 'Offers Received';
      case 'Modifications': return 'Modification Requests';
      case 'New Request': return 'Create New Shipment';
      default: return page;
    }
  };

  return (
    <header className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {getPageTitle(activePage)}
          </h1>
          {activePage === 'Dashboard' && (
            <p className="text-slate-500 mt-1">Manage your shipments and track performance</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell for Dashboard */}
        {activePage === 'Dashboard' && (
          <div className="relative">
            <button
              onClick={onNotificationClick}
              className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Bell size={22} />
              {offerCount > 0 && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                  {offerCount > 9 ? '9+' : offerCount}
                </div>
              )}
            </button>
          </div>
        )}

        {/* New Request Button for Requests page */}
        {activePage === 'Requests' && (
          <Button onClick={onNewRequestClick} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus size={18} className="mr-2" />
            New Request
          </Button>
        )}

        {/* Profile Quick View */}
        <ProfileQuickView user={user} />
      </div>
    </header>
  );
};

export default function ShipperDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipperData, setShipperData] = useState({
    user: { name: "", company: "" },
    requests: [],
  });

  const navigate = useNavigate();

  // Data Fetching and Verification
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

        const requestsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shipment/get-all-for-shipper`,
          config
        );

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

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  // Notification Logic
  const offerNotifications = shipperData.requests
    .filter(request => request.status === 'OFFER_SENT')
    .length;

  const handleNotificationClick = () => {
    const offersReceived = shipperData.requests
      .filter(request => request.status === 'OFFER_SENT')
      .map(request => ({
        text: `Offer received for shipment: ${request.pickupAddressLine2} → ${request.dropAddressLine2}`,
        shipmentId: request.id
      }));

    if (offersReceived.length > 0) {
      toast(
        (t) => (
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-slate-800">New Offers</h4>
              <button onClick={() => toast.dismiss(t.id)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {offersReceived.map((offer, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setActiveView('Offers');
                    toast.dismiss(t.id);
                  }}
                  className="cursor-pointer hover:bg-blue-50 p-2 -m-2 rounded-md transition-colors text-slate-600 text-sm"
                >
                  <p>• {offer.text}</p>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-500 mt-3 text-center border-t border-slate-200 pt-2">
              Click any notification to view all offers.
            </div>
          </div>
        ),
        {
          position: 'top-right',
          duration: 8000,
          style: {
            marginTop: '10px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            maxWidth: '420px',
            padding: '16px',
            borderRadius: '12px'
          }
        }
      );
    } else {
      toast("No new offers available.", {
        icon: '👍',
        position: 'top-right',
        style: {
          marginTop: '10px',
          backgroundColor: 'white',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
        },
      });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <LoaderOne />
      </div>
    );
  }

  // Content Rendering Logic
  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <DashboardOverview
            user={shipperData.user}
            requests={shipperData.requests}
            offerCount={offerNotifications}
            onViewOffers={() => setActiveView('Offers')}
          />
        );
      case 'Requests':
        return <ShipmentRequestsPage />;
      case 'Modifications':
        return <GetModificationRequests />;
      case 'New Request':
        return <ShipmentRequestForm onComplete={() => setActiveView('Requests')} />;
      case 'Offers':
        return <OffersPage />;
      case 'Confirmed Shipments':
        return (
          <ConfirmedRequests
            requests={shipperData.requests.filter(r => r.status === 'CONFIRMED')}
            isConfirmedTab
          />
        );
      default:
        return (
          <DashboardOverview
            user={shipperData.user}
            requests={shipperData.requests}
            offerCount={offerNotifications}
            onViewOffers={() => setActiveView('Offers')}
          />
        );
    }
  };

  // Final Render
  return (
    <div className="flex bg-slate-50 font-sans min-h-screen text-slate-800">
      <Sidebar
        activePage={activeView}
        setActivePage={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <DashboardHeader
          activePage={activeView}
          setSidebarOpen={setSidebarOpen}
          onNewRequestClick={() => setActiveView('New Request')}
          offerCount={offerNotifications}
          onNotificationClick={handleNotificationClick}
          user={shipperData.user}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}