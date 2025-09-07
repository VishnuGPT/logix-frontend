import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Calendar, Truck, Check, X, ChevronDown, MapPin,
  Package, Scale, Ruler, Users, FileText, Airplay, Loader2, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoaderOne from "@/components/ui/LoadingScreen";
import OfferFilter from './OfferFilter'; // Assuming this component exists
import { toast } from 'react-hot-toast'; // For better notifications

// --- Helper Components & Functions ---

const DetailSection = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-500 mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || <span className="text-slate-400 italic">Not provided</span>}</p>
    </div>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  const baseClasses = "text-xs font-bold px-2.5 py-1 rounded-full";
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};


// --- OfferCard Component ---
const OfferCard = ({ offer, onAccept, onReject, loadingState }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { shipment } = offer;
  
  // Destructure loadingState for clarity
  const { isLoading, offerId, action } = loadingState;
  const isCurrentOfferLoading = isLoading && offerId === offer.id;

  const getBorderColor = () => {
    switch (offer.status) {
      case 'ACCEPTED': return 'border-l-4 border-green-500';
      case 'REJECTED': return 'border-l-4 border-red-500';
      default: return 'border-l-4 border-slate-200';
    }
  };

  return (
    <motion.div
      layout
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
      className={`bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:shadow-lg ${getBorderColor()}`}
    >
      <div className="p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={offer.status} />
              <p className="text-sm text-slate-500">
                Shipment ID: <span className="font-semibold text-slate-700">SHID{offer.shipmentId}</span>
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{offer.offerPrice.toLocaleString('en-IN')}
            </p>
            <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm text-slate-600 mt-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                <span>Pickup: <strong>{formatDate(offer.expectedPickupDate)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-blue-500" />
                <span>Delivery: <strong>{formatDate(offer.expectedDeliveryDate)}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {offer.status === "PENDING" && (
              <>
                <Button
                  onClick={(e) => { e.stopPropagation(); onReject(offer.id); }}
                  disabled={isCurrentOfferLoading}
                  variant="outline"
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 disabled:opacity-50"
                >
                  {isCurrentOfferLoading && action === 'reject' ? (
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                  ) : (
                    <X size={16} className="mr-1.5" />
                  )}
                  Reject
                </Button>
                <Button
                  onClick={(e) => { e.stopPropagation(); onAccept(offer.id); }}
                  disabled={isCurrentOfferLoading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCurrentOfferLoading && action === 'accept' ? (
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                  ) : (
                    <Check size={16} className="mr-1.5" />
                  )}
                  Accept
                </Button>
              </>
            )}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown size={20} className="text-slate-400" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            {shipment ? (
              <div className="border-t border-slate-200 p-5 space-y-6 bg-slate-50">
                <DetailSection title="Route">
                  <DetailItem icon={<MapPin size={14} />} label="Pickup Address" value={`${shipment.pickupAddressLine1}, ${shipment.pickupState} - ${shipment.pickupPincode}`} />
                  <DetailItem icon={<MapPin size={14} />} label="Drop Address" value={`${shipment.dropAddressLine1}, ${shipment.dropState} - ${shipment.dropPincode}`} />
                </DetailSection>
                <DetailSection title="Cargo & Dimensions">
                  <DetailItem icon={<Package size={14} />} label="Material" value={shipment.materialType === "Others" ? shipment.customMaterialType : shipment.materialType} />
                  <DetailItem icon={<Scale size={14} />} label="Weight" value={`${shipment.weightKg} kg`} />
                  <DetailItem icon={<Ruler size={14} />} label="Dimensions" value={`${shipment.lengthFt} x ${shipment.widthFt} x ${shipment.heightFt} ft`} />
                </DetailSection>
                <DetailSection title="Logistics & Value">
                    <DetailItem icon={<Truck size={14} />} label="Vehicle" value={`${shipment.truckSize} (${shipment.bodyType})`} />
                    {shipment.bodyType === 'Closed' && <DetailItem icon={<Calendar size={14} />} label="Cooling Type" value={shipment.coolingType} />}
                    <DetailItem icon={<Users size={14} />} label="Manpower" value={`${shipment.manpower === 'yes' ? `Required (${shipment.noOfLabours} labours)` : 'Not Required'}`} />
                    <DetailItem icon={<Airplay size={14} />} label="Transport Mode" value={shipment.transportMode} />
                    <DetailItem icon={<DollarSign size={14} />} label="Material Value" value={`₹${shipment.materialValue?.toLocaleString('en-IN')}`} />
                    <DetailItem icon={<FileText size={14} />} label="Additional Notes" value={shipment.additionalNotes} />
                </DetailSection>
              </div>
            ) : (
              <div className="border-t border-slate-200 p-5 text-center text-sm text-slate-500">
                Shipment details not available.
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- OffersPage Main Component ---
export const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✨ Refined loading state to track offerId and action type
  const [loadingState, setLoadingState] = useState({ isLoading: false, offerId: null, action: null });

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }
      const config = { headers: { authorization: `Bearer ${token}` } };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/offer/shipper`, config);
      const fetchedOffers = response.data.offers || [];
      
      // Sort offers: PENDING first, then by creation date
      fetchedOffers.sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
          if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOffers(fetchedOffers);
      setFilteredOffers(fetchedOffers);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setError("Could not load offers. Please try again later.");
      toast.error("Failed to fetch offers.");
    } finally {
      setLoading(false);
      setLoadingState({ isLoading: false, offerId: null, action: null });
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Filter logic for OfferFilter
  const handleFilterChange = (filters) => {
    let filtered = [...offers];

    // Status filter
    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(offer => offer.status === filters.status);
    }

    // Material type filter
    if (filters.materialType && filters.materialType !== 'All') {
      filtered = filtered.filter(offer =>
        offer.materialType === filters.materialType ||
        (offer.shipment && offer.shipment.materialType === filters.materialType)
      );
    }

    // Route filter
    if (filters.route) {
      filtered = filtered.filter(offer =>
        `${offer.pickupAddressLine2 || ''} to ${offer.dropAddressLine2 || ''}`.toLowerCase().includes(filters.route.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter(offer => {
        const offerDate = new Date(offer.created_at || offer.createdAt);
        switch (filters.dateRange) {
          case 'today':
            return offerDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return offerDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return offerDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOffers(filtered);
  };

  // Search logic for OfferFilter
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredOffers(offers);
      return;
    }

    const filtered = offers.filter(offer => {
      const shipmentIdWithPrefix = `SHID${offer.shipmentId}`;
      const searchLower = searchTerm.toLowerCase();
      return (
        shipmentIdWithPrefix.toLowerCase().includes(searchLower) ||
        (offer.shipmentId && offer.shipmentId.toString().toLowerCase().includes(searchLower)) ||
        (offer.pickupAddressLine2 && offer.pickupAddressLine2.toLowerCase().includes(searchLower)) ||
        (offer.dropAddressLine2 && offer.dropAddressLine2.toLowerCase().includes(searchLower))
      );
    });

    setFilteredOffers(filtered);
  };

  // Generic handler for responding to an offer
  const handleOfferResponse = async (offerId, action) => {
    setLoadingState({ isLoading: true, offerId, action });
    const toastId = toast.loading(`${action === 'accept' ? 'Accepting' : 'Rejecting'} offer...`);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { authorization: `Bearer ${token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/offer/respond`, { offerId, action }, config);
      
      toast.success(`Offer successfully ${action === 'accept' ? 'accepted' : 'rejected'}!`, { id: toastId });
      await fetchOffers(); // Refresh the list
    } catch (err) {
      console.error(`Failed to ${action} offer:`, err);
      toast.error(`Failed to ${action} offer. Please try again.`, { id: toastId });
      setLoadingState({ isLoading: false, offerId: null, action: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <LoaderOne />
          <span className="text-lg font-medium text-gray-600">Loading offers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OfferFilter onFilterChange={handleFilterChange} onSearch={handleSearch} />

      {filteredOffers.length > 0 ? (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onAccept={() => handleOfferResponse(offer.id, 'accept')}
                onReject={() => handleOfferResponse(offer.id, 'reject')}
                loadingState={loadingState}
              />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <Info size={40} className="mx-auto text-slate-400 mb-4" />
          <p className="font-semibold text-slate-800">
            {offers.length === 0 ? "No New Offers" : "No offers match your search criteria"}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            {offers.length === 0
              ? "You currently have no pending offers from carriers."
              : "Try adjusting your filters or search terms."}
          </p>
        </div>
      )}
    </div>
  );
};




const OfferRequests = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    dateRange: '',
    materialType: 'All',
    route: '',
    search: '',
  });


  // Filtering logic
  useEffect(() => {
    let result = [...offers];

    // Search by Shipment ID (with or without SHID prefix)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(offer => {
        const shipmentIdWithPrefix = `SHID${offer.shipmentId}`;
        return (
          shipmentIdWithPrefix.toLowerCase().includes(searchLower) ||
          offer.shipmentId?.toString().toLowerCase().includes(searchLower) ||
          offer.pickupAddressLine2?.toLowerCase().includes(searchLower) ||
          offer.dropAddressLine2?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      result = result.filter(offer => offer.status === filters.status);
    }

    // Material type filter
    if (filters.materialType && filters.materialType !== 'All') {
      result = result.filter(offer => offer.materialType === filters.materialType);
    }

    // Route filter
    if (filters.route) {
      result = result.filter(offer =>
        `${offer.pickupAddressLine2} to ${offer.dropAddressLine2}`.toLowerCase().includes(filters.route.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      result = result.filter(offer => {
        const offerDate = new Date(offer.created_at || offer.createdAt);
        switch (filters.dateRange) {
          case 'today':
            return offerDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return offerDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return offerDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOffers(result);
  }, [offers, filters]);

  // Handlers for OfferFilter
  const handleSearch = (search) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFilterChange = (changed) => {
    setFilters(prev => ({ ...prev, ...changed }));
  };

  return (
    <div>
      <OfferFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
      {/* Render filteredOffers here */}
      {filteredOffers.map(offer => (
        <div key={offer.id}>{/* Offer card or row */}</div>
      ))}
    </div>
  );
};

export default OfferRequests;