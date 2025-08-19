import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// --- UI Components ---
import Navbar from './components/ui/NavBar';
import Footer from './components/ui/Footer';

// --- Page Components ---
import LandingPage from './pages/Landing_page';
import AboutUs from './pages/About_us';
import Careers from './pages/Career';
import SignInPage from './pages/Sign_in';
import SignupFormPage from './pages/Signup_otp';

import CarrierRegistration from './pages/signup/transporter_registration';

import TransporterDashboard from './pages/TraFix';
import ClientDashboard from './pages/Client_dashboard';
import Consignment from './pages/dashboard/Consignment';
import AvailableTransporters from './pages/Transporter_list';
import VehicleRegistration from './pages/Vehicle_registration';
import DriverRegistration from './pages/Driver_registration';

// --- Layouts ---
const MainLayout = () => (
  <>
    <Navbar />
    <div className="h-[72px]" /> {/* Spacer so navbar doesn’t overlap */}
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

const FullPageLayout = () => (
  <main>
    <Outlet />
  </main>
);

// --- App Component ---
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public-facing pages (with Navbar + Footer) --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/join-us" element={<Careers />} />
        </Route>

        {/* --- Full-screen pages (no Navbar/Footer) --- */}
        <Route element={<FullPageLayout />}>
          {/* Auth Routes */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignupFormPage />} />

          {/* Registration Routes */}
          <Route path="/carrier-registration" element={<CarrierRegistration />} />
          <Route path="/vehicle-registration" element={<VehicleRegistration />} />
          <Route path="/driver-registration" element={<DriverRegistration />} />

          {/* Dashboard Routes */}
          <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/consignment" element={<Consignment />} />
          <Route path="/available-transporter" element={<AvailableTransporters />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
