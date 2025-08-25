// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Edit, ChevronDown, MapPin, Calendar, Ruler, DollarSign, Package, Truck, Scale, Users, FileText, Download, Airplay } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ModificationRequest } from './ModificationRequest';
// import axios from 'axios'
// const StatusBadge = ({ status }) => {
//     const styles = {
//         Approved: 'bg-green-500/10 text-green-600',
//         Pending: 'bg-yellow-500/10 text-yellow-600',
//         REQUESTED: 'bg-interactive/10 text-interactive',
//         OFFER_SENT: 'bg-purple-500/10 text-purple-600',
//     };
//     return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles[status] || 'bg-black/10 text-text'}`}>{status.replace('_', ' ')}</span>;
// };

// const DetailItem = ({ icon, label, value }) => (
//     <div>
//         <div className="flex items-center gap-2 text-sm text-text/60 mb-1">
//             {icon}
//             <span>{label}</span>
//         </div>
//         <p className="font-semibold text-headings">{value || '-'}</p>
//     </div>
// );

// const DetailSection = ({ title, children }) => (
//     <div>
//         <h4 className="text-xs font-bold text-text/50 uppercase tracking-wider mb-3">{title}</h4>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
//             {children}
//         </div>
//     </div>
// );

// // --- Main Card Component ---

// const ShipmentCard = ({ req }) => {
//     const [expanded, setExpanded] = useState(false);
//     const [modifying, setModifying] = useState(false);
//     const [formData, setFormData] = useState({ ...req });

//     // Destructure all the new fields from the req prop for cleaner access
//     const { id,
//         status, pickupAddressLine2, dropAddressLine2, pickupState, dropState,
//         materialType, expectedPickupDate, expectedDeliveryDate, pickupAddressLine1,
//         pickupPincode, dropAddressLine1, dropPincode, weightKg, lengthFt, customMaterialType,
//         widthFt, heightFt, bodyType, truckSize, manpower,
//         noOfLabours, materialValue, additionalNotes, ebayBillUrl, transportMode, coolingType
//     } = formData;

//     return (
//         <motion.div layout className="bg-white border border-black/10 shadow-sm rounded-xl">
//             <motion.div layout className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 cursor-pointer p-4" onClick={() => setExpanded(!expanded)}>
//                 <div>
//                     <h2 className="text-base font-semibold text-headings">{pickupAddressLine2}, {pickupState} → {dropAddressLine2}, {dropState}</h2>
//                     <p className="text-xs text-text/70">{`SHID${id} • ${materialType === 'custom' ? customMaterialType : materialType} • Pickup: ${expectedPickupDate}`}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <StatusBadge status={status} />
//                     <motion.div animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown className="w-5 h-5 text-text/50" /></motion.div>
//                 </div>
//             </motion.div>

//             <AnimatePresence>
//                 {expanded && (
//                     <motion.div
//                         layout
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="overflow-hidden"
//                     >
//                         <div className="border-t border-black/10 p-4 space-y-6">
//                             {/* IMPROVEMENT: Expanded view is organized into clear sections */}
//                             <DetailSection title="Route">
//                                 <DetailItem icon={<MapPin size={14} />} label="Pickup Address" value={`${pickupAddressLine1}, ${pickupState} - ${pickupPincode}`} />
//                                 <DetailItem icon={<MapPin size={14} />} label="Drop Address" value={`${dropAddressLine1}, ${dropState} - ${dropPincode}`} />
//                             </DetailSection>

//                             <DetailSection title="Cargo & Dimensions">
//                                 <DetailItem icon={<Package size={14} />} label="Material" value={materialType === "Others" ? customMaterialType : materialType} />
//                                 <DetailItem icon={<Scale size={14} />} label="Weight" value={`${weightKg} kg`} />
//                                 <DetailItem icon={<Ruler size={14} />} label="Dimensions" value={`${lengthFt} x ${widthFt} x ${heightFt} ft`} />
//                             </DetailSection>

//                             <DetailSection title="Logistics & Value">
//                                 <DetailItem icon={<Truck size={14} />} label="Vehicle" value={`${truckSize} (${bodyType})`} />
//                                 {bodyType === 'Closed' && (
//                                     <DetailItem icon={<Calendar size={14} />} label="Cooling Type" value={coolingType} />
//                                 )}
//                                 <DetailItem icon={<Users size={14} />} label="Manpower" value={`${manpower === 'yes' ? 'Required' : 'Not Required'}${manpower === 'yes' ? ` (${noOfLabours} labours)` : ''}`} />
//                                 <DetailItem icon={<Airplay size={14} />} label="Transport Mode" value={transportMode} />
//                                 <DetailItem icon={<Calendar size={14} />} label="Expected Pickup" value={expectedPickupDate} />
//                                 <DetailItem icon={<Calendar size={14} />} label="Expected Delivery" value={expectedDeliveryDate} />
//                                 <DetailItem icon={<FileText size={14} />} label="Additional Notes" value={additionalNotes} />
//                                 <DetailItem icon={<DollarSign size={14} />} label="Material Value" value={`₹${materialValue?.toLocaleString('en-IN')}`} />
//                             </DetailSection>

//                             {ebayBillUrl && (
//                                 <DetailSection title="Documents">
//                                     <a href={ebayBillUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-interactive font-semibold text-sm hover:underline">
//                                         <Download size={14} />
//                                         View Attached Bill
//                                     </a>
//                                 </DetailSection>
//                             )}
//                             {(status == 'REQUESTED') && (
//                                 <div className="pt-4 flex justify-end gap-2">
//                                     <Button variant="outline" size="sm"  className={"bg-red-500 "}  >
//                                         <Edit size={14} className="mr-2" /> REJECT
//                                     </Button>
//                                     <Button variant="outline" size="sm" className={"bg-green-500 "}>
//                                         <Edit size={14} className="mr-2" /> OFFER PRICE
//                                     </Button>
//                                 </div>
//                             )}
//                             {/* The modification form will appear here when active */}
//                             <AnimatePresence>
//                                 {modifying && (
//                                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
//                                         <ModificationRequest
//                                             req={formData}
//                                             setModifying={setModifying}
//                                             modifying={modifying}
//                                         />
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </motion.div>
//     );
// };


// // --- Main Page Component ---
// export const AdminRequestsRequests = () => {
//     const [formData, setFormData] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         async function fetchData() {
//             setLoading(true);
//             try {
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_API_URL}/api/shipment/get-all-for-admin`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`
//                         }
//                     }
//                 );
//                 setFormData(response.data.shipments);
//             } catch (error) {
//                 console.error("Error fetching shipment data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchData();
//     }, []);
//     if (loading) return (<>Loading...</>)
//     return (
//         <div className="space-y-4">
//             {formData && formData.length > 0 ? (
//                 formData.map((req) => (
//                     <ShipmentCard key={req.id} req={req} />
//                 ))
//             ) : (
//                 <div className="text-center py-12 text-text/70 bg-background rounded-lg border border-black/5">
//                     <p>No shipment requests found.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, ChevronDown, MapPin, Calendar, Ruler, DollarSign, Package, Truck, Scale, Users, FileText, Download, Airplay, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoaderOne } from '@/components/ui/loader';
import { ModificationRequest } from './ModificationRequest';
import axios from 'axios';

// --- HELPER COMPONENTS (No Changes Here) ---

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: 'bg-green-500/10 text-green-600',
        Pending: 'bg-yellow-500/10 text-yellow-600',
        REQUESTED: 'bg-blue-500/10 text-blue-600',
        OFFER_SENT: 'bg-purple-500/10 text-purple-600',
        REJECTED: 'bg-red-500/10 text-red-600', // Added for Rejected status
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles[status] || 'bg-black/10 text-text'}`}>{status.replace('_', ' ')}</span>;
};

const DetailItem = ({ icon, label, value }) => (
    <div>
        <div className="flex items-center gap-2 text-sm text-text/60 mb-1">
            {icon}
            <span>{label}</span>
        </div>
        <p className="font-semibold text-headings">{value || '-'}</p>
    </div>
);

const DetailSection = ({ title, children }) => (
    <div>
        <h4 className="text-xs font-bold text-text/50 uppercase tracking-wider mb-3">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
            {children}
        </div>
    </div>
);


// --- MODIFIED MODAL COMPONENT ---

const OfferModal = ({ req, onClose, onSuccess }) => {
    const [offerData, setOfferData] = useState({
        offerPrice: '',
        expectedPickupDate: req.expectedPickupDate,
        expectedDeliveryDate: req.expectedDeliveryDate,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOfferData(prev => ({ ...prev, [name]: value }));
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        if (!offerData.offerPrice) {
            setError('Offer price is required.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                shipmentId: req.id,
                offerPrice: Number(offerData.offerPrice),
                expectedPickupDate: offerData.expectedPickupDate,
                expectedDeliveryDate: offerData.expectedDeliveryDate,
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/offer/shipment`,
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            // Call the success callback passed from the parent
            onSuccess({ newStatus: 'OFFER_SENT', offerPrice: payload.offerPrice });

        } catch (err) {
            console.error("Failed to submit offer:", err);
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-headings">Make an Offer</h3>
                    <p className="text-sm text-text/70">For Shipment ID: SHID{req.id}</p>
                </div>
                <form onSubmit={handleOfferSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Offer Price (₹)</label>
                            <input
                                type="number"
                                name="offerPrice"
                                value={offerData.offerPrice}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-black/20 rounded-md focus:ring-interactive focus:border-interactive"
                                placeholder="e.g., 50000"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Confirm Pickup Date</label>
                            <input
                                type="date"
                                name="expectedPickupDate"
                                value={offerData.expectedPickupDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-black/20 rounded-md focus:ring-interactive focus:border-interactive"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Confirm Delivery Date</label>
                            <input
                                type="date"
                                name="expectedDeliveryDate"
                                value={offerData.expectedDeliveryDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-black/20 rounded-md focus:ring-interactive focus:border-interactive"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="flex justify-end gap-3 bg-gray-50 p-4 rounded-b-lg">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Submit Offer
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// --- MODIFIED Main Card Component ---

const ShipmentCard = ({ req }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOffering, setIsOffering] = useState(false);
    // Use a single state to hold all shipment data, making it easy to update
    const [shipmentData, setShipmentData] = useState({ ...req });
    console.log(shipmentData)

    // Destructure for easier access in JSX
    const { id, shipper, cost, status, pickupAddressLine2, dropAddressLine2, pickupState, dropState, materialType, expectedPickupDate, expectedDeliveryDate, pickupAddressLine1, pickupPincode, dropAddressLine1, dropPincode, weightKg, lengthFt, customMaterialType, widthFt, heightFt, bodyType, truckSize, manpower, noOfLabours, materialValue, additionalNotes, ebayBillUrl, transportMode, coolingType, offerPrice } = shipmentData;

    // This function will be called by the modal on a successful submission
    const handleOfferSuccess = ({ newStatus, offerPrice }) => {
        setShipmentData(prev => ({
            ...prev,
            status: newStatus,
            offerPrice: offerPrice,
        }));
        setIsOffering(false); // Close the modal
    };

    const handleReject = async () => {
        if (!window.confirm("Are you sure you want to reject this shipment request?")) return;

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shipment/reject`,
                { shipmentId: id },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            // Update UI instantly on success
            setShipmentData(prev => ({ ...prev, status: 'REJECTED' }));
        } catch (error) {
            console.error("Failed to reject shipment:", error);
            alert("Could not reject the shipment. Please try again.");
        }
    };


    return (
        <>
            <motion.div layout className="bg-white border border-black/10 shadow-sm rounded-xl">
                <motion.div layout className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 cursor-pointer p-4" onClick={() => setExpanded(!expanded)}>
                    <div>
                        <h2 className="text-base font-semibold text-headings">{pickupAddressLine2}, {pickupState} → {dropAddressLine2}, {dropState}</h2>
                        <p className="text-xs text-text/70">{`SHID${id} • ${materialType === 'custom' ? customMaterialType : materialType} • Pickup: ${expectedPickupDate}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        <motion.div animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown className="w-5 h-5 text-text/50" /></motion.div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="border-t border-black/10 p-4 space-y-6">
                                <DetailSection title="Route">
                                    <DetailItem icon={<MapPin size={14} />} label="Pickup Address" value={`${pickupAddressLine1}, ${pickupState} - ${pickupPincode}`} />
                                    <DetailItem icon={<MapPin size={14} />} label="Drop Address" value={`${dropAddressLine1}, ${dropState} - ${dropPincode}`} />
                                </DetailSection>

                                <DetailSection title="Cargo & Dimensions">
                                    <DetailItem icon={<Package size={14} />} label="Material" value={materialType === "Others" ? customMaterialType : materialType} />
                                    <DetailItem icon={<Scale size={14} />} label="Weight" value={`${weightKg} kg`} />
                                    <DetailItem icon={<Ruler size={14} />} label="Dimensions" value={`${lengthFt} x ${widthFt} x ${heightFt} ft`} />
                                </DetailSection>

                                <DetailSection title="Logistics & Value">
                                    <DetailItem icon={<Truck size={14} />} label="Vehicle" value={`${truckSize} (${bodyType})`} />
                                    {bodyType === 'Closed' && (
                                        <DetailItem icon={<Calendar size={14} />} label="Cooling Type" value={coolingType} />
                                    )}
                                    <DetailItem icon={<Users size={14} />} label="Manpower" value={`${manpower === 'yes' ? 'Required' : 'Not Required'}${manpower === 'yes' ? ` (${noOfLabours} labours)` : ''}`} />
                                    <DetailItem icon={<Airplay size={14} />} label="Transport Mode" value={transportMode} />
                                    <DetailItem icon={<Calendar size={14} />} label="Expected Pickup" value={expectedPickupDate} />
                                    <DetailItem icon={<Calendar size={14} />} label="Expected Delivery" value={expectedDeliveryDate} />
                                    <DetailItem icon={<FileText size={14} />} label="Additional Notes" value={additionalNotes} />
                                    <DetailItem icon={<DollarSign size={14} />} label="Material Value" value={`₹${materialValue?.toLocaleString('en-IN')}`} />
                                    {cost && <DetailItem icon={<DollarSign size={14} />} label="Total Cost" value={`₹${cost.toLocaleString('en-IN')}`} />}

                                </DetailSection>

                                <DetailSection title="Shipper Profile">
                                    <DetailItem icon={<User size={14} />} label="Owner Name" value={shipper.ownerName} />
                                    <DetailItem icon={<User size={14} />} label="Contact Number" value={shipper.ownerContactNumber} />
                                    <DetailItem icon={<User size={14} />} label="Email" value={shipper.email} />
                                    <DetailItem icon={<User size={14} />} label="Company Address" value={shipper.companyAddress} />
                                    <DetailItem icon={<User size={14} />} label="Company Name" value={shipper.companyName} />
                                </DetailSection>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Render the Offer Modal */}
            <AnimatePresence>
                {isOffering && <OfferModal req={shipmentData} onClose={() => setIsOffering(false)} onSuccess={handleOfferSuccess} />}
            </AnimatePresence>
        </>
    );
};


// --- Main Page Component (No Changes Here) ---
export const AdminConfirmedRequests = () => {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/shipment/get-all-for-admin`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                // Filter to only show 'CONFIRMED' shipments initially
                const requestedShipments = response.data.shipments.filter(s => s.status === 'CONFIRMED');
                setFormData(requestedShipments);
            } catch (error) {
                console.error("Error fetching shipment data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <LoaderOne />
                <span className="text-lg font-medium text-gray-600">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {formData && formData.length > 0 ? (
                formData.map((req) => (
                    <ShipmentCard key={req.id} req={req} />
                ))
            ) : (
                <div className="text-center py-12 text-text/70 bg-background rounded-lg border border-black/5">
                    <p>No new shipment requests found.</p>
                </div>
            )}
        </div>
    );
};