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
const truckSize = ['14 ft', '17 ft', '19 ft', '20 ft', '22 ft', '24 ft', '32 ft', '40 ft'];

export const ModificationRequest = ({ req, modifying, setModifying }) => {
    const [formData, setFormData] = React.useState({ ...req });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/shipments/${formData._id}`,
        formData
      );
      console.log("Update successful:", response.data);
      setModifying(false);
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

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
                  onChange={(e) => handleChange("pickupAddressLine1", e.target.value)}
                  placeholder="Building no, street"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 2</span>
                <input
                  name="pickupAddressLine2"
                  value={formData.pickupAddressLine2 || ""}
                  onChange={(e) => handleChange("pickupAddressLine2", e.target.value)}
                  placeholder="City / Area"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">State</span>
                <select
                  name="pickupState"
                  value={formData.pickupState || ""}
                  onChange={(e) => handleChange("pickupState", e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Pincode</span>
                <input
                  name="pickupPincode"
                  value={formData.pickupPincode || ""}
                  onChange={(e) => handleChange("pickupPincode", e.target.value)}
                  placeholder="Pincode"
                  className="w-full border rounded-md p-2"
                />
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
                  onChange={(e) => handleChange("dropAddressLine1", e.target.value)}
                  placeholder="Building no, street"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Address Line 2</span>
                <input
                  name="dropAddressLine2"
                  value={formData.dropAddressLine2 || ""}
                  onChange={(e) => handleChange("dropAddressLine2", e.target.value)}
                  placeholder="City / Area"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">State</span>
                <select
                  name="dropState"
                  value={formData.dropState || ""}
                  onChange={(e) => handleChange("dropState", e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Pincode</span>
                <input
                  name="dropPincode"
                  value={formData.dropPincode || ""}
                  onChange={(e) => handleChange("dropPincode", e.target.value)}
                  placeholder="Pincode"
                  className="w-full border rounded-md p-2"
                />
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
                  onChange={(e) => handleChange("materialType", e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select material type</option>
                  {materialTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              {formData.materialType === 'Others' && (
                <label>
                  <span className="block text-xs font-medium text-gray-600">Custom Material Type</span>
                  <input
                    name="customMaterialType"
                    value={formData.customMaterialType || ""}
                    onChange={(e) => handleChange("customMaterialType", e.target.value)}
                    placeholder="Please specify other material"
                    className="w-full border rounded-md p-2"
                  />
                </label>
              )}
              <label>
                <span className="block text-xs font-medium text-gray-600">Weight (kg)</span>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg || ""}
                  onChange={(e) => handleChange("weightKg", e.target.value)}
                  placeholder="Weight (kg)"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Value of Material (₹)</span>
                <input
                  type="number"
                  name="materialValue"
                  value={formData.materialValue || ""}
                  onChange={(e) => handleChange("materialValue", e.target.value)}
                  placeholder="Value of Material (₹)"
                  className="w-full border rounded-md p-2"
                />
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
                  type="number"
                  name="length"
                  value={formData.lengthFt || ""}
                  onChange={(e) => handleChange("length", e.target.value)}
                  placeholder="Length in ft"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Width (ft)</span>
                <input
                  type="number"
                  name="width"
                  value={formData.widthFt || ""}
                  onChange={(e) => handleChange("width", e.target.value)}
                  placeholder="Width in ft"
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Height (ft)</span>
                <input
                  type="number"
                  name="height"
                  value={formData.heightFt || ""}
                  onChange={(e) => handleChange("height", e.target.value)}
                  placeholder="Height in ft"
                  className="w-full border rounded-md p-2"
                />
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
                  value={formData.expectedPickupDate || ""}
                  onChange={(e) => handleChange("expectedPickupDate", e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Expected Delivery Date</span>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate || ""}
                  onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-gray-600">Transport Mode</span>
                <select
                  name="transportMode"
                  value={formData.transportMode || ""}
                  onChange={(e) => handleChange("transportMode", e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select Transport Mode</option>
                  {transportModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                </select>
              </label>
              {formData.transportMode === 'Road Transport' && (
                <label>
                  <span className="block text-xs font-medium text-gray-600">Truck Size</span>
                  <select
                    name="truckSize"
                    value={`${formData.truckSize} ft`|| ""}
                    onChange={(e) => handleChange("truckSize", e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select Truck Size</option>
                    {truckSize.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
              )}
              <label>
                <span className="block text-xs font-medium text-gray-600">Temperature</span>
                <select
                  name="coolingType"
                  value={formData.coolingType || ""}
                  onChange={(e) => handleChange("coolingType", e.target.value)}
                  className="w-full border rounded-md p-2"
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
                      onChange={(e) => handleChange("shipmentType", e.target.value)} /> PTL
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="shipmentType" value="FTL" 
                      checked={formData.shipmentType === 'FTL'} 
                      onChange={(e) => handleChange("shipmentType", e.target.value)} /> FTL
                  </label>
                </div>
              </div>
              <div className="p-2 bg-white border rounded-md">
                <label className="text-xs font-medium text-gray-500">Body Type</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="bodyType" value="Open" 
                      checked={formData.bodyType === 'Open'} 
                      onChange={(e) => handleChange("bodyType", e.target.value)} /> Open
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="bodyType" value="Closed" 
                      checked={formData.bodyType === 'Closed'} 
                      onChange={(e) => handleChange("bodyType", e.target.value)} /> Closed
                  </label>
                </div>
              </div>
              <div className="p-2 bg-white border rounded-md">
                <label className="text-xs font-medium text-gray-500">Manpower</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="manpower" value="yes" 
                      checked={formData.manpower === 'yes'} 
                      onChange={(e) => handleChange("manpower", e.target.value)} /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="manpower" value="no" 
                      checked={formData.manpower === 'no'} 
                      onChange={(e) => handleChange("manpower", e.target.value)} /> No
                  </label>
                </div>
              </div>
            </div>

            {formData.manpower === 'yes' && (
              <div className="pt-2">
                <input
                  type="number"
                  name="noOfLabours"
                  value={formData.noOfLabours || ""}
                  onChange={(e) => handleChange("noOfLabours", e.target.value)}
                  placeholder="Number of Labours"
                  className="w-full border rounded-md p-2"
                />
              </div>
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
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              className="w-full border rounded-md p-2"
              rows={3}
              placeholder="Provide any extra details or instructions here..."
            />
          </div>

          
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


