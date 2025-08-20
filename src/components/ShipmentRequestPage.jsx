import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, ChevronDown, MapPin, Calendar,Ruler,DollarSign , Package, Truck, Scale, Users, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {ModificationRequest} from './ModificationRequest';

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: 'bg-green-500/10 text-green-600',
        Pending: 'bg-yellow-500/10 text-yellow-600',
        REQUESTED: 'bg-interactive/10 text-interactive',
        OFFER_SENT: 'bg-purple-500/10 text-purple-600',
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

// --- Main Card Component ---

const ShipmentCard = ({ req }) => {
    const [expanded, setExpanded] = useState(false);
    const [modifying, setModifying] = useState(false);
    const [formData, setFormData] = useState({ ...req });

    // Destructure all the new fields from the req prop for cleaner access
    const {
        status, pickupAddressLine2, dropAddressLine2, pickupState, dropState,
        materialType, expectedPickupDate, expectedDeliveryDate, pickupAddressLine1,
        pickupPincode, dropAddressLine1, dropPincode, weightKg, lengthFt, customMaterialType,
        widthFt, heightFt, bodyType, truckSize, manpower,
        noOfLabours, materialValue, additionalNotes, ebayBillUrl
    } = formData;

    return (
          
        <motion.div layout className="bg-white border border-black/10 shadow-sm rounded-xl">
            <motion.div layout className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 cursor-pointer p-4" onClick={() => setExpanded(!expanded)}>
                <div>
                    <h2 className="text-base font-semibold text-headings">{pickupAddressLine2}, {pickupState} → {dropAddressLine2}, {dropState}</h2>
                    <p className="text-xs text-text/70">{materialType} • Pickup: {expectedPickupDate}</p>
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
                            {/* IMPROVEMENT: Expanded view is organized into clear sections */}
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
                                <DetailItem icon={<Users size={14} />} label="Manpower" value={`${manpower === 'yes' ? 'Required' : 'Not Required'}${manpower === 'yes' ? ` (${noOfLabours} labours)` : ''}`} />
                                <DetailItem icon={<FileText size={14} />} label="Additional Notes" value={additionalNotes} />
                                <DetailItem icon={<DollarSign size={14} />} label="Material Value" value={`₹${materialValue?.toLocaleString('en-IN')}`} />
                            </DetailSection>

                            {ebayBillUrl && (
                                <DetailSection title="Documents">
                                    <a href={ebayBillUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-interactive font-semibold text-sm hover:underline">
                                        <Download size={14} />
                                        View Attached Bill
                                    </a>
                                </DetailSection>
                            )}
                            {(status== 'REQUESTED' || status == 'OFFER_SENT') && (
                                <div className="pt-4 flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => setModifying(!modifying)}>
                                        <Edit size={14} className="mr-2" />
                                        {modifying ? "Cancel Modification" : "Modify Request"}
                                    </Button>
                                </div>
                            )}
                            {/* The modification form will appear here when active */}
                            <AnimatePresence>
                                {modifying && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                        <ModificationRequest 
                                            req={formData}
                                            setModifying={setModifying}
                                            modifying={modifying}
                                        />
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


// --- Main Page Component ---
export const ShipmentRequestsPage = ({ requests }) => (
    <div className="space-y-4">
        {requests && requests.length > 0 ? (
            requests.map((req) => (
                <ShipmentCard key={req.id} req={req} />
            ))
        ) : (
            <div className="text-center py-12 text-text/70 bg-background rounded-lg border border-black/5">
                <p>No shipment requests found.</p>
            </div>
        )}
    </div>
);