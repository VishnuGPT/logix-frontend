import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, Users, X, Edit, Plus, ChevronDown, BarChart2, FileText, DollarSign, LogOut, Package, MapPin, Calendar, Truck, Scale, Ruler, Upload, Edit3, CheckCircle, File, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoaderOne } from '@/components/ui/loader';
import axios from 'axios';
import { useRef } from 'react';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

const materialTypes = ['Electronics & Technology', 'Automotive Parts', 'Machinery & Equipment', 'Textiles & Clothing', 'Food & Beverages', 'Pharmaceuticals', 'Chemicals', 'Raw Materials', 'Construction Materials', 'Furniture & Home Goods', 'Books & Documents', 'Hazardous Materials', 'Fragile Items', 'Perishable Goods', 'Others'];
const transportModes = ['Road Transport', 'Rail Transport', 'Air Transport', 'Sea Transport', 'Intermodal'];
const coolingType = ['Ambient temperature/Non-Refrigerated', 'Refrigerated Frozen temperature', 'Refrigerated Chiller'];
const truckSize = ['14 ft', '17 ft', '19 ft', '20 ft', '22 ft', '24 ft', '32 ft', '40 ft'];


const RequestPreview = ({ formData, onEdit, onConfirm, loading }) => {
  const renderValue = (value, fallback = "Not Provided") =>
    value && value !== "null" && value !== "undefined" && value !== ""
      ? value
      : <span className="text-gray-400 italic">{fallback}</span>;

  const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
    </div>
  );

  const PreviewSection = ({ title, icon, children }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2 border-b border-gray-200 pb-2 mb-3">
        {icon}
        <span>{title}</span>
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );



  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">
        Confirm Your Shipment Request
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route */}
        <PreviewSection title="Route" icon={<MapPin size={18} className="text-blue-600" />}>
          <DetailItem
            label="Pickup From"
            value={renderValue(
              `${formData.pickupAddressLine1}, ${formData.pickupAddressLine2}, ${formData.pickupState} - ${formData.pickupPincode}`
            )}
          />
          <DetailItem
            label="Deliver To"
            value={renderValue(
              `${formData.dropAddressLine1}, ${formData.dropAddressLine2}, ${formData.dropState} - ${formData.dropPincode}`
            )}
          />
        </PreviewSection>

        {/* Schedule */}
        <PreviewSection title="Schedule" icon={<Calendar size={18} className="text-green-600" />}>
          <DetailItem label="Expected Pickup Date" 
            value={renderValue(formData.expectedPickup)} />
          <DetailItem label="Expected Delivery Date" 
            value={renderValue(formData.expectedDelivery)} />
        </PreviewSection>

        {/* Cargo Details */}
        <PreviewSection title="Cargo Details" icon={<Package size={18} className="text-yellow-600" />}>
          <DetailItem
            label="Material Type"
            value={renderValue(
              formData.materialType === "Others" ? formData.customMaterialType : formData.materialType
            )}
          />
          <DetailItem label="Weight" value={renderValue(`${formData.weight} kg`)} />
          {formData.length && formData.width && formData.height && (
            <DetailItem
              label="Dimensions (L×W×H)"
              value={`${formData.length} × ${formData.width} × ${formData.height} ft`}
            />
          )}
          <DetailItem label="Material Value" value={renderValue(`₹${formData.materialValue}`)} />
          {formData.additionalNotes && (
            <DetailItem label="Additional Notes" value={renderValue(formData.additionalNotes)} />
          )}
        </PreviewSection>

        {/* Logistics */}
        <PreviewSection title="Logistics Requirements" icon={<Truck size={18} className="text-purple-600" />}>
          <DetailItem label="Shipment Type" value={renderValue(formData.shipmentType)} />
          <DetailItem label="Body Type" value={renderValue(formData.bodyType)} />
          <DetailItem label="Transport Mode" value={renderValue(formData.transportMode)} />
          {formData.transportMode === "Road Transport" && (
            <DetailItem label="Truck Size" value={renderValue(formData.truckSize)} />
          )}
          <DetailItem label="Temperature" value={renderValue(formData.coolingType)} />
          <DetailItem label="Manpower Required" value={renderValue(formData.manpower)} />
          {formData.manpower === "yes" && (
            <DetailItem label="Number of Labours" value={renderValue(formData.noOfLabours)} />
          )}
        </PreviewSection>

        {/* Attachments */}
        {formData.ebayBill && (
          <PreviewSection title="Attachments" icon={<File size={18} className="text-red-600" />}>
            <DetailItem label="eBay Bill PDF" value={renderValue(formData.ebayBill.name)} />
          </PreviewSection>
        )}
      </div>

              {/* Actions */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={onEdit} className="flex-1 sm:flex-none sm:w-1/3 hover:cursor-pointer">
            <Edit3 size={16} className="mr-2 " /> Edit Details
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-green-500 sm:flex-none sm:w-2/3 hover:cursor-pointer">
            {loading ? (
              <>
                <LoaderOne />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2 " /> Confirm & Submit Request
              </>
            )}
          </Button>
        </div>
    </div>
  );
};


export const ShipmentRequestForm = ({ onComplete }) => {
  const [formStep, setFormStep] = useState("editing");
  const [loading, setLoading] = useState(false);

  // unified state
  const [formData, setFormData] = useState({
    // Pickup address
    pickupAddressLine1: "",
    pickupAddressLine2: "",
    pickupState: "",
    pickupPincode: "",

    // Drop address
    dropAddressLine1: "",
    dropAddressLine2: "",
    dropState: "",
    dropPincode: "",

    // Shipment details
    shipmentType: "", // PTL / FTL
    materialType: "",
    customMaterialType: "",
    bodyType: "", // Open / Closed
    manpower: "", // yes / no
    noOfLabours: "",
    weight: "",
    materialValue: "",
    additionalNotes: "",
    length: "",
    width: "",
    height: "",

    // Schedule
    expectedPickup: "",
    expectedDelivery: "",

    // Transport
    transportMode: "",
    truckSize: "",
    coolingType: "",

    // File
    ewayBill: null,
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validatePincode = (pincode) => {
    if (!pincode) return "Pincode is required";
    if (!/^\d{6}$/.test(pincode)) return "Pincode must be exactly 6 digits";
    return null;
  };

  const validatePickupDate = (date) => {
    if (!date) return "Pickup date is required";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(date);
    if (pickupDate <= today) return "Pickup date must be in the future";
    return null;
  };

  const validateDeliveryDate = (pickupDate, deliveryDate) => {
    if (!deliveryDate) return "Delivery date is required";
    if (!pickupDate) return "Please select pickup date first";
    const pickup = new Date(pickupDate);
    const delivery = new Date(deliveryDate);
    if (delivery <= pickup) return "Delivery date must be after pickup date";
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
      newErrors.weight = "Weight must be greater than 0";
    }

    // Validate material value
    if (formData.materialValue && parseFloat(formData.materialValue) <= 0) {
      newErrors.materialValue = "Material value must be greater than 0";
    }

    // Validate number of labours
    if (formData.noOfLabours && parseInt(formData.noOfLabours) <= 0) {
      newErrors.noOfLabours = "Number of labours must be greater than 0";
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
      newErrors.required = "Please fill in all required fields";
    }

    // Check if material type is "Others" but custom type is not provided
    if (formData.materialType === 'Others' && !formData.customMaterialType) {
      newErrors.customMaterialType = "Please specify the material type";
    }

    // Check if manpower is "yes" but number of labours is not provided
    if (formData.manpower === 'yes' && !formData.noOfLabours) {
      newErrors.noOfLabours = "Please specify number of labours";
    }

    // Check if body type is "Closed" but cooling type is not selected
    if (formData.bodyType === 'Closed' && !formData.coolingType) {
      newErrors.coolingType = "Please select cooling type for closed body";
    }

    // Check if transport mode is "Road Transport" but truck size is not selected
    if (formData.transportMode === 'Road Transport' && !formData.truckSize) {
      newErrors.truckSize = "Please select truck size for road transport";
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
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // file upload
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, ewayBill: file }));
    } else {
      alert("Only PDF files are allowed");
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, ewayBill: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // preview submit
  const handlePreviewSubmit = (e) => {
    e.preventDefault();
    setFormStep("previewing");
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
        customMaterialType: formData.materialType === "Others" ? formData.customMaterialType : null,
        bodyType: formData.bodyType,
        manpower: formData.manpower,
        noOfLabours: formData.manpower === "yes" ? formData.noOfLabours : "0",
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

      Object.entries(fields).forEach(([key, val]) =>
        formDataToSend.append(key, val ?? "")
      );

      // append file
      if (formData.ewayBill) {
        formDataToSend.append("ewayBill", formData.ewayBill);
      }
      console.log("Form data to send:", formDataToSend);

      // send request
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shipment/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || "Failed to submit request");
      }
      setLoading(false);


      alert("Request submitted successfully!");
      setFormData({
        pickupAddressLine1: "",
        pickupAddressLine2: "",
        pickupState: "",
        pickupPincode: "",
        dropAddressLine1: "",
        dropAddressLine2: "",
        dropState: "",
        dropPincode: "",
        shipmentType: "",
        materialType: "",
        customMaterialType: "",
        bodyType: "",
        manpower: "",
        noOfLabours: "",
        weight: "",
        materialValue: "",
        additionalNotes: "",
        expectedPickup: "",
        expectedDelivery: "",
        transportMode: "",
        truckSize: "",
        coolingType: "",
        ewayBill: null,
      }); // reset
      onComplete();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  if (formStep === "previewing") {
    return (
      <RequestPreview
        loading={loading}
        formData={formData}
        onEdit={() => setFormStep("editing")}
        onConfirm={handleFinalSubmit}
      />
    );
  }
  return (
    <form onSubmit={handlePreviewSubmit} className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="border-b pb-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Request Shipment</h2>
          <p className="text-gray-600">Fill in the details to issue a request</p>
          
          {/* Validation Status */}
          <div className="mt-4 p-4 rounded-lg border-2 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Form Validation Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isFormValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {isFormValid ? 'Ready to Submit' : 'Validation Required'}
              </span>
            </div>
            
            {isFormValid ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">All validations passed! You can proceed to preview your shipment request.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Please complete all required fields and fix validation errors to proceed.</span>
                </div>
                {errors.required && (
                  <p className="text-red-600 text-sm ml-7">{errors.required}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pickup and Drop Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Address */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-medium text-gray-700"><MapPin className="w-4 h-4 mr-2 text-blue-600" />Pick Up Location *</label>
            <input type="text" name="pickupAddressLine1" value={formData.pickupAddressLine1} onChange={handleInputChange} placeholder="Building no, street" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            <input type="text" name="pickupAddressLine2" value={formData.pickupAddressLine2} onChange={handleInputChange} placeholder="City / Area" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            <select name="pickupState" value={formData.pickupState} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select State</option>
              {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <input 
              type="text" 
              name="pickupPincode" 
              value={formData.pickupPincode} 
              onChange={handleInputChange} 
              placeholder="Pincode" 
              maxLength="6"
              pattern="[0-9]*"
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.pickupPincode ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`} 
              required 
            />
            {errors.pickupPincode && (
              <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.pickupPincode}</p>
            )}
          </div>

          {/* Drop Address */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-medium text-gray-700"><MapPin className="w-4 h-4 mr-2 text-red-500" />Drop Location *</label>
            <input type="text" name="dropAddressLine1" value={formData.dropAddressLine1} onChange={handleInputChange} placeholder="Building no, street" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            <input type="text" name="dropAddressLine2" value={formData.dropAddressLine2} onChange={handleInputChange} placeholder="City / Area" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            <select name="dropState" value={formData.dropState} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select State</option>
              {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <input 
              type="text" 
              name="dropPincode" 
              value={formData.dropPincode} 
              onChange={handleInputChange} 
              placeholder="Pincode" 
              maxLength="6"
              pattern="[0-9]*"
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.dropPincode ? 'border-red-500 focus:border-red-500' : 'border-gray-500 focus:border-blue-500'
              }`} 
              required 
            />
            {errors.dropPincode && (
              <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.dropPincode}</p>
            )}
          </div>
        </div>

        {/* Other fields... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700"><Package className="w-4 h-4 mr-2 text-green-600" />Material Type *</label>
            <select name="materialType" value={formData.materialType} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select material type</option>
              {materialTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            {formData.materialType === 'Others' && (
              <input type="text" name="customMaterialType" value={formData.customMaterialType} onChange={handleInputChange} className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg" placeholder="Please specify" required />
            )}
            {errors.customMaterialType && (
              <p className="text-red-500 text-xs mt-1"><AlertCircle className="w-4 h-4 mr-1" /> {errors.customMaterialType}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700"><Scale className="w-4 h-4 mr-2 text-purple-600" />Weight (kg) *</label>
            <input 
              type="number" 
              name="weight" 
              value={formData.weight} 
              onChange={handleInputChange} 
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.weight ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter weight in kg" 
              min="0" 
              step="0.1" 
              required 
            />
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.weight}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700"><Ruler className="w-4 h-4 mr-2 text-orange-600" />Dimensions (feet)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="number" name="length" value={formData.length} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Length (ft)" min="0" step="0.1" />
            <input type="number" name="width" value={formData.width} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Width (ft)" min="0" step="0.1" />
            <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Height (ft)" min="0" step="0.1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700"><Calendar className="w-4 h-4 mr-2" />Expected Pickup Date *</label>
            <input 
              type="date" 
              name="expectedPickup" 
              value={formData.expectedPickup} 
              onChange={handleInputChange} 
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
              required 
            />
            {errors.expectedPickup && (
              <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.expectedPickup}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700"><Calendar className="w-4 h-4 mr-2" />Expected Delivery Date *</label>
            <input 
              type="date" 
              name="expectedDelivery" 
              value={formData.expectedDelivery} 
              onChange={handleInputChange} 
              min={formData.expectedPickup || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
              required 
            />
            {errors.expectedDelivery && (
              <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.expectedDelivery}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Shipment Type *</label>
            <div className="flex space-x-4 pt-2">
              <label className="flex items-center"><input type="radio" name="shipmentType" value="PTL" checked={formData.shipmentType === 'PTL'} onChange={handleInputChange} className="mr-2" required />PTL</label>
              <label className="flex items-center"><input type="radio" name="shipmentType" value="FTL" checked={formData.shipmentType === 'FTL'} onChange={handleInputChange} className="mr-2" required />FTL</label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Body Type *</label>
            <div className="flex space-x-4 pt-2">
              <label className="flex items-center"><input type="radio" name="bodyType" value="Closed" checked={formData.bodyType === 'Closed'} onChange={handleInputChange} className="mr-2" required />Closed</label>
              <label className="flex items-center"><input type="radio" name="bodyType" value="Open" checked={formData.bodyType === 'Open'} onChange={handleInputChange} className="mr-2" required />Open</label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Manpower Required *</label>
            <div className="flex space-x-4 pt-2">
              <label className="flex items-center"><input type="radio" name="manpower" value="yes" checked={formData.manpower === 'yes'} onChange={handleInputChange} className="mr-2" required />Yes</label>
              <label className="flex items-center"><input type="radio" name="manpower" value="no" checked={formData.manpower === 'no'} onChange={handleInputChange} className="mr-2" required />No</label>
            </div>
          </div>
                      {formData.manpower === 'yes' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Number of Labours *</label>
                <input 
                  type="number" 
                  name="noOfLabours" 
                  value={formData.noOfLabours} 
                  onChange={handleInputChange} 
                  className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                    errors.noOfLabours ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter number of labours" 
                  min="1" 
                  required 
                />
                {errors.noOfLabours && (
                  <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.noOfLabours}</p>
                )}
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Value of Material (₹) *</label>
            <input 
              type="number" 
              name="materialValue" 
              value={formData.materialValue} 
              onChange={handleInputChange} 
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.materialValue ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter material value" 
              min="0" 
              required 
            />
            {errors.materialValue && (
              <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.materialValue}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700"><Truck className="w-4 h-4 mr-2" />Mode of Transportation *</label>
            <select name="transportMode" value={formData.transportMode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select transport mode</option>
              {transportModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </div>
          {formData.transportMode === 'Road Transport' && (
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700"><Truck className="w-4 h-4 mr-2" />Truck Size</label>
              <select name="truckSize" value={formData.truckSize} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option value="">Select truck size</option>
                {truckSize.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
              {errors.truckSize && (
                <p className="text-red-500 text-xs mt-1"><AlertCircle className="w-4 h-4 mr-1" /> {errors.truckSize}</p>
              )}
            </div>
          )}
          {formData.bodyType === 'Closed' && (
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">Vehicle Temperature *</label>
              <select name="coolingType" value={formData.coolingType} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select temperature</option>
                {coolingType.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.coolingType && (
                <p className="text-red-500 text-xs mt-1"><AlertCircle className="w-4 h-4 mr-1" /> {errors.coolingType}</p>
              )}
            </div>
          )}
        </div>
        {/* additionalNotes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter any additional notes" rows="4"></textarea>
        </div>
        {/* (NEW) PDF Upload Section
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700"><Upload className="w-4 h-4 mr-2" />eBay Bill (Optional PDF)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-interactive transition-colors">
            <input
              type="file"
              id="ebay-bill-upload"
              className="hidden"
              accept="application/pdf,.pdf"
              onChange={handleFileUpload}
            />
            <label htmlFor="ebay-bill-upload" className="cursor-pointer">
              {!formData.ebayBill ? (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF only</p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-interactive" />
                  <p className="font-semibold text-gray-800">{formData.ebayBill.name}</p>
                  <button type="button" onClick={removeFile} className="ml-2 text-red-500 hover:text-red-700">
                    <XCircle size={20} />
                  </button>
                </div>
              )}
            </label>
          </div>
        </div> */}

        {errors.required && (
          <p className="text-red-500 text-xs mt-1"><AlertCircle className="w-4 h-4 mr-1" /> {errors.required}</p>
        )}

        <div className="pt-6">
          <button 
            type="submit" 
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-all transform focus:ring-4 focus:ring-blue-300 ${
              isFormValid 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 cursor-pointer' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`} 
            disabled={!isFormValid}
          >
            {isFormValid ? 'Preview Request' : 'Complete Form to Continue'}
          </button>
        </div>
      </div>
    </form>
  );
};
