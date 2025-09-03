import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, ChevronDown, MapPin, Calendar, Scale, DollarSign, Package, Truck, Ruler, Users, FileText, Download, Thermometer, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoaderOne from "@/components/ui/LoadingScreen";
import { ModificationRequest } from './ModificationRequest'; // This component is used but not defined here
import axios from 'axios';


const StatusBadge = ({ status }) => {
    const statusConfig = {
        CONFIRMED: { label: 'Confirmed', styles: 'bg-green-100 text-green-700 border-green-200' },
        PENDING: { label: 'Pending', styles: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        REQUESTED: { label: 'Requested', styles: 'bg-blue-100 text-blue-700 border-blue-200' },
        OFFER_SENT: { label: 'Offer Sent', styles: 'bg-purple-100 text-purple-700 border-purple-200' },
        DEFAULT: { label: status.replace('_', ' '), styles: 'bg-slate-100 text-slate-700 border-slate-200' }
    };
    const config = statusConfig[status] || statusConfig.DEFAULT;
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${config.styles}`}>
            <div className={`w-2 h-2 rounded-full ${config.styles.replace('text', 'bg').replace('-100', '-400')}`}></div>
            <span>{config.label}</span>
        </div>
    );
};

// --- [FIX] Corrected DetailItem to render icon directly ---
const DetailItem = ({ icon, label, value, className = '' }) => (
    <div className={className}>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            {icon}
            <span>{label}</span>
        </div>
        <p className="font-semibold text-slate-800 break-words">{value || '—'}</p>
    </div>
);

const DetailSection = ({ title, children }) => (
    <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-4 pb-2 border-b border-slate-200">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {children}
        </div>
    </div>
);



const ShipmentCard = ({ req }) => {
    const [expanded, setExpanded] = useState(false);
    const [modifying, setModifying] = useState(false);
    
    const {
        id, cost, status, pickupAddressLine2, dropAddressLine2, materialType, customMaterialType,
        expectedPickupDate, expectedDeliveryDate, pickupAddressLine1, pickupState, pickupPincode,
        dropAddressLine1, dropState, dropPincode, weightKg, lengthFt, widthFt, heightFt,
        bodyType, truckSize, manpower, noOfLabours, materialValue, additionalNotes, transportMode,
        coolingType, ebayBillUrl
    } = req;

    return (
        <motion.div layout className="bg-white border border-slate-200 shadow-sm rounded-xl transition-shadow duration-300 hover:shadow-md">
            {/* --- Card Header (Collapsed View) --- */}
            <motion.div layout className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="font-bold text-lg text-slate-800 tracking-tight">SHID{id}</span>
                           <StatusBadge status={status} />
                        </div>
                        <h3 className="text-md font-semibold text-slate-700">{pickupAddressLine2} → {dropAddressLine2}</h3>
                        <p className="text-sm text-slate-500">{materialType === 'Others' ? customMaterialType : materialType}</p>
                    </div>
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-slate-400 p-2">
                        <ChevronDown size={20} />
                    </motion.div>
                </div>

                {/* --- Key Details (Visible when collapsed) --- */}
                <div className="border-t border-slate-200 mt-4 pt-3 flex items-center gap-x-6 gap-y-2 text-sm flex-wrap">
                    <div className="flex items-center gap-2 text-slate-600"><Calendar size={15} className="text-slate-400"/> Pickup: <span className="font-medium text-slate-800">{expectedPickupDate}</span></div>
                    <div className="flex items-center gap-2 text-slate-600"><Scale size={15} className="text-slate-400"/> Weight: <span className="font-medium text-slate-800">{weightKg} kg</span></div>
                    {cost && <div className="flex items-center gap-2 text-slate-600"><DollarSign size={15} className="text-slate-400"/> Cost: <span className="font-medium text-slate-800">₹{cost.toLocaleString('en-IN')}</span></div>}
                </div>
            </motion.div>

            {/* --- Expanded View --- */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-200 p-6 space-y-8 bg-slate-50/70">
                            {/* --- [FIX] Added size={14} to all icons --- */}
                            <DetailSection title="Route Details">
                                <DetailItem icon={<MapPin size={14}/>} label="Pickup Address" value={`${pickupAddressLine1}, ${pickupState} - ${pickupPincode}`} />
                                <DetailItem icon={<MapPin size={14}/>} label="Drop Address" value={`${dropAddressLine1}, ${dropState} - ${dropPincode}`} />
                                <DetailItem icon={<Calendar size={14}/>} label="Expected Pickup Date" value={expectedPickupDate} />
                                <DetailItem icon={<Calendar size={14}/>} label="Expected Delivery Date" value={expectedDeliveryDate} />
                            </DetailSection>

                            <DetailSection title="Cargo Details">
                                <DetailItem icon={<Package size={14}/>} label="Material" value={materialType === "Others" ? customMaterialType : materialType} />
                                <DetailItem icon={<Scale size={14}/>} label="Weight" value={`${weightKg} kg`} />
                                <DetailItem icon={<Ruler size={14}/>} label="Dimensions (L×W×H)" value={`${lengthFt} × ${widthFt} × ${heightFt} ft`} />
                                <DetailItem icon={<DollarSign size={14}/>} label="Material Value" value={`₹${materialValue?.toLocaleString('en-IN')}`} />
                            </DetailSection>
                            
                            <DetailSection title="Logistics Details">
                                <DetailItem icon={<Truck size={14}/>} label="Vehicle" value={`${truckSize} ft (${bodyType})`} />
                                <DetailItem icon={<Truck size={14}/>} label="Transport Mode" value={transportMode} />
                                {bodyType === 'Closed' && <DetailItem icon={<Thermometer size={14}/>} label="Cooling Type" value={coolingType} />}
                                <DetailItem icon={<Users size={14}/>} label="Manpower" value={`${manpower === 'yes' ? `Required (${noOfLabours} labours)` : 'Not Required'}`} />
                            </DetailSection>

                            <DetailSection title="Additional Information">
                                <DetailItem icon={<FileText size={14}/>} label="Additional Notes" value={additionalNotes} className="sm:col-span-2" />
                                {cost && <DetailItem icon={<DollarSign size={14}/>} label="Total Cost" value={`₹${cost.toLocaleString('en-IN')}`} />}
                                {ebayBillUrl && (
                                    <div className="sm:col-span-2">
                                        <a href={ebayBillUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
                                            <Download size={14} /> View Attached E-Way Bill
                                        </a>
                                    </div>
                                )}
                            </DetailSection>

                            {(status === 'REQUESTED' || status === 'OFFER_SENT') && (
                                <div className="pt-4 flex justify-end border-t border-slate-200">
                                    <Button variant="outline" size="sm" onClick={() => setModifying(!modifying)}>
                                        <Edit size={14} className="mr-2" />
                                        {modifying ? "Cancel Modification" : "Modify Request"}
                                    </Button>
                                </div>
                            )}

                            <AnimatePresence>
                                {modifying && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="!mt-4">
                                        <ModificationRequest req={req} setModifying={setModifying} modifying={modifying} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};



const EmptyState = () => (
    <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-center items-center mx-auto w-16 h-16 bg-slate-100 rounded-full mb-4">
           <Inbox size={32} className="text-slate-500"/>
        </div>
        <h3 className="text-xl font-semibold text-slate-800">No Requests Yet</h3>
        <p className="mt-2 text-slate-500">When you create a new shipment request, it will appear here.</p>
    </div>
);

export const ShipmentRequestsPage = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/shipment/get-all-for-shipper`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setShipments(response.data.shipments || []);
            } catch (error) {
                console.error("Error fetching shipment data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center pt-20">
                <LoaderOne />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {shipments && shipments.length > 0 ? (
                shipments.map((req) => <ShipmentCard key={req.id} req={req} />)
            ) : (
                <EmptyState />
            )}
        </div>
    );
};