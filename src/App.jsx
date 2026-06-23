import Home from "./pages/Home";
import { Routes, Route} from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"; 
import ScrollToTop from "./Components/ScrollToTop";
import Dashboard from "./Components/Dashboard";


function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300">
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;