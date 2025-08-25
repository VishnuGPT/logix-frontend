import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, Lock, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderOne } from '@/components/ui/loader';

// --- Helper Components ---
const Stepper = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-12">
    {steps.map((step, index) => (
      <React.Fragment key={step.number}>
        <div className="flex flex-col items-center text-center z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.number ? "bg-interactive border-interactive text-white" : "bg-white border-black/10 text-text/50"}`}>
            {currentStep > step.number ? <Check size={20} /> : step.number}
          </div>
          <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${currentStep >= step.number ? "text-headings" : "text-text/50"}`}>{step.title}</p>
        </div>
        {index < steps.length - 1 && (<div className={`flex-1 h-1 mx-4 transition-colors duration-300 ${currentStep > index + 1 ? "bg-interactive" : "bg-black/10"}`} />)}
      </React.Fragment>
    ))}
  </div>
);

const FormSection = ({ icon: Icon, title, children }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="h-5 w-5 text-interactive" />
      <h3 className="text-lg font-semibold text-headings">{title}</h3>
    </div>
    {children}
  </div>
);


// --- Main Shipper Signup Component ---
export default function ShipperSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '', companyGst: '', companyEmail: '', companyAddress: '',
    pocName: '', pocDesignation: '', pocContact: '',
    ownerName: '', ownerContact: '', password: '', confirmPassword: ''
  });
  const [gstVerified, setGstVerified] = useState(false);
  const [gstVerifying, setGstVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const stepsConfig = [{ number: 1, title: 'Account' }, { number: 2, title: 'Company' }, { number: 3, title: 'Contacts' }];

  const updateField = (field, value) => {
    setFormData(previousState => ({
      ...previousState,
      [field]: value
    }));
  };

  const handleNextStep = () => { /* ... your handleNextStep logic */ setStep(s => s + 1); }; // Simplified for example
  const handlePrevStep = () => setStep(s => s - 1);
  const handleGstVerify = () => { /* ... GST verify logic */ setGstVerified(true); };
  const handleSubmit = (e) => { e.preventDefault(); /* ... final submit logic */ };

  const formVariants = { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };
  const formLabel = "block mb-1.5 text-sm font-medium text-text";

  // IMPROVEMENT: Refined input styles for a modern look
  const inputClassName = "bg-black/5 border-transparent focus:bg-white focus:border-interactive";

  const renderStepContent = () => {
    switch (step) {
      case 1: // Account Setup
        return (
          <div className="space-y-6">
            <FormSection icon={User} title="Create Your Account">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={formLabel}>Contact Phone*</label><Input className={inputClassName} value={formData.pocContact} onChange={e => updateField('pocContact', e.target.value)} /></div>
                <div><label className={formLabel}>Company Email*</label><Input className={inputClassName} type="email" value={formData.companyEmail} onChange={e => updateField('companyEmail', e.target.value)} /></div>
                <div><label className={formLabel}>Create Password*</label><Input className={inputClassName} type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} /></div>
                <div><label className={formLabel}>Confirm Password*</label><Input className={inputClassName} type="password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} /></div>
                <div className="md:col-span-2"><label className={formLabel}>GST Number*</label>
                  <div className="flex gap-2">
                    <Input className={inputClassName} value={formData.companyGst} onChange={e => updateField('companyGst', e.target.value)} />
                    <Button type="button" onClick={handleGstVerify} disabled={gstVerifying || gstVerified}>{gstVerifying ? 'Verifying...' : gstVerified ? 'Verified' : 'Verify'}</Button>
                  </div>
                </div>
              </div>
            </FormSection>
            <Button onClick={handleNextStep} className="w-full">Next <ChevronRight size={16} /></Button>
          </div>
        );
      // ... other cases remain the same, but you would add `className={inputClassName}` to other <Input> components.
      case 2:
        return (
          <div className="space-y-6">
            <FormSection icon={Building} title="Company Information">
              <div className="grid grid-cols-1">
                <div><label className={formLabel}>Company Name*</label><Input className={inputClassName} value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} /></div>
                <div className="mt-4"><label className={formLabel}>Company Address*</label><Input as="textarea" className={`${inputClassName} h-24`} value={formData.companyAddress} onChange={e => updateField('companyAddress', e.target.value)} /></div>
              </div>
            </FormSection>
            <div className="flex gap-4"><Button onClick={handlePrevStep} variant="outline">Back</Button><Button onClick={handleNextStep} className="w-full">Next</Button></div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection icon={User} title="Point of Contact & Owner Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={formLabel}>POC Name*</label><Input className={inputClassName} value={formData.pocName} onChange={e => updateField('pocName', e.target.value)} /></div>
                <div><label className={formLabel}>POC Designation*</label><Input className={inputClassName} value={formData.pocDesignation} onChange={e => updateField('pocDesignation', e.target.value)} /></div>
                <div className="border-t border-black/10 md:col-span-2 my-4"></div>
                <div><label className={formLabel}>Owner Name*</label><Input className={inputClassName} value={formData.ownerName} onChange={e => updateField('ownerName', e.target.value)} /></div>
                <div><label className={formLabel}>Owner Contact*</label><Input className={inputClassName} value={formData.ownerContact} onChange={e => updateField('ownerContact', e.target.value)} /></div>
              </div>
            </FormSection>
            <div className="flex gap-4"><Button onClick={handlePrevStep} variant="outline">Back</Button><Button type="submit" variant="cta" className="w-full" disabled={isSubmitting}>{isSubmitting ? (
              <>
                <LoaderOne />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              'Complete Registration'
            )}</Button></div>
          </form>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* IMPROVEMENT: Dynamic animated background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-interactive/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-cta/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-headings">Shipper Registration</h1>
          <p className="text-text/70 mt-2">Join our network in a few simple steps to streamline your shipping operations.</p>
        </div>
        <Stepper currentStep={step} steps={stepsConfig} />

        {/* IMPROVEMENT: "Glass" form card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-lg p-8 border border-white/20 shadow-lg">
          {error && (<p className="mb-4 text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>)}
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={formVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, ease: "easeInOut" }}>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}