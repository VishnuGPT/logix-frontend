import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../components/ui/Switch';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import OtpInput from '../components/Otp_input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContactNumber, setOwnerContactNumber] = useState('');


  const navigate = useNavigate();

  const handleNextStep = () => setStep(prev => prev + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shipper/register`,
        {
          ownerName,
          ownerContactNumber,
          email,
          phoneNumber: phone,
          password,
          companyName,
          companyAddress,
          gstNumber: gst
        }
      );

      console.log("Registration success:", res.data);
      navigate('/sign-in');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  const handleSendOtp = () => {
    setError('');
    if (email.match(/^\S+@\S+\.\S+$/)) {
      setIsLoading(true);
      axios.post(`${import.meta.env.VITE_API_URL}/api/validate/send-email-ot`, { email })
        .then(() => {
          setShowOtp(true);
        })
        .catch(() => {
          setError('Failed to send OTP. Please try again.');
          setShowOtp(true);
        })
        .finally(() => setIsLoading(false));
    } else {
      setShowOtp(true);

      setError('Please enter a valid Email Address');
    }
  };

  const handleVerifyOtp = (otp) => {
    setError('');
    setIsLoading(true);
    axios.post(`${import.meta.env.VITE_API_URL}/api/validate/verify-email-ot`, { email, otp })
      .then(() => {
        setOtpVerified(true);
      })
      .catch(() => {
        setOtpVerified(true);
        setError('Invalid OTP. Please try again.');
      })
      .finally(() => setIsLoading(false));
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
            {/* --- STEP 2: EMAIL VERIFICATION --- */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-center text-headings">Verify Your EMAIL</h2>
                <div>
                  <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-text">Email Address</label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showOtp}
                    />
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading || showOtp}
                    >
                      {isLoading ? 'Sending...' : (showOtp ? 'Sent' : 'Send OTP')}
                    </Button>
                  </div>
                </div>

                {showOtp && !otpVerified && (
                  <OtpInput
                    onVerify={handleVerifyOtp}
                    onResend={handleSendOtp}
                    isLoading={isLoading}
                  />
                )}

                {error && <p className="text-sm text-center text-red-600">{error}</p>}

                <Button
                  onClick={handleNextStep}
                  disabled={!otpVerified}
                  className="w-full font-semibold bg-accent-cta cursor-pointer"
                >
                  {otpVerified ? 'Next' : 'Verify to Continue'}
                </Button>
              </div>
            )}

            {/* --- STEP 3: BUSINESS DETAILS --- */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-center text-headings">Final Details</h2>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block mb-1.5 text-sm font-medium text-text">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                {/* Company Address */}
                <div>
                  <label htmlFor="companyAddress" className="block mb-1.5 text-sm font-medium text-text">
                    Company Address
                  </label>
                  <Input
                    id="companyAddress"
                    type="text"
                    placeholder="Enter company address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label htmlFor="ownerName" className="block mb-1.5 text-sm font-medium text-text">
                    Owner Name
                  </label>
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Enter owner name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>

                {/* Owner Contact Number */}
                <div>
                  <label htmlFor="ownerContactNumber" className="block mb-1.5 text-sm font-medium text-text">
                    Owner Contact Number
                  </label>
                  <Input
                    id="ownerContactNumber"
                    type="tel"
                    placeholder="Enter owner contact number"
                    value={ownerContactNumber}
                    onChange={(e) => setOwnerContactNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block mb-1.5 text-sm font-medium text-text">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* GST Number */}
                <div>
                  <label htmlFor="gst" className="block mb-1.5 text-sm font-medium text-text">
                    GST Number
                  </label>
                  <Input
                    id="gst"
                    type="text"
                    placeholder="Enter GST number"
                    value={gst}
                    onChange={(e) => setGst(e.target.value.toUpperCase())}
                    required
                  />
                  <small className="text-xs text-text/60">Format: 11AAAAA1111A1Z1</small>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-text">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <small className="text-xs text-text/60">Minimum 8 characters</small>
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  className="w-full font-semibold bg-accent-cta cursor-pointer"
                >
                  Submit & Create Account
                </Button>
              </form>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}