import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Stepper component
const steps = [
  { number: 1, title: "Route" },
  { number: 2, title: "Details" },
  { number: 3, title: "Logistics" },
];
const Stepper = ({ currentStep }) => (
  <div className="flex items-center justify-center w-full max-w-md mx-auto mb-12">
    {steps.map((step, index) => (
      <React.Fragment key={step.number}>
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              currentStep >= step.number
                ? "bg-interactive border-interactive text-white"
                : "bg-background border-black/10 text-text/50"
            }`}
          >
            {currentStep > step.number ? <Check size={20} /> : step.number}
          </div>
          <p
            className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
              currentStep >= step.number ? "text-headings" : "text-text/50"
            }`}
          >
            {step.title}
          </p>
        </div>
        {index < steps.length - 1 && (
          <div
            className={`flex-1 h-1 mx-4 transition-colors duration-300 ${
              currentStep > index + 1 ? "bg-interactive" : "bg-black/10"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const materialTypes = [
  "Electronics",
  "Automotive",
  "Machinery",
  "Textiles",
  "Food",
  "Pharmaceuticals",
  "Chemicals",
  "Raw Materials",
  "Others",
];
const shipmentTypes = ["Full Truck Load", "Part Truck Load"];
const loadingOptions = ["Yes", "No"];
const coolingTypes = [
  "None",
  "Refrigerated",
  "Frozen",
  "Temperature Controlled",
];

export default function ShipmentRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    materialType: "",
    coolingType: "",
    loadingAssistance: "",
    additionalNotes: "",
    weight: "",
    goodsValue: "",
    length: "",
    width: "",
    height: "",
    estimatedDeliveryDate: "",
    shipmentType: "",
    ebayBill: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setError("");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setError("");
    if (
      step === 1 &&
      (!formData.pickupLocation ||
        !formData.dropLocation ||
        !formData.pickupDate)
    ) {
      setError("Please fill in all route and date details.");
      return;
    }
    if (
      step === 2 &&
      (!formData.materialType ||
        !formData.coolingType ||
        !formData.loadingAssistance)
    ) {
      setError("Please select an option for all shipment details.");
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: add submit logic
  };

  const formVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };
  const formLabel = "block mb-1.5 text-sm font-medium text-text";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-headings">
              Where is your shipment going?
            </h3>
            <div>
              <label htmlFor="pickupLocation" className={formLabel}>
                Pickup Location
              </label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) =>
                  updateField("pickupLocation", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label htmlFor="dropLocation" className={formLabel}>
                Drop Location
              </label>
              <Input
                id="dropLocation"
                value={formData.dropLocation}
                onChange={(e) => updateField("dropLocation", e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="pickupDate" className={formLabel}>
                Pickup Date
              </label>
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => updateField("pickupDate", e.target.value)}
                required
              />
            </div>
            <Button onClick={nextStep} className="w-full">
              Next <ChevronRight size={16} />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-headings">
              Shipment Details
            </h3>
            <div>
              <label className={formLabel}>Material Type</label>
              <Select
                value={formData.materialType}
                onValueChange={(v) => updateField("materialType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {materialTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={formLabel}>Cooling Type</label>
              <Select
                value={formData.coolingType}
                onValueChange={(v) => updateField("coolingType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cooling type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {coolingTypes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={formLabel}>Loading Assistance</label>
              <Select
                value={formData.loadingAssistance}
                onValueChange={(v) => updateField("loadingAssistance", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yes / No" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {loadingOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="additionalNotes" className={formLabel}>
                Additional Notes (Optional)
              </label>
              <Input
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) =>
                  updateField("additionalNotes", e.target.value)
                }
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                Back
              </Button>
              <Button onClick={nextStep} className="w-full">
                Next
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-headings">
              Final Logistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={formLabel}>Weight (kg)</label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={formLabel}>Goods Value (INR)</label>
                <Input
                  type="number"
                  value={formData.goodsValue}
                  onChange={(e) => updateField("goodsValue", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={formLabel}>Length (ft)</label>
                <Input
                  type="number"
                  value={formData.length}
                  onChange={(e) => updateField("length", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={formLabel}>Width (ft)</label>
                <Input
                  type="number"
                  value={formData.width}
                  onChange={(e) => updateField("width", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={formLabel}>Height (ft)</label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={formLabel}>Est. Delivery Date</label>
                <Input
                  type="date"
                  value={formData.estimatedDeliveryDate}
                  onChange={(e) =>
                    updateField("estimatedDeliveryDate", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className={formLabel}>Shipment Type</label>
              <Select
                value={formData.shipmentType}
                onValueChange={(v) => updateField("shipmentType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipment type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {shipmentTypes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="ebayBill" className={formLabel}>
                Upload eBay Bill (Optional)
              </label>
              <label
                htmlFor="ebayBill"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-interactive"
              >
                <Upload size={20} className="mr-2 text-text/60" />
                <span className="text-sm text-text/80">
                  {formData.ebayBill
                    ? formData.ebayBill.name
                    : "Click to upload a file"}
                </span>
              </label>
              <Input
                id="ebayBill"
                type="file"
                className="hidden"
                onChange={(e) => updateField("ebayBill", e.target.files[0])}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                Back
              </Button>
              <Button
                type="submit"
                variant="cta"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Create Shipment"}
              </Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-headings">
            Create a New Shipment
          </h1>
          <p className="text-text/70 mt-2">
            Follow the steps to complete your shipment request.
          </p>
        </div>
        <Stepper currentStep={step} />
        <div className="bg-white rounded-lg p-8 border border-black/5 shadow-sm">
          {error && (
            <p className="mb-4 text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
