import React, { useEffect, useState } from "react";
import "./TicketBookingDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Helmet } from "react-helmet";
import { DatePicker } from "antd";
import { IoAirplaneSharp } from "react-icons/io5";
import {
  ACCEPT_HEADER,
  bookFlight,
  bookingget,
  getItinerary,
  reprice,
  savePassenger,
  bookcurl,
  ticketcurl,
} from "../../Utils/Constant";
import { useFlightContext } from "../../Context/flight_context";
import Modal from "react-modal";
import { Plane } from "lucide-react";
import Notification from "../../Utils/Notification";
import { useBusContext } from "../../Context/bus_context";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import dayjs from "dayjs";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const titleOptions = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Miss", label: "Miss" },
  { value: "Ms", label: "Ms" },
  { value: "Mstr", label: "Mstr" },
  { value: "Doctor", label: "Doctor" },
];

const TicketBookingDetails = () => {
  const navigate = useNavigate();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime1 = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDay = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
    });

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  // Custom styles for the modal
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 1050,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      border: "none",
      borderRadius: "20px",
      maxWidth: "600px",
      width: "95%",
      maxHeight: "95vh",
      overflow: "hidden",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    },
  };

  const modalCSS = `
<style>
  .booking-modal-content {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .modal-header-gradient {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  .modal-header-pending {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); /* yellow/orange */
  }

  .modal-header-failed {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); /* red */
  }

  
  .section-card {
    border-radius: 16px;
    // padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid;
  }
  
  .flight-card {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-color: #93c5fd;
  }
  
  .passenger-card {
    background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%);
    border-color: #c084fc;
  }
  
  .baggage-card {
    background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
    border-color: #fdba74;
  }
  
  .fare-card {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-color: #86efac;
  }
  
  .info-card {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #93c5fd;
  }
  
  .icon-box {
    border-radius: 8px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .city-card {
    background-color: white;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
  
  .flight-path {
    display: flex;
    align-items: center;
    margin: 0 1rem;
    flex-shrink: 0;
  }
  
  .path-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #3b82f6;
  }
  
  .path-line {
    width: 60px;
    height: 2px;
    background: linear-gradient(to right, #3b82f6, #6366f1);
    margin: 0 8px;
    position: relative;
  }
  
  .scrollable-content {
    max-height: calc(95vh - 200px);
    overflow-y: auto;
    padding: 1.5rem;
  }

  
  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollable-content::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .scrollable-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
`;

  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [isModalOpensession, setIsModalOpensession] = useState(false);
  const [activeTab, setActiveTab] = useState("passengers");
  const [askingmodalIsOpen, setAskingModalIsOpen] = useState(false);
  const [addonCondition, setAddonCondition] = useState(false);
  const [ssrobject, setSsrObject] = useState({
    meal: [],
    baggage: [],
    seat: [],
  });
  const [ssrobjectkhali, setSsrObjectkhali] = useState({
    meal: [],
    baggage: [],
    seat: [],
  });

  const [showSavedPassengers, setShowSavedPassengers] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("adult");

  const [item, setItem] = useState(location.state?.item[0] || null);
  const [flightdata, setFlightData] = useState(
    location.state?.returnitem || null
  );

  const [ttltraveller, setttltraveller] = useState(
    location.state?.totaltraveller || 1
  );

  const [adulttraveler, setadulttraveler] = useState(
    location.state?.adulttraveler
  );
  const [childtraveler, setchildtraveler] = useState(
    location.state?.childtraveler
  );
  const [infanttraveler, setinfanttraveler] = useState(
    location.state?.infanttraveler
  );

  const [okres, setOKRes] = useState();
  const [ticketId, setTicketId] = useState(item?.rI);
  const [okres2, setOKRes2] = useState();
  const [bookingID, setBookingID] = useState("");
  const [getBookingData, setBookingData] = useState();

  const [userRole, setUserRole] = useState("");
  const { selectedTab } = useBusContext();

  const handleCloseBookingModal = () => {
    setBookingModal(false);
    navigate("/");
  };

  useEffect(() => {
    var role = localStorage.getItem("is_role");
    setUserRole(JSON.parse(role));
  }, []);

  const [timeing, setTimeing] = useState(
    location.state?.timeing?.remainingTime || null
  );

  const [timebaki, setTimeBaki] = useState(null);

  useEffect(() => {
    if (timebaki === null) return;

    if (timebaki <= 0 && item?.fareIdentifier?.code !== "airIQ_fare") {
      setIsModalOpensession(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeBaki((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timebaki]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNewSearch = () => {
    setIsModalOpensession(false);
    navigate(-1); // Redirect to previous page
  };

  const handleCloseModal = () => {
    setIsModalOpensession(false);
  };

  const getTravelerFields = () => ({
    title: "",
    firstName: "",
    lastName: "",
    passportNumber: "",
    passportExpiry: "",
    gender: "",
    isLeadPax: true,
    paxType: 1,
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    cellCountryCode: "91",
    contactNumber: "",
    countryCode: "IN",
    countryName: "",
    dateOfBirth: "",
    email: "",
    frequentFlyerAirlineCode: null,
    frequentFlyerNumber: null,
    gstCompanyAddress: "",
    gstCompanyContactNumber: "",
    gstCompanyEmail: "",
    gstCompanyName: "",
    gstNumber: "",
    nationality: "IN",
  });

  const getChildFields = () => ({
    title: "",
    firstName: "",
    lastName: "",
    passportNumber: "",
    passportExpiry: "",
    gender: "",
    isLeadPax: false,
    paxType: 2,
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    cellCountryCode: "91",
    contactNumber: "",
    countryCode: "IN",
    countryName: "",
    dateOfBirth: "",
    email: "",
    frequentFlyerAirlineCode: null,
    frequentFlyerNumber: null,
    gstCompanyAddress: "",
    gstCompanyContactNumber: "",
    gstCompanyEmail: "",
    gstCompanyName: "",
    gstNumber: "",
    nationality: "IN",
  });

  const getInfantFields = () => ({
    title: "",
    firstName: "",
    lastName: "",
    passportNumber: "",
    passportExpiry: "",
    gender: "",
    isLeadPax: false,
    paxType: 3,
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    cellCountryCode: "91",
    contactNumber: "",
    countryCode: "IN",
    countryName: "",
    dateOfBirth: "",
    email: "",
    frequentFlyerAirlineCode: null,
    frequentFlyerNumber: null,
    gstCompanyAddress: "",
    gstCompanyContactNumber: "",
    gstCompanyEmail: "",
    gstCompanyName: "",
    gstNumber: "",
    nationality: "IN",
  });

  const [travelers, setTravelers] = useState(
    Array.from({ length: adulttraveler }, () => getTravelerFields())
  );
  const [childtravelers, setChildTravelers] = useState(
    Array.from({ length: childtraveler }, () => getChildFields())
  );
  const [infanttravelers, setInfantTravelers] = useState(
    Array.from({ length: infanttraveler }, () => getInfantFields())
  );

  const [itinerarydatastate, setuseitinerarydatastate] = useState({});
  const [datass, setdatass] = useState(ssrobjectkhali);

  const handleTravelerChange = (type, index, field, value) => {
    if (type === "adult") {
      const updated = [...travelers];
      updated[index][field] = value;
      setTravelers(updated);
    } else if (type === "child") {
      const updated = [...childtravelers];
      updated[index][field] = value;
      setChildTravelers(updated);
    } else if (type === "infant") {
      const updated = [...infanttravelers];
      updated[index][field] = value;
      setInfantTravelers(updated);
    }
  };

  const [check, setCheck] = useState(false);
  const currentDate = new Date();
  let hasInvalidInfant = false;

  // Iterate through travelers
  travelers.forEach((traveler) => {
    const dob = new Date(traveler.dob);
    const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25);

    if (traveler.age < 0 || traveler.age > 2) {
      if (traveler.age < 0 || traveler.age > 2) {
        hasInvalidInfant = true;
      }
    }
  });

  const togglecheck = () => {
    setCheck(!check);
  };

  const {
    GetSavedItinerary,
    itinerary_data,
    getitinerary_data,
    SavePassengerDetails,
    passenger_loading,
    CheckReprice,
    reprice_data,
    reprice_loading,
    Booking,
    booking_loading,
    GetBookingFlight,
    get_booking_data,
    return_get_booking_data,
    get_booking_loading,
    GetPassengersDetails,
    passenger_Details,
    passenger_loading_details,
    add_passenger_loading,
    PassengerDetails,
  } = useFlightContext();

  const GetItinerary = async () => {
    const token = localStorage.getItem("accessToken");
    const traceid = localStorage.getItem("traceID");
    const itineraryCode = localStorage.getItem("itineraryCode");

    const formdata = new FormData();
    formdata.append("type", "GET");
    formdata.append(
      "url",
      `${getItinerary}/${itineraryCode}?traceId=${traceid}`
    );
    formdata.append("url_token", `Bearer ${token}`);

    const res = await GetSavedItinerary(formdata);
    const remaining = res?.traceIdDetails?.remainingTime ?? 0;
    setTimeBaki(remaining);

    if (res) {
      if (!res?.error?.errorCode) {
        setuseitinerarydatastate(res);

        const ssrData = res?.itineraryItems?.[0]?.itemFlight?.ssr;

        await setdatass(ssrData ?? ssrobjectkhali);

        // await setdatass(
        //   res?.itineraryItems[0]?.itemFlight?.ssr || ssrobjectkhali
        // );
      } else {
        Notification("error", "Error", res.error.errorMessage);
      }
    } else {
    }
  };

  const categories = [
    {
      id: "adult",
      label: "Adults",
      count: passenger_Details.filter((p) => p.passenger_type === "1").length,
    },
    {
      id: "child",
      label: "Children",
      count: passenger_Details.filter((p) => p.passenger_type === "2").length,
    },
    {
      id: "infant",
      label: "Infants",
      count: passenger_Details.filter((p) => p.passenger_type === "3").length,
    },
  ].filter((c) => c.count > 0);

  // const datas = getitinerary_data?.itineraryItems[0]?.itemFlight?.ssr || {};
  useEffect(() => {
    // if (itinerary_data?.itineraryCode) {
    GetItinerary();
    GetPassengersDetails();
    // }
  }, []);

  const validatePassengers = (passengers) => {
    const requiredFields = [
      "title",
      "firstName",
      "lastName",
      "passportNumber",
      "passportExpiry",
      "gender",
      "addressLineOne",
      "city",
      "contactNumber",
      "countryName",
      "dateOfBirth",
      "email",
    ];

    const fieldLabels = {
      title: "Title",
      firstName: "First Name",
      lastName: "Last Name",
      passportNumber: "Passport Number",
      passportExpiry: "Passport Expiry",
      gender: "Gender",
      addressLineOne: "Address Line One",
      city: "City",
      contactNumber: "Contact Number",
      countryName: "Country Name",
      dateOfBirth: "Date of Birth",
      email: "Email",
    };

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      for (const field of requiredFields) {
        if (!passenger[field] || passenger[field].toString().trim() === "") {
          return {
            isValid: false,
            message: `${fieldLabels[field]} is required for Passenger ${i + 1}`,
          };
        }
      }
    }

    return { isValid: true };
  };

  const validatePassengersAiriq = (passengers) => {
    const requiredFields = ["title", "firstName", "lastName"];

    const fieldLabels = {
      title: "Title",
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
    };

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      for (const field of requiredFields) {
        if (!passenger[field] || passenger[field].toString().trim() === "") {
          return {
            isValid: false,
            message: `${fieldLabels[field]} is required for Passenger ${i + 1}`,
          };
        }
      }
    }

    return { isValid: true };
  };

  const handleSavePassenger = async () => {
    const token = localStorage.getItem("accessToken");
    const traceid = localStorage.getItem("traceID");
    const itineraryCode = localStorage.getItem("itineraryCode");

    const allPassengers = [...travelers, ...childtravelers, ...infanttravelers];

    const validation = validatePassengers(allPassengers);

    if (!validation.isValid) {
      Notification("warning", "Field Required", validation.message);
      return;
    }

    // Ensure only first passenger is Lead Pax
    const passengersWithLeadFlag = allPassengers.map((pax, index) => ({
      ...pax,
      isLeadPax: index === 0,
    }));

    const payload = {
      type: "POST",
      url: `${savePassenger}/${itineraryCode}/passenger-collections`,
      url_token: `Bearer ${token}`,
      traceId: traceid,
      passengers: passengersWithLeadFlag,
    };

    try {
      const res = await SavePassengerDetails(payload);

      if (res) {
        if (!res?.error?.errorCode) {
          setIsModalOpen(true);
          closeModalasking();
          CheckRepriceData();
        } else {
          Notification("error", "Error", res.error.errorMessage);
        }
      }
    } catch (err) {
      Notification(
        "error",
        "Error",
        "Something went wrong while saving passengers"
      );
      console.error("handleSavePassenger error:", err);
    }
  };

  // Airiq Part API Start
  const handleSavePassengerAiriq = async () => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    const allPassengers = [...travelers, ...childtravelers, ...infanttravelers];
    const validation = validatePassengersAiriq(allPassengers);

    if (!validation.isValid) {
      Notification("warning", "Field Required", validation.message);
      return;
    }

    // Ensure only first passenger is Lead Pax
    const passengersWithLeadFlag = allPassengers.map((pax, index) => ({
      ...pax,
      isLeadPax: index === 0,
    }));

    // Map passengers to the required API payload structure
    const adult_info = passengersWithLeadFlag

      .filter((pax) => pax.paxType == 1)
      .map((pax) => ({
        title: pax.title
          ? pax.title.endsWith(".")
            ? pax.title
            : pax.title + "."
          : "Mr.",
        first_name: pax.firstName,
        last_name: pax.lastName,
      }));
    console.log("adult_info", adult_info);

    const child_info = passengersWithLeadFlag
      .filter((pax) => pax.type == 2)
      .map((pax) => ({
        title: pax.title || "Mstr.",
        first_name: pax.firstName,
        last_name: pax.lastName,
      }));

    const infant_info = passengersWithLeadFlag
      .filter((pax) => pax.type == 3)
      .map((pax) => ({
        title: pax.title || "Mstr.",
        first_name: pax.firstName,
        last_name: pax.lastName,
        dob: pax.dob,
        travel_with: pax.travelWith || 1,
      }));

    const payload = {
      ticket_id: ticketId,
      total_pax: passengersWithLeadFlag.length,
      adult: adult_info.length,
      child: child_info.length,
      infant: infant_info.length,
      adult_info,
      child_info,
      infant_info,
    };
    try {
      const res = await axios.post(bookcurl, payload, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: token,
        },
      });

      if (res.data.status === "success") {
        localStorage.setItem("booking_id", res.data.booking_id);
        setBookingID(res.data.booking_id);
        setBookingData(res.data);
        Notification("success", "Success", res.data.message);

        // Call the GET API with the booking_id
        try {
          const booking_id = res.data.booking_id;
          const getRes = await axios.get(`${ticketcurl}/${booking_id}`, {
            headers: {
              Accept: ACCEPT_HEADER,
              Authorization: token,
            },
          });
          console.log("getRes", getRes);

          if (getRes.data.status === "success") {
            setBookingData(getRes?.data);
            navigate("/");
            // setBookingModal(true);
          }

          // Handle the GET response here if needed (e.g., set state or notify)
          // For example: setTicketData(getRes.data);
        } catch (getErr) {
          Notification(
            "error",
            "Error",
            getErr.response?.data?.error?.errorMessage ||
              "Something went wrong while fetching ticket data"
          );
          console.error("GET API error:", getErr);
        }
      } else {
        Notification(
          "error",
          "Error",
          res.data?.error?.errorMessage || "Failed to save passenger details"
        );
      }
    } catch (err) {
      Notification(
        "error",
        "Error",
        err.response?.data?.error?.errorMessage ||
          "Something went wrong while saving passengers"
      );
      console.error("handleSavePassengerAiriq error:", err);
    }
  };

  const SavePassengerWithSSR = async () => {
    const token = localStorage.getItem("accessToken");
    const traceid = localStorage.getItem("traceID");
    const itineraryCode = localStorage.getItem("itineraryCode");

    const allPassengers = [...travelers, ...childtravelers, ...infanttravelers];

    const validation = validatePassengers(allPassengers);

    if (!validation.isValid) {
      Notification("warning", "Field Required", validation.message);
      return;
    }

    // Assign SSR per passenger
    const passengersWithSSR = allPassengers.map((pax, index) => {
      return {
        ...pax,
        isLeadPax: index === 0,
        ssr: {
          meal: ssrobject?.meal?.[index] ? [ssrobject.meal[index]] : [],
          baggage: ssrobject?.baggage?.[index]
            ? [ssrobject.baggage[index]]
            : [],
          seat: ssrobject?.seat?.[index] ? [ssrobject.seat[index]] : [],
        },
      };
    });

    const payload = {
      type: "POST",
      url: `${savePassenger}/${itineraryCode}/passenger-collections`,
      url_token: `Bearer ${token}`,
      traceId: traceid,
      passengers: passengersWithSSR,
    };

    try {
      const res = await SavePassengerDetails(payload);

      if (res) {
        if (!res?.error?.errorCode) {
          setIsModalOpen(true);
          closeModalasking();
          CheckRepriceData();
        } else {
          Notification("error", "Error", res.error.errorMessage);
        }
      }
    } catch (err) {
      Notification(
        "error",
        "Error",
        "Something went wrong while saving passengers"
      );
      console.error("SavePassengerWithSSR error:", err);
    }
  };

  const CheckRepriceData = async () => {
    const token = localStorage.getItem("accessToken");
    const traceid = localStorage.getItem("traceID");
    const itineraryCode = localStorage.getItem("itineraryCode");

    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", `${reprice}/${itineraryCode}/fare-quote`);
    formdata.append("url_token", `Bearer ${token}`);
    formdata.append("traceId", traceid);

    await CheckReprice(formdata);
  };

  const closeModal = async () => {
    const token = localStorage.getItem("accessToken");
    const traceid = localStorage.getItem("traceID");
    const itineraryCode = localStorage.getItem("itineraryCode");

    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", `${bookFlight}/${itineraryCode}/book`);
    formdata.append("url_token", `Bearer ${token}`);
    formdata.append("traceId", traceid);
    formdata.append("isPriceChangeAccepted", true);

    const res = await Booking(formdata);
    setOKRes2(res?.results?.details[0]);
    setOKRes(res?.results?.details[1]);

    if (!res?.error?.errorCode) {
      setIsModalOpen(false);
      setBookingModal(true);
      GetBookingData(res.results.details[0]?.bmsBookingCode);
      if (res?.results?.details[1]) {
        GetReturnBookingData(res.results.details[1]?.bmsBookingCode);
      }
    } else {
      Notification("error", "Error", res.error.errorMessage);
    }
  };

  const GetBookingData = async (code) => {
    const token = localStorage.getItem("accessToken");
    const formdata = new FormData();
    formdata.append("type", "GET");
    formdata.append("url", `${bookingget}/${code}`);
    formdata.append("url_token", `Bearer ${token}`);
    formdata.append("booking_code", code);

    const res = await GetBookingFlight(formdata);

    if (!res?.error?.errorCode) {
    } else {
      Notification("error", "Error", res.error.errorMessage);
    }
  };

  const GetReturnBookingData = async (code) => {
    const token = localStorage.getItem("accessToken");
    const formdata = new FormData();
    formdata.append("type", "GET");
    formdata.append("url", `${bookingget}/${code}`);
    formdata.append("url_token", `Bearer ${token}`);
    formdata.append("booking_code", code);

    const res = await GetBookingFlight(formdata);

    if (!res?.error?.errorCode) {
    } else {
      Notification("error", "Error", res.error.errorMessage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusConfig = {
    CONFIRMED: {
      bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      title: "Booking Confirmed!",
      message: "Your flight has been successfully booked.",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
    },
    PENDING: {
      bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
      title: "Booking Pending!",
      message: "Your booking is being processed, please wait...",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    FAILED: {
      bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      title: "Booking Failed!",
      message: "Unfortunately, your booking could not be completed.",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ),
    },
  };

  const formatTimeok = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateok = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const bookingStatus = get_booking_data?.bookingStatus || "CONFIRMED";
  const status = statusConfig[bookingStatus] || statusConfig.CONFIRMED;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedBaggage, setSelectedBaggage] = useState([]);
  const [seatmodalOpen, setSeatModalOpen] = useState(false);

  const [isReturn, setIsReturn] = useState(0);

  const handleSeatSelect = (seat) => {
    if (!seat.isBooked && seat.code) {
      setSelectedSeats((prev) => {
        let updated;

        // If already selected, remove it (toggle off)
        if (prev.some((s) => s.code === seat.code)) {
          updated = prev.filter((s) => s.code !== seat.code);
        } else {
          // Prevent selecting more than ttltraveller
          if (prev.length >= ttltraveller) {
            alert(`You can select up to ${ttltraveller} seat(s) only.`);
            return prev; // don't add more
          }
          updated = [...prev, seat];
        }

        // update ssrobject
        setSsrObject((prevSsr) => ({
          ...prevSsr,
          seat: updated.map((s) => ({
            origin: `${item?.sg[0]?.or?.aC}`,
            destination: `${item?.sg[item?.sg.length - 1]?.ds?.aC}`,
            code: s.code,
            amt: s.amt,
            seat: s.seatNo,
          })),
        }));

        return updated;
      });
      setSeatModalOpen(true);
    }
  };

  const handleConfirmSeat = () => {
    setSeatModalOpen(false);
  };

  const handleCloseModalSeat = () => {
    setSeatModalOpen(false);
    setSelectedSeats([]);
  };

  const handleMealSelect = (meal) => {
    setSelectedMeals((prev) => {
      let updated;
      if (prev.some((m) => m.code === meal.code)) {
        updated = prev.filter((m) => m.code !== meal.code);
      } else {
        updated = [...prev, meal];
      }

      // update ssrobject
      setSsrObject((prevSsr) => ({
        ...prevSsr,
        meal: updated.map((m) => ({
          code: m.code,
          amt: m.amt,
          origin: `${item?.sg[0]?.or?.aC}`,
          destination: `${item?.sg[item?.sg.length - 1]?.ds?.aC}`,
        })),
      }));

      return updated;
    });
  };

  const handleBaggageSelect = (baggage) => {
    setSelectedBaggage((prev) => {
      let updated;
      if (prev.some((b) => b.code === baggage.code)) {
        updated = prev.filter((b) => b.code !== baggage.code);
      } else {
        updated = [...prev, baggage];
      }

      // update ssrobject
      setSsrObject((prevSsr) => ({
        ...prevSsr,
        baggage: updated.map((b) => ({
          code: b.code,
          amt: b.amt,
          origin: `${item?.sg[0]?.or?.aC}`,
          destination: `${item?.sg[item?.sg.length - 1]?.ds?.aC}`,
        })),
      }));

      return updated;
    });
  };

  const getTotalAmount = () => {
    let total = 0;

    if (selectedSeats.length) {
      total += selectedSeats.reduce((sum, s) => sum + s.amt, 0);
    }
    if (selectedMeals.length) {
      total += selectedMeals.reduce((sum, m) => sum + m.amt, 0);
    }
    if (selectedBaggage.length) {
      total += selectedBaggage.reduce((sum, b) => sum + b.amt, 0);
    }

    return total;
  };

  const SeatMap = () => (
    <div className="seat-map">
      <div className="aircraft-body">
        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <span className="seat-icon available"></span>Free
          </div>
          <div className="legend-item">
            <span className="seat-icon booked"></span>Booked
          </div>
          <div className="legend-item">
            <span className="seat-icon selected"></span>Selected
          </div>
          <div className="legend-item">
            <span className="seat-icon premium"></span>Premium
          </div>
        </div>

        {datass?.seat[0]?.rowSeats?.slice(0, 2).map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row?.seats?.map((seat, seatIndex) => (
              <div key={seatIndex} className="seat-container">
                {seat.code ? (
                  <button
                    className={`seat ${
                      seat.isBooked ? "booked" : "available"
                    } ${seat.priceBracket === 2 ? "premium" : ""} ${
                      selectedSeats.some((s) => s.code === seat.code)
                        ? "selected"
                        : ""
                    }  ${seat.isLegroom ? "legroom" : ""} ${
                      seat.isAisle ? "" : ""
                    } ${seat.amt == 0 ? "free" : ""}`}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={seat.isBooked}
                    title={`${seat.seatNo} - ₹${seat.amt} ${
                      seat.isLegroom ? "(Extra Legroom)" : ""
                    }`}
                  >
                    <span className="seat-number">{seat.seatNo}</span>
                  </button>
                ) : (
                  <div className="seat-gap"></div>
                )}
              </div>
            ))}
          </div>
        ))}

        {datass?.seat[0]?.rowSeats?.slice(2).map((row, rowIndex) => (
          <div key={rowIndex + 2} className="seat-row">
            {row?.seats?.map((seat, seatIndex) => (
              <div key={seatIndex} className="seat-container">
                {seat.code ? (
                  <button
                    className={`seat ${
                      seat.isBooked ? "booked" : "available"
                    } ${seat.priceBracket === 2 ? "premium" : ""}${
                      selectedSeats.some((s) => s.code === seat.code)
                        ? "selected"
                        : ""
                    }  ${seat.isLegroom ? "legroom" : ""} ${
                      seat.isAisle ? "" : ""
                    } ${seat.amt == 0 ? "free" : ""}`}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={seat.isBooked}
                    title={`${seat.seatNo} - ₹${seat.amt} ${
                      seat.isLegroom ? "(Extra Legroom)" : ""
                    }`}
                  >
                    <span className="seat-number">{seat.seatNo}</span>
                  </button>
                ) : (
                  <div className="seat-gap"></div>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="aircraft-tail"></div>
      </div>

      {/* Seat Confirmation Modal */}
    </div>
  );

  const MealSelection = () => (
    <div className="meal-selection">
      <h3>Select Your Meal</h3>
      <p className="section-description">
        Choose from our delicious in-flight meal options
      </p>

      {datass?.meal.length == 0 ? (
        <p className="no-meals-msg">⚠️ No meals available at this moment</p>
      ) : (
        <div className="selection-grid">
          {datass?.meal[0]?.options?.map((meal) => (
            <div
              key={meal.code}
              className={`selection-card ${
                selectedMeals.some((m) => m.code === meal.code)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleMealSelect(meal)}
              role="button"
            >
              <div className="card-content">
                <div className="icon">🍽️</div>
                <h4>{meal.dsc}</h4>
                <p className="price">₹{meal.amt}</p>
              </div>
            </div>
          ))}
          {/* No Meal Option */}
          <div
            className={`selection-card ${
              selectedMeals.length === 0 ? "selected" : ""
            }`}
            onClick={() => setSelectedMeals([])}
            role="button"
          >
            <div className="card-content">
              <div className="icon">❌</div>
              <h4>No Meal</h4>
              <p className="text-muted">Skip meal selection</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const BaggageSelection = () => (
    <div className="baggage-selection">
      <h3>Select Extra Baggage</h3>
      <p className="section-description">
        Add extra baggage allowance for your journey
      </p>
      {datass?.baggage?.length == 0 ? (
        <p className="no-meals-msg">
          ⚠️ No Extra Baggage Details available at this moment
        </p>
      ) : (
        <div className="selection-grid">
          {datass?.baggage[0]?.options?.map((baggage) => (
            <div
              key={baggage.code}
              className={`selection-card ${
                selectedBaggage.some((b) => b.code === baggage.code)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleBaggageSelect(baggage)}
              role="button"
            >
              <div className="card-content">
                <div className="icon">🧳</div>
                <h4>{baggage.dsc}</h4>
                <p className="price">₹{baggage.amt}</p>
              </div>
            </div>
          ))}
          <div
            className={`selection-card ${
              selectedBaggage.length === 0 ? "selected" : ""
            }`}
            onClick={() => setSelectedBaggage([])}
            role="button"
          >
            <div className="card-content">
              <div className="icon">✅</div>
              <h4>Standard Baggage</h4>
              <p className="text-muted">15 Kg included</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const openModalasking = () => {
    setAskingModalIsOpen(true);
  };

  const closeModalasking = () => {
    setAskingModalIsOpen(false);
  };

  const handleSkip = () => {
    handleSavePassenger();
  };

  const handleYes = () => {
    window.scroll(0, 0);
    setAddonCondition(true);
    closeModalasking();
  };

  const toggleSavedPassengers = () => {
    setShowSavedPassengers(!showSavedPassengers);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const formatDOB = (dob) => {
    if (!dob) return "";
    const d = new Date(dob);
    if (isNaN(d)) return ""; // invalid date, avoid errors

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const emptyFieldsByCategory = (category) => {
    if (category === "adult") return getTravelerFields();
    if (category === "child") return getChildFields();
    if (category === "infant") return getInfantFields();
  };

  const handleSelectPassenger = (passenger, category) => {
    console.log("Selected Passenger:", passenger);

    const formattedDOB = formatDOB(passenger.date_of_birth);
    const formattedPassportExpiry = formatDOB(passenger.passport_expiry);

    let list, setList;
    if (category === "adult") {
      list = travelers;
      setList = setTravelers;
    } else if (category === "child") {
      list = childtravelers;
      setList = setChildTravelers;
    } else {
      list = infanttravelers;
      setList = setInfantTravelers;
    }

    const passengerFirstName = passenger.first_name || "";
    const passengerLastName = passenger.last_name || "";

    // Check if this exact passenger is already selected in the list
    const alreadySelectedIndex = list.findIndex(
      (t) =>
        t.firstName === passengerFirstName &&
        t.lastName === passengerLastName &&
        t.firstName // not empty
    );

    // CASE 1: Single slot category
    if (list.length === 1) {
      const current = list[0];

      // If clicking the SAME passenger that's already there → CLEAR IT
      if (
        alreadySelectedIndex !== -1 &&
        current.firstName === passengerFirstName &&
        current.lastName === passengerLastName
      ) {
        setList([emptyFieldsByCategory(category)]);
        return;
      }

      // Otherwise → assign this (possibly different) passenger
      setList([
        {
          ...emptyFieldsByCategory(category),
          firstName: passengerFirstName,
          lastName: passengerLastName,
          gender: passenger.gender || "",
          dateOfBirth: formattedDOB,
          email: passenger.email || "",
          contactNumber: passenger.phone || "",
          passportNumber: passenger.passport_number || "",
          passportExpiry: formattedPassportExpiry || "",
          addressLineOne: passenger.addressline_1 || "",
          addressLineTwo: passenger.addressline_2 || "",
          title: passenger.title || "",
          city: passenger.city || "",
          countryName: passenger.country || "",
        },
      ]);
      return;
    }

    // CASE 2: Multiple slots → original toggle behavior
    // If already selected → deselect (clear that slot)
    if (alreadySelectedIndex !== -1) {
      const updated = [...list];
      updated[alreadySelectedIndex] = emptyFieldsByCategory(category);
      setList(updated);
      return;
    }

    // Find first empty slot and fill it
    const emptyIndex = list.findIndex((t) => !t.firstName);
    if (emptyIndex !== -1) {
      const updated = [...list];
      updated[emptyIndex] = {
        ...updated[emptyIndex],
        firstName: passengerFirstName,
        lastName: passengerLastName,
        gender: passenger.gender || "",
        dateOfBirth: formattedDOB,
        email: passenger.email || "",
        contactNumber: passenger.phone || "",
        passportNumber: passenger.passportNumber || "",
        passportExpiry: formattedPassportExpiry || "",
        addressLineOne: passenger.addressLineOne || "",
        addressLineTwo: passenger.addressLineTwo || "",
        title: passenger.title || "",
        city: passenger.city || "",
        countryName: passenger.countryName || "",
      };
      setList(updated);
    } else {
      console.log(`All ${category} slots are filled`);
      // Optional: toast notification
    }
  };

  const isPassengerSelected = (passenger, category) => {
    let list;

    if (category === "adult") {
      list = travelers;
    } else if (category === "child") {
      list = childtravelers;
    } else {
      list = infanttravelers;
    }

    return list.some(
      (t) =>
        t.firstName === passenger.first_name &&
        t.lastName === passenger.last_name &&
        t.firstName
    );
  };

  const AddPassengerDetailsToApi = async () => {
    const allPassengers = [...travelers, ...childtravelers, ...infanttravelers];
    const formdata = new FormData();

    allPassengers.forEach((pax, index) => {
      formdata.append(`passenger_type[${index}]`, pax.paxType);
      formdata.append(`title[${index}]`, pax.title);
      formdata.append(`gender[${index}]`, pax.gender);
      formdata.append(`first_name[${index}]`, pax.firstName);
      formdata.append(`last_name[${index}]`, pax.lastName);
      formdata.append(`date_of_birth[${index}]`, pax.dateOfBirth);
      formdata.append(`email[${index}]`, pax.email);
      formdata.append(`phone[${index}]`, pax.contactNumber);

      formdata.append(`addressline_1[${index}]`, pax.addressLineOne);
      formdata.append(`addressline_2[${index}]`, pax.addressLineTwo);
      formdata.append(`city[${index}]`, pax.city);
      formdata.append(`country[${index}]`, pax.countryCode);

      formdata.append(`passport_number[${index}]`, pax.passportNumber);
      formdata.append(`passport_expiry[${index}]`, pax.passportExpiry);
    });

    PassengerDetails(formdata);
  };

  return (
    <>
      <Helmet>
        <title>Booking</title>
      </Helmet>
      <>
        <PathHero name={"Flight Booking"} getSelectedTabService={selectedTab} />

        <div className="container-fluid details-contt py-4">
          <div className="bg-cont">
            <div className="booking-header">
              <div className="flight-route-badge">
                <span className="origin">{item?.sg[0]?.or?.aC}</span>
                <div className="flight-arrow">➝</div>
                <span className="destination">
                  {item?.sg[item?.sg.length - 1]?.ds?.aC}
                </span>
              </div>
              <h1>Customize Your Flight Experience</h1>
              <p>Select your seat, meal, and baggage options</p>
            </div>
            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
              <>
                <div className="navv-tabss">
                  {/* Passenger tab - always enabled */}
                  <button
                    className={`nav-tab ${
                      activeTab === "passengers" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("passengers")}
                  >
                    <span className="tab-icon">🧍‍♂️</span>
                    <span className="tab-label">Passenger</span>
                  </button>

                  {/* Seats tab */}
                  <button
                    className={`nav-tab ${
                      activeTab === "seats" ? "active" : ""
                    }`}
                    onClick={() => addonCondition && setActiveTab("seats")}
                    disabled={!addonCondition}
                  >
                    <span className="tab-icon">💺</span>
                    <span className="tab-label">Seats</span>
                  </button>

                  {/* Meals tab */}
                  <button
                    className={`nav-tab ${
                      activeTab === "meals" ? "active" : ""
                    }`}
                    onClick={() => addonCondition && setActiveTab("meals")}
                    disabled={!addonCondition}
                  >
                    <span className="tab-icon">🍽️</span>
                    <span className="tab-label">Meals</span>
                  </button>

                  {/* Baggage tab */}
                  <button
                    className={`nav-tab ${
                      activeTab === "baggage" ? "active" : ""
                    }`}
                    onClick={() => addonCondition && setActiveTab("baggage")}
                    disabled={!addonCondition}
                  >
                    <span className="tab-icon">🧳</span>
                    <span className="tab-label">Baggage</span>
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="row justify-content-center mt-4">
              <div className="col-12 col-lg-7 order-1 order-lg-1 mb-4">
                <div className="row mt-3">
                  <div className="col-12">
                    {timebaki !== null && timebaki > 0 && (
                      <div
                        style={{
                          position: "fixed",
                          top: "20px",
                          right: "20px",
                          zIndex: 1050,
                        }}
                      >
                        <div
                          className={`badge p-2 ${
                            timebaki <= 120
                              ? "bg-danger text-white"
                              : "bg-primary text-white"
                          }`}
                        >
                          Time Remaining: {formatTime(timebaki)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {activeTab === "passengers" && (
                  <>
                    <div
                      className="saved-passengers-trigger"
                      onClick={toggleSavedPassengers}
                    >
                      <div className="trigger-left">
                        <div className="trigger-icon">👤</div>
                        <div className="trigger-text">
                          <h3>Load Saved Passenger</h3>
                          <p>Quick fill from previous bookings</p>
                        </div>
                      </div>
                      <span
                        className={`trigger-arrow ${
                          showSavedPassengers ? "rotate" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                    {showSavedPassengers && (
                      <div className="saved-passengers-dropdown">
                        <div className="category-tabs">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className={`category-tab ${
                                selectedCategory === cat.id ? "active" : ""
                              }`}
                              onClick={() => handleCategoryChange(cat.id)}
                            >
                              {cat.label} ({cat.count})
                            </div>
                          ))}
                        </div>

                        <div className="passengers-list">
                          {passenger_Details
                            .filter((p) => {
                              if (selectedCategory === "adult")
                                return p.passenger_type === "1";
                              if (selectedCategory === "child")
                                return p.passenger_type === "2";
                              if (selectedCategory === "infant")
                                return p.passenger_type === "3";
                            })
                            .map((passenger) => (
                              <div
                                key={passenger.id}
                                className={`passenger-carddd ${
                                  isPassengerSelected(
                                    passenger,
                                    selectedCategory
                                  )
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSelectPassenger(
                                    passenger,
                                    selectedCategory
                                  )
                                }
                              >
                                {isPassengerSelected(
                                  passenger,
                                  selectedCategory
                                ) && (
                                  <span className="selected-badge">
                                    Selected
                                  </span>
                                )}

                                <h4>
                                  {passenger.first_name} {passenger.last_name}
                                </h4>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    <div className="w-100 mb-4">
                      <div className="card shadow-lg border-0 h-100 w-100 card_flight">
                        {/* Header */}
                        <div
                          className="card-header border-0 p-4"
                          style={{
                            background:
                              "linear-gradient(135deg, #fc8236 0%, #fc5940 100%)",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <Plane className="text-white me-3" size={32} />
                            <div>
                              <h1 className="h3 text-white mb-1 fw-bold resp_head_text">
                                Flight Passenger Details
                              </h1>
                              <p className="text-white-50 mb-0">
                                Please fill in your booking information
                              </p>
                            </div>
                          </div>
                        </div>

                        {travelers?.length !== 0 && (
                          <h4
                            className="fw-bold text-dark text-center mb-3"
                            style={{ cursor: "pointer" }}
                            // onClick={() => setShowAccordion(!showAccordion)}
                          >
                            Adult Details
                            {/* {showAccordion ? "▲" : "▼"} */}
                          </h4>
                        )}
                        {/* {showAccordion && ( */}
                        <>
                          {travelers?.map((traveler, index) => (
                            <div
                              key={index}
                              className="card-body p-3 p-md-4 mb-3 mb-md-4 border rounded"
                            >
                              <h5 className="fw-semibold mb-3 fs-6 fs-md-5">
                                Adult Traveler {index + 1}
                              </h5>

                              {/* Title + Gender */}
                              <div className="row g-2 mb-3">
                                <div className="col-12 col-sm-6">
                                  <label className="form-label small">
                                    Title
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <Select
                                    options={titleOptions}
                                    value={titleOptions.find(
                                      (o) => o.value === traveler.title
                                    )}
                                    onChange={(selected) =>
                                      handleTravelerChange(
                                        "adult",
                                        index,
                                        "title",
                                        selected.value
                                      )
                                    }
                                  />
                                </div>
                                {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                                <>
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Gender{" "}
                                      {item?.fareIdentifier?.code !==
                                      "airIQ_fare" ? (
                                        <>
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </label>
                                    <Select
                                      options={genderOptions}
                                      value={genderOptions.find(
                                        (o) => o.value === traveler.gender
                                      )}
                                      onChange={(selected) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "gender",
                                          selected.value
                                        )
                                      }
                                    />
                                  </div>
                                </>
                                {/* ) : (
                                  <></>
                                )} */}
                              </div>

                              {/* First + Last Name */}
                              <div className="row g-2 mb-3">
                                <div className="col-12 col-sm-6">
                                  <label className="form-label small">
                                    First Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={traveler.firstName}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "adult",
                                        index,
                                        "firstName",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                                <div className="col-12 col-sm-6">
                                  <label className="form-label small">
                                    Last Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={traveler.lastName}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "adult",
                                        index,
                                        "lastName",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                              </div>

                              {/* Date of Birth */}
                              {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                              <>
                                <div className="mb-3">
                                  <label className="form-label small">
                                    Date of Birth{" "}
                                    {item?.fareIdentifier?.code !==
                                    "airIQ_fare" ? (
                                      <>
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </label>
                                  <DatePicker
                                    selected={traveler.dateOfBirth}
                                    value={
                                      traveler?.dateOfBirth
                                        ? dayjs(traveler?.dateOfBirth)
                                        : null
                                    }
                                    onChange={(date, dateString) => {
                                      handleTravelerChange(
                                        "adult",
                                        index,
                                        "dateOfBirth",
                                        dateString
                                      );
                                    }}
                                    className="form-control w-100"
                                    dateFormat="YYYY-MM-DD"
                                  />
                                </div>
                              </>
                              {/* ) : (
                                <></>
                              )} */}

                              {/* Email + Phone */}
                              {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Email{" "}
                                      {item?.fareIdentifier?.code !==
                                      "airIQ_fare" ? (
                                        <>
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </label>
                                    <input
                                      type="email"
                                      value={traveler.email}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Phone
                                      {item?.fareIdentifier?.code !==
                                      "airIQ_fare" ? (
                                        <>
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </label>
                                    <input
                                      type="text"
                                      value={traveler.contactNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "contactNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                              {/* ) : (
                                <></>
                              )} */}

                              {/* Address */}
                              {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                              <>
                                <div className="mb-3">
                                  <label className="form-label small">
                                    Address Line 1{" "}
                                    {item?.fareIdentifier?.code !==
                                    "airIQ_fare" ? (
                                      <>
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={traveler.addressLineOne}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "adult",
                                        index,
                                        "addressLineOne",
                                        e.target.value
                                      )
                                    }
                                    className="form-control mb-2"
                                  />

                                  <label className="form-label small">
                                    Address Line 2{" "}
                                    {item?.fareIdentifier?.code !==
                                    "airIQ_fare" ? (
                                      <>
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={traveler.addressLineTwo}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "adult",
                                        index,
                                        "addressLineTwo",
                                        e.target.value
                                      )
                                    }
                                    className="form-control mb-2"
                                  />

                                  <div className="row g-2">
                                    <div className="col-12 col-sm-6">
                                      <input
                                        type="text"
                                        placeholder="City"
                                        value={traveler.city}
                                        onChange={(e) =>
                                          handleTravelerChange(
                                            "adult",
                                            index,
                                            "city",
                                            e.target.value
                                          )
                                        }
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="col-12 col-sm-6">
                                      <input
                                        type="text"
                                        placeholder="Country"
                                        value={traveler.countryName}
                                        onChange={(e) =>
                                          handleTravelerChange(
                                            "adult",
                                            index,
                                            "countryName",
                                            e.target.value
                                          )
                                        }
                                        className="form-control"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                              {/* ) : (
                                <></>
                              )} */}

                              {/* Passport */}
                              {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Passport Number{" "}
                                      {item?.fareIdentifier?.code !==
                                      "airIQ_fare" ? (
                                        <>
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </label>
                                    <input
                                      type="text"
                                      value={traveler.passportNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "passportNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Passport Expiry{" "}
                                      {item?.fareIdentifier?.code !==
                                      "airIQ_fare" ? (
                                        <>
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </label>
                                    <DatePicker
                                      selected={traveler.passportExpiry}
                                      value={
                                        traveler.passportExpiry
                                          ? dayjs(traveler?.passportExpiry)
                                          : null
                                      }
                                      onChange={(date, dateString) => {
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "passportExpiry",
                                          dateString
                                        );
                                      }}
                                      className="form-control w-100"
                                    />
                                  </div>
                                </div>
                              </>
                              {/* ) : (
                                <></>
                              )} */}

                              {/* Frequent Flyer */}
                              {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Frequent Flyer No (optional)
                                    </label>
                                    <input
                                      type="text"
                                      value={traveler.frequentFlyerNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "frequentFlyerNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <label className="form-label small">
                                      Frequent Flayer Airline Code (optional)
                                    </label>
                                    <input
                                      type="text"
                                      value={traveler.frequentFlyerAirlineCode}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "frequentFlyerAirlineCode",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                              {/* ) : (
                                <></>
                              )} */}

                              {/* GST Information - Collapsible on Mobile */}
                              {/* {item?.fareIdentifier?.code !== "airIQ_fare" ? ( */}
                              <>
                                <div className="mb-3">
                                  <h6 className="fw-bold fs-6">
                                    GST Information (Optional)
                                  </h6>

                                  {/* GST Number - Full width on mobile */}
                                  <div className="mb-2">
                                    <input
                                      type="text"
                                      placeholder="GST Number"
                                      value={traveler.gstNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "gstNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>

                                  {/* Company Name - Full width on mobile */}
                                  <div className="mb-2">
                                    <input
                                      type="text"
                                      placeholder="GST Company Name"
                                      value={traveler.gstCompanyName}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "gstCompanyName",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>

                                  {/* Company Address - Full width on mobile */}
                                  <div className="mb-2">
                                    <input
                                      type="text"
                                      placeholder="GST Company Address"
                                      value={traveler.gstCompanyAddress}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "adult",
                                          index,
                                          "gstCompanyAddress",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>

                                  {/* Email and Phone in row for tablet+, stacked for mobile */}
                                  <div className="row g-2">
                                    <div className="col-12 col-sm-6">
                                      <input
                                        type="email"
                                        placeholder="GST Company Email"
                                        value={traveler.gstCompanyEmail}
                                        onChange={(e) =>
                                          handleTravelerChange(
                                            "adult",
                                            index,
                                            "gstCompanyEmail",
                                            e.target.value
                                          )
                                        }
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="col-12 col-sm-6">
                                      <input
                                        type="text"
                                        placeholder="GST Company Phone"
                                        value={traveler.gstCompanyContactNumber}
                                        onChange={(e) =>
                                          handleTravelerChange(
                                            "adult",
                                            index,
                                            "gstCompanyContactNumber",
                                            e.target.value
                                          )
                                        }
                                        className="form-control"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                              {/* ) : (
                                <></>
                              )} */}
                            </div>
                          ))}
                        </>
                        {/* )} */}
                        {childtravelers?.length !== 0 && (
                          <h4 className="fw-bold text-dark text-center">
                            Child Details
                          </h4>
                        )}
                        {childtravelers?.map((child, index) => (
                          <div
                            key={index}
                            className="card-body p-4 mb-3 border rounded"
                          >
                            <h5>Child {index + 1} - Personal Information</h5>

                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label className="form-label small">
                                  Title
                                </label>
                                <Select
                                  options={titleOptions}
                                  value={titleOptions.find(
                                    (o) => o.value === child.title
                                  )}
                                  onChange={(selected) =>
                                    handleTravelerChange(
                                      "child",
                                      index,
                                      "title",
                                      selected.value
                                    )
                                  }
                                />
                              </div>
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  <div className="col-6">
                                    <label className="form-label small">
                                      Gender
                                    </label>
                                    <Select
                                      options={genderOptions}
                                      value={genderOptions.find(
                                        (o) => o.value === child.gender
                                      )}
                                      onChange={(selected) =>
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "gender",
                                          selected.value
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>

                            {/* Names */}
                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label>First Name</label>
                                <input
                                  type="text"
                                  value={child.firstName}
                                  onChange={(e) =>
                                    handleTravelerChange(
                                      "child",
                                      index,
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                              </div>
                              <div className="col-6">
                                <label>Last Name</label>
                                <input
                                  type="text"
                                  value={child.lastName}
                                  onChange={(e) =>
                                    handleTravelerChange(
                                      "child",
                                      index,
                                      "lastName",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* DOB */}
                            <div className="mb-3">
                              <label className="form-label small">
                                Date of Birth
                              </label>
                              <DatePicker
                                selected={child.dateOfBirth}
                                onChange={(date, dateString) => {
                                  handleTravelerChange(
                                    "child",
                                    index,
                                    "dateOfBirth",
                                    dateString
                                  );
                                }}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                              />
                            </div>
                            {/* Contact */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label>Email</label>
                                    <input
                                      type="email"
                                      value={child.email}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label>Phone</label>
                                    <input
                                      type="text"
                                      value={child.contactNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "contactNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {/* Address */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="mb-3">
                                  <label>Address Line 1</label>
                                  <input
                                    type="text"
                                    value={child.addressLineOne}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "child",
                                        index,
                                        "addressLineOne",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="mb-3">
                                  <label>Address Line 2</label>
                                  <input
                                    type="text"
                                    value={child.addressLineTwo}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "child",
                                        index,
                                        "addressLineTwo",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label>City</label>
                                    <input
                                      type="text"
                                      value={child.city}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "city",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label>Country</label>
                                    <input
                                      type="text"
                                      value={child.countryName}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "countryName",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            {}
                            {/* Passport */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label>Passport Number</label>
                                    <input
                                      type="text"
                                      value={child.passportNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "passportNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label>Passport Expiry</label>
                                    <DatePicker
                                      selected={child.passportExpiry}
                                      onChange={(date, dateString) => {
                                        handleTravelerChange(
                                          "child",
                                          index,
                                          "passportExpiry",
                                          dateString
                                        );
                                      }}
                                      className="form-control"
                                      dateFormat="yyyy-MM-dd"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))}

                        {infanttravelers?.length !== 0 && (
                          <h4 className="fw-bold text-dark text-center">
                            Infant Details
                          </h4>
                        )}

                        {infanttravelers?.map((infant, index) => (
                          <div
                            key={index}
                            className="card-body p-4 mb-3 border rounded"
                          >
                            <h5>infant {index + 1} - Personal Information</h5>

                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label className="form-label small">
                                  Title
                                </label>
                                <Select
                                  options={titleOptions}
                                  value={titleOptions.find(
                                    (o) => o.value === infant.title
                                  )}
                                  onChange={(selected) =>
                                    handleTravelerChange(
                                      "infant",
                                      index,
                                      "title",
                                      selected.value
                                    )
                                  }
                                />
                              </div>
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  <div className="col-6">
                                    <label className="form-label small">
                                      Gender
                                    </label>
                                    <Select
                                      options={genderOptions}
                                      value={genderOptions.find(
                                        (o) => o.value === infant.gender
                                      )}
                                      onChange={(selected) =>
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "gender",
                                          selected.value
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>

                            {/* Names */}
                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label>First Name</label>
                                <input
                                  type="text"
                                  value={infant.firstName}
                                  onChange={(e) =>
                                    handleTravelerChange(
                                      "infant",
                                      index,
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                              </div>
                              <div className="col-6">
                                <label>Last Name</label>
                                <input
                                  type="text"
                                  value={infant.lastName}
                                  onChange={(e) =>
                                    handleTravelerChange(
                                      "infant",
                                      index,
                                      "lastName",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* DOB */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="mb-3">
                                  <label>Date of Birth</label>
                                  <DatePicker
                                    selected={infant.dateOfBirth}
                                    onChange={(date, dateString) => {
                                      handleTravelerChange(
                                        "infant",
                                        index,
                                        "dateOfBirth",
                                        dateString
                                      );
                                    }}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                  />
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {/* Contact */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label>Email</label>
                                    <input
                                      type="email"
                                      value={infant.email}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label>Phone</label>
                                    <input
                                      type="text"
                                      value={infant.contactNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "contactNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {/* Address */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="mb-3">
                                  <label>Address Line 1</label>
                                  <input
                                    type="text"
                                    value={infant.addressLineOne}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "infant",
                                        index,
                                        "addressLineOne",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="mb-3">
                                  <label>Address Line 2</label>
                                  <input
                                    type="text"
                                    value={infant.addressLineTwo}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        "infant",
                                        index,
                                        "addressLineTwo",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                  />
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label>City</label>
                                    <input
                                      type="text"
                                      value={infant.city}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "city",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label>Country</label>
                                    <input
                                      type="text"
                                      value={infant.countryName}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "countryName",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {/* Passport */}
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label>Passport Number</label>
                                    <input
                                      type="text"
                                      value={infant.passportNumber}
                                      onChange={(e) =>
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "passportNumber",
                                          e.target.value
                                        )
                                      }
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label>Passport Expiry</label>
                                    <DatePicker
                                      selected={infant.passportExpiry}
                                      onChange={(date, dateString) => {
                                        handleTravelerChange(
                                          "infant",
                                          index,
                                          "passportExpiry",
                                          dateString
                                        );
                                      }}
                                      className="form-control"
                                      dateFormat="yyyy-MM-dd"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "seats" && <SeatMap />}
                {activeTab === "meals" && <MealSelection />}
                {activeTab === "baggage" && <BaggageSelection />}
              </div>

              <div className="col-12 col-lg-5 order-2 order-lg-2">
                <div className="row">
                  <div className="col-12 pricee-tag">
                    <h2 className="fs-4 fs-lg-2">Your Booking Details</h2>
                  </div>
                </div>
                <div
                  className="row border border-top-none"
                  style={{ border: "1px solid #ff4500" }}
                >
                  <div className="booking_details_airline_name_heading">
                    <div className="d-flex gap-2 align-items-center">
                      <div>
                        {(() => {
                          const airline = item.sg[0]?.al?.alN;
                          return airline === "Indigo" ||
                            airline === "Indigo" ? (
                            <img
                              src={images.IndiGoAirlines_logo}
                              className="airline_logo"
                            />
                          ) : airline === "Spicejet" ? (
                            <img
                              src={images.spicejet}
                              className="airline_logo"
                            />
                          ) : airline === "Neos" ? (
                            <img
                              src={images.neoslogo}
                              className="airline_logo"
                            />
                          ) : airline === "Air India" ? (
                            <img
                              src={images.airindialogo}
                              className="airline_logo"
                            />
                          ) : airline === "Akasa Air" ? (
                            <img
                              src={images.akasalogo}
                              className="airline_logo"
                            />
                          ) : airline === "Etihad" ? (
                            <img
                              src={images.etihadlogo}
                              style={{
                                backgroundColor: "#fffbdb",
                                padding: "5px",
                                borderRadius: "5px",
                              }}
                              className="airline_logo"
                            />
                          ) : airline === "Vistara" ? (
                            <img
                              src={images.vistaralogo}
                              className="airline_logo"
                            />
                          ) : airline === "AirAsia X" ? (
                            <img
                              src={images.airasiax}
                              className="airline_logo"
                            />
                          ) : (
                            <IoAirplaneSharp size={40} color="white" />
                          );
                        })()}
                      </div>
                      <div
                        className="text-dark"
                        style={{ fontWeight: "600", fontSize: "18px" }}
                      >
                        {item.sg[0]?.al?.alN}
                      </div>
                    </div>
                    {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                      <>
                        <div>
                          <Chip
                            label={
                              item?.iR === true
                                ? "Refundable"
                                : "Non-Refundable"
                            }
                            variant="outlined"
                            sx={{
                              color: item?.iR === true ? "green" : "gray",
                              backgroundColor:
                                item?.iR === true ? "#e0f7e9" : "inherit",
                              borderColor:
                                item?.iR === true ? "#4caf50" : "inherit",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col-12 py-3 flight-box">
                    <div className="flight-departure text-center">
                      <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                        {moment(item?.sg[0]?.or?.dT).format("hh:mm A")}
                      </h5>
                      <h5 className="text-dark fs-6 fs-lg-5">
                        {item?.sg[0]?.or?.aC}
                      </h5>
                      <div className="fw-bold fs-lg-5 text-dark align-self-center">
                        {moment(item?.sg[0]?.or?.dT).format("DD-MM-YYYY")}
                      </div>
                    </div>
                    <div className="d-inline-flex column-gap-0 column-gap-lg-3 align-items-center">
                      <span className="d-inline-block text-dark">From</span>
                      <div className="text-center">
                        <p className="text-dark durationtxt">
                          {(() => {
                            const departure = moment(item?.sg[0]?.or?.dT);
                            const arrival = moment(
                              item?.sg[item?.sg.length - 1]?.ds?.aT
                            );
                            const totalMinutes = arrival.diff(
                              departure,
                              "minutes"
                            );
                            return `${Math.floor(totalMinutes / 60)}h ${
                              totalMinutes % 60
                            }m`;
                          })()}
                        </p>
                        <img
                          src={images.invertedviman}
                          alt=""
                          className="resp_booking_details_flight_img"
                        />
                        <p>
                          {item?.sg.length === 1
                            ? "Non Stop"
                            : `${item?.sg.length - 1} Stop${
                                item?.sg.length - 1 > 1 ? "s" : ""
                              }`}
                        </p>
                      </div>
                      <span className="d-inline-block text-dark">To</span>
                    </div>
                    <div className="flight-departure text-center">
                      <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                        {moment(item?.sg[item?.sg.length - 1]?.ds?.aT).format(
                          "hh:mm A"
                        )}
                      </h5>
                      <h5 className="text-dark fs-6 fs-lg-5">
                        {item?.sg[item?.sg.length - 1]?.ds?.aC}
                      </h5>
                      <div className="fw-bold fs-lg-5 text-dark align-self-center">
                        {moment(item?.sg[item?.sg.length - 1]?.ds?.aT).format(
                          "DD-MM-YYYY"
                        )}
                      </div>
                    </div>
                  </div>

                  {flightdata ? (
                    <>
                      <div className="booking_details_airline_name_heading">
                        <div className="d-flex gap-2 align-items-center">
                          <div>
                            {(() => {
                              const airline = flightdata.sg[0]?.al?.alN;
                              return airline === "Indigo" ||
                                airline === "Indigo" ? (
                                <img
                                  src={images.IndiGoAirlines_logo}
                                  className="airline_logo"
                                />
                              ) : airline === "Neos" ? (
                                <img
                                  src={images.neoslogo}
                                  className="airline_logo"
                                />
                              ) : airline === "SpiceJet" ? (
                                <img
                                  src={images.spicejet}
                                  className="airline_logo"
                                />
                              ) : airline === "Air India" ? (
                                <img
                                  src={images.airindialogo}
                                  className="airline_logo"
                                />
                              ) : airline === "Akasa Air" ? (
                                <img
                                  src={images.akasalogo}
                                  className="airline_logo"
                                />
                              ) : airline === "Etihad" ? (
                                <img
                                  src={images.etihadlogo}
                                  style={{
                                    backgroundColor: "#fffbdb",
                                    padding: "5px",
                                    borderRadius: "5px",
                                  }}
                                  className="airline_logo"
                                />
                              ) : airline === "Vistara" ? (
                                <img
                                  src={images.vistaralogo}
                                  className="airline_logo"
                                />
                              ) : airline === "AirAsia X" ? (
                                <img
                                  src={images.airasiax}
                                  className="airline_logo"
                                />
                              ) : (
                                <IoAirplaneSharp size={40} color="white" />
                              );
                            })()}
                          </div>
                          <div
                            className="text-dark"
                            style={{ fontWeight: "600", fontSize: "18px" }}
                          >
                            {flightdata.sg[0]?.al?.alN}
                          </div>
                        </div>
                        <div>
                          <Chip
                            label={
                              item?.iR === true
                                ? "Refundable"
                                : "Non-Refundable"
                            }
                            variant="outlined"
                            sx={{
                              color: item?.iR === true ? "green" : "gray",
                              backgroundColor:
                                item?.iR === true ? "#e0f7e9" : "inherit",
                              borderColor:
                                item?.iR === true ? "#4caf50" : "inherit",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12 py-3 flight-box">
                        <div className="flight-departure text-center">
                          <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                            {moment(flightdata?.sg[0]?.or?.dT).format(
                              "hh:mm A"
                            )}
                          </h5>
                          <h5 className="text-dark fs-6 fs-lg-5">
                            {flightdata?.sg[0]?.or?.aC}
                          </h5>
                          <div className="fw-bold fs-lg-5 text-dark align-self-center">
                            {moment(flightdata?.sg[0]?.or?.dT).format(
                              "DD-MM-YYYY"
                            )}
                          </div>
                        </div>
                        <div className="d-inline-flex column-gap-0 column-gap-lg-3 align-items-center">
                          <span className="d-inline-block text-dark">From</span>
                          <div className="text-center">
                            <p className="text-dark durationtxt">
                              {(() => {
                                const departure = moment(
                                  flightdata?.sg[0]?.or?.dT
                                );
                                const arrival = moment(
                                  flightdata?.sg[flightdata?.sg.length - 1]?.ds
                                    ?.aT
                                );
                                const totalMinutes = arrival.diff(
                                  departure,
                                  "minutes"
                                );
                                return `${Math.floor(totalMinutes / 60)}h ${
                                  totalMinutes % 60
                                }m`;
                              })()}
                            </p>
                            <img
                              src={images.invertedviman}
                              alt=""
                              className="resp_booking_details_flight_img_return"
                            />
                            <p>
                              {flightdata?.sg.length === 1
                                ? "Non Stop"
                                : `${flightdata?.sg.length - 1} Stop${
                                    flightdata?.sg.length - 1 > 1 ? "s" : ""
                                  }`}
                            </p>
                          </div>
                          <span className="d-inline-block text-dark">To</span>
                        </div>
                        <div className="flight-departure text-center">
                          <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                            {moment(
                              flightdata?.sg[flightdata?.sg.length - 1]?.ds?.aT
                            ).format("hh:mm A")}
                          </h5>
                          <h5 className="text-dark fs-6 fs-lg-5">
                            {flightdata?.sg[flightdata?.sg.length - 1]?.ds?.aC}
                          </h5>
                          <div className="fw-bold fs-lg-5 text-dark align-self-center">
                            {moment(
                              flightdata?.sg[flightdata?.sg.length - 1]?.ds?.aT
                            ).format("DD-MM-YYYY")}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="row mt-4">
                  <div className="col-12 pricee-tag">
                    <h2 className="fs-4 fs-lg-2">Price Summary</h2>
                  </div>
                  <div className="border p-3 rounded shadow-sm">
                    {(() => {
                      let totalFare =
                        item?.fareIdentifier?.code !== "airIQ_fare"
                          ? item?.fF || 0
                          : item?.airIQPrice || 0;

                      let totalService =
                        item?.fareIdentifier?.code !== "airIQ_fare"
                          ? item?.sF || 0
                          : 0.0;

                      if (flightdata) {
                        totalFare += flightdata?.fF || 0;
                        totalService += flightdata?.sF || 0;
                      }

                      return (
                        <>
                          {/* Onward Breakdown */}
                          <div className="mb-3">
                            <h6 className="fw-bold text-dark">Onward Fare</h6>
                            <div className="row w-100">
                              <div className="col-6 text-start text-dark">
                                Base + Taxes
                              </div>
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  <div className="col-6 text-end text-dark">
                                    ₹ {item?.fF?.toFixed(2) || "0.00"}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="col-6 text-end text-dark">
                                    ₹ {item?.airIQPrice?.toFixed(2) || "0.00"}
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="row w-100">
                              <div className="col-6 text-start text-dark">
                                Service Fees
                              </div>
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  <div className="col-6 text-end text-dark">
                                    ₹ {item?.sF?.toFixed(2) || "0.00"}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="col-6 text-end text-dark">
                                    ₹ {"0.00"}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {flightdata && (
                            <div className="mb-3">
                              <h6 className="fw-bold text-dark">Return Fare</h6>
                              <div className="row w-100">
                                <div className="col-6 text-start text-dark">
                                  Base + Taxes
                                </div>
                                <div className="col-6 text-end text-dark">
                                  ₹ {flightdata?.fF?.toFixed(2) || "0.00"}
                                </div>
                              </div>
                              <div className="row w-100">
                                <div className="col-6 text-start text-dark">
                                  Service Fees
                                </div>
                                <div className="col-6 text-end text-dark">
                                  ₹ {flightdata?.sF?.toFixed(2) || "0.00"}
                                </div>
                              </div>
                            </div>
                          )}
                          {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                            <>
                              <div className="text-center fw-bold fs-4 text-danger">
                                {" "}
                                Add Ons
                              </div>
                              <div className="summary-details">
                                {/* Seats */}
                                <div className="summary-item">
                                  <span className="label">Seat Selection</span>
                                  <div className="value">
                                    {selectedSeats.length > 0 ? (
                                      selectedSeats.map((seat) => (
                                        <span
                                          key={seat.code}
                                          className="selected-option d-block"
                                        >
                                          {seat.seatNo}{" "}
                                          <span className="price price_addon">
                                            ₹{seat.amt}
                                          </span>
                                        </span>
                                      ))
                                    ) : (
                                      <span className="not-selected">
                                        Not selected
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Meals */}
                                <div className="summary-item">
                                  <span className="label">Meal</span>
                                  <div className="value">
                                    {selectedMeals.length > 0 ? (
                                      selectedMeals.map((meal) => (
                                        <span
                                          key={meal.code}
                                          className="selected-option d-block"
                                        >
                                          {meal.dsc}{" "}
                                          <span className="price price_addon">
                                            ₹{meal.amt}
                                          </span>
                                        </span>
                                      ))
                                    ) : (
                                      <span className="not-selected">
                                        Not selected
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Baggage */}
                                <div className="summary-item">
                                  <span className="label">Baggage</span>
                                  <div className="value">
                                    {selectedBaggage.length > 0 ? (
                                      selectedBaggage.map((baggage) => (
                                        <span
                                          key={baggage.code}
                                          className="selected-option d-block"
                                        >
                                          {baggage.dsc}{" "}
                                          <span className="price price_addon">
                                            ₹{baggage.amt}
                                          </span>
                                        </span>
                                      ))
                                    ) : (
                                      <span className="not-selected">
                                        Standard (15 Kg)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          <hr />

                          {/* Grand Total */}
                          <div className="row mb-2 w-100">
                            <div className="col-6 text-start fs-4 fw-bold text-success">
                              Grand Total
                            </div>
                            <div className="col-6 text-end fs-4 fw-bold text-success">
                              ₹{" "}
                              {(
                                totalFare +
                                totalService +
                                getTotalAmount()
                              ).toFixed(2)}
                            </div>
                          </div>

                          <div
                            className="row justify-content-center mt-2"
                            style={{
                              display: !addonCondition ? "inherit" : "none",
                            }}
                          >
                            <div className="col-12 d-flex align-items-center gap-2">
                              <label className="custom-checkbox d-flex align-items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={check}
                                  onChange={togglecheck}
                                  className="d-none"
                                />
                                <span className="checkmark"></span>
                                <span className="fw-bold text-muted">
                                  I agree with the Terms & Conditions
                                </span>
                              </label>
                            </div>
                            <div
                              style={{
                                cursor: check ? "pointer" : "not-allowed",
                                width: "95%",
                              }}
                              className="col-2 mx-auto btnn text-center sbmitbtn"
                              onClick={() => {
                                AddPassengerDetailsToApi();

                                const allPassengers = [
                                  ...travelers,
                                  ...childtravelers,
                                  ...infanttravelers,
                                ];
                                const validation =
                                  item?.fareIdentifier?.code !== "airIQ_fare"
                                    ? validatePassengers(allPassengers)
                                    : validatePassengersAiriq(allPassengers);
                                if (!validation.isValid) {
                                  Notification(
                                    "warning",
                                    "Field Required",
                                    validation.message
                                  );
                                  return;
                                }

                                if (
                                  check &&
                                  item?.fareIdentifier?.code !== "airIQ_fare"
                                ) {
                                  openModalasking();
                                  console.log("true airiq");
                                  // handleSavePassenger();
                                } else {
                                  console.log("false airiq");
                                  handleSavePassengerAiriq();
                                }
                              }}
                            >
                              {passenger_loading ? "Loading..." : "SUBMIT"}
                            </div>
                          </div>

                          <button
                            style={{
                              display: !addonCondition ? "none" : "block",
                              width: "100%",
                            }}
                            className="btn-proceed"
                            disabled={!selectedSeats}
                            onClick={() => SavePassengerWithSSR()}
                          >
                            Continue to Payment
                          </button>

                          <div className="security-note">
                            <div className="lock-icon">🔒</div>
                            Your information is secure and encrypted
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

      <Dialog
        open={seatmodalOpen}
        onClose={handleCloseModalSeat}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="dialog-header">
          <Typography variant="h6" sx={{ flex: 1 }}>
            Confirm Seat
          </Typography>
          <IconButton className="close-icon" onClick={handleCloseModalSeat}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="dialog-body">
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seat) => (
              <div key={seat.code} className="mb-2">
                <Typography>
                  <strong>Seat:</strong> {seat.seatNo}
                </Typography>
                <Typography>
                  <strong>Type:</strong>{" "}
                  {seat.isAisle
                    ? "Aisle Seat"
                    : seat.seatNo.endsWith("A") || seat.seatNo.endsWith("F")
                    ? "Window Seat"
                    : "Middle Seat"}
                </Typography>
                <Typography>
                  <strong>Price:</strong> ₹{seat.amt}
                </Typography>
              </div>
            ))
          ) : (
            <Typography>No seat selected</Typography>
          )}
        </DialogContent>

        <DialogActions className="dialog-footer">
          <Button onClick={handleCloseModalSeat} className="cancel-btn">
            Cancel
          </Button>
          <Button onClick={handleConfirmSeat} className="confirm-btn">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        contentLabel="Price Recheck Response"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            borderRadius: "12px",
            maxWidth: "600px",
            width: "95%",
            maxHeight: "90vh",
            overflow: "auto",
            border: "none",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <div style={{ height: "100%" }}>
          {/* Header */}

          <div
            style={{
              background: "linear-gradient(135deg, #f25e0e 0%, #f91d1d 100%)",
              color: "white",
              padding: "20px",
              textAlign: "center",
              position: "sticky",
              top: "0",
              zIndex: "10",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
              Price Recheck Results
            </h2>

            <button className="btn2" onClick={() => setIsModalOpen(false)}>
              X
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "20px",
            }}
          >
            {reprice_loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #667eea",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>
                  Rechecking prices and validating details...
                </p>
                <style>
                  {`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </div>
            ) : reprice_data?.results ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Price Summary */}
                <div
                  style={{
                    background: reprice_data.results.isPriceChanged
                      ? "#fff3cd"
                      : "#d1edff",
                    border: `1px solid ${
                      reprice_data.results.isPriceChanged
                        ? "#ffeaa7"
                        : "#74b9ff"
                    }`,
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: reprice_data.results.isPriceChanged
                        ? "#856404"
                        : "#0984e3",
                      fontSize: "18px",
                    }}
                  >
                    {reprice_data.results.isPriceChanged
                      ? "⚠️ Price Updated"
                      : "✅ Price Confirmed"}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        Total Amount
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#2d3436",
                        }}
                      >
                        {formatCurrency(reprice_data.results.totalAmount)}
                      </p>
                    </div>
                    {reprice_data.results.previousTotalAmount && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "14px",
                            color: "#666",
                          }}
                        >
                          Previous Amount
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            color: "#636e72",
                            textDecoration: reprice_data.results.isPriceChanged
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {formatCurrency(
                            reprice_data.results.previousTotalAmount
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Baggage Information */}
                <div
                  style={{
                    background: "#f0f8ff",
                    border: "1px solid #b3d9ff",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 16px 0", color: "#2d3436" }}>
                    Baggage Information
                    {/* {reprice_data.results.isBaggageChanged && ( */}
                    <span
                      style={{
                        background: "#ffc107",
                        color: "#856404",
                        fontSize: "12px",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        marginLeft: "8px",
                      }}
                    >
                      CHANGED
                    </span>
                    {/* )} */}
                  </h4>

                  {reprice_data.results.itineraryItems?.map((item, index) => {
                    if (item.type !== "FLIGHT") return null;

                    const flight = item.itemFlight;
                    const segments = flight.segments?.[0];
                    const isReturn = index === 1;

                    if (!segments || segments.length === 0) return null;

                    return (
                      <div
                        key={item.itemCode}
                        style={{
                          marginBottom: "16px",
                          padding: "12px",
                          background: "white",
                          borderRadius: "6px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <span
                            style={{
                              background: isReturn ? "#28a745" : "#007bff",
                              color: "white",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              marginRight: "8px",
                            }}
                          >
                            {isReturn ? "Return" : "Outbound"}
                          </span>
                          <span style={{ fontWeight: "600", fontSize: "14px" }}>
                            {flight.airlineName} {flight.flightNumber}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                          }}
                        >
                          {/* Check-in Baggage */}
                          <div
                            style={{
                              padding: "10px",
                              background: "#f8f9fa",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "4px",
                                fontWeight: "500",
                              }}
                            >
                              Check-in Baggage
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#2d3436",
                              }}
                            >
                              {segments[0]?.bg || "Not specified"}
                            </div>
                            {segments.length > 1 && segments[1]?.bg && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#666",
                                  marginTop: "2px",
                                }}
                              >
                                Via segment: {segments[1].bg}
                              </div>
                            )}
                          </div>

                          {/* Cabin Baggage */}
                          <div
                            style={{
                              padding: "10px",
                              background: "#f8f9fa",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "4px",
                                fontWeight: "500",
                              }}
                            >
                              Cabin Baggage
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#2d3436",
                              }}
                            >
                              {segments[0]?.cBg || "Not specified"}
                            </div>
                            {segments.length > 1 && segments[1]?.cBg && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#666",
                                  marginTop: "2px",
                                }}
                              >
                                Via segment: {segments[1].cBg}
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: "12px",
                          }}
                        >
                          {" "}
                          <div
                            style={{
                              padding: "10px",
                              background: "#f8f9fa",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "4px",
                                fontWeight: "500",
                              }}
                            >
                              Add Ons Baggage
                            </div>
                            {/* <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#2d3436",
                              }}
                            >
                              {formatCurrency(
                                reprice_data?.results?.addONs?.baggage
                                  ?.totalAmt || 0
                              )}
                              
                            </div> */}
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#e8b51b",
                                backgroundColor: "#fff3cd",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                display: "inline-block",
                                border: "1px solid #e8b51b",
                              }}
                            >
                              11560
                            </div>
                          </div>
                        </div>

                        {/* Route Information for Baggage Context */}
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "8px",
                            background: "#f1f3f4",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          <strong>Route:</strong> {segments[0]?.or?.aC} →{" "}
                          {segments[segments.length - 1]?.ds?.aC}
                          {segments.length > 1 && (
                            <span style={{ marginLeft: "8px" }}>
                              (via {segments[0]?.ds?.aC})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Baggage Change Notice */}
                  {/* {reprice_data.results.isBaggageChanged && ( */}
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "1px solid #ffeaa7",
                      borderRadius: "6px",
                      padding: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: "#856404",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      ⚠️ Baggage allowance has been updated from the original
                      search
                    </div>
                  </div>
                  {/* )} */}

                  {/* {!reprice_data.results.isBaggageChanged && (
                    <div
                      style={{
                        background: "#d1edff",
                        border: "1px solid #74b9ff",
                        borderRadius: "6px",
                        padding: "12px",
                        marginTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          color: "#0984e3",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        ✅ Baggage allowance confirmed - no changes from
                        original search
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Fare Breakdown */}
                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", color: "#2d3436" }}>
                    Fare Breakdown
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#636e72" }}>Base Fare</span>
                      <span style={{ fontWeight: "500" }}>
                        {formatCurrency(reprice_data.results.baseFare)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#636e72" }}>Tax & Surcharge</span>
                      <span style={{ fontWeight: "500" }}>
                        {formatCurrency(reprice_data.results.taxAndSurcharge)}
                      </span>
                    </div>
                    {reprice_data.results.addONs?.seat?.totalAmt > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#636e72" }}>Seat Selection</span>
                        <span style={{ fontWeight: "500" }}>
                          {formatCurrency(
                            reprice_data.results.addONs.seat.totalAmt
                          )}
                        </span>
                      </div>
                    )}
                    {reprice_data.results.addONs?.seat?.totalAmt > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#636e72" }}>
                          Baggage Selection
                        </span>
                        <span style={{ fontWeight: "500" }}>
                          {formatCurrency(
                            reprice_data.results.addONs.baggage.totalAmt
                          )}
                        </span>
                      </div>
                    )}
                    {reprice_data.results.insuranceAmount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#636e72" }}>Insurance</span>
                        <span style={{ fontWeight: "500" }}>
                          {formatCurrency(reprice_data.results.insuranceAmount)}
                        </span>
                      </div>
                    )}
                    <hr
                      style={{
                        margin: "8px 0",
                        border: "none",
                        borderTop: "1px solid #ddd",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      <span>Total</span>
                      <span>
                        {formatCurrency(reprice_data.results.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Flight Details */}
                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 16px 0", color: "#2d3436" }}>
                    Flight Details
                  </h4>

                  {reprice_data.results.itineraryItems?.map((item, index) => {
                    if (item.type !== "FLIGHT") return null;

                    const flight = item.itemFlight;
                    const segment = flight.segments?.[0]?.[0];
                    const isReturn = index === 1;

                    return (
                      <div
                        key={item.itemCode}
                        style={{
                          marginBottom: "20px",
                          padding: "16px",
                          background: "white",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {/* Flight Header */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                background: isReturn ? "#28a745" : "#007bff",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginRight: "8px",
                              }}
                            >
                              {isReturn ? "Return" : "Outbound"}
                            </span>
                            <span
                              style={{
                                fontWeight: "600",
                                color: "#2d3436",
                                fontSize: "16px",
                              }}
                            >
                              {flight.airlineName} {flight.flightNumber}
                            </span>
                          </div>
                          <span
                            style={{
                              background: flight.fareIdentifier.colorCode,
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            {flight.fareIdentifier.name}
                          </span>
                        </div>

                        {/* Route Information */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "16px",
                          }}
                        >
                          {/* Departure */}
                          <div style={{ textAlign: "left" }}>
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#2d3436",
                              }}
                            >
                              {formatTimeok(
                                segment?.or?.dT || flight.departureAt
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "4px",
                              }}
                            >
                              {formatDateok(
                                segment?.or?.dT || flight.departureAt
                              )}
                            </div>
                            <div
                              style={{ fontWeight: "600", fontSize: "14px" }}
                            >
                              {segment?.or?.aC || flight.origin}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              {segment?.or?.cN}
                            </div>
                            <div style={{ fontSize: "11px", color: "#999" }}>
                              {segment?.or?.aN}
                            </div>
                          </div>

                          {/* Flight Info */}
                          <div
                            style={{ textAlign: "center", padding: "0 20px" }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "4px",
                              }}
                            >
                              {flight.stopCount.stops === 0
                                ? "Non-stop"
                                : `${flight.stopCount.stops} stop(s)`}
                            </div>
                            <div
                              style={{
                                height: "2px",
                                background: "#ddd",
                                position: "relative",
                                width: "60px",
                                margin: "8px 0",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  right: "-6px",
                                  top: "-4px",
                                  width: "0",
                                  height: "0",
                                  borderLeft: "6px solid #ddd",
                                  borderTop: "5px solid transparent",
                                  borderBottom: "5px solid transparent",
                                }}
                              ></div>
                            </div>
                            <div style={{ fontSize: "11px", color: "#666" }}>
                              {Math.floor(
                                (new Date(segment?.ds?.aT || flight.arrivalAt) -
                                  new Date(
                                    segment?.or?.dT || flight.departureAt
                                  )) /
                                  (1000 * 60)
                              )}{" "}
                              min
                            </div>
                          </div>

                          {/* Arrival */}
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#2d3436",
                              }}
                            >
                              {formatTimeok(
                                segment?.ds?.aT || flight.arrivalAt
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "4px",
                              }}
                            >
                              {formatDateok(
                                segment?.ds?.aT || flight.arrivalAt
                              )}
                            </div>
                            <div
                              style={{ fontWeight: "600", fontSize: "14px" }}
                            >
                              {segment?.ds?.aC || flight.destination}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              {segment?.ds?.cN}
                            </div>
                            <div style={{ fontSize: "11px", color: "#999" }}>
                              {segment?.ds?.aN}
                            </div>
                          </div>
                        </div>

                        {/* Individual Fare Details */}
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "8px",
                            }}
                          >
                            Fare details for this flight:
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "8px",
                            }}
                          >
                            <div style={{ fontSize: "13px" }}>
                              <span style={{ color: "#666" }}>Base Fare: </span>
                              <span style={{ fontWeight: "500" }}>
                                {formatCurrency(flight.fareQuote.baseFare)}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px" }}>
                              <span style={{ color: "#666" }}>Total: </span>
                              <span style={{ fontWeight: "600" }}>
                                {formatCurrency(flight.fareQuote.finalFare)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Passenger Details */}
                <div
                  style={{
                    background: "#e8f5e8",
                    border: "1px solid #c3e6c3",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", color: "#2d3436" }}>
                    Passenger Details
                  </h4>
                  <div
                    style={{
                      marginBottom: "12px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    <span>
                      Adults: <strong>{reprice_data.results.adultCount}</strong>{" "}
                      |{" "}
                    </span>
                    <span>
                      Children:{" "}
                      <strong>{reprice_data.results.childCount}</strong> |{" "}
                    </span>
                    <span>
                      Infants:{" "}
                      <strong>{reprice_data.results.infantCount}</strong>
                    </span>
                  </div>

                  {/* Passenger List */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {reprice_data.results.passengers?.map(
                      (passenger, index) => (
                        <div
                          key={passenger.id || index}
                          style={{
                            background: "white",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "12px",
                            fontSize: "14px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <span
                              style={{ fontWeight: "600", color: "#2d3436" }}
                            >
                              {passenger.title} {passenger.firstName}{" "}
                              {passenger.lastName}
                              {passenger.isLeadPax && (
                                <span
                                  style={{
                                    background: "#667eea",
                                    color: "white",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    marginLeft: "8px",
                                  }}
                                >
                                  Lead
                                </span>
                              )}
                            </span>
                            <span
                              style={{
                                background:
                                  passenger.paxType === 1
                                    ? "#28a745"
                                    : passenger.paxType === 2
                                    ? "#ffc107"
                                    : "#17a2b8",
                                color: "white",
                                fontSize: "10px",
                                padding: "2px 6px",
                                borderRadius: "3px",
                              }}
                            >
                              {passenger.paxType === 1
                                ? "Adult"
                                : passenger.paxType === 2
                                ? "Child"
                                : "Infant"}
                            </span>
                          </div>
                          <div style={{ color: "#636e72", fontSize: "13px" }}>
                            <p style={{ margin: "2px 0" }}>
                              📧 {passenger.email}
                            </p>
                            <p style={{ margin: "2px 0" }}>
                              📱 +{passenger.cellCountryCode}{" "}
                              {passenger.contactNumber}
                            </p>
                            {passenger.dateOfBirth && (
                              <p style={{ margin: "2px 0" }}>
                                🎂{" "}
                                {new Date(
                                  passenger.dateOfBirth
                                ).toLocaleDateString("en-IN")}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Important Alerts */}
                {(reprice_data.results.isPriceChanged ||
                  reprice_data.results.isBaggageChanged) && (
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "1px solid #ffeaa7",
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0", color: "#856404" }}>
                      Important Changes
                    </h4>
                    {reprice_data.results.isPriceChanged && (
                      <p style={{ margin: "4px 0", color: "#856404" }}>
                        • Flight price has changed
                      </p>
                    )}
                    {reprice_data.results.isBaggageChanged && (
                      <p style={{ margin: "4px 0", color: "#856404" }}>
                        • Baggage allowance has changed
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ color: "#e74c3c", fontSize: "16px" }}>
                  No data available or an error occurred.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #eee",
              background: "#f8f9fa",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "sticky",
              bottom: "0",
              left: "0",
              right: "0",
              zIndex: "100",
              margin: "0 -20px -20px -20px",
            }}
          >
            <button
              onClick={closeModal}
              disabled={reprice_loading || booking_loading}
              style={{
                backgroundColor:
                  reprice_loading || booking_loading ? "#ccc" : "red",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor:
                  reprice_loading || booking_loading
                    ? "not-allowed"
                    : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
                minWidth: "120px",
              }}
            >
              {reprice_loading || booking_loading
                ? "Processing..."
                : "Continue"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Time Up modal */}
      <Modal
        isOpen={isModalOpensession}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s ease",
          },
          content: {
            position: "static", // This is key for centering
            borderRadius: "16px",
            maxWidth: "480px",
            width: "90%",
            padding: "40px",
            backgroundColor: "#fff",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
            border: "none",
            textAlign: "center",
            animation: "modalFadeIn 0.3s ease-out",
          },
        }}
      >
        <div className="modal-content-wrapper">
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#2d3748", // Dark grey for a professional feel
              marginBottom: "10px",
            }}
          >
            Time's Up! ⏳
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "#718096", // Slightly lighter grey for body text
              marginBottom: "30px",
              lineHeight: 1.5,
            }}
          >
            The Session has expired. To continue, you'll need to start a new
            search.
          </p>
          <button
            onClick={handleNewSearch}
            style={{
              width: "100%",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.2s ease, transform 0.1s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(1px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            Start a New Search
          </button>
        </div>
      </Modal>
      <div dangerouslySetInnerHTML={{ __html: modalCSS }} />
      {/* Booking Details modal */}
      <Modal
        isOpen={bookingModal}
        onRequestClose={() => handleCloseBookingModal()}
        style={customStyles}
        contentLabel="Flight Booking Details"
      >
        <div className="booking-modal-content">
          {get_booking_loading ? (
            // Loading State
            <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="fw-semibold text-muted">
                Fetching your booking details...
              </p>
            </div>
          ) : (
            <>
              {(() => {
                const currentBookingData =
                  isReturn == 0 ? get_booking_data : return_get_booking_data;

                const results =
                  currentBookingData?.flight_itinerary?.responseData?.results;
                const flight = results?.itineraryItems?.[0]?.itemFlight || {};
                const Returnflight =
                  results?.itineraryItems?.[1]?.itemFlight || {};
                const segment = flight?.segments?.[0]?.[0] || {};

                const retunsegment = Returnflight?.segments?.[0]?.[0];

                const currentBookingStatus =
                  isReturn == 0
                    ? get_booking_data?.bookingStatus || "CONFIRMED"
                    : return_get_booking_data?.bookingStatus || "CONFIRMED";

                return (
                  <>
                    {/* HEADER */}
                    <div
                      className={`p-4 position-relative text-white ${
                        currentBookingStatus === "FAILED"
                          ? "modal-header-failed"
                          : currentBookingStatus === "PENDING"
                          ? "modal-header-pending"
                          : "modal-header-gradient"
                      }`}
                    >
                      <button
                        onClick={handleCloseBookingModal}
                        className="close-btn"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>

                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="me-3"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            padding: "12px",
                            borderRadius: "50%",
                          }}
                        >
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22,4 12,14.01 9,11.01"></polyline>
                          </svg>
                        </div>
                        <div>
                          <h1 className="h2 mb-1 fw-bold">{status.title}</h1>
                          <p
                            className="mb-0"
                            style={{ color: "rgba(255, 255, 255, 0.8)" }}
                          >
                            {status.message}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-end">
                        <div className="d-flex w-100 gap-2">
                          {okres && (
                            <button
                              className={`btn flex-fill ${
                                isReturn === 0
                                  ? "btn-light"
                                  : "btn-outline-light"
                              }`}
                              onClick={() => setIsReturn(0)}
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                borderColor:
                                  isReturn === 0
                                    ? "white"
                                    : "rgba(255, 255, 255, 0.3)",
                                color:
                                  isReturn === 0
                                    ? "black"
                                    : "rgba(255, 255, 255, 0.9)",
                                backgroundColor:
                                  isReturn === 0 ? "white" : "transparent",
                                transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (isReturn !== 0) {
                                  e.target.style.backgroundColor = "black";
                                  e.target.style.borderColor = "black";
                                  e.target.style.color = "white";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (isReturn !== 0) {
                                  e.target.style.backgroundColor =
                                    "transparent";
                                  e.target.style.borderColor =
                                    "rgba(255, 255, 255, 0.3)";
                                  e.target.style.color =
                                    "rgba(255, 255, 255, 0.9)";
                                }
                              }}
                            >
                              Outbound Flight
                            </button>
                          )}
                          {okres && (
                            <button
                              className={`btn flex-fill ${
                                isReturn === 1
                                  ? "btn-light"
                                  : "btn-outline-light"
                              }`}
                              onClick={() => setIsReturn(1)}
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                borderColor:
                                  isReturn === 1
                                    ? "white"
                                    : "rgba(255, 255, 255, 0.3)",
                                color:
                                  isReturn === 1
                                    ? "black"
                                    : "rgba(255, 255, 255, 0.9)",
                                backgroundColor:
                                  isReturn === 1 ? "white" : "transparent",
                                transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (isReturn !== 1) {
                                  e.target.style.backgroundColor = "black";
                                  e.target.style.borderColor = "black";
                                  e.target.style.color = "white";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (isReturn !== 1) {
                                  e.target.style.backgroundColor =
                                    "transparent";
                                  e.target.style.borderColor =
                                    "rgba(255, 255, 255, 0.3)";
                                  e.target.style.color =
                                    "rgba(255, 255, 255, 0.9)";
                                }
                              }}
                            >
                              Return Flight
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="scrollable-content">
                      <div className="d-flex justify-content-between align-items-end">
                        {/* <div>
                          <p
                            className="mb-1"
                            style={{
                              color: "rgba(0, 0, 0, 0.8)",
                              fontSize: "0.875rem",
                            }}
                          >
                            Booking Reference
                          </p>
                          <p
                            className="h4 mb-0"
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              letterSpacing: "2px",
                            }}
                          >
                            {currentBookingData?.bmsBookingCode?.toUpperCase()}
                          </p>
                        </div> */}
                        <div className="text-start">
                          <p
                            className="mb-1"
                            style={{
                              color: "rgba(0, 0, 0, 0.8)",
                              fontSize: "0.875rem",
                            }}
                          >
                            PNR
                          </p>
                          <p
                            className="h4 mb-0"
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              letterSpacing: "2px",
                            }}
                          >
                            {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                              <>
                                {isReturn == 0 ? (
                                  <>{flight?.pnrDetails?.[0]?.pnr}</>
                                ) : (
                                  <>{Returnflight?.pnrDetails?.[0]?.pnr}</>
                                )}
                              </>
                            ) : (
                              <>{getBookingData?.pnr}</>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Flight Route */}
                      <div className="section-card flight-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="d-flex align-items-center">
                            <div
                              className="icon-box me-3"
                              style={{ backgroundColor: "#3b82f6" }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                              >
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9l-8.2-1.8c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 2.4 4.4c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="h5 mb-1 fw-bold">
                                {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                  <>
                                    {isReturn == 0 ? (
                                      <> {flight?.airlineName}</>
                                    ) : (
                                      <> {Returnflight?.airlineName}</>
                                    )}
                                  </>
                                ) : (
                                  <>{getBookingData?.airline}</>
                                )}
                              </h3>
                              <p className="mb-0 text-muted small">
                                Flight{" "}
                                {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                  <>
                                    {isReturn == 0 ? (
                                      <>{flight?.flightNumber}</>
                                    ) : (
                                      <>{Returnflight?.flightNumber}</>
                                    )}{" "}
                                    •{" "}
                                    {isReturn == 0
                                      ? flight?.stopCount?.stops === 0
                                        ? "Non-stop"
                                        : `${flight?.stopCount?.stops} stop(s)`
                                      : Returnflight?.stopCount?.stops === 0
                                      ? "Non-stop"
                                      : `${Returnflight?.stopCount?.stops} stop(s)`}
                                  </>
                                ) : (
                                  <>{getBookingData?.flight_no}</>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-end">
                            <p className="mb-1 text-muted small">Duration</p>
                            <p className="mb-0 fw-semibold">
                              {isReturn == 0 ? (
                                <>
                                  {calculateDuration(
                                    segment?.or?.dT,
                                    segment?.ds?.aT
                                  )}
                                </>
                              ) : (
                                <>
                                  {calculateDuration(
                                    retunsegment?.or?.dT,
                                    retunsegment?.ds?.aT
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="city-card flex-fill">
                            <p className="h3 mb-1 fw-bold text-primary">
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{segment?.or?.aC}</>
                                  ) : (
                                    <>{retunsegment?.or?.aC}</>
                                  )}
                                </>
                              ) : (
                                <>
                                  {getBookingData?.sector
                                    ?.split("//")[0]
                                    ?.trim()}
                                </>
                              )}
                            </p>
                            <p className="mb-2 text-muted small">
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{segment?.or?.cN} </>
                                  ) : (
                                    <>{retunsegment?.or?.cN}</>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </p>
                            <div
                              className="mb-2 text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{formatDay(segment?.or?.dT)}</>
                                  ) : (
                                    <>{formatDay(retunsegment?.or?.dT)}</>
                                  )}
                                </>
                              ) : (
                                <>{item?.departure_date}</>
                              )}
                            </div>
                            <div className="h5 mb-1 fw-bold text-primary">
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{formatTime1(segment?.or?.dT)}</>
                                  ) : (
                                    <>{formatTime1(retunsegment?.or?.dT)}</>
                                  )}
                                </>
                              ) : (
                                <>{getBookingData?.departure_time}</>
                              )}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{formatDate(segment?.or?.dT)}</>
                                  ) : (
                                    <>{formatDate(retunsegment?.or?.dT)}</>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>

                          {/* Arrow Path */}
                          <div className="flight-path">
                            <div className="path-dot"></div>
                            <div className="path-line">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="2"
                                style={{
                                  position: "absolute",
                                  right: "-8px",
                                  top: "-7px",
                                }}
                              >
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12,5 19,12 12,19"></polyline>
                              </svg>
                            </div>
                            <div
                              className="path-dot"
                              style={{ backgroundColor: "#6366f1" }}
                            ></div>
                          </div>

                          <div className="city-card flex-fill">
                            <p className="h3 mb-1 fw-bold text-primary">
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{segment?.ds?.aC}</>
                                  ) : (
                                    <>{retunsegment?.ds?.aC}</>
                                  )}
                                </>
                              ) : (
                                <>
                                  {getBookingData?.sector
                                    ?.split("//")[1]
                                    ?.trim()}
                                </>
                              )}
                            </p>
                            <p className="mb-2 text-muted small">
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{segment?.ds?.cN}</>
                                  ) : (
                                    <>{retunsegment?.ds?.cN}</>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </p>
                            <div
                              className="mb-2 text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{formatDay(segment?.ds?.aT)}</>
                                  ) : (
                                    <>{formatDay(retunsegment?.ds?.aT)}</>
                                  )}
                                </>
                              ) : (
                                <>{getBookingData?.arrival_date}</>
                              )}
                            </div>
                            <div className="h5 mb-1 fw-bold text-primary">
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{formatTime1(segment?.ds?.aT)}</>
                                  ) : (
                                    <>{formatTime1(retunsegment?.ds?.aT)}</>
                                  )}
                                </>
                              ) : (
                                <>{getBookingData?.arrival_time}</>
                              )}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item?.fareIdentifier?.code !== "airIQ_fare" ? (
                                <>
                                  {isReturn === 0 ? (
                                    <>{formatDate(segment?.ds?.aT)}</>
                                  ) : (
                                    <>{formatDate(retunsegment?.ds?.aT)}</>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Passenger Details */}
                      <div className="section-card passenger-card">
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="icon-box me-3"
                            style={{ backgroundColor: "#8b5cf6" }}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <h3 className="h5 mb-0 fw-bold">
                            Passenger Details (
                            {results?.passengers?.length || 0})
                          </h3>
                        </div>

                        {results?.passengers?.map((passenger, index) => (
                          <div
                            key={index}
                            className="bg-white rounded p-3 border mb-3"
                          >
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <p
                                  className="mb-1 text-muted small text-uppercase"
                                  style={{ letterSpacing: "1px" }}
                                >
                                  Full Name
                                </p>
                                <p className="h5 mb-0 fw-bold">
                                  {passenger?.title} {passenger?.firstName}{" "}
                                  {passenger?.lastName}
                                </p>
                              </div>
                              <div className="col-md-6">
                                <p
                                  className="mb-1 text-muted small text-uppercase"
                                  style={{ letterSpacing: "1px" }}
                                >
                                  Ticket Number
                                </p>
                                <p
                                  className="mb-0 fw-semibold"
                                  style={{ fontFamily: "monospace" }}
                                >
                                  {passenger?.paxFare?.ticketNumber || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="d-flex flex-wrap gap-4 pt-3 border-top">
                              {passenger?.email && (
                                <div className="d-flex align-items-center">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="me-2 text-muted"
                                  >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                  </svg>
                                  <span className="small text-muted">
                                    {passenger?.email}
                                  </span>
                                </div>
                              )}
                              {passenger?.contactNumber && (
                                <div className="d-flex align-items-center">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="me-2 text-muted"
                                  >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                  </svg>
                                  <span className="small text-muted">
                                    +91 {passenger?.contactNumber}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Passenger Type Badge */}
                            {passenger?.passengerType && (
                              <div className="mt-3">
                                <span
                                  className={`badge ${
                                    passenger.passengerType === "ADULT"
                                      ? "bg-primary"
                                      : passenger.passengerType === "CHILD"
                                      ? "bg-warning"
                                      : passenger.passengerType === "INFANT"
                                      ? "bg-info"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {passenger.passengerType}
                                </span>
                              </div>
                            )}
                          </div>
                        )) || (
                          <div className="bg-white rounded p-3 border text-center text-muted">
                            No passenger details available
                          </div>
                        )}
                      </div>

                      {/* Baggage */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="bg-white rounded text-center p-3 border h-100">
                            <div className="fs-2 mb-2">🧳</div>
                            <p
                              className="mb-1 text-muted small text-uppercase"
                              style={{ letterSpacing: "1px" }}
                            >
                              Check-in
                            </p>
                            <p className="mb-0 fw-semibold">
                              {isReturn === 0 ? (
                                <>{segment.bg}</>
                              ) : (
                                <>{retunsegment.bg}</>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="bg-white rounded text-center p-3 border h-100">
                            <div className="fs-2 mb-2">🎒</div>
                            <p
                              className="mb-1 text-muted small text-uppercase"
                              style={{ letterSpacing: "1px" }}
                            >
                              Cabin
                            </p>
                            <p className="mb-0 fw-semibold">
                              {isReturn === 0 ? (
                                <>{segment.cBg}</>
                              ) : (
                                <>{retunsegment.cBg}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Fare */}
                      <div className="section-card fare-card">
                        <h3 className="h5 mb-3 fw-bold">Fare Summary</h3>
                        <div className="bg-white rounded p-3 border">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="text-muted">Base Fare</span>
                              <span className="fw-semibold">
                                ₹{results?.baseFare?.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Taxes & Fees</span>
                              <span className="fw-semibold">
                                ₹{results?.taxAndSurcharge?.toLocaleString()}
                              </span>
                            </div>

                            {/* AddONs Section - Only show if addONs exist */}
                            {results?.addONs &&
                              Object.keys(results.addONs).length > 0 && (
                                <div className="mb-3">
                                  <div className="border-top pt-2 mb-2">
                                    <span className="text-muted small fw-semibold">
                                      Add-ons
                                    </span>
                                  </div>
                                  {Object.entries(results.addONs).map(
                                    ([key, value], index) => (
                                      <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center mb-1"
                                      >
                                        <span
                                          className="text-muted small"
                                          style={{ marginLeft: "10px" }}
                                        >
                                          {key.charAt(0).toUpperCase() +
                                            key
                                              .slice(1)
                                              .replace(/([A-Z])/g, " $1")}
                                          {value.count > 1 &&
                                            ` (x${value.count})`}
                                        </span>
                                        <span className="fw-semibold small">
                                          ₹{value.totalAmt?.toLocaleString()}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                            <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                              <span className="h5 fw-bold mb-0">
                                Total Paid
                              </span>
                              <span className="h4 fw-bold mb-0 text-success">
                                ₹{results?.totalAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={askingmodalIsOpen}
        onRequestClose={closeModalasking}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "0",
            borderRadius: "16px",
            maxWidth: "480px",
            width: "95%",
            maxHeight: "90vh",
            overflow: "auto",
            border: "none",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
        contentLabel="Airline Add-ons Modal"
      >
        <div className="addon-modal-content">
          <div className="addon-modal-header">
            <h2 className="addon-modal-title">
              <span className="addon-plane-icon">✈️</span>
              Enhance Your Journey
            </h2>
            <button className="addon-close-btn" onClick={closeModalasking}>
              ×
            </button>
          </div>

          <div className="addon-modal-body">
            <div className="addon-icon-main">➕</div>

            <h3 className="addon-main-title">Add Extra Services?</h3>

            <p className="addon-description">
              Make your flight more comfortable with our premium add-on
              services. Choose from meals, extra baggage, and preferred seating
              options.
            </p>

            <div className="addon-services-grid">
              <div className="addon-service-item">
                <div className="addon-service-icon meals">🍽️</div>
                <span className="addon-service-label">Meals</span>
              </div>

              <div className="addon-service-item">
                <div className="addon-service-icon baggage">🧳</div>
                <span className="addon-service-label">Baggage</span>
              </div>

              <div className="addon-service-item">
                <div className="addon-service-icon seats">💺</div>
                <span className="addon-service-label">Seats</span>
              </div>
            </div>
          </div>

          <div className="addon-modal-footer">
            <button
              className="addon-btn addon-btn-skip"
              onClick={handleSkip}
              disabled={passenger_loading}
            >
              {passenger_loading ? "Loading..." : "Skip"}
            </button>
            <button className="addon-btn addon-btn-yes" onClick={handleYes}>
              Yes, Add Services
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TicketBookingDetails;
