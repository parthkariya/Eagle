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
import SeatSelection from "./Pages/SeatSelection/SeatSelection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewBookingBus from "./Pages/ViewBooking/ViewBookingBus";
import PassengerBooking from "./Pages/NewBookingPage/PassengerBooking";
import PaymentStatus from "./Pages/Payment/PaymentStatus";
import Payment from "./Pages/Payment/Payment";
import PaymentStatus2 from "./Pages/Payment/designtest";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import HotelBookingDetails from "./Pages/HotelBookingDetails/HotelBookingDetails";

function App() {
  return (
    <BrowserRouter basename="eagleticket" future={{ v7_startTransition: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/TicketBookingDetails"
          element={<TicketBookingDetails />}
        />
        <Route path="/SeatSelcetion" element={<SeatSelection />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/ViewBooking" element={<ViewBooking />} />
        <Route path="/ViewBookingBus" element={<ViewBookingBus />} />
        <Route path="/zk" element={<PassengerBooking />} />
        <Route path="/hoteldetails" element={<HotelBookingDetails />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/payment-status2" element={<PaymentStatus2 />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
