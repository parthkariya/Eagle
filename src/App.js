import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Homepage/HomePage";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Footer from "./Common/Footer/Footer";
import Navbar from "./Common/Navbar/Navbar";
import TicketBookingDetails from "./Pages/TicketBookingDetails/TicketBookingDetails";
import ContactUs from "./Pages/ContactUs/ContactUs";
import DashBoard from "./Pages/Dashboard/DashBoard";
import Profile from "./Pages/Profile/Profile";
import ViewBooking from "./Pages/ViewBooking/ViewBooking";

function App() {
  return (
    <BrowserRouter
      basename="airlineticketapi"
      future={{ v7_startTransition: true }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/TicketBookingDetails"
          element={<TicketBookingDetails />}
        />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/ViewBooking" element={<ViewBooking />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
