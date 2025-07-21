import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransporterDashboard from './pages/TraFix';
// import Home from './pages/home'; // You can create this as a landing page
import CarrierRegistration from './pages/signup/transporter_registration'; 
import ShipperRegistration from './pages/signup/shipper_registration'; 
import Shipments from './pages/dashboard/Shipments'; // Assuming you have this component
import Consignment from './pages/dashboard/Consignment'; // Assuming you have this component
// import AboutPage from './pages/aboutUs';
// import CareersPage from './pages/Join_us';
import ClientDashboard from './pages/Client_dashboard';
import AvailableTransporters from './pages/Transporter_list'; // Assuming you have this component
import ShipmentRegistration from './pages/Shipment_registration';
// import AboutPage from './pages/aboutUs';
// import CareersPage from './pages/Join_us';
import SignInPage from './pages/Sign_in'; // Assuming you have this component
import Footer from './components/ui/Footer.jsx';  
import Navbar from './components/ui/NavBar';
import LandingPage from './pages/Landing_page';
import AboutUs from './pages/About_us';
import Careers from './pages/Career';

import SignupFormPage from './pages/Signup_otp';

import VehicleRegistration from './pages/Vehicle_registration';
import DriverRegistration from './pages/Driver_registration';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
        <Route path="/carrier-registration" element={<CarrierRegistration />} />
        <Route path="/shipper-registration" element={<ShipperRegistration />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/consignment" element={<Consignment />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/join-us" element={<Careers />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/available-transporter" element={<AvailableTransporters />} />
        <Route path="/shipment-registration" element={<ShipmentRegistration />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/landing" element={<LandingPage />} />
        
        <Route path="/signup-otp" element={<SignupFormPage />} />
        <Route path="/vehicle-registration" element={<VehicleRegistration />} />
        <Route path="/driver-registration" element={<DriverRegistration />} />
        <Route path="/carrier-registration" element={<CarrierRegistration />} />
        <Route path="/shipper-registration" element={<ShipperRegistration />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
