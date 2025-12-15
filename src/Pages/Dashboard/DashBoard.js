import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import { Helmet } from "react-helmet";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { DatePicker } from "antd";
import { useBusContext } from "../../Context/bus_context";
import dayjs from "dayjs";
import {
  FaInfoCircle,
  FaShareAlt,
  FaUser,
  FaUsers,
  FaLongArrowAltRight,
} from "react-icons/fa";
import ReactModal from "react-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import images from "../../Constants/images";
import { IoAirplaneSharp, IoCloseCircle } from "react-icons/io5";
import {
  ACCEPT_HEADER,
  bookseatdetails,
  canceldetails,
  confirmCancellationUrl,
  get_all_flights_booking,
  get_booking,
  get_combineflight_Booking,
  get_flight_Booking,
  TicketStatus,
  verifyCall,
} from "../../Utils/Constant";
import axios from "axios";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { MdCurrencyRupee, MdCancelPresentation } from "react-icons/md";
import { BsFillLuggageFill, BsBookmarkCheckFill } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { GiCommercialAirplane } from "react-icons/gi";
import { LuBus } from "react-icons/lu";

const ITEMS_PER_PAGE = 20;

const DashBoard = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [departureFromDate, setDepartureFromDate] = useState(null);
  const [departureToDate, setDepartureToDate] = useState(null);
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [getBookingData, SetbookingData] = useState([]);
  const [getBookingDataLoading, SetbookingDataLoading] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flightLoading, setFlightLoading] = useState(false);
  const [getBookingDataFilter, SetbookingDataFilter] = useState([]);
  const [getModalData, setModalData] = useState();
  const [getCondi, setCondi] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [filteredBookingData, setFilteredBookingData] = useState([]);
  const [flightdata, setFlightData] = useState([]);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedPNR, setSelectedPNR] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const location = useLocation();
  const captureRef = useRef(null);
  const navigate = useNavigate();

  const item = location.state?.item;
  const referenceId = location.state?.referanceId;

  const totalPages = Math.ceil(getBookingDataFilter.length / ITEMS_PER_PAGE);

  const {
    ticketBookingDataApi,
    GetBookSeatDetailsApi,
    booking_data,
    booking_data_loading,
    selectedTabMainHome,
    ticketCancelDetailsapi,
    cancellation_details,
    cancellation_details_loading,
    confirmCancellation,
    confirm_cancellation_loading,
    TicketStatusApi,
    ticket_status,
  } = useBusContext();
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredBookingData.slice(startIndex, endIndex);

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5; // Number of pages to show before using "..."
    let pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      pages = [...Array(totalPages)].map((_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        // Show first few pages and "..."
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Show "..." and last few pages
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Show "..." before and after current page
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="dots">
          ...
        </span>
      ) : (
        <button
          key={index}
          className={currentPage === page ? "active" : ""}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      )
    );
  };


  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload(false);
  }


  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openModal2 = async () => {
    setIsOpen2(true);
  };
  const closeModal2 = () => setIsOpen2(false);

  const handlePrint = () => {
    const input = captureRef.current;
    if (!input) return;

    const options = {
      margin: 5,
      filename: "modal-content.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(input)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const blobUrl = URL.createObjectURL(pdf.output("blob"));
        window.open(blobUrl, "_blank");
      });
  };


  const [modalWidth, setModalWidth] = useState(
    window.innerWidth <= 600 ? "90vw" : "80vw"
  );

  useEffect(() => {
    const handleResize = () => {
      setModalWidth(window.innerWidth <= 600 ? "90vw" : "80vw");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    ticketBookingDataApi();
    var getcondition = localStorage.getItem("getConditionnn");
    setCondi(getcondition);
    GetBooking();
    // GetFlightBooking();
    GetAllFlightBookings();
    window.scroll(0, 0);
  }, []);

  const GetBooking = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));

    setLoading(true);
    axios
      .get(get_booking, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.success == 1) {
          SetbookingData(res.data.data);
          SetbookingDataFilter(res.data.data);
          setLoading(false);
        } else if (res.data.status === "Token is Expired") {
          logout();
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("error11", err);
        setLoading(false);
      });
  };

  const GetFlightBooking = async () => {
    setFlightLoading(true);
    const token = JSON.parse(localStorage.getItem("is_token"));

    axios
      .get(get_flight_Booking, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("res", res.data.data);

        if (res.data.success == 1) {
          setFlightData(res.data.data);
          SetbookingDataFilter(res.data.data);
          setFlightLoading(false);
        } else if (res.data.status === "Token is Expired") {
          logout();
          setFlightLoading(false);
        } else {
          setFlightLoading(false);
        }
      })
      .catch((err) => {
        console.log("error11 in get flightbooking", err);
        setFlightLoading(false);
      });
  };


  const GetAllFlightBookings = async () => {
    setFlightLoading(true);
    const token = JSON.parse(localStorage.getItem("is_token"));

    try {
      const res = await axios.get(get_all_flights_booking, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      });

      if (res.data.success === 1) {
        const raw = res.data.data; // array of bookings

        // ---- NORMALISE -------------------------------------------------
        const normalised = raw.map((item) => {
          // 1. TravClan – already has the deep structure
          if (item.booking_type === "trav_clan_booking") {
            return {
              booking_code: item.booking_code,
              response_data: item.response_data,
            };
          }

          // 2. AirIQ – flat fields → build a *fake* response_data
          // Inside GetAllFlightBookings → AirIQ normalization
          if (item.booking_type === "air_iq_booking") {
            // ---------- 1. Build a *complete* fake results object ----------
            const fakeResults = {
              // ALWAYS an array – even if empty
              itineraryItems: [
                {
                  itemCode: `airiq-${item.id}`,
                  itemFlight: {
                    airlineName: item.airline_name || "Unknown Airline",
                    flightNumber: (item.airline_code || "").split(" ").pop() || "",
                    departureAt: `${item.departure_date}T${item.departure_time}.000Z`,
                    arrivalAt: `${item.arrival_date}T${item.arrival_time}.000Z`,
                    fareIdentifier: { name: "Economy" },
                    stopCount: { stops: item.stop || 0 },
                    isRefundable: !!item.is_refundable,
                    segments: [
                      [
                        {
                          or: {
                            aC: item.departure_city || "",
                            aN: "", // you can add airport name later
                            dT: `${item.departure_date}T${item.departure_time}`, // ← CRITICAL
                          },
                          ds: {
                            aC: item.arrival_city || "",
                            aN: "",
                            aT: `${item.arrival_date}T${item.arrival_time}`,     // ← CRITICAL
                          },
                          bg: item.total_baggage || "Reconfirm with Airline",
                          cBg: item.total_baggage || "Reconfirm with Airline",
                        },
                      ],
                    ],
                    // ---- fake fareQuote so GST/YR works (optional) ----
                    fareQuote: {
                      paxFareBreakUp: [
                        {
                          gst: Math.round((Number(item.taxes_and_others) || 0) * 0.05),
                          yrTax: 0,
                        },
                      ],
                    },
                    // ---- fake fare rule (optional) ----
                    fareRule: [
                      {
                        fareRuleDetail:
                          "<p>Cancellation / change policy as per airline. Contact support for details.</p>",
                      },
                    ],
                  },
                },
              ],

              // ---------- 2. Passengers ----------
              passengers: (item.child || []).map((c) => ({
                title: c.gender === 1 ? "Mr" : "Ms",
                firstName: c.first_name || "",
                lastName: c.last_name || "",
                gender: c.gender,
                email: c.email || "",
                contactNumber: c.phone_no || "",
                cellCountryCode: "91",
                nationality: "IN",
                passportNumber: c.passport_no || "",
                passportExpiry: c.passport_expiry_date || "",
                dateOfBirth: c.dob || "",
              })),

              // ---------- 3. Pricing ----------
              totalAmount: Number(item.total_amount || 0),
              baseFare: Number(item.base_fare || 0),
              taxAndSurcharge: Number(item.taxes_and_others || 0),
            };

            // ---------- 4. Return the normalised object ----------
            return {
              booking_code: item.booking_id || `AIRIQ-${item.id}`,
              response_data: {
                booking_details: {
                  flight_itinerary: {
                    responseData: { results: fakeResults }, // <-- THIS IS CRUCIAL
                  },
                  bookingStatus: "CONFIRMED",
                },
              },
              // keep original flat fields if you need them elsewhere
              ...item,
            };
          }

          // fallback – unknown provider
          return {
            booking_code: item.booking_code || item.booking_id || `UNKNOWN-${item.id}`,
          };
        });

        setFlightData(normalised);
        SetbookingDataFilter(normalised);
      } else if (res.data.status === "Token is Expired") {
        logout();
      }
    } catch (err) {
      console.error("get_all_flights_booking error", err);
    } finally {
      setFlightLoading(false);
    }
  };

  const filterBookings = (data, type) => {
    const now = new Date();

    const filtered = data.filter((item) => {
      const departureDateTime = new Date(
        `${item.departure_date}T${item.departure_time}`
      );
      if (type === "upcoming") {
        return departureDateTime >= now;
      } else if (type === "completed") {
        return departureDateTime < now;
      }
      return true;
    });

    setFilteredBookingData(filtered);
  };

  const filterBookingsBus = (data, type) => {
    const now = new Date();
    const filtered = data.filter((item) => {
      const departureDateTime = new Date(
        `${item.departure_date}T${item.departure_time}`
      );
      if (type === "upcoming") {
        return departureDateTime >= now && item.is_cancel != 1;
      } else if (type === "completed") {
        return departureDateTime < now && item.is_cancel != 1;
      } else if (type === "CANCELLED") {
        return item.is_cancel == 1;
      }
      return true;
    });
    setFilteredBookingData(filtered);
  };


  const handleTabChange = (type) => {
    setSelectedTab(type);

    if (selectedTabMainHome === "flights") {
      filterBookings(getBookingData, type);
    } else {
      filterBookingsBus(booking_data, type);
    }
  };

  const getTicketStatus = async (pnr) => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", TicketStatus);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("pnrNo", pnr);
    const datas = await TicketStatusApi(formdata);
    if (datas) {
      // console.log("get ticket status data", datas);
    }
  };

  useEffect(() => {
    filterBookings(getBookingData, selectedTab);
    filterBookingsBus(booking_data, selectedTab);
  }, [getBookingData]);



  const handleViewBookingBus = async (pnr) => {
    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", bookseatdetails);
    formdata.append("verifyCall", verifyCall);
    formdata.append("pnrNo", pnr ? pnr : "");

    const data = await GetBookSeatDetailsApi(formdata);

    if (data) {
      console.log("get book seat data", data);
      if (data.status == 1) {
        console.log("details ni api no log", data);

        // setPnrNumber("");
      }
    }
  };

  const handleCancelBookingDetails = async (pnr) => {
    setConfirmationModalOpen(true);

    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", canceldetails);
    formdata.append("verifyCall", verifyCall);
    formdata.append("pnrno", pnr);

    const data = await ticketCancelDetailsapi(formdata);
  };

  const handleConfirmCancel = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));

    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", confirmCancellationUrl);
    formdata.append("verifyCall", verifyCall);
    formdata.append("PNRNo", selectedPNR);

    const data = await confirmCancellation(formdata, token);
    if (data) {
      console.log("Confirm Cancellation Response", data);
      setConfirmationModalOpen(false);
      ticketBookingDataApi();
    }
  };

  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleOpenModal = (flight) => {
    setSelectedBooking(flight);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const formatFlightTime = (dateString) => {
    // remove ".000Z" if present
    const cleanDate = dateString.replace(".000Z", "");
    return moment(cleanDate).format("hh:mm A");
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard | Airline Booking</title>
      </Helmet>
      <PathHero name="Dashboard" getSelectedTabService={selectedTabMainHome} />

      {loading === true ? (
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
        <>
          {selectedTabMainHome === "flights" ? (
            <>
              <div className="flights-container">
                <header className="page-header">
                  <div className="header-content">
                    <h1 className="page-title">My Flight Bookings</h1>
                    <div className="flights-summary">
                      <span className="summary-text">
                        {flightdata.length} booking
                        {flightdata.length !== 1 ? "s" : ""} found
                      </span>
                    </div>
                  </div>
                </header>

                <div className="flights-list">
                  {flightdata.slice(0, visibleCount).map((flight) => {
                    const {
                      booking_code,
                      response_data: {
                        booking_details: {
                          flight_itinerary: {
                            responseData: { results },
                            error,
                          },
                        },
                      },
                    } = flight;

                    const { itineraryItems } = results;

                    const departureSegment =
                      itineraryItems[0].itemFlight.segments[0][0];
                    const flightInfo = itineraryItems[0].itemFlight;
                    const bookingStatus =
                      flight?.response_data?.booking_details?.bookingStatus ||
                      "";

                    const statusMap = {
                      CONFIRMED: {
                        article: "success",
                        pill: "status-success",
                        label: "Confirmed",
                      },
                      PENDING: {
                        article: "pending",
                        pill: "status-pending",
                        label: "Pending",
                      },
                      FAILED: {
                        article: "failed",
                        pill: "status-error",
                        label: "Failed",
                      },
                      HOLD: {
                        article: "hold",
                        pill: "status-hold",
                        label: "On Hold",
                      },
                      RELEASED: {
                        article: "released",
                        pill: "status-released",
                        label: "Released",
                      },
                    };

                    const { article, pill, label } = statusMap[
                      bookingStatus
                    ] || {
                      article: "unknown",
                      pill: "status-unknown",
                      label: "Unknown",
                    };

                    return (
                      <article
                        key={booking_code}
                        className={`flight-item ${article}`}
                      >
                        {/* Flight Header */}
                        <div className="flight-header">
                          <div className="flight-meta">
                            <div className="booking-ref">
                              <span className="ref-label">Ref</span>
                              <span className="ref-code">{booking_code}</span>
                            </div>
                            <div className={`status-pill ${pill}`}>{label}</div>
                          </div>

                          <div className="airline-info">
                            <h2 className="airline-name">
                              {flightInfo.airlineName}
                            </h2>
                            <span className="flight-code">
                              {flightInfo.flightNumber}
                            </span>
                          </div>
                        </div>

                        {/* Flight Route */}
                        <div className="flight-route">
                          <div className="route-segment">
                            <div className="location-block departure">
                              <div className="time">
                                {/* {new Date(
                                  flightInfo.departureAt
                                ).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })} */}

                                {formatFlightTime(flightInfo.departureAt)}
                              </div>
                              <div className="airport">
                                <span className="airport-code">
                                  {departureSegment.or.aC}
                                </span>
                                <span className="airport-name">
                                  {departureSegment.or.aN}
                                </span>
                              </div>
                            </div>

                            <div className="route-connector">
                              <div className="flight-info-line">
                                <div className="duration">
                                  {(() => {
                                    const departure = moment(
                                      departureSegment?.or?.dT
                                    );
                                    const arrival = moment(
                                      departureSegment?.ds?.aT
                                    );

                                    // total minutes
                                    const totalMinutes = arrival.diff(
                                      departure,
                                      "minutes"
                                    );

                                    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
                                  })()}
                                </div>
                                <div className="route-line">
                                  <div className="line-dot"></div>
                                  <div className="connecting-line"></div>
                                  <div className="airplane-indicator">
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="connecting-line"></div>
                                  <div className="line-dot"></div>
                                </div>
                                <div className="stops">
                                  {flightInfo.stopCount.stops === 0
                                    ? "Direct"
                                    : `${flightInfo.stopCount.stops} stop${flightInfo.stopCount.stops > 1
                                      ? "s"
                                      : ""
                                    }`}
                                </div>
                              </div>
                            </div>

                            <div className="location-block arrival">
                              <div className="time">
                                {/* {new Date(
                                  flightInfo.arrivalAt
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })} */}
                                {formatFlightTime(flightInfo.arrivalAt)}
                              </div>
                              <div className="airport">
                                <span className="airport-code">
                                  {departureSegment.ds.aC}
                                </span>
                                <span className="airport-name text-end">
                                  {departureSegment.ds.aN}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flight-date">
                            {(() => {
                              const date = new Date(flightInfo.departureAt);
                              return date.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                timeZone: "UTC", // ← CRITICAL: Treat as UTC
                              });
                            })()}
                          </div>
                        </div>

                        {/* Flight Details */}
                        <div className="flight-details">
                          <div className="detail-row">
                            <div className="detail-group">
                              <span className="detail-key">Class</span>
                              <span className="detail-value">
                                {flightInfo.fareIdentifier.name}
                              </span>
                            </div>
                            <div className="detail-group">
                              <span className="detail-key">Baggage</span>
                              <span className="detail-value">
                                {departureSegment.bg}
                              </span>
                            </div>
                            <div className="detail-group">
                              <span className="detail-key">Refund</span>
                              <span
                                className={`detail-value ${flightInfo.isRefundable
                                  ? "refundable"
                                  : "non-refundable"
                                  }`}
                              >
                                {flightInfo.isRefundable ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flight-actions">
                          <button
                            className="details-button"
                            onClick={() => handleOpenModal(flight)}
                          >
                            View Details
                          </button>
                        </div>
                      </article>
                    );
                  })}

                  {visibleCount < flightdata.length && (
                    <div className="d-flex align-items-center">
                      <button
                        className="subsbtn"
                        onClick={() => setVisibleCount((prev) => prev + 10)}
                      >
                        Show More
                      </button>
                    </div>
                  )}

                  {flightdata.length === 0 && (
                    <div className="empty-flights">
                      <div className="empty-content">
                        <div className="empty-graphic">
                          <svg viewBox="0 0 24 24" width="48" height="48">
                            <path
                              fill="currentColor"
                              d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                            />
                          </svg>
                        </div>
                        <h3 className="empty-title">No flights booked yet</h3>
                        <p className="empty-description">
                          Your flight bookings will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ReactModal
                isOpen={!!selectedBooking}
                onRequestClose={handleCloseModal}
                contentLabel="Booking Details"
                className="booking-modal"
                overlayClassName="booking-modal-overlay"
              >
                {selectedBooking &&
                  (() => {
                    const {
                      booking_code,
                      response_data: {
                        booking_details: {
                          flight_itinerary: {
                            responseData: { results },
                            error,
                          },
                        },
                      },
                    } = selectedBooking;

                    // ---- SAFE DESTRUCTURING ----
                    const resultsSafe = results || {};
                    const {
                      itineraryItems = [],
                      passengers = [],
                      totalAmount = 0,
                      baseFare = 0,
                      taxAndSurcharge = 0,
                    } = resultsSafe;
                    const bookingStatus =
                      selectedBooking?.response_data?.booking_details
                        ?.bookingStatus || "";

                    // Map booking statuses to styles & labels
                    const chipStatusMap = {
                      CONFIRMED: {
                        className: "status-success",
                        label: "Confirmed",
                      },
                      PENDING: {
                        className: "status-pending",
                        label: "Pending",
                      },
                      FAILED: {
                        className: "status-error",
                        label: `Failed: ${error?.errorMessage}`,
                      },
                      HOLD: { className: "status-hold", label: "On Hold" },
                      RELEASED: {
                        className: "status-released",
                        label: "Released",
                      },
                    };

                    const { className, label } = chipStatusMap[
                      bookingStatus
                    ] || {
                      className: "status-unknown",
                      label: "Unknown",
                    };

                    return (
                      <div className="modal-container">
                        {/* Header Section */}
                        <div className="modal-header">
                          <div className="header-left">
                            <h1 className="modal-title">Booking Details</h1>
                            <div className="booking-reference">
                              <span className="reference-label">
                                Reference:
                              </span>
                              <span className="reference-code">
                                {booking_code}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={handleCloseModal}
                            className="close-button"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Status Section */}
                        <div className="status-section">
                          <div className={`status-chip ${className}`}>
                            <div className="status-dot"></div>
                            {label}
                          </div>
                        </div>

                        {/* Content Sections */}
                        <div className="content-wrapper">
                          {/* Flight Information */}
                          <section className="content-section">
                            <div className="section-title">
                              <h2>Flight Information</h2>
                            </div>

                            {(itineraryItems || []).map((item, index) => (
                              <div key={item.itemCode} className="flight-card">
                                <div className="flight-header flight_header_dash__modal">
                                  <div className="airline-info">
                                    <span className="airline-name">
                                      {item.itemFlight.airlineName}
                                    </span>
                                    <span className="flight-number">
                                      {item.itemFlight.flightNumber}
                                    </span>
                                  </div>
                                  <div className="flight-class">
                                    {item.itemFlight.fareIdentifier.name}
                                  </div>
                                </div>

                                <div className="route-container">
                                  <div className="route-point">
                                    <div className="airport-code">
                                      {item.itemFlight.segments[0][0].or.aN}
                                    </div>
                                    <div className="datetime">
                                      <div className="time">
                                        {(() => {
                                          const date = new Date(item.itemFlight.departureAt);
                                          return date.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                            timeZone: "UTC", // ← Show time as per UTC (same as API)
                                          });
                                        })()}
                                      </div>
                                      <div className="date">
                                        {new Date(
                                          item.itemFlight.departureAt
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="route-line">
                                    <div className="duration-badge">
                                      {(() => {
                                        const dep = moment(item.itemFlight.departureAt);
                                        const arr = moment(item.itemFlight.arrivalAt);
                                        const totalMinutes = arr.diff(dep, "minutes");
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        return `${hours}h ${minutes}m`;
                                      })()}
                                    </div>
                                    <div className="line-graphic">
                                      <div className="line"></div>
                                      <div className="plane-icon">
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="stops-info">
                                      {item.itemFlight.stopCount.stops === 0
                                        ? "Direct"
                                        : `${item.itemFlight.stopCount.stops
                                        } stop${item.itemFlight.stopCount.stops > 1
                                          ? "s"
                                          : ""
                                        }`}
                                    </div>
                                  </div>

                                  <div className="route-point">
                                    <div className="airport-code">
                                      {item.itemFlight.segments[0][0].ds.aN}
                                    </div>
                                    <div className="datetime">
                                      <div className="time">
                                        {(() => {
                                          const date = new Date(item.itemFlight.arrivalAt);  // ← arrivalAt
                                          return date.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                            timeZone: "UTC"
                                          });
                                        })()}
                                      </div>
                                      <div className="date">
                                        {new Date(
                                          item.itemFlight.arrivalAt
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flight-details-grid">
                                  <div className="detail-item">
                                    <span className="detail-label">Baggage</span>
                                    <span className="detail-value">
                                      {item.itemFlight.segments?.[0]?.[0]?.bg || "Reconfirm with Airline"}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Cabin Bag</span>
                                    <span className="detail-value">
                                      {item.itemFlight.segments?.[0]?.[0]?.cBg || "Reconfirm with Airline"}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Refundable</span>
                                    <span
                                      className={`detail-value ${item.itemFlight.isRefundable ? "refundable" : "non-refundable"
                                        }`}
                                    >
                                      {item.itemFlight.isRefundable ? "Yes" : "No"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </section>

                          {/* Pricing Breakdown */}
                          {/* Pricing Breakdown */}
                          <section className="content-section">
                            <div className="section-title">
                              <h2>Price Breakdown</h2>
                            </div>

                            <div className="pricing-card">
                              <div className="price-row">
                                <span className="price-label">Base Fare</span>
                                <span className="price-amount">
                                  ₹{baseFare?.toLocaleString() || "0"}
                                </span>
                              </div>
                              <div className="price-row">
                                <span className="price-label">Taxes & Fees</span>
                                <span className="price-amount">
                                  ₹{taxAndSurcharge?.toLocaleString() || "0"}
                                </span>
                              </div>

                              {/* ---- GST & YR Tax – only show if TravClan (paxFareBreakUp exists) ---- */}
                              {itineraryItems?.[0]?.itemFlight?.fareQuote?.paxFareBreakUp?.[0] && (
                                <div className="tax-breakdown">
                                  <div className="tax-item">
                                    <span>
                                      GST: ₹
                                      {itineraryItems[0].itemFlight.fareQuote.paxFareBreakUp[0].gst.toLocaleString()}
                                    </span>
                                    <span>
                                      YR Tax: ₹
                                      {itineraryItems[0].itemFlight.fareQuote.paxFareBreakUp[0].yrTax.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="price-total">
                                <span className="total-label">Total Amount</span>
                                <span className="total-amount">
                                  ₹{totalAmount?.toLocaleString() || "0"}
                                </span>
                              </div>
                            </div>
                          </section>

                          {/* Passenger Information */}
                          <section className="content-section">
                            <div className="section-title">
                              <h2>Passenger Information</h2>
                            </div>

                            <div className="passengers-grid">
                              {passengers.map((passenger, index) => (
                                <div
                                  key={passenger.id}
                                  className="passenger-card"
                                >
                                  <div className="passenger-header">
                                    <div className="passenger-number">
                                      #{index + 1}
                                    </div>
                                    <div className="passenger-name">
                                      {passenger.title} {passenger.firstName}{" "}
                                      {passenger.lastName}
                                    </div>
                                  </div>

                                  <div className="passenger-info">
                                    <div className="info-row">
                                      <span className="info-label">Gender</span>
                                      <span className="info-value">
                                        {passenger.gender === 1
                                          ? "Male"
                                          : "Female"}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">
                                        Date of Birth
                                      </span>
                                      <span className="info-value">
                                        {new Date(
                                          passenger.dateOfBirth
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">
                                        Nationality
                                      </span>
                                      <span className="info-value">
                                        {passenger.nationality}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">
                                        Passport
                                      </span>
                                      <span className="info-value">
                                        {passenger.passportNumber}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">
                                        Passport Expiry
                                      </span>
                                      <span className="info-value">
                                        {new Date(
                                          passenger.passportExpiry
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">
                                        Contact
                                      </span>
                                      <span className="info-value">
                                        +{passenger.cellCountryCode}{" "}
                                        {passenger.contactNumber}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">Email</span>
                                      <span className="info-value email">
                                        {passenger.email}
                                      </span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">
                                        Address
                                      </span>
                                      <span className="info-value">
                                        {passenger.addressLineOne},{" "}
                                        {passenger.addressLineTwo}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>

                          {/* Terms & Conditions */}
                          <section className="content-section">
                            <div className="section-title">
                              <h2>Terms & Conditions</h2>
                            </div>

                            <div className="terms-container">
                              {itineraryItems[0].itemFlight.fareRule.map(
                                (rule, index) => (
                                  <div
                                    key={index}
                                    className="terms-content"
                                    dangerouslySetInnerHTML={{
                                      __html: rule.fareRuleDetail,
                                    }}
                                  />
                                )
                              )}
                            </div>
                          </section>
                        </div>
                      </div>
                    );
                  })()}
              </ReactModal>
            </>
          ) : (
            <section className="container p-0 bookingsec shadow">
              <div className="tabSec">
                <div
                  className={`tabDiv ${selectedTab === "upcoming" ? "activeTab" : ""
                    }`}
                  onClick={() => handleTabChange("upcoming")}
                >
                  <div>
                    <BsFillLuggageFill color="#ff4500" size={25} />
                  </div>
                  <div className="tabFont">UPCOMING</div>
                </div>

                <div
                  className={`tabDiv ${selectedTab === "CANCELLED" ? "activeTab" : ""
                    }`}
                  onClick={() => handleTabChange("CANCELLED")}
                >
                  <div>
                    <MdCancelPresentation color="#ff4500" size={25} />
                  </div>
                  <div className="tabFont">CANCELLED</div>
                </div>

                <div
                  className={`tabDiv ${selectedTab === "completed" ? "activeTab" : ""
                    }`}
                  onClick={() => handleTabChange("completed")}
                >
                  <div>
                    <BsBookmarkCheckFill color="#ff4500" size={25} />
                  </div>
                  <div className="tabFont">COMPLETED</div>
                </div>
              </div>

              <div className="table-div">
                <>
                  {selectedTabMainHome === "flights" ? (
                    <>{flightdata.length > 0 ? <></> : null}</>
                  ) : (
                    <>
                      <div className="container p-3 resp_view_main_sec">
                        <div className="row justify-content-start align-items-center">
                          {selectedTab === "upcoming" && (
                            <>
                              {currentData.length <= 0 ? (
                                <>
                                  <div className="row my-3 align-items-center justify-content-center">
                                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                                      <img
                                        src={images.completeempty}
                                        className="tabcancelledempty"
                                      />
                                    </div>
                                    <div className="col-12 text-center text-lg-start col-lg-6 mt-4 mt-lg-0">
                                      <div className="emptytxtboldbig">
                                        Looks empty, you've no Upcoming
                                        bookings.
                                      </div>
                                      <div className="emptytxtregular">
                                        There is no Upcoming Ticket{" "}
                                      </div>
                                      <Link className="plan-trip-btn" to={"/"}>
                                        Plan a Trip
                                      </Link>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {currentData.map((item, index) => {
                                    return (
                                      <div className="completedmaintab">
                                        <div className="completeheader">
                                          <div className="row align-items-center justify-content-around gap-2 resp_dashboard">
                                            <div className="col-lg-8 align-items-center d-flex resp_dashboard_inner">
                                              <div className="row resp_dashboard_inner_first_part">
                                                <div className="col-12 d-flex align-items-center gap-2 resp_justify_center">
                                                  <div className="completeFrom">
                                                    {item.departure_city
                                                      ? item.departure_city
                                                      : "N/A"}
                                                  </div>
                                                  <div className="">
                                                    <FaLongArrowAltRight />
                                                  </div>
                                                  <div className="completeFrom">
                                                    {item.arrival_city
                                                      ? item.arrival_city
                                                      : "N/A"}
                                                  </div>
                                                </div>
                                                <div className="col-12 d-flex flex-column flex-lg-row align-items-center gap-lg-3 gap-1 mt-2 resp_dashboard_inner_first resp_justify_center">
                                                  <div className="text-warning text-warning2">
                                                    Upcoming
                                                  </div>
                                                </div>
                                                <div className="circlegol">
                                                  <LuBus size={25} />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-3 d-flex align-items-center justify-content-center">
                                              <Link
                                                to={"/ViewBooking"}
                                                onClick={() => {
                                                  handleViewBookingBus(
                                                    item?.PNRNO
                                                  );
                                                }}
                                                state={{ item }}
                                                className="completeViewBokingbtn"
                                              >
                                                View Booking
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="completesection">
                                          <div className="row w-100 align-items-center justify-content-between resp_ticket_detail_dash">
                                            <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                              <div className="text-secondary">
                                                From
                                              </div>
                                              <div className="completedDate">
                                                {moment(
                                                  item.departure_date
                                                ).format("DD MMM'YY")}{" "}
                                                <span className="text-secondary fw-light completedTime">
                                                  {item.departure_time}
                                                </span>
                                              </div>
                                              <div className="d-flex gap-3">
                                                <div className="fw-bold">
                                                  {item.departure_city
                                                    ? item.departure_city
                                                    : "N/A"}
                                                </div>
                                                <div className="text-muted">
                                                  {item.terminal}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                              <div className="text-secondary from_min_width">
                                                To
                                              </div>
                                              <div className="completedDate">
                                                {moment(
                                                  item.arrival_date
                                                ).format("DD MMM'YY")}{" "}
                                                <span className="text-secondary fw-light completedTime">
                                                  {item.arrival_time}
                                                </span>
                                              </div>
                                              <div className="d-flex gap-3">
                                                <div className="fw-bold">
                                                  {item.arrival_city
                                                    ? item.arrival_city
                                                    : "N/A"}
                                                </div>
                                                <div className="text-muted">
                                                  {item.terminal}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-3 d-flex flex-column align-items-start resp_dashboard_ticket_short_detail_icon_flex">
                                              <div className="d-flex flex-row gap-3 mb-2">
                                                <LuBus size={19} />
                                                <div>Eagle Travels</div>
                                              </div>
                                              {item?.child?.length > 0 && (
                                                <div className="d-flex flex-row gap-3 align-items-center">
                                                  <FaUser size={19} />
                                                  <div>
                                                    {item.child[0].paxName}{" "}
                                                    {item.child[0].last_name}{" "}
                                                    {item.child.length > 1 && (
                                                      <span>
                                                        +{item.child.length - 1}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <div className="col-lg-3 d-flex flex-column text-center">
                                              <div
                                                className="completeCancelBokingbtn"
                                                onClick={() => {
                                                  handleCancelBookingDetails(
                                                    item.PNRNO
                                                  ); // ✅ Open modal
                                                  setSelectedPNR(item.PNRNO); // ✅ Set selected PNR
                                                }}
                                              >
                                                Cancel Booking
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          )}

                          {selectedTab === "CANCELLED" && (
                            <>
                              {currentData.length <= 0 ? (
                                <div className="row my-3 align-items-center justify-content-center">
                                  <div className="col-lg-4 d-flex align-items-center justify-content-center">
                                    <img
                                      src={images.cancelledempty}
                                      className="tabcancelledempty"
                                    />
                                  </div>
                                  <div className="col-12 text-center text-lg-start col-lg-6 mt-4 mt-lg-0">
                                    <div className="emptytxtboldbig">
                                      Looks empty, you've no cancelled bookings.
                                    </div>
                                    <div className="emptytxtregular">
                                      There is no Cancelled Ticket{" "}
                                    </div>
                                    <Link className="plan-trip-btn" to={"/"}>
                                      Plan a Trip
                                    </Link>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {currentData.map((item, index) => {
                                    return (
                                      <div className="completedmaintab">
                                        <div className="completeheader">
                                          <div className="row align-items-center justify-content-around gap-2 resp_dashboard">
                                            <div className="col-lg-8 align-items-center d-flex resp_dashboard_inner">
                                              <div className="row resp_dashboard_inner_first_part">
                                                <div className="col-12 d-flex align-items-center gap-2 resp_justify_center">
                                                  <div className="completeFrom">
                                                    {item.departure_city
                                                      ? item.departure_city
                                                      : "N/A"}
                                                  </div>
                                                  <div className="">
                                                    <FaLongArrowAltRight />
                                                  </div>
                                                  <div className="completeFrom">
                                                    {item.arrival_city
                                                      ? item.arrival_city
                                                      : "N/A"}
                                                  </div>
                                                </div>
                                                <div className="col-12 d-flex flex-column flex-lg-row align-items-center gap-lg-3 gap-1 mt-2 resp_dashboard_inner_first resp_justify_center">
                                                  <div className="text-warning text-warning2">
                                                    Cancelled
                                                  </div>
                                                </div>
                                                <div className="circlegol">
                                                  <LuBus size={25} />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-3 d-flex align-items-center justify-content-center">
                                              {ticket_status.length !== 0 &&
                                                selectedIndex === index && (
                                                  <div
                                                    className="fw-bold text-warning rounded-pill p-2 w-75 text-center"
                                                    style={{
                                                      backgroundColor:
                                                        "#ffffc5",
                                                    }}
                                                  >
                                                    {ticket_status[0]?.Status}
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="completesection">
                                          <div className="row w-100 align-items-center justify-content-between resp_ticket_detail_dash">
                                            <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                              <div className="text-secondary">
                                                From
                                              </div>
                                              <div className="completedDate">
                                                {moment(
                                                  item.departure_date
                                                ).format("DD MMM'YY")}{" "}
                                                <span className="text-secondary fw-light completedTime">
                                                  {item.departure_time}
                                                </span>
                                              </div>
                                              <div className="d-flex gap-3">
                                                <div className="fw-bold">
                                                  {item.departure_city
                                                    ? item.departure_city
                                                    : "N/A"}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                              <div className="text-secondary from_min_width">
                                                To
                                              </div>
                                              <div className="completedDate">
                                                {moment(
                                                  item.arrival_date
                                                ).format("DD MMM'YY")}{" "}
                                                <span className="text-secondary fw-light completedTime">
                                                  {item.arrival_time}
                                                </span>
                                              </div>
                                              <div className="d-flex gap-3">
                                                <div className="fw-bold">
                                                  {item.arrival_city
                                                    ? item.arrival_city
                                                    : "N/A"}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-3 d-flex flex-column align-items-start resp_dashboard_ticket_short_detail_icon_flex">
                                              <div className="d-flex flex-row gap-3 mb-2">
                                                <LuBus size={19} />
                                                <div>Eagle Travels</div>
                                              </div>
                                              {item?.child?.length > 0 && (
                                                <div className="d-flex flex-row gap-3 align-items-center">
                                                  <FaUser size={19} />
                                                  <div>
                                                    {item.child[0].paxName}{" "}
                                                    {item.child[0].last_name}{" "}
                                                    {item.child.length > 1 && (
                                                      <span>
                                                        +{item.child.length - 1}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>

                                            <div className="col-lg-3 d-flex flex-column text-center">
                                              <div
                                                className="completeCancelBokingbtn"
                                                onClick={() => {
                                                  getTicketStatus(item.PNRNO); // ✅ Open modal
                                                  setSelectedPNR(item.PNRNO); // ✅ Set selected PNR
                                                  setSelectedIndex(index);
                                                }}
                                              >
                                                Check Status
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          )}

                          {selectedTab === "completed" && (
                            <>
                              {currentData.length <= 0 ? (
                                <>
                                  <div className="row my-3 align-items-center justify-content-center">
                                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                                      <img
                                        src={images.completeempty}
                                        className="tabcancelledempty"
                                      />
                                    </div>
                                    <div className="col-12 text-center text-lg-start col-lg-6 mt-4 mt-lg-0">
                                      <div className="emptytxtboldbig">
                                        Looks empty, you've no Completed
                                        bookings.
                                      </div>
                                      <div className="emptytxtregular">
                                        There is no Completed Ticket{" "}
                                      </div>
                                      <Link className="plan-trip-btn" to={"/"}>
                                        Plan a Trip
                                      </Link>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {currentData.map((item, index) => {
                                    return (
                                      <>
                                        <div className="completedmaintab">
                                          <div className="completeheader">
                                            <div className="row align-items-center justify-content-around gap-2 resp_dashboard">
                                              <div className="col-lg-8 align-items-center d-flex resp_dashboard_inner">
                                                <div className="row resp_dashboard_inner_first_part">
                                                  <div className="col-12 d-flex align-items-center gap-2 resp_justify_center">
                                                    <div className="completeFrom">
                                                      {item.departure_city
                                                        ? item.departure_city
                                                        : "N/A"}
                                                    </div>
                                                    <div className="">
                                                      <FaLongArrowAltRight />
                                                    </div>
                                                    <div className="completeFrom">
                                                      {item.arrival_city
                                                        ? item.arrival_city
                                                        : "N/A"}
                                                    </div>
                                                  </div>
                                                  <div className="col-12 d-flex flex-column flex-lg-row align-items-center gap-lg-3 gap-1 mt-2 resp_dashboard_inner_first resp_justify_center">
                                                    <div className="text-warning text-warning2">
                                                      Completed
                                                    </div>
                                                  </div>
                                                  <div className="circlegol">
                                                    <LuBus size={25} />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-3 d-flex align-items-center justify-content-center">
                                                <Link
                                                  to={"/ViewBooking"}
                                                  onClick={() => {
                                                    handleViewBookingBus(
                                                      item?.PNRNO
                                                    );
                                                  }}
                                                  state={{ item }}
                                                  className="completeViewBokingbtn"
                                                >
                                                  View Booking
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="completesection">
                                            <div className="row w-100 align-items-center justify-content-between resp_ticket_detail_dash">
                                              <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                                <div className="text-secondary">
                                                  From
                                                </div>
                                                <div className="completedDate">
                                                  {moment(
                                                    item.departure_date
                                                  ).format("DD MMM'YY")}{" "}
                                                  <span className="text-secondary fw-light completedTime">
                                                    {item.departure_time}
                                                  </span>
                                                </div>
                                                <div className="d-flex gap-3">
                                                  <div className="fw-bold">
                                                    {item.departure_city
                                                      ? item.departure_city
                                                      : "N/A"}
                                                  </div>
                                                  <div className="text-muted">
                                                    {item.terminal}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                                <div className="text-secondary from_min_width">
                                                  To
                                                </div>
                                                <div className="completedDate">
                                                  {moment(
                                                    item.arrival_date
                                                  ).format("DD MMM'YY")}{" "}
                                                  <span className="text-secondary fw-light completedTime">
                                                    {item.arrival_time}
                                                  </span>
                                                </div>
                                                <div className="d-flex gap-3">
                                                  <div className="fw-bold">
                                                    {item.arrival_city
                                                      ? item.arrival_city
                                                      : "N/A"}
                                                  </div>
                                                  <div className="text-muted">
                                                    {item.terminal}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-3 d-flex flex-column align-items-start resp_dashboard_ticket_short_detail_icon_flex">
                                                <div className="d-flex flex-row gap-3 mb-2">
                                                  <LuBus size={19} />
                                                  <div>Eagle Travels</div>
                                                </div>
                                                {item?.child?.length > 0 && (
                                                  <div className="d-flex flex-row gap-3 align-items-center">
                                                    <FaUser size={19} />
                                                    <div>
                                                      {item.child[0].paxName}{" "}
                                                      {item.child[0].last_name}{" "}
                                                      {item.child.length >
                                                        1 && (
                                                          <span>
                                                            +
                                                            {item.child.length -
                                                              1}
                                                          </span>
                                                        )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="col-lg-3 d-flex flex-column text-center"></div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>

                {selectedTab === "UPCOMING" && currentData.length > 0 && (
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Prev
                    </button>
                    {renderPaginationButtons()}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: modalWidth,
            height: "620px",
            padding: "0",
            border: "none",
            borderRadius: "10px",
            position: "relative",
            overflowY: "auto",
          },
          overlay: {
            zIndex: 10000,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <div className="maindivbookinginfo">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <IoCloseCircle color="#ddb46b" size={30} />
          </button>

          <div className="p-3 resp_modal_main">
            <h4 className="fw-semibold" style={{ marginBottom: "1rem" }}>
              Traveler Details
            </h4>
            <div
              className="table-responsive"
              style={{ border: "1px solid #ddb46b" }}
            >
              <table
                className="table table-bordered custom-table"
                style={{ marginBottom: "0px" }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    {getCondi == 0 ? <></> : <th>Number</th>}
                  </tr>
                </thead>
                <tbody>
                  {getModalData?.child?.map((itm, indx) => {
                    return (
                      <tr key={indx}>
                        <td>{indx + 1}</td>
                        <td>{itm?.first_name}</td>
                        <td>{itm?.last_name}</td>
                        {getCondi == 0 ? (
                          <></>
                        ) : (
                          <td>{itm?.phone_no ? itm?.phone_no : "N/A"}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* <div className="row align-items-center">
              {getModalData?.child?.map((itm, indx) => {
                return (
                  <div
                    key={indx}
                    className="col-12 col-md-6 col-lg-4 m-md-3 mb-3 p-3 rounded shadow gradient-card"
                    style={{ border: "1px solid #dbb46b" }}
                  >
                    <div className="row mb-4">
                      <BsPinAngleFill size={20} color="#dbb46b" />
                    </div>
                    <div className="row flex-row align-items-center">
                      <div className="col-6 fw-bold">First Name : </div>
                      <div className="col-6 text-center">{itm?.first_name}</div>
                    </div>
                    <div className="row flex-row align-items-center mt-2">
                      <div className="col-6 fw-bold">Last Name : </div>
                      <div className="col-6 text-center"> {itm?.last_name}</div>
                    </div>
                    <div className="row flex-row align-items-center mt-2">
                      <div className="col-6 fw-bold">Number : </div>
                      <div className="col-6 text-center">
                        {" "}
                        {itm?.phone_no ? itm.phone_no : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>

          <div className="row my-3 gap-1 justify-content-center">
            <div
              className="col-12"
              style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
            >
              <div
                className="text-center text-white p-2 fw-bold"
                style={{
                  backgroundColor: "#ddb46b",
                  border: "2px solid #ddb46b",
                }}
              >
                Onward Details
              </div>

              <div className="row  align-items-center">
                <div className="col-12 col-md-6 ">
                  <div
                    className=""
                  // style={{ borderRight: "2px solid #ddb46b", height: "100%" }}
                  >
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Departure Date
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.departure_date}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Arrival Date
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.arrival_date}
                      </div>
                    </div>
                    <div className="row p-2 gap-2 align-items-center justify-content-around">
                      <div className="col-5 text-center fw-bold">Flight</div>
                      <div className="col-6 text-center">
                        {getModalData?.departure_city} →{" "}
                        {getModalData?.arrival_city}
                      </div>
                    </div>

                    {/* <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Departure City
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.departure_city}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Arrival City
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.arrival_city}
                      </div>
                    </div> */}

                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Departure Time
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.departure_time}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Arrival Time
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.arrival_time}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">Stop</div>
                      <div className="col-6 text-center">
                        {getModalData?.stop}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Airline Name
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.airline_name}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Airline Code
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.airline_code}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 rounded">
                  <img
                    src={images.svgaero}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                    }}
                    className="rounded-bottom"
                  />
                </div>
              </div>
              {/* <div className="" style={{ border: "2px solid #ddb46b" }}>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">
                    Departure Date
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.departure_date}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Arrival Date</div>
                  <div className="col-6 text-center">
                    {getModalData?.arrival_date}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">
                    Departure City
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.departure_city}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Arrival City</div>
                  <div className="col-6 text-center">
                    {getModalData?.arrival_city}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">
                    Departure Time
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.departure_time}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Arrival Time</div>
                  <div className="col-6 text-center">
                    {getModalData?.arrival_time}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Stop</div>
                  <div className="col-6 text-center">{getModalData?.stop}</div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Airline Name</div>
                  <div className="col-6 text-center">
                    {getModalData?.airline_name}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Airline Code</div>
                  <div className="col-6 text-center">
                    {getModalData?.airline_name}
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Retun details */}
          {getModalData?.is_return == 1 && (
            <div className="col-12">
              <div className="accordion w-100 p-0" id="returnDetailsAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingReturn">
                    <button
                      className="accordion-button collapsed fw-bold"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseReturn"
                      aria-expanded="false"
                      aria-controls="collapseReturn"
                      style={{
                        backgroundColor: "#ddb46b",
                        border: "2px solid #dbb46b",
                        color: "white",
                      }}
                    >
                      Return Details
                    </button>
                  </h2>
                  <div
                    id="collapseReturn"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingReturn"
                    data-bs-parent="#returnDetailsAccordion"
                  >
                    <div
                      className="accordion-body p-2"
                      style={{ border: "2px solid #ddb46b" }}
                    >
                      {getModalData?.return_departure_date ===
                        getModalData?.return_arrival_date ? (
                        <div className="row gap-2 p-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">Date </div>
                          <div className="col-6 text-center">
                            {getModalData?.return_departure_date}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="row gap-2 p-2 align-items-center justify-content-around">
                            <div className="col-5 text-center fw-bold">
                              Departure Date
                            </div>
                            <div className="col-6 text-center">
                              {getModalData?.return_departure_date}
                            </div>
                          </div>
                          <div className="row gap-2 p-2 align-items-center justify-content-around">
                            <div className="col-5 text-center fw-bold">
                              Arrival Date
                            </div>
                            <div className="col-6 text-center">
                              {getModalData?.return_arrival_date}
                            </div>
                          </div>
                        </>
                      )}
                      <div className="row p-2 gap-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">Flight</div>
                        <div className="col-6 text-center">
                          {getModalData?.return_departure_city} →{" "}
                          {getModalData?.return_arrival_city}
                        </div>
                      </div>
                      {/* <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">
                          Departure City
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.return_departure_city}
                        </div>
                      </div>
                      <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">
                          Arrival City
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.return_arrival_city}
                        </div>
                      </div> */}
                      <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">
                          Departure Time
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.return_departure_time}
                        </div>
                      </div>
                      <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">
                          Arrival Time
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.return_arrival_time}
                        </div>
                      </div>
                      <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">Stop</div>
                        <div className="col-6 text-center">
                          {getModalData?.return_stop}
                        </div>
                      </div>
                      <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">
                          Airline Name
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.return_airline_name}
                        </div>
                      </div>
                      <div className="row gap-2 p-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">
                          Airline Code
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.return_airline_code === "undefined"
                            ? "N/A"
                            : getModalData?.return_airline_code}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className="row gap-1 justify-content-center"
            style={{ marginBottom: "1rem" }}
          >
            {getModalData?.stop != 0 && (
              <div
                className="col-12 col-lg-5"
                style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
              >
                <div
                  className="text-center text-white p-2 fw-bold"
                  style={{ backgroundColor: "#ddb46b" }}
                >
                  Flight Stop Details
                </div>
                <div className="" style={{ border: "2px solid #dbb46b" }}>
                  {getModalData?.stop_details.length <= 0 ? (
                    <>
                      <p
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          marginTop: "0.7rem",
                        }}
                      >
                        Non Stop
                      </p>
                    </>
                  ) : (
                    <>
                      {getModalData?.stop_details?.map((it, ind) => {
                        return (
                          <>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-5 text-center fw-bold">
                                City Name
                              </div>
                              <div className="col-6 text-center">
                                {it?.stop_city}
                              </div>
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around "
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-5 text-center fw-bold">
                                Duration
                              </div>
                              <div className="col-6 text-center">
                                {it?.stop_layover_duration}
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}
            {getModalData?.is_return == 1 &&
              getModalData?.return_stop !== 0 && (
                <div className="col-12 col-lg-5">
                  <div
                    className="text-center text-white p-2 fw-bold"
                    style={{ backgroundColor: "#ddb46b" }}
                  >
                    Return Flight Stop Details
                  </div>

                  <div className="" style={{ border: "2px solid #ddb46b" }}>
                    {getModalData?.return_stop_data?.length > 0 ? (
                      getModalData.return_stop_data.map((item, index) => (
                        <div key={index}>
                          <div
                            className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                            style={{ marginLeft: "0px", marginRight: "0px" }}
                          >
                            <div className="col-5 text-center fw-bold">
                              City Name
                            </div>
                            <div className="col-6 text-center">
                              {item.city_name}
                            </div>
                          </div>

                          <div
                            className="row p-2 gap-2 align-items-center justify-content-around"
                            style={{ marginLeft: "0px", marginRight: "0px" }}
                          >
                            <div className="col-5 text-center fw-bold">
                              Duration
                            </div>
                            <div className="col-6 text-center">
                              {item.duration}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          marginTop: "0.7rem",
                        }}
                      >
                        Non Stop
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>

          {getCondi == 0 ? (
            <></>
          ) : (
            <>
              <div className="row gap-1 justify-content-center">
                <div
                  className="col-12"
                  style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
                >
                  {getModalData?.check_in_adult == null ? (
                    <></>
                  ) : (
                    <>
                      <div
                        className="text-center text-white p-2 fw-bold"
                        style={{ backgroundColor: "#dbb46b" }}
                      >
                        Baggage Details
                      </div>
                      <div className="row p-3 align-items-center">
                        <div className="col-12 col-md-6">
                          <img
                            src={images.svgbag}
                            style={{
                              width: "100%",
                              objectFit: "contain",
                            }}
                            className="rounded-bottom"
                            alt="bag image"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="">
                            <div className="booking_details_baggage_head ticket_booking_details_table_border text-center p-2">
                              Check-in
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center">
                                <div className="fw-bold">Adult</div>
                                <div className="booking_details_age_desc">
                                  (Age 12+ yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.check_in_adult} KG
                              </div>
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center">
                                <div className="fw-bold">Children</div>
                                <div className="booking_details_age_desc">
                                  (Age 2-12 yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.check_in_children} KG
                              </div>
                            </div>
                            <div className="row p-2 gap-2 align-items-center justify-content-around ">
                              <div className="col-4 text-center">
                                <div className="fw-bold">Infant</div>
                                <div className="booking_details_age_desc">
                                  (Age 2 yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.check_in_infant} KG
                              </div>
                            </div>
                          </div>
                          {getModalData?.cabin_adult == null ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="mt-3"
                              // style={{ border: "2px solid #ddb46b" }}
                              >
                                <div className="booking_details_baggage_head text-center ticket_booking_details_table_border p-2">
                                  Cabin
                                </div>
                                <div
                                  className="row p-2 gap-2 align-items-center justify-content-around "
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                  }}
                                >
                                  <div className="col-4 text-center">
                                    <div className="fw-bold">Adult</div>
                                    <div className="booking_details_age_desc">
                                      (Age 12+ yrs)
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    {getModalData?.cabin_adult} KG
                                  </div>
                                </div>
                                <div
                                  className="row p-2 gap-2 align-items-center justify-content-around "
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                  }}
                                >
                                  <div className="col-4 text-center">
                                    <div className="fw-bold">Children</div>
                                    <div className="booking_details_age_desc">
                                      (Age 2-12 yrs)
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    {getModalData?.cabin_children} KG
                                  </div>
                                </div>
                                <div
                                  className="row p-2 gap-2 align-items-center justify-content-around "
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                  }}
                                >
                                  <div className="col-4 text-center ">
                                    <div className="fw-bold">Infant</div>
                                    <div className="booking_details_age_desc">
                                      (Age 2 yrs)
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    {getModalData?.cabin_infant} KG
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* {getModalData?.cabin_adult == null ? (
                        <></>
                      ) : (
                        <>
                          <div
                            className="mt-3"
                            style={{ border: "2px solid #ddb46b" }}
                          >
                            <div className="booking_details_baggage_head ticket_booking_details_table_border p-2">
                              Cabin
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center">
                                <div className="fw-bold">Adult</div>
                                <div className="booking_details_age_desc">
                                  (Age 12+ yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.cabin_adult} KG
                              </div>
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center">
                                <div className="fw-bold">Children</div>
                                <div className="booking_details_age_desc">
                                  (Age 2-12 yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.cabin_children} KG
                              </div>
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around "
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center ">
                                <div className="fw-bold">Infant</div>
                                <div className="booking_details_age_desc">
                                  (Age 2 yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.cabin_infant} KG
                              </div>
                            </div>
                          </div>
                        </>
                      )} */}
                    </>
                  )}
                </div>
                {getModalData?.is_return == 1 && (
                  <div className="col-12">
                    {/* Accordion Header */}
                    <div className="accordion" id="returnAccordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingReturn">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseReturn"
                            aria-expanded="true"
                            aria-controls="collapseReturn"
                            style={{
                              backgroundColor: "#ddb46b",
                              color: "white",
                              fontWeight: "bold",
                              height: "50px",
                            }}
                          >
                            Return Baggage Details
                          </button>
                        </h2>

                        {/* Accordion Body */}
                        <div
                          id="collapseReturn"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingReturn"
                          data-bs-parent="#returnAccordion"
                        >
                          <div className="accordion-body">
                            <div className="row align-items-center">
                              <div className="col-12 col-lg-4">
                                <div>
                                  <div className="booking_details_baggage_head text-center ticket_booking_details_table_border p-2">
                                    Check-in
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Adult</div>
                                      <div className="booking_details_age_desc">
                                        (Age 12+ yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.check_in_adult} KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Children</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2-12 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.check_in_children} KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Infant</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.check_in_infant} KG
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-lg-4 d-none d-lg-block">
                                <img
                                  src={images.svgluggage}
                                  style={{
                                    width: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                              <div className="col-12 col-lg-4">
                                <div>
                                  <div className="booking_details_baggage_head text-center p-2 ticket_booking_details_table_border">
                                    Cabin
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Adult</div>
                                      <div className="booking_details_age_desc">
                                        (Age 12+ yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.cabin_adult}KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Children</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2-12 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.cabin_children} KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Infant</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.cabin_infant} KG
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div
            className="row mt-4"
            style={{ marginLeft: "0px", marginRight: "0px" }}
          >
            <div
              className="col-12 pricee-tag"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <h2
                className="fs-4 fs-lg-2 p-2"
                style={{ backgroundColor: "var(--color-theme)", color: "#fff" }}
              >
                Price Summary
              </h2>
            </div>
            <div
              className=" mt-3"
              style={{
                border: "2px solid #ddb46b",
                marginLeft: "0px",
                marginRight: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">Base Fare</div>
                <div className="col-6 text-end text-black">
                  <span>&#8377;</span> {getModalData?.base_fare}.00
                </div>
              </div>
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">Discount</div>
                <div className="col-6 text-end text-black">
                  <span>&#8377;</span> {getModalData?.discount}.00
                </div>
              </div>
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">
                  Taxes & Others
                </div>
                <div className="col-6 text-end text-black">
                  <span>&#8377;</span>
                  {getModalData?.taxes_and_others}.00
                </div>
              </div>
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">Service Fees</div>
                <div className="col-6 text-end text-black">
                  <span>&#8377;</span> {getModalData?.service_fees}.00
                </div>
              </div>
              <div
                className="bottomlito"
                style={{ marginBottom: "0rem" }}
              ></div>
              <div
                className="row w-100 "
                style={{
                  marginLeft: "0px",
                  marginRight: "0px",
                  marginBottom: "0.5rem",
                }}
              >
                <div className="col-6 text-start fs-4 fw-bolder text-black">
                  Total
                </div>
                <div className="col-6 text-end text-success fw-bolder fs-4">
                  <span>&#8377;</span> {getModalData?.total_amount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isOpen2}
        onRequestClose={closeModal2}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: modalWidth,
            height: "620px",
            padding: "0",
            border: "none",
            borderRadius: "10px",
            position: "relative",
            overflowY: "auto",
          },
          overlay: {
            zIndex: 10000,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <div className="maindivbookinginfo">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsOpen2(false);
            }}
          >
            <IoCloseCircle color="#ddb46b" size={30} />
          </button>
          <div ref={captureRef}>
            <div className="p-3 resp_modal_main">
              <h4 className="fw-semibold" style={{ marginBottom: "1rem" }}>
                Traveler Details
              </h4>

              <div
                className="table-responsive"
                style={{ border: "1px solid #ddb46b" }}
              >
                <table
                  className="table table-bordered custom-table"
                  style={{ marginBottom: "0px" }}
                >
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getModalData?.child?.map((itm, indx) => {
                      return (
                        <tr key={indx}>
                          {" "}
                          <td>{indx + 1}</td>
                          <td>{itm?.first_name}</td>
                          <td>{itm?.last_name}</td>
                          <td>{itm?.phone_no ? itm?.phone_no : "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row my-3 gap-1 justify-content-center">
              <div
                className="col-12"
                style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
              >
                <div
                  className="text-center text-white p-2 fw-bold"
                  style={{
                    backgroundColor: "#ddb46b",
                    border: "2px solid #ddb46b",
                  }}
                >
                  Onward Details
                </div>

                <div className="row  align-items-center">
                  <div className="col-12 col-md-6 ">
                    <div
                      className=""
                    // style={{ borderRight: "2px solid #ddb46b", height: "100%" }}
                    >
                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around "
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">
                          Departure Date
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.departure_date}
                        </div>
                      </div>
                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around "
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">
                          Arrival Date
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.arrival_date}
                        </div>
                      </div>
                      <div className="row p-2 gap-2 align-items-center justify-content-around">
                        <div className="col-5 text-center fw-bold">Flight</div>
                        <div className="col-6 text-center">
                          {getModalData?.departure_city} →{" "}
                          {getModalData?.arrival_city}
                        </div>
                      </div>

                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around "
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">
                          Departure Time
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.departure_time}
                        </div>
                      </div>
                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around "
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">
                          Arrival Time
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.arrival_time}
                        </div>
                      </div>
                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around"
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">Stop</div>
                        <div className="col-6 text-center">
                          {getModalData?.stop}
                        </div>
                      </div>
                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around"
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">
                          Airline Name
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.airline_name}
                        </div>
                      </div>
                      <div
                        className="row p-2 gap-2 align-items-center justify-content-around"
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        <div className="col-5 text-center fw-bold">
                          Airline Code
                        </div>
                        <div className="col-6 text-center">
                          {getModalData?.airline_code}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 rounded">
                    <img
                      src={images.svgaero}
                      style={{
                        width: "100%",
                        objectFit: "contain",
                      }}
                      className="rounded-bottom"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Retun details */}
            {getModalData?.is_return == 1 && (
              <div className="col-12">
                <div className="accordion" id="returnDetailsAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingReturn">
                      <button
                        className="accordion-button collapsed fw-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseReturn"
                        aria-expanded="false"
                        aria-controls="collapseReturn"
                        style={{
                          backgroundColor: "#ddb46b",
                          border: "2px solid #dbb46b",
                          color: "white",
                        }}
                      >
                        Return Details
                      </button>
                    </h2>
                    <div
                      id="collapseReturn"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingReturn"
                      data-bs-parent="#returnDetailsAccordion"
                    >
                      <div
                        className="accordion-body p-2"
                        style={{ border: "2px solid #ddb46b" }}
                      >
                        {getModalData?.return_departure_date ===
                          getModalData?.return_arrival_date ? (
                          <div className="row gap-2 p-2 align-items-center justify-content-around">
                            <div className="col-5 text-center fw-bold">
                              Date{" "}
                            </div>
                            <div className="col-6 text-center">
                              {getModalData?.return_departure_date}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="row gap-2 p-2 align-items-center justify-content-around">
                              <div className="col-5 text-center fw-bold">
                                Departure Date
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.return_departure_date}
                              </div>
                            </div>
                            <div className="row gap-2 p-2 align-items-center justify-content-around">
                              <div className="col-5 text-center fw-bold">
                                Arrival Date
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.return_arrival_date}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="row p-2 gap-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">
                            Flight
                          </div>
                          <div className="col-6 text-center">
                            {getModalData?.return_departure_city} →{" "}
                            {getModalData?.return_arrival_city}
                          </div>
                        </div>

                        <div className="row gap-2 p-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">
                            Departure Time
                          </div>
                          <div className="col-6 text-center">
                            {getModalData?.return_departure_time}
                          </div>
                        </div>
                        <div className="row gap-2 p-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">
                            Arrival Time
                          </div>
                          <div className="col-6 text-center">
                            {getModalData?.return_arrival_time}
                          </div>
                        </div>
                        <div className="row gap-2 p-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">Stop</div>
                          <div className="col-6 text-center">
                            {getModalData?.return_stop}
                          </div>
                        </div>
                        <div className="row gap-2 p-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">
                            Airline Name
                          </div>
                          <div className="col-6 text-center">
                            {getModalData?.return_airline_name}
                          </div>
                        </div>
                        <div className="row gap-2 p-2 align-items-center justify-content-around">
                          <div className="col-5 text-center fw-bold">
                            Airline Code
                          </div>
                          <div className="col-6 text-center">
                            {getModalData?.return_airline_code === "undefined"
                              ? "N/A"
                              : getModalData?.return_airline_code}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className="row gap-1 justify-content-center"
              style={{ marginBottom: "1rem" }}
            >
              {getModalData?.stop != 0 && (
                <div
                  className="col-12 col-lg-5"
                  style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
                >
                  <div
                    className="text-center text-white p-2 fw-bold"
                    style={{ backgroundColor: "#ddb46b" }}
                  >
                    Flight Stop Details
                  </div>
                  <div className="" style={{ border: "2px solid #dbb46b" }}>
                    {getModalData?.stop_details.length <= 0 ? (
                      <>
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "600",
                            marginTop: "0.7rem",
                          }}
                        >
                          Non Stop
                        </p>
                      </>
                    ) : (
                      <>
                        {getModalData?.stop_details?.map((it, ind) => {
                          return (
                            <>
                              <div
                                className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                                style={{
                                  marginLeft: "0px",
                                  marginRight: "0px",
                                }}
                              >
                                <div className="col-5 text-center fw-bold">
                                  City Name
                                </div>
                                <div className="col-6 text-center">
                                  {it?.stop_city}
                                </div>
                              </div>
                              <div
                                className="row p-2 gap-2 align-items-center justify-content-around "
                                style={{
                                  marginLeft: "0px",
                                  marginRight: "0px",
                                }}
                              >
                                <div className="col-5 text-center fw-bold">
                                  Duration
                                </div>
                                <div className="col-6 text-center">
                                  {it?.stop_layover_duration}
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
              {getModalData?.is_return == 1 &&
                getModalData?.return_stop !== 0 && (
                  <div className="col-12 col-lg-5">
                    <div
                      className="text-center text-white p-2 fw-bold"
                      style={{ backgroundColor: "#ddb46b" }}
                    >
                      Return Flight Stop Details
                    </div>

                    <div className="" style={{ border: "2px solid #ddb46b" }}>
                      {getModalData?.return_stop_data?.length > 0 ? (
                        getModalData.return_stop_data.map((item, index) => (
                          <div key={index}>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-5 text-center fw-bold">
                                City Name
                              </div>
                              <div className="col-6 text-center">
                                {item.city_name}
                              </div>
                            </div>

                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-5 text-center fw-bold">
                                Duration
                              </div>
                              <div className="col-6 text-center">
                                {item.duration}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "600",
                            marginTop: "0.7rem",
                          }}
                        >
                          Non Stop
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <>
              <div className="row gap-1 justify-content-center">
                <div
                  className="col-12"
                  style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
                >
                  {getModalData?.check_in_adult == null ? (
                    <></>
                  ) : (
                    <>
                      <div
                        className="text-center text-white p-2 fw-bold"
                        style={{ backgroundColor: "#dbb46b" }}
                      >
                        Baggage Details
                      </div>
                      <div className="row p-3 align-items-center">
                        <div className="col-12 col-md-6">
                          <img
                            src={images.svgbag}
                            style={{
                              width: "100%",
                              objectFit: "contain",
                            }}
                            className="rounded-bottom"
                            alt="bag image"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="">
                            <div className="booking_details_baggage_head ticket_booking_details_table_border text-center p-2">
                              Check-in
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center">
                                <div className="fw-bold">Adult</div>
                                <div className="booking_details_age_desc">
                                  (Age 12+ yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.check_in_adult} KG
                              </div>
                            </div>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-4 text-center">
                                <div className="fw-bold">Children</div>
                                <div className="booking_details_age_desc">
                                  (Age 2-12 yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.check_in_children} KG
                              </div>
                            </div>
                            <div className="row p-2 gap-2 align-items-center justify-content-around ">
                              <div className="col-4 text-center">
                                <div className="fw-bold">Infant</div>
                                <div className="booking_details_age_desc">
                                  (Age 2 yrs)
                                </div>
                              </div>
                              <div className="col-6 text-center">
                                {getModalData?.check_in_infant} KG
                              </div>
                            </div>
                          </div>
                          {getModalData?.cabin_adult == null ? (
                            <></>
                          ) : (
                            <>
                              <div
                                className="mt-3"
                              // style={{ border: "2px solid #ddb46b" }}
                              >
                                <div className="booking_details_baggage_head text-center ticket_booking_details_table_border p-2">
                                  Cabin
                                </div>
                                <div
                                  className="row p-2 gap-2 align-items-center justify-content-around "
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                  }}
                                >
                                  <div className="col-4 text-center">
                                    <div className="fw-bold">Adult</div>
                                    <div className="booking_details_age_desc">
                                      (Age 12+ yrs)
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    {getModalData?.cabin_adult} KG
                                  </div>
                                </div>
                                <div
                                  className="row p-2 gap-2 align-items-center justify-content-around "
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                  }}
                                >
                                  <div className="col-4 text-center">
                                    <div className="fw-bold">Children</div>
                                    <div className="booking_details_age_desc">
                                      (Age 2-12 yrs)
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    {getModalData?.cabin_children} KG
                                  </div>
                                </div>
                                <div
                                  className="row p-2 gap-2 align-items-center justify-content-around "
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                  }}
                                >
                                  <div className="col-4 text-center ">
                                    <div className="fw-bold">Infant</div>
                                    <div className="booking_details_age_desc">
                                      (Age 2 yrs)
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    {getModalData?.cabin_infant} KG
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {getModalData?.is_return == 1 && (
                  <div className="col-12">
                    {/* Accordion Header */}
                    <div className="accordion" id="returnAccordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingReturn">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseReturn"
                            aria-expanded="true"
                            aria-controls="collapseReturn"
                            style={{
                              backgroundColor: "#ddb46b",
                              color: "white",
                              fontWeight: "bold",
                              height: "50px",
                            }}
                          >
                            Return Baggage Details
                          </button>
                        </h2>

                        {/* Accordion Body */}
                        <div
                          id="collapseReturn"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingReturn"
                          data-bs-parent="#returnAccordion"
                        >
                          <div className="accordion-body">
                            <div className="row align-items-center">
                              <div className="col-12 col-lg-4">
                                <div>
                                  <div className="booking_details_baggage_head text-center ticket_booking_details_table_border p-2">
                                    Check-in
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Adult</div>
                                      <div className="booking_details_age_desc">
                                        (Age 12+ yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.check_in_adult} KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Children</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2-12 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.check_in_children} KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Infant</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.check_in_infant} KG
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-lg-4 d-none d-lg-block">
                                <img
                                  src={images.svgluggage}
                                  style={{
                                    width: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                              <div className="col-12 col-lg-4">
                                <div>
                                  <div className="booking_details_baggage_head text-center p-2 ticket_booking_details_table_border">
                                    Cabin
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Adult</div>
                                      <div className="booking_details_age_desc">
                                        (Age 12+ yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.cabin_adult}KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Children</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2-12 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.cabin_children} KG
                                    </div>
                                  </div>
                                  <div className="row p-2 gap-2 align-items-center justify-content-around">
                                    <div className="col-4 text-center">
                                      <div className="fw-bold">Infant</div>
                                      <div className="booking_details_age_desc">
                                        (Age 2 yrs)
                                      </div>
                                    </div>
                                    <div className="col-6 text-center">
                                      {getModalData?.cabin_infant} KG
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>

            <div
              className="row mt-4"
              style={{ marginLeft: "0px", marginRight: "0px" }}
            >
              <div
                className="col-12 pricee-tag"
                style={{ paddingLeft: "0px", paddingRight: "0px" }}
              >
                <h2
                  className="fs-4 fs-lg-2 p-2"
                  style={{
                    backgroundColor: "var(--color-theme)",
                    color: "#fff",
                  }}
                >
                  Price Summary
                </h2>
              </div>
              <div
                className=" mt-3"
                style={{
                  border: "2px solid #ddb46b",
                  marginLeft: "0px",
                  marginRight: "0px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <div
                  className="row p-2 w-100 ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-6 text-start text-black">Base Fare</div>
                  <div className="col-6 text-end text-black">
                    <span>&#8377;</span> {getModalData?.base_fare}.00
                  </div>
                </div>
                <div
                  className="row p-2 w-100 ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-6 text-start text-black">Discount</div>
                  <div className="col-6 text-end text-black">
                    <span>&#8377;</span> {getModalData?.discount}.00
                  </div>
                </div>
                <div
                  className="row p-2 w-100 ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-6 text-start text-black">
                    Taxes & Others
                  </div>
                  <div className="col-6 text-end text-black">
                    <span>&#8377;</span>
                    {getModalData?.taxes_and_others}.00
                  </div>
                </div>
                <div
                  className="row p-2 w-100 ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-6 text-start text-black">
                    Service Fees
                  </div>
                  <div className="col-6 text-end text-black">
                    <span>&#8377;</span> {getModalData?.service_fees}.00
                  </div>
                </div>
                <div
                  className="bottomlito"
                  style={{ marginBottom: "0rem" }}
                ></div>
                <div
                  className="row w-100 "
                  style={{
                    marginLeft: "0px",
                    marginRight: "0px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div className="col-6 text-start fs-4 fw-bolder text-black">
                    Total
                  </div>
                  <div className="col-6 text-end text-success fw-bolder fs-4">
                    <span>&#8377;</span> {getModalData?.total_amount}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={handlePrint}
            className="d-flex mt-4 justify-content-end gap-3"
          >
            <div
              style={{
                width: "150px",
                cursor: "pointer",
                borderRadius: "30px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.3)",
                transition: "all 0.3s ease", // Smooth transition for hover effect
              }}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                style={{
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
              >
                Share
              </div>
              <FaShareAlt className="" size={18} color="white" />
            </div>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={confirmationModalOpen}
        onRequestClose={() => setConfirmationModalOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            padding: "0",
            border: "none",
            borderRadius: "10px",
            position: "relative",
            overflowY: "auto",
          },
          overlay: {
            zIndex: 10000,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        {cancellation_details_loading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "390px",
            }}
          >
            <div className="loader">
              <div className="spinner"></div>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 custom-cancel-modal-content">
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title text-dark">Confirm Cancellation</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setConfirmationModalOpen(false)}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p className="text-muted">
                Are you sure you want to cancel the booking
              </p>
              <p>
                <strong>Your PNR No. : {selectedPNR || ""}</strong>
              </p>
              <p>
                <strong>
                  Refundable Amount:{" "}
                  <span style={{ color: "green" }}>
                    ₹ {cancellation_details[0]?.RefundAmount.toFixed(2)}
                  </span>
                </strong>
              </p>
              <p>
                <strong>Seat No.: {cancellation_details[0]?.SeatNames}</strong>
              </p>
              <p>
                <strong>
                  You have Paid: ₹ {cancellation_details[0]?.TotalFare}
                </strong>
              </p>
              <p className="text-muted small mt-2">
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-0 d-flex justify-content-end gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-light keep-btn"
                onClick={() => setConfirmationModalOpen(false)}
              >
                No, Keep Booking
              </button>
              <button
                type="button"
                disabled={confirm_cancellation_loading}
                className="btn btn-danger cancel-btn"
                onClick={() => {
                  handleConfirmCancel();
                }}
              >
                {confirm_cancellation_loading
                  ? "Processing..."
                  : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default DashBoard;
