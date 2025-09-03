import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Menu,
  Users,
  X,
  Edit,
  Plus,
  ChevronDown,
  BarChart2,
  FileText,
  DollarSign,
  LogOut,
  Package,
  MapPin,
  Calendar,
  Truck,
  Scale,
  Ruler,
  Upload,
  Edit3,
  CheckCircle,
  File,
  XCircle,
  AlertCircle,
  Thermometer,
  BadgeCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoaderOne from '@/components/ui/LoadingScreen';
import axios from 'axios';

/**
 * --- Constants ---
 */
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

const materialTypes = [
  'Electronics & Technology', 'Automotive Parts', 'Machinery & Equipment', 'Textiles & Clothing',
  'Food & Beverages', 'Pharmaceuticals', 'Chemicals', 'Raw Materials', 'Construction Materials',
  'Furniture & Home Goods', 'Books & Documents', 'Hazardous Materials', 'Fragile Items', 'Perishable Goods', 'Others'
];
const transportModes = ['Road Transport', 'Rail Transport', 'Air Transport', 'Sea Transport', 'Intermodal'];
const coolingType = ['Ambient temperature/Non-Refrigerated', 'Refrigerated Frozen temperature', 'Refrigerated Chiller'];
const truckSize = ['14 ft', '17 ft', '19 ft', '20 ft', '22 ft', '24 ft', '32 ft', '40 ft'];

/**
 * --- Helpers ---
 */
const cx = (...cn) => cn.filter(Boolean).join(' ');
const formatINR = (val) => {
  if (val === '' || val === null || val === undefined) return '';
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
};
const formatDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
};

/**
 * --- Small UI Primitives (accessibility + consistent styles) ---
 */
const Field = ({ label, icon, id, required, children, hint, error }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-800">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
    {children}
    <div className="min-h-[1.25rem]">
      {error ? (
        <p className="text-xs text-rose-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  </div>
);

const TextInput = ({ id, error, className, ...props }) => (
  <input
    id={id}
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : undefined}
    className={cx(
      'w-full px-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm shadow-sm outline-none',
      'placeholder:text-gray-400',
      error
        ? 'border-rose-400 focus:border-rose-500 focus:ring focus:ring-rose-300/40'
        : 'border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-300/40',
      className
    )}
    {...props}
  />
);

const SelectInput = ({ id, error, className, children, ...props }) => (
  <select
    id={id}
    aria-invalid={!!error}
    className={cx(
      'w-full px-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm shadow-sm outline-none',
      error
        ? 'border-rose-400 focus:border-rose-500 focus:ring focus:ring-rose-300/40'
        : 'border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-300/40',
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const Radio = ({ name, value, checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-400"
    />
    <span>{label}</span>
  </label>
);

/**
 * --- Preview Card ---
 */
const RequestPreview = ({ formData, onEdit, onConfirm, loading }) => {
  const renderValue = (value, fallback = 'Not Provided') =>
    value && value !== 'null' && value !== 'undefined' && value !== ''
      ? value
      : <span className="text-gray-400 italic">{fallback}</span>;

  const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 break-words">{value}</p>
    </div>
  );

  const PreviewSection = ({ title, icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-2xl p-5 shadow-sm"
    >
      <h3 className="font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        {icon}
        <span>{title}</span>
      </h3>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Confirm Your Shipment Request</h2>
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <BadgeCheck className="w-4 h-4" />
          Review
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route */}
        <PreviewSection title="Route" icon={<MapPin size={18} className="text-blue-600" />}> 
          <DetailItem
            label="Pickup From"
            value={renderValue(`${formData.pickupAddressLine1}, ${formData.pickupAddressLine2}, ${formData.pickupState} - ${formData.pickupPincode}`)}
          />
          <DetailItem
            label="Deliver To"
            value={renderValue(`${formData.dropAddressLine1}, ${formData.dropAddressLine2}, ${formData.dropState} - ${formData.dropPincode}`)}
          />
        </PreviewSection>

        {/* Schedule */}
        <PreviewSection title="Schedule" icon={<Calendar size={18} className="text-green-600" />}> 
          <DetailItem label="Expected Pickup Date" value={renderValue(formatDate(formData.expectedPickup))} />
          <DetailItem label="Expected Delivery Date" value={renderValue(formatDate(formData.expectedDelivery))} />
        </PreviewSection>

        {/* Cargo Details */}
        <PreviewSection title="Cargo Details" icon={<Package size={18} className="text-yellow-600" />}> 
          <DetailItem
            label="Material Type"
            value={renderValue(formData.materialType === 'Others' ? formData.customMaterialType : formData.materialType)}
          />
          <DetailItem label="Weight" value={renderValue(`${formData.weight} kg`)} />
          {formData.length && formData.width && formData.height && (
            <DetailItem label="Dimensions (L×W×H)" value={`${formData.length} × ${formData.width} × ${formData.height} ft`} />
          )}
          <DetailItem label="Material Value" value={renderValue(formatINR(formData.materialValue))} />
          {formData.additionalNotes && (
            <DetailItem label="Additional Notes" value={renderValue(formData.additionalNotes)} />
          )}
        </PreviewSection>

        {/* Logistics */}
        <PreviewSection title="Logistics Requirements" icon={<Truck size={18} className="text-purple-600" />}> 
          <DetailItem label="Shipment Type" value={renderValue(formData.shipmentType)} />
          <DetailItem label="Body Type" value={renderValue(formData.bodyType)} />
          <DetailItem label="Transport Mode" value={renderValue(formData.transportMode)} />
          {formData.transportMode === 'Road Transport' && (
            <DetailItem label="Truck Size" value={renderValue(formData.truckSize)} />
          )}
          <DetailItem label="Temperature" value={renderValue(formData.coolingType || 'Ambient')} />
          <DetailItem label="Manpower Required" value={renderValue(formData.manpower)} />
          {formData.manpower === 'yes' && (
            <DetailItem label="Number of Labours" value={renderValue(formData.noOfLabours)} />
          )}
        </PreviewSection>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onEdit} className="flex-1 sm:flex-none sm:w-1/3 hover:cursor-pointer">
          <ArrowLeft size={16} className="mr-2" /> Edit Details
        </Button>
        <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 sm:flex-none sm:w-2/3 hover:cursor-pointer">
          {loading ? (
            <>
              <LoaderOne />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} className="mr-2" /> Confirm & Submit Request
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

/**
 * --- Main Form ---
 */
export const ShipmentRequestForm = ({ onComplete }) => {
  const [formStep, setFormStep] = useState('editing');
  const [loading, setLoading] = useState(false);

  // unified state
  const [formData, setFormData] = useState({
    // Pickup address
    pickupAddressLine1: '',
    pickupAddressLine2: '',
    pickupState: '',
    pickupPincode: '',

    // Drop address
    dropAddressLine1: '',
    dropAddressLine2: '',
    dropState: '',
    dropPincode: '',

    // Shipment details
    shipmentType: '', // PTL / FTL
    materialType: '',
    customMaterialType: '',
    bodyType: '', // Open / Closed
    manpower: '', // yes / no
    noOfLabours: '',
    weight: '',
    materialValue: '',
    additionalNotes: '',
    length: '',
    width: '',
    height: '',

    // Schedule
    expectedPickup: '',
    expectedDelivery: '',

    // Transport
    transportMode: '',
    truckSize: '',
    coolingType: '',
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validatePincode = (pincode) => {
    if (!pincode) return 'Pincode is required';
    if (!/^\d{6}$/.test(pincode)) return 'Pincode must be exactly 6 digits';
    return null;
  };

  const validatePickupDate = (date) => {
    if (!date) return 'Pickup date is required';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(date);
    if (pickupDate <= today) return 'Pickup date must be in the future';
    return null;
  };

  const validateDeliveryDate = (pickupDate, deliveryDate) => {
    if (!deliveryDate) return 'Delivery date is required';
    if (!pickupDate) return 'Please select pickup date first';
    const pickup = new Date(pickupDate);
    const delivery = new Date(deliveryDate);
    if (delivery <= pickup) return 'Delivery date must be after pickup date';
    return null;
  };

  // Validate form on every change
  useEffect(() => {
    const newErrors = {};

    // Validate pickup pincode
    const pickupPincodeError = validatePincode(formData.pickupPincode);
    if (pickupPincodeError) newErrors.pickupPincode = pickupPincodeError;

    // Validate drop pincode
    const dropPincodeError = validatePincode(formData.dropPincode);
    if (dropPincodeError) newErrors.dropPincode = dropPincodeError;

    // Validate pickup date
    const pickupDateError = validatePickupDate(formData.expectedPickup);
    if (pickupDateError) newErrors.expectedPickup = pickupDateError;

    // Validate delivery date
    const deliveryDateError = validateDeliveryDate(formData.expectedPickup, formData.expectedDelivery);
    if (deliveryDateError) newErrors.expectedDelivery = deliveryDateError;

    // Validate weight
    if (formData.weight && parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    // Validate material value
    if (formData.materialValue && parseFloat(formData.materialValue) <= 0) {
      newErrors.materialValue = 'Material value must be greater than 0';
    }

    // Validate number of labours
    if (formData.noOfLabours && parseInt(formData.noOfLabours) <= 0) {
      newErrors.noOfLabours = 'Number of labours must be greater than 0';
    }

    // Check if all required fields are filled
    const requiredFields = [
      'pickupAddressLine1', 'pickupAddressLine2', 'pickupState', 'pickupPincode',
      'dropAddressLine1', 'dropAddressLine2', 'dropState', 'dropPincode',
      'shipmentType', 'materialType', 'bodyType', 'manpower', 'weight',
      'materialValue', 'expectedPickup', 'expectedDelivery', 'transportMode'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      newErrors.required = 'Please fill in all required fields';
    }

    // Check if material type is "Others" but custom type is not provided
    if (formData.materialType === 'Others' && !formData.customMaterialType) {
      newErrors.customMaterialType = 'Please specify the material type';
    }

    // Check if manpower is "yes" but number of labours is not provided
    if (formData.manpower === 'yes' && !formData.noOfLabours) {
      newErrors.noOfLabours = 'Please specify number of labours';
    }

    // Check if body type is "Closed" but cooling type is not selected
    if (formData.bodyType === 'Closed' && !formData.coolingType) {
      newErrors.coolingType = 'Please select cooling type for closed body';
    }

    // Check if transport mode is "Road Transport" but truck size is not selected
    if (formData.transportMode === 'Road Transport' && !formData.truckSize) {
      newErrors.truckSize = 'Please select truck size for road transport';
    }

    setErrors(newErrors);

    // Form is valid if no errors and all required fields are filled
    const hasNoErrors = Object.keys(newErrors).length === 0;
    const allRequiredFilled = requiredFields.every(field => formData[field]);
    const conditionalFieldsValid =
      (formData.materialType !== 'Others' || formData.customMaterialType) &&
      (formData.manpower !== 'yes' || formData.noOfLabours) &&
      (formData.bodyType !== 'Closed' || formData.coolingType) &&
      (formData.transportMode !== 'Road Transport' || formData.truckSize);

    setIsFormValid(hasNoErrors && allRequiredFilled && conditionalFieldsValid);
  }, [formData]);

  // handlers -----------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for pincode fields - only allow numbers
    if (name === 'pickupPincode' || name === 'dropPincode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // preview submit
  const handlePreviewSubmit = (e) => {
    e.preventDefault();
    setFormStep('previewing');
  };

  // final submit
  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // append text fields
      const fields = {
        pickupAddressLine1: formData.pickupAddressLine1,
        pickupAddressLine2: formData.pickupAddressLine2,
        pickupState: formData.pickupState,
        pickupPincode: formData.pickupPincode,

        dropAddressLine1: formData.dropAddressLine1,
        dropAddressLine2: formData.dropAddressLine2,
        dropState: formData.dropState,
        dropPincode: formData.dropPincode,

        shipmentType: formData.shipmentType,
        materialType: formData.materialType,
        customMaterialType: formData.materialType === 'Others' ? formData.customMaterialType : null,
        bodyType: formData.bodyType,
        manpower: formData.manpower,
        noOfLabours: formData.manpower === 'yes' ? formData.noOfLabours : '0',
        weight: formData.weight,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        materialValue: formData.materialValue,
        additionalNotes: formData.additionalNotes,

        expectedPickupDate: formData.expectedPickup,
        expectedDeliveryDate: formData.expectedDelivery,

        transportMode: formData.transportMode,
        truckSize: formData.truckSize,
        coolingType: formData.coolingType,
      };

      Object.entries(fields).forEach(([key, val]) => formDataToSend.append(key, val ?? ''));

      // send request
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shipment/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || 'Failed to submit request');
      }
      setLoading(false);

      alert('Request submitted successfully!');
      setFormData({
        pickupAddressLine1: '',
        pickupAddressLine2: '',
        pickupState: '',
        pickupPincode: '',
        dropAddressLine1: '',
        dropAddressLine2: '',
        dropState: '',
        dropPincode: '',
        shipmentType: '',
        materialType: '',
        customMaterialType: '',
        bodyType: '',
        manpower: '',
        noOfLabours: '',
        weight: '',
        materialValue: '',
        additionalNotes: '',
        expectedPickup: '',
        expectedDelivery: '',
        transportMode: '',
        truckSize: '',
        coolingType: '',
      }); // reset
      onComplete && onComplete();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(error.message || 'An error occurred. Please try again.');
    }
  };

  // --- UI Decorations ---
  const StepBadge = ({ active }) => (
    <span
      className={cx(
        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
      )}
    />
  );

  if (formStep === 'previewing') {
    return (
      <RequestPreview
        loading={loading}
        formData={formData}
        onEdit={() => setFormStep('editing')}
        onConfirm={handleFinalSubmit}
      />
    );
  }

  return (
    <form onSubmit={handlePreviewSubmit} className="space-y-8">
      {/* Sticky header / progress */}
      <div className="sticky top-0 z-10 -mt-4 pt-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-gray-800">Shipment Request</span>
              <span className="h-4 w-px bg-gray-200" />
              <span className={cx('px-2 py-0.5 rounded-full text-xs', isFormValid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                {isFormValid ? 'Ready to Preview' : 'Validation Required'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <StepBadge active /> <span>Details</span>
              </div>
              <ChevronDown className="rotate-[-90deg]" />
              <div className="flex items-center gap-1 opacity-60">
                <StepBadge active={false} /> <span>Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8 border border-gray-100">
        <div className="border-b pb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Request Shipment</h2>
          <p className="text-gray-600">Fill in the details to issue a request</p>

          {/* Validation Status */}
          <div className="mt-4 p-4 rounded-xl border bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">Form Validation Status</span>
              <span
                className={cx(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  isFormValid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                )}
              >
                {isFormValid ? 'Ready to Submit' : 'Validation Required'}
              </span>
            </div>

            {isFormValid ? (
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">All validations passed! You can proceed to preview your shipment request.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center text-amber-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Please complete all required fields and fix validation errors to proceed.</span>
                </div>
                {errors.required && (
                  <p className="text-rose-600 text-sm ml-7">{errors.required}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pickup and Drop Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Address */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />Pick Up Location
                <span className="ml-1 text-rose-500">*</span>
              </div>
              <div className="space-y-3">
                <TextInput id="pickupAddressLine1" name="pickupAddressLine1" value={formData.pickupAddressLine1} onChange={handleInputChange} placeholder="Building no, street" required />
                <TextInput id="pickupAddressLine2" name="pickupAddressLine2" value={formData.pickupAddressLine2} onChange={handleInputChange} placeholder="City / Area" required />
                <SelectInput id="pickupState" name="pickupState" value={formData.pickupState} onChange={handleInputChange} required>
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </SelectInput>
                <TextInput
                  id="pickupPincode"
                  name="pickupPincode"
                  value={formData.pickupPincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={errors.pickupPincode}
                  required
                />
                {errors.pickupPincode && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.pickupPincode}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Drop Address */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />Drop Location
                <span className="ml-1 text-rose-500">*</span>
              </div>
              <div className="space-y-3">
                <TextInput id="dropAddressLine1" name="dropAddressLine1" value={formData.dropAddressLine1} onChange={handleInputChange} placeholder="Building no, street" required />
                <TextInput id="dropAddressLine2" name="dropAddressLine2" value={formData.dropAddressLine2} onChange={handleInputChange} placeholder="City / Area" required />
                <SelectInput id="dropState" name="dropState" value={formData.dropState} onChange={handleInputChange} required>
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </SelectInput>
                <TextInput
                  id="dropPincode"
                  name="dropPincode"
                  value={formData.dropPincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={errors.dropPincode}
                  required
                />
                {errors.dropPincode && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.dropPincode}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Other fields... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Field label="Material Type" id="materialType" required icon={<Package className="w-4 h-4" />} error={errors.customMaterialType}>
              <SelectInput id="materialType" name="materialType" value={formData.materialType} onChange={handleInputChange} required>
                <option value="">Select material type</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </SelectInput>
            </Field>
            {formData.materialType === 'Others' && (
              <Field label="Specify Material" id="customMaterialType" error={errors.customMaterialType}>
                <TextInput id="customMaterialType" name="customMaterialType" value={formData.customMaterialType} onChange={handleInputChange} placeholder="Please specify" required />
              </Field>
            )}
          </div>

          <div>
            <Field label="Weight (kg)" id="weight" required icon={<Scale className="w-4 h-4" />} error={errors.weight}>
              <TextInput
                id="weight"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter weight in kg"
                min={0}
                step={0.1}
                error={errors.weight}
                required
              />
            </Field>
          </div>
        </div>

        <div>
          <div className="flex items-center text-sm font-medium text-gray-800 mb-2"><Ruler className="w-4 h-4 mr-2 text-orange-600" />Dimensions (feet)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput type="number" name="length" value={formData.length} onChange={handleInputChange} placeholder="Length (ft)" min={0} step={0.1} />
            <TextInput type="number" name="width" value={formData.width} onChange={handleInputChange} placeholder="Width (ft)" min={0} step={0.1} />
            <TextInput type="number" name="height" value={formData.height} onChange={handleInputChange} placeholder="Height (ft)" min={0} step={0.1} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Expected Pickup Date" id="expectedPickup" required icon={<Calendar className="w-4 h-4" />} error={errors.expectedPickup}>
            <TextInput
              id="expectedPickup"
              type="date"
              name="expectedPickup"
              value={formData.expectedPickup}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </Field>

          <Field label="Expected Delivery Date" id="expectedDelivery" required icon={<Calendar className="w-4 h-4" />} error={errors.expectedDelivery}>
            <TextInput
              id="expectedDelivery"
              type="date"
              name="expectedDelivery"
              value={formData.expectedDelivery}
              onChange={handleInputChange}
              min={formData.expectedPickup || new Date().toISOString().split('T')[0]}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Shipment Type <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-4 pt-2">
              <Radio name="shipmentType" value="PTL" checked={formData.shipmentType === 'PTL'} onChange={handleInputChange} label="PTL" />
              <Radio name="shipmentType" value="FTL" checked={formData.shipmentType === 'FTL'} onChange={handleInputChange} label="FTL" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Body Type <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-4 pt-2">
              <Radio name="bodyType" value="Closed" checked={formData.bodyType === 'Closed'} onChange={handleInputChange} label="Closed" />
              <Radio name="bodyType" value="Open" checked={formData.bodyType === 'Open'} onChange={handleInputChange} label="Open" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Manpower Required <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-4 pt-2">
              <Radio name="manpower" value="yes" checked={formData.manpower === 'yes'} onChange={handleInputChange} label="Yes" />
              <Radio name="manpower" value="no" checked={formData.manpower === 'no'} onChange={handleInputChange} label="No" />
            </div>
          </div>

          {formData.manpower === 'yes' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Number of Labours <span className="text-rose-500">*</span></label>
              <TextInput
                type="number"
                name="noOfLabours"
                value={formData.noOfLabours}
                onChange={handleInputChange}
                placeholder="Enter number of labours"
                min={1}
                error={errors.noOfLabours}
                required
              />
              {errors.noOfLabours && (
                <p className="text-rose-600 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.noOfLabours}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Value of Material (₹)" id="materialValue" required icon={<DollarSign className="w-4 h-4" />} error={errors.materialValue}>
            <TextInput
              id="materialValue"
              type="number"
              name="materialValue"
              value={formData.materialValue}
              onChange={handleInputChange}
              placeholder="Enter material value"
              min={0}
              required
            />
            {formData.materialValue && (
              <p className="text-xs text-gray-500 mt-1">Approx: {formatINR(formData.materialValue)}</p>
            )}
          </Field>

          <Field label="Mode of Transportation" id="transportMode" required icon={<Truck className="w-4 h-4" />}>
            <SelectInput id="transportMode" name="transportMode" value={formData.transportMode} onChange={handleInputChange} required>
              <option value="">Select transport mode</option>
              {transportModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </SelectInput>
          </Field>

          {formData.transportMode === 'Road Transport' && (
            <div className="md:col-span-1">
              <Field label="Truck Size" id="truckSize" error={errors.truckSize} icon={<Truck className="w-4 h-4" />}>
                <SelectInput id="truckSize" name="truckSize" value={formData.truckSize} onChange={handleInputChange}>
                  <option value="">Select truck size</option>
                  {truckSize.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          )}

          {formData.bodyType === 'Closed' && (
            <div className="md:col-span-1">
              <Field label="Vehicle Temperature" id="coolingType" required error={errors.coolingType} icon={<Thermometer className="w-4 h-4" />}>
                <SelectInput id="coolingType" name="coolingType" value={formData.coolingType} onChange={handleInputChange} required>
                  <option value="">Select temperature</option>
                  {coolingType.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          )}
        </div>

        {/* additionalNotes */}
        <Field label="Additional Notes" id="additionalNotes" hint="Add any special handling instructions, loading constraints, or timing notes.">
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            className={cx(
              'w-full px-4 py-3 min-h-[120px] rounded-xl border bg-white/80 backdrop-blur-sm shadow-sm outline-none',
              'placeholder:text-gray-400 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-300/40'
            )}
            placeholder="Enter any additional notes"
            rows={4}
          />
        </Field>

        {errors.required && (
          <p className="text-rose-600 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.required}</p>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            className={cx(
              'w-full py-4 px-6 rounded-xl font-semibold transition-all transform',
              'focus:ring-4 focus:ring-blue-300',
              isFormValid
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01]'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            )}
            disabled={!isFormValid}
          >
            {isFormValid ? (
              <span className="inline-flex items-center justify-center"><ArrowRight className="w-5 h-5 mr-2" /> Preview Request</span>
            ) : (
              'Complete Form to Continue'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ShipmentRequestForm;
