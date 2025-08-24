import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, Truck, FileText, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

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
  'Furniture & Home Goods', 'Books & Documents', 'Hazardous Materials', 'Fragile Items',
  'Perishable Goods', 'Others'
];

const transportModes = ['Road Transport', 'Rail Transport', 'Air Transport', 'Sea Transport', 'Intermodal'];
const coolingType = ['Ambient temperature/Non-Refrigerated', 'Refrigerated Frozen temperature', 'Refrigerated Chiller'];
const truckSize = ['14 ft', '17 ft', '19 ft', '20 ft', '22 ft', '24 ft', '32 ft', '40 ft'];

const dateToYMD = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const startOfToday = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};
const addDays = (d, n) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

// pick only the fields that exist in UI for dirtiness check
const FIELDS_TO_COMPARE = [
  'pickupAddressLine1', 'pickupAddressLine2', 'pickupState', 'pickupPincode',
  'dropAddressLine1', 'dropAddressLine2', 'dropState', 'dropPincode',
  'materialType', 'customMaterialType',
  'weightKg', 'materialValue',
  'lengthFt', 'widthFt', 'heightFt',
  'expectedPickupDate', 'expectedDeliveryDate',
  'transportMode', 'truckSize',
  'bodyType', 'coolingType',
  'shipmentType', 'manpower', 'noOfLabours',
  'additionalNotes',
  'shipmentId'
];

export const ModificationRequest = ({ req, modifying, setModifying }) => {
  // initial snapshot (used for dirty check)
  const initialRef = React.useRef({
    ...req,
    shipmentId: req.id
  });

  const [formData, setFormData] = React.useState(initialRef.current);
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [touched, setTouched] = React.useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // clear dependent fields if parent changes
      if (field === 'materialType' && value !== 'Others') next.customMaterialType = '';
      if (field === 'transportMode' && value !== 'Road Transport') next.truckSize = '';
      if (field === 'bodyType' && value !== 'Closed') next.coolingType = '';
      if (field === 'manpower' && value !== 'yes') next.noOfLabours = '';

      return next;
    });
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const pick = (obj, keys) =>
    keys.reduce((acc, k) => {
      acc[k] = obj?.[k] ?? '';
      return acc;
    }, {});

  const comparableInitial = React.useMemo(
    () => pick(initialRef.current, FIELDS_TO_COMPARE),
    []
  );
  const comparableCurrent = React.useMemo(
    () => pick(formData, FIELDS_TO_COMPARE),
    [formData]
  );

  const isDirty = React.useMemo(() => {
    return JSON.stringify(comparableInitial) !== JSON.stringify(comparableCurrent);
  }, [comparableInitial, comparableCurrent]);

  const validate = (fd) => {
    const errs = {};

    // Required base fields
    const required = [
      'pickupAddressLine1', 'pickupAddressLine2', 'pickupState', 'pickupPincode',
      'dropAddressLine1', 'dropAddressLine2', 'dropState', 'dropPincode',
      'materialType',
      'weightKg', 'materialValue',
      'lengthFt', 'widthFt', 'heightFt',
      'expectedPickupDate', 'expectedDeliveryDate',
      'transportMode', 'bodyType', 'shipmentType', 'manpower'
    ];
    required.forEach((f) => {
      if (fd[f] === undefined || fd[f] === null || String(fd[f]).trim() === '') {
        errs[f] = 'Required';
      }
    });

    // Conditional requireds
    if (fd.materialType === 'Others' && !String(fd.customMaterialType || '').trim()) {
      errs.customMaterialType = 'Required';
    }
    if (fd.transportMode === 'Road Transport' && !String(fd.truckSize || '').trim()) {
      errs.truckSize = 'Required';
    }
    if (fd.bodyType === 'Closed' && !String(fd.coolingType || '').trim()) {
      errs.coolingType = 'Required';
    }
    if (fd.manpower === 'yes') {
      const n = Number(fd.noOfLabours);
      if (!Number.isFinite(n) || n < 1 || !/^\d+$/.test(String(fd.noOfLabours))) {
        errs.noOfLabours = 'Enter at least 1 labour';
      }
    }

    // Pincode: exactly 6 digits
    const pinRe = /^\d{6}$/;
    if (fd.pickupPincode && !pinRe.test(String(fd.pickupPincode))) {
      errs.pickupPincode = 'Enter a valid 6-digit pincode';
    }
    if (fd.dropPincode && !pinRe.test(String(fd.dropPincode))) {
      errs.dropPincode = 'Enter a valid 6-digit pincode';
    }

    // Positive numbers
    ['weightKg', 'materialValue', 'lengthFt', 'widthFt', 'heightFt'].forEach((k) => {
      const v = Number(fd[k]);
      if (!(String(fd[k]).trim().length > 0)) return;
      if (!Number.isFinite(v) || v <= 0) errs[k] = 'Must be greater than 0';
    });

    // Dates
    if (fd.expectedPickupDate) {
      const today = startOfToday();
      const pickup = new Date(fd.expectedPickupDate);
      if (!(pickup > today)) {
        errs.expectedPickupDate = 'Pickup must be after today';
      }
      if (fd.expectedDeliveryDate) {
        const delivery = new Date(fd.expectedDeliveryDate);
        if (!(delivery > pickup)) {
          errs.expectedDeliveryDate = 'Delivery must be after pickup';
        }
      }
    }

    return errs;
  };

  // validate whenever form changes
  React.useEffect(() => {
    setErrors(validate(formData));
  }, [formData]);

  const isValid = React.useMemo(() => Object.keys(errors).length === 0, [errors]);
  const canSubmit = isDirty && isValid && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const currentErrs = validate(formData);
    setErrors(currentErrs);
    if (Object.keys(currentErrs).length > 0) return;

    try {
      setSubmitting(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/modification/modify-shipment`,
        formData,
        { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setModifying(false); // success closes the form; button never re-enables on this screen
    } catch (error) {
      console.error('Error updating shipment:', error);
      // allow user to fix and resubmit
      setSubmitting(false);
    }
  };

  // Date min attributes for better UX and to mirror the rules
  const pickupMin = React.useMemo(() => dateToYMD(addDays(startOfToday(), 1)), []);
  const deliveryMin = React.useMemo(() => {
    if (formData.expectedPickupDate) {
      return dateToYMD(addDays(new Date(formData.expectedPickupDate), 1));
    }
    return dateToYMD(addDays(startOfToday(), 2));
  }, [formData.expectedPickupDate]);

  const fieldError = (name) => errors[name];
  const errorClass = (name) =>
    fieldError(name) ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300';

  return (
    <AnimatePresence>
      {modifying && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          noValidate
          className="mt-4 p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-6 text-sm"
        >
          {/* --- SECTION: PICKUP DETAILS --- */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Pickup Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 1</span>
                <input
                  name="pickupAddressLine1"
                  value={formData.pickupAddressLine1 || ''}
                  onChange={(e) => handleChange('pickupAddressLine1', e.target.value)}
                  placeholder="Building no, street"
                  className={`w-full border rounded-md p-2 ${errorClass('pickupAddressLine1')}`}
                />
                {fieldError('pickupAddressLine1') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('pickupAddressLine1')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 2</span>
                <input
                  name="pickupAddressLine2"
                  value={formData.pickupAddressLine2 || ''}
                  onChange={(e) => handleChange('pickupAddressLine2', e.target.value)}
                  placeholder="City / Area"
                  className={`w-full border rounded-md p-2 ${errorClass('pickupAddressLine2')}`}
                />
                {fieldError('pickupAddressLine2') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('pickupAddressLine2')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">State</span>
                <select
                  name="pickupState"
                  value={formData.pickupState || ''}
                  onChange={(e) => handleChange('pickupState', e.target.value)}
                  className={`w-full border rounded-md p-2 ${errorClass('pickupState')}`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {fieldError('pickupState') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('pickupState')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Pincode</span>
                <input
                  name="pickupPincode"
                  value={formData.pickupPincode || ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                    handleChange('pickupPincode', v);
                  }}
                  inputMode="numeric"
                  pattern="\d{6}"
                  placeholder="Pincode"
                  className={`w-full border rounded-md p-2 ${errorClass('pickupPincode')}`}
                />
                {fieldError('pickupPincode') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('pickupPincode')}</p>
                )}
              </label>
            </div>
          </div>

          {/* --- SECTION: DROP DETAILS --- */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              Drop Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 1</span>
                <input
                  name="dropAddressLine1"
                  value={formData.dropAddressLine1 || ''}
                  onChange={(e) => handleChange('dropAddressLine1', e.target.value)}
                  placeholder="Building no, street"
                  className={`w-full border rounded-md p-2 ${errorClass('dropAddressLine1')}`}
                />
                {fieldError('dropAddressLine1') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('dropAddressLine1')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 2</span>
                <input
                  name="dropAddressLine2"
                  value={formData.dropAddressLine2 || ''}
                  onChange={(e) => handleChange('dropAddressLine2', e.target.value)}
                  placeholder="City / Area"
                  className={`w-full border rounded-md p-2 ${errorClass('dropAddressLine2')}`}
                />
                {fieldError('dropAddressLine2') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('dropAddressLine2')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">State</span>
                <select
                  name="dropState"
                  value={formData.dropState || ''}
                  onChange={(e) => handleChange('dropState', e.target.value)}
                  className={`w-full border rounded-md p-2 ${errorClass('dropState')}`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {fieldError('dropState') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('dropState')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Pincode</span>
                <input
                  name="dropPincode"
                  value={formData.dropPincode || ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                    handleChange('dropPincode', v);
                  }}
                  inputMode="numeric"
                  pattern="\d{6}"
                  placeholder="Pincode"
                  className={`w-full border rounded-md p-2 ${errorClass('dropPincode')}`}
                />
                {fieldError('dropPincode') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('dropPincode')}</p>
                )}
              </label>
            </div>
          </div>

          {/* --- SECTION: CARGO DETAILS --- */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              Cargo Details
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label>
                <span className="block text-xs font-medium text-gray-600">Material Type</span>
                <select
                  name="materialType"
                  value={formData.materialType || ''}
                  onChange={(e) => handleChange('materialType', e.target.value)}
                  className={`w-full border rounded-md p-2 ${errorClass('materialType')}`}
                >
                  <option value="">Select material type</option>
                  {materialTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {fieldError('materialType') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('materialType')}</p>
                )}
              </label>

              {formData.materialType === 'Others' && (
                <label>
                  <span className="block text-xs font-medium text-gray-600">Custom Material Type</span>
                  <input
                    name="customMaterialType"
                    value={formData.customMaterialType || ''}
                    onChange={(e) => handleChange('customMaterialType', e.target.value)}
                    placeholder="Please specify other material"
                    className={`w-full border rounded-md p-2 ${errorClass('customMaterialType')}`}
                  />
                  {fieldError('customMaterialType') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('customMaterialType')}</p>
                  )}
                </label>
              )}

              <label>
                <span className="block text-xs font-medium text-gray-600">Weight (kg)</span>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg || ''}
                  onChange={(e) => handleChange('weightKg', e.target.value)}
                  placeholder="Weight (kg)"
                  className={`w-full border rounded-md p-2 ${errorClass('weightKg')}`}
                />
                {fieldError('weightKg') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('weightKg')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Value of Material (₹)</span>
                <input
                  type="number"
                  name="materialValue"
                  value={formData.materialValue || ''}
                  onChange={(e) => handleChange('materialValue', e.target.value)}
                  placeholder="Value of Material (₹)"
                  className={`w-full border rounded-md p-2 ${errorClass('materialValue')}`}
                />
                {fieldError('materialValue') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('materialValue')}</p>
                )}
              </label>
            </div>
          </div>

          {/* --- SECTION: DIMENSIONS --- */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">📐 Dimensions</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label>
                <span className="block text-xs font-medium text-gray-600">Length (ft)</span>
                <input
                  type="number"
                  name="lengthFt"
                  value={formData.lengthFt || ''}
                  onChange={(e) => handleChange('lengthFt', e.target.value)}
                  placeholder="Length in ft"
                  className={`w-full border rounded-md p-2 ${errorClass('lengthFt')}`}
                />
                {fieldError('lengthFt') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('lengthFt')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Width (ft)</span>
                <input
                  type="number"
                  name="widthFt"
                  value={formData.widthFt || ''}
                  onChange={(e) => handleChange('widthFt', e.target.value)}
                  placeholder="Width in ft"
                  className={`w-full border rounded-md p-2 ${errorClass('widthFt')}`}
                />
                {fieldError('widthFt') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('widthFt')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Height (ft)</span>
                <input
                  type="number"
                  name="heightFt"
                  value={formData.heightFt || ''}
                  onChange={(e) => handleChange('heightFt', e.target.value)}
                  placeholder="Height in ft"
                  className={`w-full border rounded-md p-2 ${errorClass('heightFt')}`}
                />
                {fieldError('heightFt') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('heightFt')}</p>
                )}
              </label>
            </div>
          </div>

          {/* --- SECTION: LOGISTICS & SCHEDULE --- */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              Logistics & Schedule
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label>
                <span className="block text-xs font-medium text-gray-600">Expected Pickup Date</span>
                <input
                  type="date"
                  name="expectedPickupDate"
                  value={formData.expectedPickupDate || ''}
                  onChange={(e) => handleChange('expectedPickupDate', e.target.value)}
                  min={pickupMin}
                  className={`w-full border rounded-md p-2 ${errorClass('expectedPickupDate')}`}
                />
                {fieldError('expectedPickupDate') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('expectedPickupDate')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Expected Delivery Date</span>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate || ''}
                  onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
                  min={deliveryMin}
                  className={`w-full border rounded-md p-2 ${errorClass('expectedDeliveryDate')}`}
                />
                {fieldError('expectedDeliveryDate') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('expectedDeliveryDate')}</p>
                )}
              </label>

              <label>
                <span className="block text-xs font-medium text-gray-600">Transport Mode</span>
                <select
                  name="transportMode"
                  value={formData.transportMode || ''}
                  onChange={(e) => handleChange('transportMode', e.target.value)}
                  className={`w-full border rounded-md p-2 ${errorClass('transportMode')}`}
                >
                  <option value="">Select Transport Mode</option>
                  {transportModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
                {fieldError('transportMode') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('transportMode')}</p>
                )}
              </label>

              {formData.transportMode === 'Road Transport' && (
                <label>
                  <span className="block text-xs font-medium text-gray-600">Truck Size</span>
                  <select
                    name="truckSize"
                    value={formData.truckSize || ''}
                    onChange={(e) => handleChange('truckSize', e.target.value)}
                    className={`w-full border rounded-md p-2 ${errorClass('truckSize')}`}
                  >
                    <option value="">Select Truck Size</option>
                    {truckSize.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  {fieldError('truckSize') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('truckSize')}</p>
                  )}
                </label>
              )}

              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Shipment Type */}
                <div className="p-2 bg-white border rounded-md">
                  <label className="text-xs font-medium text-gray-500">Shipment Type</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="shipmentType"
                        value="PTL"
                        checked={formData.shipmentType === 'PTL'}
                        onChange={(e) => handleChange('shipmentType', e.target.value)}
                      />{' '}
                      PTL
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="shipmentType"
                        value="FTL"
                        checked={formData.shipmentType === 'FTL'}
                        onChange={(e) => handleChange('shipmentType', e.target.value)}
                      />{' '}
                      FTL
                    </label>
                  </div>
                  {fieldError('shipmentType') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('shipmentType')}</p>
                  )}
                </div>

                {/* Body Type */}
                <div className="p-2 bg-white border rounded-md">
                  <label className="text-xs font-medium text-gray-500">Body Type</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="bodyType"
                        value="Open"
                        checked={formData.bodyType === 'Open'}
                        onChange={(e) => handleChange('bodyType', e.target.value)}
                      />{' '}
                      Open
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="bodyType"
                        value="Closed"
                        checked={formData.bodyType === 'Closed'}
                        onChange={(e) => handleChange('bodyType', e.target.value)}
                      />{' '}
                      Closed
                    </label>
                  </div>
                  {fieldError('bodyType') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('bodyType')}</p>
                  )}
                </div>

                {/* Manpower */}
                <div className="p-2 bg-white border rounded-md">
                  <label className="text-xs font-medium text-gray-500">Manpower</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="manpower"
                        value="yes"
                        checked={formData.manpower === 'yes'}
                        onChange={(e) => handleChange('manpower', e.target.value)}
                      />{' '}
                      Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="manpower"
                        value="no"
                        checked={formData.manpower === 'no'}
                        onChange={(e) => handleChange('manpower', e.target.value)}
                      />{' '}
                      No
                    </label>
                  </div>
                  {fieldError('manpower') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('manpower')}</p>
                  )}
                </div>
              </div>

              {formData.bodyType === 'Closed' && (
                <label className="col-span-1 md:col-span-2">
                  <span className="block text-xs font-medium text-gray-600">Temperature</span>
                  <select
                    name="coolingType"
                    value={formData.coolingType || ''}
                    onChange={(e) => handleChange('coolingType', e.target.value)}
                    className={`w-full border rounded-md p-2 ${errorClass('coolingType')}`}
                  >
                    <option value="">Select Temperature</option>
                    {coolingType.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {fieldError('coolingType') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('coolingType')}</p>
                  )}
                </label>
              )}

              {formData.manpower === 'yes' && (
                <div className="col-span-1 md:col-span-2 pt-2">
                  <input
                    type="number"
                    name="noOfLabours"
                    value={formData.noOfLabours || ''}
                    onChange={(e) => handleChange('noOfLabours', e.target.value)}
                    placeholder="Number of Labours"
                    className={`w-full border rounded-md p-2 ${errorClass('noOfLabours')}`}
                  />
                  {fieldError('noOfLabours') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('noOfLabours')}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- SECTION: NOTES --- */}
          <div>
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes || ''}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              className="w-full border rounded-md p-2"
              rows={3}
              placeholder="Provide any extra details or instructions here..."
            />
          </div>

          {/* Submit + helper state */}
          <div className="space-y-2">
            {!isDirty && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <AlertCircle className="w-4 h-4" />
                Make at least one change to enable the button.
              </div>
            )}
            {!isValid && isDirty && (
              <div className="flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4" />
                Please fix the highlighted fields before submitting.
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
              aria-busy={submitting}
              className={`w-full py-2.5 rounded-md font-semibold focus:ring-4 transition-colors text-white
                ${canSubmit ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300' : 'bg-blue-300 cursor-not-allowed'}
              `}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Modification
              </span>
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
};
