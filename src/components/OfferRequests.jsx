import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, Calendar, Truck, Check, X, ChevronDown, MapPin,
    Package, Scale, Ruler, Users, FileText, Airplay, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button'; // ShadCN button

// --- Reusable Detail Section Component ---
const DetailSection = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-semibold text-text/60 mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-interactive mt-0.5">{icon}</div>
        <div>
            <p className="text-xs text-text/70">{label}</p>
            <p className="text-sm font-medium text-headings">{value || 'N/A'}</p>
        </div>
    </div>
);

// Helper: format dates for readability
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// --- Fixed OfferCard Component (merged into one) ---
const OfferCard = ({ offer, onAccept, onReject }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { shipment } = offer;

    const handleAcceptClick = async (e) => {
        e.stopPropagation();
        setIsSubmitting(true);
        await onAccept();
    };

    const handleRejectClick = async (e) => {
        e.stopPropagation();
        setIsSubmitting(true);
        await onReject();
    };

    return (
        <motion.div
            layout
            exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
            className="bg-white border border-black/5 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
        >
            {/* Card Header */}
            <div
                className="p-5 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="flex-grow">
                        <p className="text-sm text-text/60">Shipment ID: {`SHID${offer.shipmentId} | Status: ${offer.status} `}</p>
                        <p className="text-2xl font-bold text-interactive mt-1">
                            ₹{offer.offerPrice.toLocaleString('en-IN')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm text-text/80 mt-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-interactive" />
                                <span>Carrier Pickup: <strong>{formatDate(offer.expectedPickupDate)}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck size={16} className="text-interactive" />
                                <span>Carrier Delivery: <strong>{formatDate(offer.expectedDeliveryDate)}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                        {offer.status == "PENDING" && (
                            <>
                <Button 
              onClick={handleRejectClick}
              disabled={isSubmitting}
              variant="outline" 
              size="sm" 
              className="bg-red-500/10 text-red-600 hover:bg-red-500/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <X size={16} className="mr-1.5" />}
              Reject
            </Button>
            <Button 
              onClick={handleAcceptClick}
              disabled={isSubmitting}
              size="sm"
              className="disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <Check size={16} className="mr-1.5" />}
              Accept
            </Button></>

                        )}

                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                            <ChevronDown size={20} className="text-text/50" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Expandable Shipment Details */}
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
                            <div className="border-t border-black/10 p-5 space-y-6 bg-black/5">
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
                                    {shipment.bodyType === 'Closed' && (<DetailItem icon={<Calendar size={14} />} label="Cooling Type" value={shipment.coolingType} />)}
                                    <DetailItem icon={<Users size={14} />} label="Manpower" value={`${shipment.manpower === 'yes' ? 'Required' : 'Not Required'}${shipment.manpower === 'yes' ? ` (${shipment.noOfLabours} labours)` : ''}`} />
                                    <DetailItem icon={<Airplay size={14} />} label="Transport Mode" value={shipment.transportMode} />
                                    <DetailItem icon={<DollarSign size={14} />} label="Material Value" value={`₹${shipment.materialValue?.toLocaleString('en-IN')}`} />
                                    <DetailItem icon={<FileText size={14} />} label="Additional Notes" value={shipment.additionalNotes} />
                                </DetailSection>
                            </div>
                        ) : (
                            <div className="border-t border-black/10 p-5 text-center text-sm text-text/60">
                                Shipment details not available.
                            </div>
                        )}
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- OffersPage Component ---
export const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication token not found.");
                    return;
                }
                const config = { headers: { authorization: `Bearer ${token}` } };
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/offer/shipper`,
                    config
                );
                setOffers(response.data.offers || []);
            } catch (err) {
                console.error("Failed to fetch offers:", err);
                setError("Could not load offers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const handleAcceptOffer = async (offerId) => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { authorization: `Bearer ${token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/offer/respond`, { offerId, action: 'accept' }, config);
            setOffers(currentOffers => currentOffers.filter(offer => offer.id !== offerId));
        } catch (err) {
            console.error("Failed to accept offer:", err);
            alert("Failed to accept offer. Please try again.");
        }
    };

    const handleRejectOffer = async (offerId) => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { authorization: `Bearer ${token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/offer/respond`, { offerId, action: 'reject' }, config);
            setOffers(currentOffers => currentOffers.filter(offer => offer.id !== offerId));
        } catch (err) {
            console.error("Failed to reject offer:", err);
            alert("Failed to reject offer. Please try again.");
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading offers...</div>;
    }
    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div>
            {offers.length > 0 ? (
                <AnimatePresence>
                    <div className="space-y-4">
                        {offers.map((offer) => (
                            <OfferCard
                                key={offer.id}
                                offer={offer}
                                onAccept={() => handleAcceptOffer(offer.id)}
                                onReject={() => handleRejectOffer(offer.id)}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            ) : (
                <div className="text-center p-8 border-2 border-dashed border-black/10 rounded-lg">
                    <p className="font-semibold text-headings">No New Offers</p>
                    <p className="text-text/60 text-sm mt-1">You currently have no pending offers from carriers.</p>
                </div>
            )}
        </div>
    );
};
