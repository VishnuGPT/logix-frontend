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
import { Loader2, Image as ImageIcon, Clock, ChevronDown, MapPin, Calendar, Ruler, DollarSign, Package, Truck, Scale, Users, FileText, Download, Airplay, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import LoaderOne from "@/components/ui/LoadingScreen";
import axios from 'axios';
import AdminPushStatusComponent from './AdminStatusPush';

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

const ShipmentStatus = ({ shipmentId }) => {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/progress/get-status`,
          { shipmentId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          setStatusUpdates(res.data.statusUpdates || []);
          console.log("Status updates fetched successfully:", res.data.statusUpdates);
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!statusUpdates.length) {
    return (
      <div className="text-center text-slate-500 p-10">
        No status updates available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {statusUpdates.map((update, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="rounded-2xl shadow-md border border-slate-200">
            <CardContent className="p-6">
              {/* Title + Description */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {update.title}
                  </h3>
                  <p className="text-slate-600 mt-1">{update.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  {new Date(update.date).toLocaleString()}
                </div>
              </div>

              {/* File Previews */}
              <div className="flex flex-col md:flex-row gap-6 mt-4">
                {/* Image Preview */}
                {update.imageUrl && (
                  <div className="flex flex-col items-start">
                    <img
                      src={update.imageUrl}
                      alt="Shipment proof"
                      className="rounded-md border w-40 h-40 object-cover shadow-sm"
                    />
                    <a
                      href={update.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" /> View Full Image
                      </Button>
                    </a>
                  </div>
                )}

                {/* PDF Preview */}
                {update.pdfUrl && (
                  <div className="flex flex-col items-start">
                    <iframe
                      src={update.pdfUrl}
                      className="w-40 h-40 border rounded-md shadow-sm"
                      title={`Shipment PDF ${idx}`}
                    />
                    <a
                      href={update.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" /> View Full PDF
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// --- MODIFIED Main Card Component ---

const ShipmentCard = ({ req }) => {
    const [expanded, setExpanded] = useState(false);
    // Use a single state to hold all shipment data, making it easy to update
    const [shipmentData, setShipmentData] = useState({ ...req });
    console.log(shipmentData)

    // Destructure for easier access in JSX
    const { id, shipper, cost, status, pickupAddressLine2, dropAddressLine2, pickupState, dropState, materialType, expectedPickupDate, expectedDeliveryDate, pickupAddressLine1, pickupPincode, dropAddressLine1, dropPincode, weightKg, lengthFt, customMaterialType, widthFt, heightFt, bodyType, truckSize, manpower, noOfLabours, materialValue, additionalNotes, ebayBillUrl, transportMode, coolingType, offerPrice } = shipmentData;



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
                            <div>
                                <ShipmentStatus shipmentId={id} />
                            </div>
                            <div>
                                <AdminPushStatusComponent shipmentId={id} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
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