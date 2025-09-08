import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, ChevronDown, MapPin, Calendar, Scale, DollarSign, Package, Truck, Ruler, Users, Download, Thermometer, Inbox, Ship, Eye } from 'lucide-react';
import { Loader2, Image as ImageIcon, FileText, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex justify-center items-center p-10 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl min-h-[200px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-75"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 font-medium">Loading shipment status...</p>
            <p className="text-slate-400 text-sm mt-1">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!statusUpdates.length) {
    return (
      <div className="text-center text-slate-400 p-12 italic bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl min-h-[200px] flex items-center justify-center">
        <div className="space-y-3">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-600 not-italic">No Updates Yet</h3>
            <p className="text-slate-400">Status updates will appear here once available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-8 mt-8 bg-gradient-to-br from-slate-50/50 to-blue-50/50 rounded-2xl p-6">
      {/* Timeline vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-blue-200 to-blue-100 rounded-full" />
      {statusUpdates.map((update, idx) => (
        <div key={idx} className="relative mb-12 group">
          {/* Timeline dot */}
          <div className="absolute -left-3 top-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-xl border-4 border-white z-10 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600">
            <Clock className="h-3 w-3 text-white" />
          </div>
          <div className="ml-8 bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:bg-white/95 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                  {update.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{update.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(update.date).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              {/* Image Preview */}
              {update.imageUrl && (
                <div className="flex flex-col items-start space-y-3">
                  <div className="relative group/img overflow-hidden rounded-xl">
                    <img
                      src={update.imageUrl}
                      alt="Shipment proof"
                      className="rounded-xl border-2 border-slate-200 w-40 h-40 object-cover shadow-md transition-all duration-300 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors duration-300" />
                  </div>
                  <a
                    href={update.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2"
                  >
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-all duration-200 hover:shadow-md">
                      <ImageIcon className="h-4 w-4" /> View Full Image
                    </button>
                  </a>
                </div>
              )}
              {/* PDF Preview */}
              {update.pdfUrl && (
                <div className="flex flex-col items-start space-y-3">
                  <div className="relative overflow-hidden rounded-xl">
                    <iframe
                      src={update.pdfUrl}
                      className="w-40 h-40 border-2 border-slate-200 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
                      title={`Shipment PDF ${idx}`}
                    />
                  </div>
                  <a
                    href={update.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2"
                  >
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl border border-red-200 transition-all duration-200 hover:shadow-md">
                      <FileText className="h-4 w-4" /> View Full PDF
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShipmentCard = ({ req, onViewStatus }) => {
    const [expanded, setExpanded] = useState(false);
    const [modifying, setModifying] = useState(false);
    
    const {
        id, cost, status, pickupAddressLine2, dropAddressLine2, materialType, customMaterialType,
        expectedPickupDate, expectedDeliveryDate, pickupAddressLine1, pickupState, pickupPincode,
        dropAddressLine1, dropState, dropPincode, weightKg, lengthFt, widthFt, heightFt,
        bodyType, truckSize, manpower, noOfLabours, materialValue, additionalNotes, transportMode,
        coolingType, ebayBillUrl
    } = req;

    const handleViewStatus = (e) => {
        e.stopPropagation(); // Prevent card expansion when clicking the button
        if (onViewStatus) {
            onViewStatus(id);
        } else {
            // Default behavior - you can customize this based on your routing setup
            // For example: navigate(`/shipment-status/${id}`)
            console.log(`Navigate to status for shipment ${id}`);
        }
    };

    const handleCardClick = () => {
        setExpanded(!expanded);
    };

    return (
        <motion.div layout className="bg-white border border-slate-200 shadow-sm rounded-xl transition-shadow duration-300 hover:shadow-md">
            {/* --- Card Header (Collapsed View) --- */}
            <motion.div layout className="p-4 cursor-pointer" onClick={handleCardClick}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="font-bold text-lg text-slate-800 tracking-tight">SHID{id}</span>
                           <StatusBadge status={status} />
                        </div>
                        <h3 className="text-md font-semibold text-slate-700">{pickupAddressLine2} → {dropAddressLine2}</h3>
                        <p className="text-sm text-slate-500">{materialType === 'Others' ? customMaterialType : materialType}</p>
                    </div>
                    
                    {/* Top right buttons container */}
                    <div className="flex items-center gap-2">
                        {/* View Status Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewStatus}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                        >
                            <Eye size={14} />
                            View Status
                        </Button>
                        
                        {/* Expand/Collapse Arrow */}
                        <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-slate-400 p-2">
                            <ChevronDown size={20} />
                        </motion.div>
                    </div>
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

export const ConfirmedRequests = ({ requests = [], isConfirmedTab, onViewStatus }) => {
    const [loading, setLoading] = useState(true);
    const [statusModalId, setStatusModalId] = useState(null);

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
                // Note: You might want to use this response data
                // setShipments(response.data.shipments || []);
            } catch (error) {
                console.error("Error fetching shipment data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const displayRequests = isConfirmedTab
        ? requests.filter(r => r.status === 'CONFIRMED')
        : requests;

    const handleViewStatus = (shipmentId) => {
        setStatusModalId(shipmentId);
    };

    const closeModal = () => {
        setStatusModalId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center pt-20">
                <LoaderOne />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {displayRequests && displayRequests.length > 0 ? (
                displayRequests.map((req) => (
                    <ShipmentCard 
                        key={req.id} 
                        req={req} 
                        isConfirmedTab={isConfirmedTab}
                        onViewStatus={onViewStatus || handleViewStatus}
                    />
                ))
            ) : (
                <EmptyState />
            )}
            
            {/* Status Modal */}
            <AnimatePresence>
                {statusModalId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={closeModal}
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Eye className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Shipment Status</h2>
                                        <p className="text-sm text-slate-500">SHID{statusModalId}</p>
                                    </div>
                                </div>
                                <button
                                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all duration-200"
                                    onClick={closeModal}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                                <ShipmentStatus shipmentId={statusModalId} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};