import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../components/ui/Switch';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import OtpInput from '../components/Otp_input';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Component for the progress bar ---
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full mb-8">
      <p className="text-sm text-center text-text/60 mb-2">Step {currentStep} of {totalSteps}</p>
      <div className="w-full bg-black/10 rounded-full h-2">
        <motion.div
          className="bg-interactive h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>
    </div>
  );
};

// --- Main Signup Page Component ---
export default function SignupFormPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('shipper');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gst, setGst] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNextStep = () => setStep(prev => prev + 1);

  const handleSendOtp = () => {
    setError('');
    if (phone.match(/^\d{10}$/)) {
      setIsLoading(true);
      setTimeout(() => { // Simulate API call
        setShowOtp(true);
        setIsLoading(false);
      }, 1000);
    } else {
      setError('Please enter a valid 10-digit phone number.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Final validation can be added here
    console.log('Form Submitted!', { role, phone, email, gst });
    const destination = role === 'shipper' ? '/shipper-registration' : '/carrier-registration';
    navigate(destination);
  };

  const formAnimation = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { ease: "easeInOut", duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row items-center justify-center p-6">
      {/* Left Side: Company Motto */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left mb-12 md:mb-0 md:pr-10">
        <img src="/LOGO_LxJ2.png" alt="LogiXjunction Logo" className="h-20 w-24 mx-auto md:mx-0" />
        <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mt-4">
          YOUR JUNCTION TO <br />
          <span className="text-accent-cta">SMART</span>{' '}
          <span className="text-interactive">LOGISTICS</span>
        </h1>
        <p className="text-text/70 mt-4 max-w-md mx-auto md:mx-0">
          Join India's fastest-growing digital freight network. A few simple steps and you're ready to go.
        </p>
      </div>

      {/* Right Side: Multi-Step Signup Form */}
      <div className="w-full max-w-lg bg-white rounded-lg p-8 border border-black/5">
        <ProgressIndicator currentStep={step} totalSteps={3} />
        <AnimatePresence mode="wait">
          <motion.div key={step} {...formAnimation}>
            
            {/* --- STEP 1: ROLE SELECTION --- */}
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-headings mb-4">Are you a Shipper or a Transporter?</h2>
                <p className="text-text/70 mb-8">Select your role to get started.</p>
                <div className="flex items-center justify-center gap-4 my-6">
                  <span className={`font-medium transition ${role === 'shipper' ? 'text-accent-cta' : 'text-text/60'}`}>Shipper</span>
                  <Switch checked={role === 'transporter'} onCheckedChange={() => setRole(r => r === 'shipper' ? 'transporter' : 'shipper')} />
                  <span className={`font-medium transition ${role === 'transporter' ? 'text-interactive' : 'text-text/60'}`}>Transporter</span>
                </div>
                <Button onClick={handleNextStep} className="w-full mt-8 font-semibold bg-accent-cta cursor-pointer">Next</Button>
              </div>
            )}
            
            {/* --- STEP 2: PHONE VERIFICATION --- */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-center text-headings">Verify Your Phone Number</h2>
                <div>
                  <label htmlFor="phone" className="block mb-1.5 text-sm font-medium text-text">Phone Number</label>
                  <div className="flex gap-2">
                    <Input id="phone" type="tel" placeholder="Enter 10-digit phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={showOtp} />
                    <Button type="button" onClick={handleSendOtp} disabled={isLoading || showOtp}>
                      {isLoading ? 'Sending...' : (showOtp ? 'Sent' : 'Send OTP')}
                    </Button>
                  </div>
                </div>
                {showOtp && !otpVerified && <OtpInput onVerify={() => { setOtpVerified(true); setError(''); }} />}
                {error && <p className="text-sm text-center text-red-600">{error}</p>}
                <Button onClick={handleNextStep} disabled={!otpVerified} className="w-full font-semibold bg-accent-cta cursor-pointer">
                  {otpVerified ? 'Next' : 'Verify to Continue'}
                </Button>
              </div>
            )}
            
            {/* --- STEP 3: BUSINESS DETAILS --- */}
            {step === 3 && (
               <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-center text-headings">Final Details</h2>
                <div>
                  <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-text">Email</label>
                  <Input id="email" type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="gst" className="block mb-1.5 text-sm font-medium text-text">GST Number</label>
                  <Input id="gst" type="text" placeholder="Enter GST number" value={gst} onChange={(e) => setGst(e.target.value.toUpperCase())} required />
                  <small className="text-xs text-text/60">Format: 11AAAAA1111A1Z1</small>
                </div>
                <Button type="submit" variant="cta" className="w-full font-semibold bg-accent-cta cursor-pointer">Submit & Create Account</Button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}