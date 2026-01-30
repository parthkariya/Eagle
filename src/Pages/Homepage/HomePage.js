import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Homepage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeHero from "../../Components/HomeHero/HomeHero";
import HeroTicketBooking from "../../Components/HeroTicketBooking/HeroTicketBooking";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import PartnerAirline from "../../Components/PartnerAirlines/PartnerAirline";
import { Helmet } from "react-helmet";
import ReactModal from "react-modal";
import Modal from "react-modal";
import { IoCloseCircle } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import {
  ACCEPT_HEADER,
  getcancellationpolicy,
  getcompanylist,
  supplierticketcurl,
  ticketcurl,
  verifyCall,
} from "../../Utils/Constant";
import { useAuthContext } from "../../Context/auth_context";
import HappySection from "../../Components/HappySection/HappySection";
import WhyChooseUsBus from "../../Components/WhyChooseUsBus/WhyChooseUsBus";
import CountSection from "../../Components/CountSection/CountSection";
import { useBusContext } from "../../Context/bus_context";
import { useFlightContext } from "../../Context/flight_context";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X,
  Plane,
  Calendar,
  Users,
  CreditCard,
  Luggage,
  Clock,
  MapPin,
} from "lucide-react";

const HomePage = () => {
  const { getCancellationPolicyApi } = useAuthContext();
  const [modalWidth, setModalWidth] = useState("90%");
  const location = useLocation();

  const [refid, setRefID] = useState(location.state?.reference_id || "");

  const { FlightSearch, FlightSearchAiriq, flight_Data, flightAirIq_Data } =
    useFlightContext();

  useLayoutEffect(() => {
    const updateWidth = () => {
      setModalWidth(window.innerWidth <= 1180 ? "90%" : "1140px");
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: modalWidth,
      padding: "0",
      border: "none",
      borderRadius: "10px",
      position: "relative",
      overflowY: "auto",
      height: "auto",
      maxHeight: "90vh",
    },
    overlay: {
      zIndex: 10000,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingid, setBookingId] = useState(null);
  const [login, SetLogin] = useState("");
  const [getCompanyId, setCompanyId] = useState();
  const [loading, setLoading] = useState(false);
  const [cheapfixloading, setCheapFixLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dataCheapfix, setDataCheapFix] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [modelOpenCheapFix, setModalOpenCheapFix] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    var companyid = localStorage.getItem("companyid");
    setCompanyId(companyid);

    SetLogin(islogin);
    var role = localStorage.getItem("is_role");
    if (islogin) {
      setUserRole(JSON.parse(role));
    }
  }, []);

  useEffect(() => {
    getCancellationPolicy();
  }, []);

  useEffect(() => {
    if (refid) {
      fetchBookingDetailsByReference();
    }
  }, [refid]);

  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";
  const isLocalhost = window.location.hostname === "localhost";

  const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";

  useEffect(() => {
    window.scroll(0, 0);
    var bookingid = localStorage.getItem("booking_id");
    setBookingId(bookingid);
    if (bookingid !== null) {
      setModalOpen(true);
      setTimeout(() => {
        BookingDetails(bookingid);
      }, 1000);
    }

    const token = JSON.parse(localStorage.getItem("is_token"));
  }, [userRole]);

  const BookingDetails = async (bookingid) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    setLoading(true);
    let apiUrl = "";

    if (userRole === "2") {
      apiUrl = `${ticketcurl}/${bookingid}`;
    } else if (userRole === "3") {
      apiUrl = `${supplierticketcurl}/${bookingid}`;
    } else {
      console.error("Invalid selection value");
      return;
    }
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          "api-key": API_KEY,
          Authorization: token,
          Accept: ACCEPT_HEADER,
        },
      });
      if (res.data.status === "success") {
        const data = res.data.data;
        console.log("Ticket no data", res.data.data);
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("Error in Ticket Details Api ", error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    localStorage.removeItem("booking_id");
    console.log("Booking ID cleared!");
  };

  const handleCloseCheapFix = () => {
    setModalOpenCheapFix(false);
    setDataCheapFix(null);
    setRefID("");
    navigate("/", { replace: true });
  };

  const { selectedTabMainHome, selectedTab, ClearRouteData } = useBusContext();

  const getCancellationPolicy = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", getcancellationpolicy);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("companyId", 1);

    const data = await getCancellationPolicyApi(formdata);
    if (data) {
      // console.log("cancellation data", data);
    }
  };

  const fetchBookingDetailsByReference = async () => {
    const token = "3-1-NEWTEST-dmjkwj78BJHk8";

    const payload = {
      reference_id: refid,
      transaction_id: "ok bhai",
      end_user_ip: "183.83.43.117",
      token: token,
    };

    try {
      setCheapFixLoading(true);
      const res = await axios.post(
        "https://local.flightapi.co.in/v1/fbapi/booking_details",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Booking Details Response:", res.data);

      if (res.data?.replyCode === 0 && res.data?.data) {
        setDataCheapFix(res.data.data);
        setModalOpenCheapFix(true);
      } else {
        console.error("API failed:", res.data);
        alert("Failed to fetch booking details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      alert("Error fetching booking details. Please check your connection.");
    } finally {
      setCheapFixLoading(false);
    }
  };

  return (
    <div className="">
      <Helmet>
        <title>Home | Airline Booking</title>
      </Helmet>
      <HomeHero />

      {selectedTab === "buses" ? (
        <>
          <HappySection />
          <WhyChooseUsBus />
          <CountSection />
        </>
      ) : (
        <>
          {flight_Data?.length > 0 || flightAirIq_Data?.length > 0 ? (
            <></>
          ) : (
            <>
              <WhyChooseUs />
              <PartnerAirline />
            </>
          )}
        </>
      )}

      {/* Original Booking Modal */}
      <ReactModal
        isOpen={modalOpen}
        style={customStyles}
        onRequestClose={() => setModalOpen(false)}
      >
        <div className="home_model_4wrappp home_model_4wrapp_resp_padding">
          <button className="login_modal_close" onClick={handleClose}>
            <IoCloseCircle color="#e8381b" size={30} />
          </button>

          {loading ? (
            <>
              <div
                style={{
                  width: "100%",
                  height: "80vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="loader">
                  <div className="spinner"></div>
                  <p className="loading-text">Loading...</p>
                </div>
              </div>
            </>
          ) : (
            <div className="modal-content-wrapper">
              <div className="d-flex text-center my-4">
                <p
                  className="fw-bold fs-4"
                  style={{ color: "#362a60", marginBottom: "0px" }}
                >
                  Your Booking Details
                </p>
              </div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-black">Airline</th>
                    <th className="text-black">Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data?.airline}</td>
                    <td>{moment(data?.booking_date).format("DD-MM-YYYY")} </td>
                  </tr>
                </tbody>
              </table>

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td className="w-0 w-lg-50 ">Agency Name</td>
                    <td className="w-50 "> {data?.agency_name}</td>
                  </tr>
                  <tr>
                    <td className="w-50 ">Booking ID</td>
                    <td className="w-50 ">{data?.booking_id}</td>
                  </tr>
                  <tr>
                    <td className="w-50 ">PNR</td>
                    <td className="w-50 ">{data?.pnr}</td>
                  </tr>
                  <tr>
                    <td className="w-50 ">Flight No</td>
                    <td className="w-50 ">{data?.flight_no}</td>
                  </tr>
                </tbody>
              </table>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="w-50 text-black">Origin</th>
                    <th className="w-50 text-black">Destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data?.sector.split(" // ")[0]}</td>
                    <td>{data?.sector.split(" // ")[1]}</td>
                  </tr>
                  <tr>
                    <td>{data?.departure_date}</td>
                    <td>{data?.arrival_date} </td>
                  </tr>
                  <tr>
                    <td>{data?.departure_time}</td>
                    <td>{data?.arrival_time}</td>
                  </tr>
                </tbody>
              </table>

              <div className="col-12 text-start">
                <h4>Passenger Details</h4>

                <table className="table table-bordered">
                  {data?.passenger_details?.Adult ? (
                    <>
                      <thead>
                        <tr>
                          <th
                            colSpan={4}
                            className="text-black"
                            style={{ textAlign: "left" }}
                          >
                            Adult (12+ Years)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Sr No.</th>
                          <th colSpan={3}>Name</th>
                        </tr>

                        {data?.passenger_details?.Adult.map((itm, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td colSpan={3}>{itm?.Name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  ) : (
                    <></>
                  )}

                  {data?.passenger_details?.Child ? (
                    <>
                      <thead>
                        <tr>
                          <th colSpan={4} className="text-black">
                            Child (2-12 Years)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Sr No.</th>
                          <th colSpan={3}> Name</th>
                        </tr>
                        {data?.passenger_details?.Child.map((itm, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td colSpan={3}>{itm?.Name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  ) : (
                    <></>
                  )}

                  {data?.passenger_details?.Infant ? (
                    <>
                      <thead>
                        <tr>
                          <th colSpan={4} className="text-white">
                            Infant (0-2 Years)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Sr No.</th>
                          <th colSpan={2}> Name</th>
                          <th>Birth Date</th>
                        </tr>

                        {data?.passenger_details?.Infant.map((itm, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td colSpan={2}>{itm?.Name}</td>
                              <td>{itm?.Dob}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  ) : (
                    <></>
                  )}
                </table>
              </div>

              <div className="col-12 text-start">
                <h4>Total Amount</h4>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th className="w-50">Total Amount</th>
                        <th className="w-50 text-success fw-bolder">
                          {`\u20B9 ${data?.total_amount}`}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </ReactModal>

      {modelOpenCheapFix && dataCheapfix && (
        <div className="cheapfix-modal-overlay">
          <div className="cheapfix-modal-container">
            <div className="cheapfix-modal-header">
              <h2 className="cheapfix-modal-title">Booking Details</h2>
              <button
                className="cheapfix-modal-close-btn"
                onClick={handleCloseCheapFix}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="cheapfix-modal-content">
              {/* Booking Summary */}
              <div className="cheapfix-section">
                <h3 className="cheapfix-section-title">Booking Summary</h3>
                <div className="cheapfix-info-grid">
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Reference ID:</span>
                    <span className="cheapfix-value">
                      {dataCheapfix.reference_id}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Booking Date:</span>
                    <span className="cheapfix-value">
                      {dataCheapfix.booking_date}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">PNR:</span>
                    <span className="cheapfix-value">
                      {dataCheapfix.flight_pnrs}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Total Amount:</span>
                    <span className="cheapfix-value cheapfix-amount">
                      ₹{dataCheapfix.total_amount}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Payment Status:</span>
                    <span
                      className={`cheapfix-status ${dataCheapfix.payment_status ? "cheapfix-status-success" : "cheapfix-status-pending"}`}
                    >
                      {dataCheapfix.payment_status ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Seat Booking Status:</span>
                    <span
                      className={`cheapfix-status ${dataCheapfix.seat_book_status ? "cheapfix-status-success" : "cheapfix-status-pending"}`}
                    >
                      {dataCheapfix.seat_book_status ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="cheapfix-section">
                <h3 className="cheapfix-section-title">Contact Information</h3>
                <div className="cheapfix-info-grid">
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Name:</span>
                    <span className="cheapfix-value">
                      {dataCheapfix.contact_name}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Email:</span>
                    <span className="cheapfix-value">
                      {dataCheapfix.contact_email}
                    </span>
                  </div>
                  <div className="cheapfix-info-item">
                    <span className="cheapfix-label">Phone:</span>
                    <span className="cheapfix-value">
                      {dataCheapfix.contact_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passenger Count */}
              <div className="cheapfix-section">
                <h3 className="cheapfix-section-title">Passenger Details</h3>
                <div className="cheapfix-passenger-count">
                  <div className="cheapfix-count-item">
                    <Users size={20} />
                    <span>Adult: {dataCheapfix.adult}</span>
                  </div>
                  <div className="cheapfix-count-item">
                    <Users size={20} />
                    <span>Children: {dataCheapfix.children}</span>
                  </div>
                  <div className="cheapfix-count-item">
                    <Users size={20} />
                    <span>Infant: {dataCheapfix.infant}</span>
                  </div>
                  <div className="cheapfix-count-item">
                    <span className="cheapfix-total-seats">
                      Total Seats: {dataCheapfix.total_book_seats}
                    </span>
                  </div>
                </div>
              </div>

              {/* Onward Flight Details */}
              {dataCheapfix.onward && (
                <div className="cheapfix-section">
                  <h3 className="cheapfix-section-title">
                    <Plane size={20} />
                    Onward Flight Details
                  </h3>
                  <div className="cheapfix-flight-card">
                    <div className="cheapfix-airline-info">
                      <div className="cheapfix-airline-details">
                        <span className="cheapfix-airline-name">
                          {dataCheapfix.onward.airline_name}
                        </span>
                        <span className="cheapfix-flight-number">
                          {dataCheapfix.onward.airline_code}{" "}
                          {dataCheapfix.onward.flight_number}
                        </span>
                      </div>
                    </div>

                    <div className="cheapfix-route-info">
                      <div className="cheapfix-route-point">
                        <div className="cheapfix-city-code">
                          {dataCheapfix.onward.depeparture_city_code}
                        </div>
                        <div className="cheapfix-city-name">
                          {dataCheapfix.onward.depeparture_city_name}
                        </div>
                        <div className="cheapfix-datetime">
                          <Calendar size={14} />
                          <span>{dataCheapfix.onward.departure_date}</span>
                        </div>
                        <div className="cheapfix-datetime">
                          <Clock size={14} />
                          <span>{dataCheapfix.onward.departure_time}</span>
                        </div>
                        <div className="cheapfix-terminal">
                          Terminal{" "}
                          {dataCheapfix.onward.departure_terminal_no_id}
                        </div>
                      </div>

                      {/* <div className="cheapfix-route-arrow">
                        <div className="cheapfix-stops">
                          {dataCheapfix.onward.stop_count === 0
                            ? "Non-Stop"
                            : `${dataCheapfix.onward.stop_count} Stop(s)`}
                        </div>
                        <div className="cheapfix-arrow-line"></div>
                      </div> */}

                      <div className="cheapfix-route-point">
                        <div className="cheapfix-city-code">
                          {dataCheapfix.onward.arrival_city_code}
                        </div>
                        <div className="cheapfix-city-name">
                          {dataCheapfix.onward.arrival_city_name}
                        </div>
                        <div className="cheapfix-datetime">
                          <Calendar size={14} />
                          <span>{dataCheapfix.onward.arrival_date}</span>
                        </div>
                        <div className="cheapfix-datetime">
                          <Clock size={14} />
                          <span>{dataCheapfix.onward.arrival_time}</span>
                        </div>
                        <div className="cheapfix-terminal">
                          Terminal {dataCheapfix.onward.arrival_terminal_no_id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baggage Information */}
              {dataCheapfix.baggage && (
                <div className="cheapfix-section">
                  <h3 className="cheapfix-section-title">
                    <Luggage size={20} />
                    Baggage Allowance
                  </h3>
                  <div className="cheapfix-baggage-grid">
                    <div className="cheapfix-baggage-card">
                      <h4 className="cheapfix-baggage-title">
                        Check-in Baggage
                      </h4>
                      <div className="cheapfix-baggage-item">
                        <span>Adult:</span>
                        <span>
                          {dataCheapfix.baggage.checkin_baggages_adult} kg
                        </span>
                      </div>
                      <div className="cheapfix-baggage-item">
                        <span>Children:</span>
                        <span>
                          {dataCheapfix.baggage.checkin_baggages_children} kg
                        </span>
                      </div>
                      <div className="cheapfix-baggage-item">
                        <span>Infant:</span>
                        <span>
                          {dataCheapfix.baggage.checkin_baggages_infant} kg
                        </span>
                      </div>
                    </div>

                    <div className="cheapfix-baggage-card">
                      <h4 className="cheapfix-baggage-title">Cabin Baggage</h4>
                      <div className="cheapfix-baggage-item">
                        <span>Adult:</span>
                        <span>
                          {dataCheapfix.baggage.cabin_baggages_adult} kg
                        </span>
                      </div>
                      <div className="cheapfix-baggage-item">
                        <span>Children:</span>
                        <span>
                          {dataCheapfix.baggage.cabin_baggages_children} kg
                        </span>
                      </div>
                      <div className="cheapfix-baggage-item">
                        <span>Infant:</span>
                        <span>
                          {dataCheapfix.baggage.cabin_baggages_infant} kg
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="cheapfix-baggage-disclaimer">
                    {dataCheapfix.baggage.disclaimer}
                  </p>
                </div>
              )}

              {/* Price Breakup */}
              {dataCheapfix.price_breakup && (
                <div className="cheapfix-section">
                  <h3 className="cheapfix-section-title">
                    <CreditCard size={20} />
                    Price Breakup
                  </h3>
                  <div className="cheapfix-price-list">
                    <div className="cheapfix-price-row">
                      <span>Base Price:</span>
                      <span>₹{dataCheapfix.price_breakup.base_price}</span>
                    </div>
                    <div className="cheapfix-price-row">
                      <span>Fees & Taxes:</span>
                      <span>₹{dataCheapfix.price_breakup.fees_taxes}</span>
                    </div>
                    <div className="cheapfix-price-row">
                      <span>Service Charge:</span>
                      <span>₹{dataCheapfix.price_breakup.service_charge}</span>
                    </div>
                    <div className="cheapfix-price-row">
                      <span>Discount:</span>
                      <span className="cheapfix-discount">
                        -₹{dataCheapfix.price_breakup.discount}
                      </span>
                    </div>
                    <div className="cheapfix-price-row cheapfix-price-total">
                      <span>Total Amount:</span>
                      <span>₹{dataCheapfix.total_amount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Travellers */}
              {dataCheapfix.travellers &&
                dataCheapfix.travellers.length > 0 && (
                  <div className="cheapfix-section">
                    <h3 className="cheapfix-section-title">
                      Travellers Information
                    </h3>
                    {dataCheapfix.travellers.map((traveller, index) => (
                      <div key={index} className="cheapfix-traveller-card">
                        <h4 className="cheapfix-traveller-name">
                          Passenger {index + 1}: {traveller.gender}{" "}
                          {traveller.first_name} {traveller.middle_name}{" "}
                          {traveller.last_name}
                        </h4>
                        <div className="cheapfix-traveller-grid">
                          <div className="cheapfix-info-item">
                            <span className="cheapfix-label">
                              Date of Birth:
                            </span>
                            <span className="cheapfix-value">
                              {traveller.dob}
                            </span>
                          </div>
                          <div className="cheapfix-info-item">
                            <span className="cheapfix-label">Age:</span>
                            <span className="cheapfix-value">
                              {traveller.age} years
                            </span>
                          </div>
                          {traveller.passport_no && (
                            <>
                              <div className="cheapfix-info-item">
                                <span className="cheapfix-label">
                                  Passport No:
                                </span>
                                <span className="cheapfix-value">
                                  {traveller.passport_no}
                                </span>
                              </div>
                              <div className="cheapfix-info-item">
                                <span className="cheapfix-label">
                                  Passport Expiry:
                                </span>
                                <span className="cheapfix-value">
                                  {traveller.passport_expire_date}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="cheapfix-info-item">
                            <span className="cheapfix-label">
                              Ticket Price:
                            </span>
                            <span className="cheapfix-value">
                              ₹{traveller.ticket_price}
                            </span>
                          </div>
                          <div className="cheapfix-info-item">
                            <span className="cheapfix-label">Status:</span>
                            <span
                              className={`cheapfix-status ${traveller.status === 1 ? "cheapfix-status-success" : "cheapfix-status-pending"}`}
                            >
                              {traveller.status === 1 ? "Confirmed" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
