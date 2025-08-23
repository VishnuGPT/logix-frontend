import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Package, Truck, FileText 
} from 'lucide-react';
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
const truckSize = ['14', '17', '19', '20', '22', '24', '32', '40'];

export const ModificationRequest = ({ req, modifying, setModifying }) => {
    const [formData, setFormData] = React.useState({ ...req });
    const [errors, setErrors] = React.useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Regex to filter input in real-time
    const integerOnlyRegex = /^\d*$/;
    const decimalOnlyRegex = /^\d*\.?\d*$/;
    const pincodeRegex = /^\d{0,6}$/;

    let shouldUpdate = true;

    switch (name) {
        case 'pickupPincode':
        case 'dropPincode':
            if (!pincodeRegex.test(value)) shouldUpdate = false;
            break;
        case 'weightKg':
        case 'materialValue':
        case 'noOfLabours':
            if (!integerOnlyRegex.test(value)) shouldUpdate = false;
            break;
        case 'lengthFt':
        case 'widthFt':
        case 'heightFt':
            if (!decimalOnlyRegex.test(value)) shouldUpdate = false;
            break;
        default:
            // For other fields (selects, textareas, etc.), allow update
            break;
    }

    if (shouldUpdate) {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear the error for this field as the user is typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Pincode validation
    if (formData.pickupPincode && formData.pickupPincode.length !== 6) newErrors.pickupPincode = "Pincode must be 6 digits.";
    else if (!formData.pickupPincode) newErrors.pickupPincode = "Pincode is required.";

    if (formData.dropPincode && formData.dropPincode.length !== 6) newErrors.dropPincode = "Pincode must be 6 digits.";
    else if (!formData.dropPincode) newErrors.dropPincode = "Pincode is required.";

    // Date validation
    if (formData.expectedPickupDate && formData.expectedDeliveryDate) {
        if (new Date(formData.expectedPickupDate) >= new Date(formData.expectedDeliveryDate)) {
            newErrors.expectedDeliveryDate = "Delivery date must be after pickup date.";
        }
    } else {
        if (!formData.expectedPickupDate) newErrors.expectedPickupDate = "Pickup date is required.";
        if (!formData.expectedDeliveryDate) newErrors.expectedDeliveryDate = "Delivery date is required.";
    }

    // Other required fields
    if (!formData.weightKg) newErrors.weightKg = "Weight is required.";
    if (!formData.materialValue) newErrors.materialValue = "Value is required.";
    if (!formData.lengthFt) newErrors.lengthFt = "Length is required.";
    if (!formData.widthFt) newErrors.widthFt = "Width is required.";
    if (!formData.heightFt) newErrors.heightFt = "Height is required.";
    if (formData.manpower === 'yes' && !formData.noOfLabours) newErrors.noOfLabours = "Number of labourers is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(`http://localhost:5000/api/shipments/${formData._id}`, formData);
        console.log("Update successful:", response.data);
        setModifying(false); // Close form on success
      } catch (error) {
        console.error("Error updating shipment:", error);
        setErrors(prev => ({ ...prev, submit: 'Failed to submit modification. Please try again.' }));
      }
    }
  };

  const inputClass = (name) => `w-full border rounded-md p-2 ${errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-blue-500 focus:ring-1 focus:outline-none transition-colors`;
  const errorText = (name) => errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>;

  return (
    <AnimatePresence>
      {modifying && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
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
                  value={formData.pickupAddressLine1 || ""}
                  onChange={handleInputChange}
                  placeholder="Building no, street"
                  className={inputClass('pickupAddressLine1')}
                />
                {errorText('pickupAddressLine1')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 2</span>
                <input
                  name="pickupAddressLine2"
                  value={formData.pickupAddressLine2 || ""}
                  onChange={handleInputChange}
                  placeholder="City / Area"
                  className={inputClass('pickupAddressLine2')}
                />
                {errorText('pickupAddressLine2')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">State</span>
                <select
                  name="pickupState"
                  value={formData.pickupState || ""}
                  onChange={handleInputChange}
                  className={inputClass('pickupState')}
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                {errorText('pickupState')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Pincode</span>
                <input
                  name="pickupPincode"
                  value={formData.pickupPincode || ""}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className={inputClass('pickupPincode')}
                  maxLength={6}
                />
                {errorText('pickupPincode')}
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
                  value={formData.dropAddressLine1 || ""}
                  onChange={handleInputChange}
                  placeholder="Building no, street"
                  className={inputClass('dropAddressLine1')}
                />
                {errorText('dropAddressLine1')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 2</span>
                <input
                  name="dropAddressLine2"
                  value={formData.dropAddressLine2 || ""}
                  onChange={handleInputChange}
                  placeholder="City / Area"
                  className={inputClass('dropAddressLine2')}
                />
                {errorText('dropAddressLine2')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">State</span>
                <select
                  name="dropState"
                  value={formData.dropState || ""}
                  onChange={handleInputChange}
                  className={inputClass('dropState')}
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                {errorText('dropState')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Pincode</span>
                <input
                  name="dropPincode"
                  value={formData.dropPincode || ""}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className={inputClass('dropPincode')}
                  maxLength={6}
                />
                {errorText('dropPincode')}
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
                  value={formData.materialType || ""}
                  onChange={handleInputChange}
                  className={inputClass('materialType')}
                >
                  <option value="">Select material type</option>
                  {materialTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errorText('materialType')}
              </label>
              {formData.materialType === 'Others' && (
                <label>
                  <span className="block text-xs font-medium text-gray-600">Custom Material Type</span>
                  <input
                    name="customMaterialType"
                    value={formData.customMaterialType || ""}
                    onChange={handleInputChange}
                    placeholder="Please specify other material"
                    className={inputClass('customMaterialType')}
                  />
                  {errorText('customMaterialType')}
                </label>
              )}
              <label>
                <span className="block text-xs font-medium text-gray-600">Weight (kg)</span>
                <input
                  type="text"
                  name="weightKg"
                  value={formData.weightKg || ""}
                  onChange={handleInputChange}
                  placeholder="Weight (kg)"
                  className={inputClass('weightKg')}
                />
                {errorText('weightKg')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Value of Material (₹)</span>
                <input
                  type="text"
                  name="materialValue"
                  value={formData.materialValue || ""}
                  onChange={handleInputChange}
                  placeholder="Value of Material (₹)"
                  className={inputClass('materialValue')}
                />
                {errorText('materialValue')}
              </label>
            </div>
          </div>

          {/* --- SECTION: DIMENSIONS --- */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              📐 Dimensions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label>
                <span className="block text-xs font-medium text-gray-600">Length (ft)</span>
                <input
                  type="text"
                  name="lengthFt"
                  value={formData.lengthFt || ""}
                  onChange={handleInputChange}
                  placeholder="Length in ft"
                  className={inputClass('lengthFt')}
                />
                {errorText('lengthFt')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Width (ft)</span>
                <input
                  type="text"
                  name="widthFt"
                  value={formData.widthFt || ""}
                  onChange={handleInputChange}
                  placeholder="Width in ft"
                  className={inputClass('widthFt')}
                />
                {errorText('widthFt')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Height (ft)</span>
                <input
                  type="text"
                  name="heightFt"
                  value={formData.heightFt || ""}
                  onChange={handleInputChange}
                  placeholder="Height in ft"
                  className={inputClass('heightFt')}
                />
                {errorText('heightFt')}
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
                  value={formData.expectedPickupDate?.split('T')[0] || ""}
                  onChange={handleInputChange}
                  className={inputClass('expectedPickupDate')}
                />
                {errorText('expectedPickupDate')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Expected Delivery Date</span>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate?.split('T')[0] || ""}
                  onChange={handleInputChange}
                  className={inputClass('expectedDeliveryDate')}
                />
                {errorText('expectedDeliveryDate')}
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Transport Mode</span>
                <select
                  name="transportMode"
                  value={formData.transportMode || ""}
                  onChange={handleInputChange}
                  className={inputClass('transportMode')}
                >
                  <option value="">Select Transport Mode</option>
                  {transportModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                </select>
                {errorText('transportMode')}
              </label>
              {formData.transportMode === 'Road Transport' && (
                <label>
                  <span className="block text-xs font-medium text-gray-600">Truck Size</span>
                  <select
                    name="truckSize"
                    value={formData.truckSize || ""}
                    onChange={handleInputChange}
                    className={inputClass('truckSize')}
                  >
                    <option value="">Select Truck Size</option>
                    {truckSize.map(size => <option key={size} value={size}>{size} ft</option>)}
                  </select>
                  {errorText('truckSize')}
                </label>
              )}
              <label>
                <span className="block text-xs font-medium text-gray-600">Temperature</span>
                <select
                  name="coolingType"
                  value={formData.coolingType || ""}
                  onChange={handleInputChange}
                  className={inputClass('coolingType')}
                >
                  <option value="">Select Temperature</option>
                  {coolingType.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
            </div>

            {/* Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-2 bg-white border rounded-md">
                <label className="text-xs font-medium text-gray-500">Shipment Type</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="shipmentType" value="PTL" 
                      checked={formData.shipmentType === 'PTL'}
                      onChange={handleInputChange} /> PTL
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="shipmentType" value="FTL" 
                      checked={formData.shipmentType === 'FTL'}
                      onChange={handleInputChange} /> FTL
                  </label>
                </div>
              </div>
              <div className="p-2 bg-white border rounded-md">
                <label className="text-xs font-medium text-gray-500">Body Type</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="bodyType" value="Open"
                      checked={formData.bodyType === 'Open'}
                      onChange={handleInputChange} /> Open
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="bodyType" value="Closed"
                      checked={formData.bodyType === 'Closed'}
                      onChange={handleInputChange} /> Closed
                  </label>
                </div>
              </div>
              <div className="p-2 bg-white border rounded-md">
                <label className="text-xs font-medium text-gray-500">Manpower</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="manpower" value="yes"
                      checked={formData.manpower === 'yes'}
                      onChange={handleInputChange} /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="manpower" value="no"
                      checked={formData.manpower === 'no'}
                      onChange={handleInputChange} /> No
                  </label>
                </div>
              </div>
            </div>

            {formData.manpower === 'yes' && (
              <label className="block pt-2">
                <span className="block text-xs font-medium text-gray-600">Number of Labours</span>
                <input
                  type="text"
                  name="noOfLabours"
                  value={formData.noOfLabours || ""}
                  onChange={handleInputChange}
                  placeholder="Number of Labours"
                  className={inputClass('noOfLabours')}
                />
                {errorText('noOfLabours')}
              </label>
            )}
          </div>

          {/* --- SECTION: NOTES --- */}
          <div>
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes || ""}
              name="additionalNotes"
              onChange={handleInputChange}
              className={inputClass('additionalNotes')}
              rows={3}
              placeholder="Provide any extra details or instructions here..."
            />
          </div>
          {errors.submit && <p className="text-sm text-red-500 text-center py-2">{errors.submit}</p>}
          
          <button   
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
          >
            Submit Modification
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
};
