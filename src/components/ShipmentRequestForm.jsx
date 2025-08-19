import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Upload, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- Data Arrays ---
const steps = [
    { number: 1, title: "Route" },
    { number: 2, title: "Details" },
    { number: 3, title: "Logistics" },
    { number: 4, title: "Review" },
];
const materialTypes = [
    "Electronics & Technology",
    "Automotive Parts",
    "Machinery & Equipment",
    "Textiles & Clothing",
    "Food & Beverages",
    "Pharmaceuticals",
    "Chemicals",
    "Raw Materials",
    "Construction Materials",
    "Furniture & Home Goods",
    "Books & Documents",
    "Hazardous Materials",
    "Fragile Items",
    "Perishable Goods",
    "Others",
];
const transportModes = [
    "Road Transport",
    "Rail Transport",
    "Air Transport",
    "Sea Transport",
];
const vehicleTempOptions = [
    "Ambient / Non-Refrigerated",
    "Refrigerated (Chiller)",
    "Refrigerated (Frozen)",
];
const manpowerOptions = ["Yes", "No"];
const bodyTypeOptions = ["Open", "Closed"];
const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
];

// --- Validation Regex ---
const validators = {
    pincode: /^[1-9][0-9]{5}$/,
    city: /^[A-Za-z ]+$/,
    building: /^[A-Za-z0-9\s,.-]+$/,
    weight: /^[1-9][0-9]*$/,
    value: /^[1-9][0-9]*$/,
};

// --- Helper Components ---
const Stepper = ({ currentStep }) => (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-12">
        {steps.map((step, index) => (
            <React.Fragment key={step.number}>
                <div className="flex flex-col items-center text-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.number
                            ? "bg-interactive border-interactive text-white"
                            : "bg-background border-black/10 text-text/50"
                            }`}
                    >
                        {currentStep > step.number ? <Check size={20} /> : step.number}
                    </div>
                    <p
                        className={`mt-2 text-sm font-semibold transition-colors duration-300 ${currentStep >= step.number
                            ? "text-headings"
                            : "text-text/50"
                            }`}
                    >
                        {step.title}
                    </p>
                </div>
                {index < steps.length - 1 && (
                    <div
                        className={`flex-1 h-1 mx-4 transition-colors duration-300 ${currentStep > index + 1 ? "bg-interactive" : "bg-black/10"
                            }`}
                    />
                )}
            </React.Fragment>
        ))}
    </div>
);

const FormSection = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-bold text-headings border-b border-black/10 pb-2">
            {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {children}
        </div>
    </div>
);

const PreviewItem = ({ label, value, className = "" }) => (
    <div className={className}>
        <p className="text-sm text-text/60 truncate">{label}</p>
        <p className="font-semibold text-headings truncate">{value || "-"}</p>
    </div>
);

// --- Validation Helper ---
const validateStep = (step, formData) => {
    switch (step) {
        case 1:
            return (
                validators.building.test(formData.pickupBuilding) &&
                validators.city.test(formData.pickupCity) &&
                validators.pincode.test(formData.pickupPincode) &&
                validators.building.test(formData.dropBuilding) &&
                validators.city.test(formData.dropCity) &&
                validators.pincode.test(formData.dropPincode) &&
                formData.pickupState &&
                formData.dropState
            );
        case 2:
            return (
                formData.bodyType &&
                formData.materialType &&
                validators.weight.test(formData.weight) &&
                formData.vehicleTemperature &&
                formData.manpower
            );
        case 3:
            return (
                formData.expectedPickup &&
                formData.expectedDelivery &&
                formData.shipmentType &&
                formData.transportMode &&
                validators.value.test(formData.materialValue)
            );
        default:
            return true;
    }
};

// --- Main Component ---
export default function ShipmentRequestForm({ onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        pickupBuilding: "",
        pickupLandmark: "",
        pickupCity: "",
        pickupState: "",
        pickupPincode: "",
        dropBuilding: "",
        dropLandmark: "",
        dropCity: "",
        dropState: "",
        dropPincode: "",
        bodyType: "",
        materialType: "",
        customMaterialType: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        vehicleTemperature: "",
        manpower: "",
        additionalNotes: "",
        expectedPickup: "",
        expectedDelivery: "",
        shipmentType: "",
        transportMode: "",
        materialValue: "",
        billUpload: null,
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = (field, value) =>
        setFormData((prev) => ({ ...prev, [field]: value }));
    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);
    const goToStep = (stepNumber) => setStep(stepNumber);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("https://your-api.com/shipments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to submit shipment request");

            const data = await response.json();
            onComplete?.(data);
            navigate("/thank-you");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };
    const formLabel = "block mb-1.5 text-sm font-medium text-text";

    const isStepValid = validateStep(step, formData);

    const renderStepContent = () => {
        switch (step) {
            case 1: // Route
                return (
                    <div className="space-y-8">
                        <FormSection title="Pickup Address">
                            <div>
                                <label htmlFor="pickupBuilding" className={formLabel}>
                                    Building No. / Street*
                                </label>
                                <Input
                                    id="pickupBuilding"
                                    value={formData.pickupBuilding}
                                    onChange={(e) =>
                                        updateField("pickupBuilding", e.target.value)
                                    }
                                    placeholder="e.g., 123 Main St"
                                />
                                {formData.pickupBuilding &&
                                    !validators.building.test(formData.pickupBuilding) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Invalid building/street
                                        </p>
                                    )}
                            </div>
                            <div>
                                <label htmlFor="pickupLandmark" className={formLabel}>
                                    Landmark
                                </label>
                                <Input
                                    id="pickupLandmark"
                                    value={formData.pickupLandmark}
                                    onChange={(e) =>
                                        updateField("pickupLandmark", e.target.value)
                                    }
                                    placeholder="e.g., Near City Hall"
                                />
                            </div>
                            <div>
                                <label htmlFor="pickupCity" className={formLabel}>
                                    City*
                                </label>
                                <Input
                                    id="pickupCity"
                                    value={formData.pickupCity}
                                    onChange={(e) => updateField("pickupCity", e.target.value)}
                                    placeholder="e.g., Mumbai"
                                />
                                {formData.pickupCity &&
                                    !validators.city.test(formData.pickupCity) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Only letters allowed
                                        </p>
                                    )}
                            </div>
                            <div>
                                <label className={formLabel}>State*</label>
                                <Select
                                    value={formData.pickupState}
                                    onValueChange={(v) => updateField("pickupState", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a state..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {indianStates.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="pickupPincode" className={formLabel}>
                                    Pincode*
                                </label>
                                <Input
                                    id="pickupPincode"
                                    value={formData.pickupPincode}
                                    onChange={(e) =>
                                        updateField("pickupPincode", e.target.value)
                                    }
                                    placeholder="e.g., 400001"
                                />
                                {formData.pickupPincode &&
                                    !validators.pincode.test(formData.pickupPincode) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Invalid pincode
                                        </p>
                                    )}
                            </div>
                        </FormSection>

                        <FormSection title="Drop Address">
                            <div>
                                <label htmlFor="dropBuilding" className={formLabel}>
                                    Building No. / Street*
                                </label>
                                <Input
                                    id="dropBuilding"
                                    value={formData.dropBuilding}
                                    onChange={(e) => updateField("dropBuilding", e.target.value)}
                                    placeholder="e.g., 456 Tech Park"
                                />
                                {formData.dropBuilding &&
                                    !validators.building.test(formData.dropBuilding) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Invalid building/street
                                        </p>
                                    )}
                            </div>
                            <div>
                                <label htmlFor="dropLandmark" className={formLabel}>
                                    Landmark
                                </label>
                                <Input
                                    id="dropLandmark"
                                    value={formData.dropLandmark}
                                    onChange={(e) => updateField("dropLandmark", e.target.value)}
                                    placeholder="e.g., Opposite Metro Station"
                                />
                            </div>
                            <div>
                                <label htmlFor="dropCity" className={formLabel}>
                                    City*
                                </label>
                                <Input
                                    id="dropCity"
                                    value={formData.dropCity}
                                    onChange={(e) => updateField("dropCity", e.target.value)}
                                    placeholder="e.g., Delhi"
                                />
                                {formData.dropCity &&
                                    !validators.city.test(formData.dropCity) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Only letters allowed
                                        </p>
                                    )}
                            </div>
                            <div>
                                <label className={formLabel}>State*</label>
                                <Select
                                    value={formData.dropState}
                                    onValueChange={(v) => updateField("dropState", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a state..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {indianStates.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="dropPincode" className={formLabel}>
                                    Pincode*
                                </label>
                                <Input
                                    id="dropPincode"
                                    value={formData.dropPincode}
                                    onChange={(e) => updateField("dropPincode", e.target.value)}
                                    placeholder="e.g., 110001"
                                />
                                {formData.dropPincode &&
                                    !validators.pincode.test(formData.dropPincode) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Invalid pincode
                                        </p>
                                    )}
                            </div>
                        </FormSection>

                        <Button
                            onClick={nextStep}
                            className="w-full"
                            disabled={!isStepValid}
                        >
                            Next <ChevronRight size={16} />
                        </Button>
                    </div>
                );

            case 2: // Details
                return (
                    <div className="space-y-8">
                        <FormSection title="Material & Dimensions">
                            <div>
                                <label className={formLabel}>Material Type*</label>
                                <Select
                                    value={formData.materialType}
                                    onValueChange={(v) => updateField("materialType", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select material..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {materialTypes.map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.materialType === "Others" && (
                                <div>
                                    <label htmlFor="customMaterialType" className={formLabel}>
                                        Specify Material
                                    </label>
                                    <Input
                                        id="customMaterialType"
                                        value={formData.customMaterialType}
                                        onChange={(e) =>
                                            updateField("customMaterialType", e.target.value)
                                        }
                                        placeholder="e.g., Industrial Coils"
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="weight" className={formLabel}>
                                    Total Weight (kg)*
                                </label>
                                <Input
                                    id="weight"
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => updateField("weight", e.target.value)}
                                    placeholder="e.g., 1000"
                                />
                                {formData.weight && !validators.weight.test(formData.weight) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Enter a valid number
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2 grid grid-cols-3 gap-2">
                                <div>
                                    <label htmlFor="length" className={formLabel}>
                                        Length (ft)
                                    </label>
                                    <Input
                                        id="length"
                                        type="number"
                                        value={formData.length}
                                        onChange={(e) => updateField("length", e.target.value)}
                                        placeholder="L"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="width" className={formLabel}>
                                        Width (ft)
                                    </label>
                                    <Input
                                        id="width"
                                        type="number"
                                        value={formData.width}
                                        onChange={(e) => updateField("width", e.target.value)}
                                        placeholder="W"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className={formLabel}>
                                        Height (ft)
                                    </label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => updateField("height", e.target.value)}
                                        placeholder="H"
                                    />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Special Requirements">
                            <div>
                                <label className={formLabel}>Body Type*</label>
                                <Select
                                    value={formData.bodyType}
                                    onValueChange={(v) => updateField("bodyType", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select body type..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {bodyTypeOptions.map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={formLabel}>Vehicle Temperature*</label>
                                <Select
                                    value={formData.vehicleTemperature}
                                    onValueChange={(v) => updateField("vehicleTemperature", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select temp..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {vehicleTempOptions.map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className={formLabel}>Manpower for Loading*</label>
                                <Select
                                    value={formData.manpower}
                                    onValueChange={(v) => updateField("manpower", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {manpowerOptions.map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="additionalNotes" className={formLabel}>
                                    Additional Notes
                                </label>
                                <Input
                                    as="textarea"
                                    className="h-24"
                                    id="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={(e) =>
                                        updateField("additionalNotes", e.target.value)
                                    }
                                    placeholder="e.g., Handle with care, specific delivery instructions..."
                                />
                            </div>
                        </FormSection>

                        <div className="flex gap-4">
                            <Button onClick={prevStep} className="w-[20%]" variant="outline">
                                Back
                            </Button>
                            <Button
                                onClick={nextStep}
                                className="w-[80%] hover:cursor-pointer"
                                disabled={!isStepValid}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                );

            case 3: // Logistics
                return (
                    <div className="space-y-8">
                        <FormSection title="Dates & Logistics">
                            <div>
                                <label htmlFor="expectedPickup" className={formLabel}>
                                    Expected Pickup Date*
                                </label>
                                <Input
                                    id="expectedPickup"
                                    type="date"
                                    value={formData.expectedPickup}
                                    onChange={(e) =>
                                        updateField("expectedPickup", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="expectedDelivery" className={formLabel}>
                                    Expected Delivery Date*
                                </label>
                                <Input
                                    id="expectedDelivery"
                                    type="date"
                                    value={formData.expectedDelivery}
                                    onChange={(e) =>
                                        updateField("expectedDelivery", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className={formLabel}>Shipment Type*</label>
                                <Select
                                    value={formData.shipmentType}
                                    onValueChange={(v) => updateField("shipmentType", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {["Full Truck Load", "Part Truck Load"].map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className={formLabel}>Mode of Transport*</label>
                                <Select
                                    value={formData.transportMode}
                                    onValueChange={(v) => updateField("transportMode", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[99] bg-background border border-black/10 shadow-lg">
                                        {transportModes.map((o) => (
                                            <SelectItem key={o} value={o}>
                                                {o}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </FormSection>

                        <FormSection title="Value & Documents">
                            <div>
                                <label htmlFor="materialValue" className={formLabel}>
                                    Value of Material (INR)*
                                </label>
                                <Input
                                    id="materialValue"
                                    type="number"
                                    value={formData.materialValue}
                                    onChange={(e) =>
                                        updateField("materialValue", e.target.value)
                                    }
                                    placeholder="e.g., 50000"
                                />
                                {formData.materialValue &&
                                    !validators.value.test(formData.materialValue) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Enter a valid amount
                                        </p>
                                    )}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="billUpload" className={formLabel}>
                                    Upload Bill (Optional)
                                </label>
                                <label
                                    htmlFor="billUpload"
                                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-interactive"
                                >
                                    <Upload size={20} className="mr-2 text-text/60" />
                                    <span>
                                        {formData.billUpload
                                            ? formData.billUpload.name
                                            : "Click to upload"}
                                    </span>
                                </label>
                                <Input
                                    id="billUpload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => updateField("billUpload", e.target.files[0])}
                                />
                            </div>
                        </FormSection>

                        <div className="flex gap-4">
                            <Button className="w-[20%]" onClick={prevStep} variant="outline">
                                Back
                            </Button>
                            <Button
                                onClick={nextStep}
                                className="w-[80%] hover:cursor-pointer"
                                disabled={!isStepValid}
                            >
                                Preview Details
                            </Button>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-headings">
                                Review Your Request
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
                                <Edit size={14} className="mr-2" />
                                Edit
                            </Button>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-background rounded-lg space-y-4">
                                <h4 className="font-semibold text-headings">Route</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <PreviewItem
                                        label="Pickup Address"
                                        value={`${formData.pickupBuilding}, ${formData.pickupCity}, ${formData.pickupState} - ${formData.pickupPincode}`}
                                        className="md:col-span-2"
                                    />
                                    <PreviewItem
                                        label="Drop Address"
                                        value={`${formData.dropBuilding}, ${formData.dropCity}, ${formData.dropState} - ${formData.dropPincode}`}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-lg space-y-4">
                                <h4 className="font-semibold text-headings">
                                    Shipment Details
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <PreviewItem label="Body Type" value={formData.bodyType} />
                                    <PreviewItem
                                        label="Material"
                                        value={
                                            formData.materialType === "Others"
                                                ? formData.customMaterialType
                                                : formData.materialType
                                        }
                                    />
                                    <PreviewItem label="Weight" value={`${formData.weight} kg`} />
                                    <PreviewItem
                                        label="Temperature"
                                        value={formData.vehicleTemperature}
                                    />
                                    <PreviewItem label="Manpower" value={formData.manpower} />
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-lg space-y-4">
                                <h4 className="font-semibold text-headings">Logistics</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <PreviewItem
                                        label="Pickup Date"
                                        value={formData.expectedPickup}
                                    />
                                    <PreviewItem
                                        label="Delivery Date"
                                        value={formData.expectedDelivery}
                                    />
                                    <PreviewItem
                                        label="Value"
                                        value={`₹${formData.materialValue}`}
                                    />
                                    <PreviewItem
                                        label="Bill"
                                        value={formData.billUpload?.name}
                                    />
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-4">
                                <Button onClick={prevStep} variant="outline">
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    variant="cta"
                                    className="w-[80%] hover:cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Confirm & Submit Request"}
                                </Button>
                            </div>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-black/5">
            <Stepper currentStep={step} />
            {error && (
                <p className="mb-4 text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">
                    {error}
                </p>
            )}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    {...formVariants}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {renderStepContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
