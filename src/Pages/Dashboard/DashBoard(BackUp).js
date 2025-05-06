import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import { Helmet } from "react-helmet";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { DatePicker } from "antd";
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
import { ACCEPT_HEADER, get_booking } from "../../Utils/Constant";
import axios from "axios";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { MdCurrencyRupee, MdCancelPresentation } from "react-icons/md";
import { BsFillLuggageFill, BsBookmarkCheckFill } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { GiCommercialAirplane } from "react-icons/gi";

const ITEMS_PER_PAGE = 20;

const completedData = [
  {
    id: 1,
    airline_name: "IndiGo",
    booking_date: "2023-10-01",
    to: "Delhi",
    from: "Mumbai",
    toDate: "2023-10-05",
    fromDate: "2023-10-01",
    toTime: "10:00 AM",
    fromTime: "12:00 PM",
    total: 2,
    terminal: "Terminal 1",
    name: "Parth Kariya",
    image: require("../../Assets/IndiGoAirlines_logo.png"),
  },
  {
    id: 2,
    airline_name: "IndiGo",
    booking_date: "2024-10-01",
    to: "Rajkot",
    from: "Bombay",
    toDate: "2024-10-05",
    fromDate: "2024-10-01",
    toTime: "10:00 AM",
    fromTime: "12:00 PM",
    total: 1,
    terminal: "Terminal 1",
    name: "zeel kaneria",
    image: require("../../Assets/Akasa_Air_logo.png"),
  },
];

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
  const [loading, setLoading] = useState(false);
  const [getBookingDataFilter, SetbookingDataFilter] = useState([]);
  const [getModalData, setModalData] = useState();
  const [getCondi, setCondi] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [filteredBookingData, setFilteredBookingData] = useState([]);
  const location = useLocation();
  const captureRef = useRef(null);
  const navigate = useNavigate();

  const item = location.state?.item;
  const referenceId = location.state?.referanceId;

  const totalPages = Math.ceil(getBookingDataFilter.length / ITEMS_PER_PAGE);

  // Get the data for the current page
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

  const handleFromDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date);
      setFromDate(formattedDate);
      setToDate(null);
    } else {
      setFromDate(null);
    }
  };

  const handleFromDateChange2 = (date) => {
    setDepartureFromDate(date);
    setDepartureToDate(null);
  };

  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload(false);
  }

  const handleToDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date); // Ensure it's a dayjs object
      setToDate(formattedDate);
    } else setToDate(null);
  };

  const handleToDateChange2 = (date) => {
    setDepartureToDate(date);
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setDepartureFromDate(null);
    setDepartureToDate(null);
    setDep("");
    setArr("");
    SetbookingDataFilter(getBookingData); // Reset to original data
  };

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

  const disabledDate2 = (current) => {
    return current && current > dayjs().endOf("day");
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
    var getcondition = localStorage.getItem("getConditionnn");
    setCondi(getcondition);
    GetBooking();
    window.scroll(0, 0);
  }, []);

  console.log("currentData", currentData);

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

  console.log("getBooking Details", filteredBookingData);

  const handleTabChange = (type) => {
    setSelectedTab(type);
    filterBookings(getBookingData, type);
  };

  useEffect(() => {
    filterBookings(getBookingData, selectedTab);
  }, [getBookingData]);

  const filterFlights = () => {
    const filteredData = getBookingData.filter((item) => {
      const matchesDeparture = dep
        ? item.departure_city.toLowerCase().includes(dep.toLowerCase())
        : true;
      const matchesArrival = arr
        ? item.arrival_city.toLowerCase().includes(arr.toLowerCase())
        : true;

      const itemBookingDate = moment(item?.updated_at).format("YYYY-MM-DD");

      let matchesBookingFrom = true;
      let matchesBookingTo = true;

      if (fromDate) {
        const fromTimestamp = dayjs(fromDate).format("YYYY-MM-DD");
        matchesBookingFrom = fromTimestamp <= itemBookingDate;
      }

      if (toDate) {
        const toTimestamp = dayjs(toDate).format("YYYY-MM-DD");
        matchesBookingTo = toTimestamp >= itemBookingDate;
      }

      return (
        matchesDeparture &&
        matchesArrival &&
        matchesBookingFrom &&
        matchesBookingTo
      );
    });

    SetbookingDataFilter(filteredData);
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard | Airline Booking</title>
      </Helmet>
      <PathHero name={"Dashboard"} />
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
          <section className="container p-0 bookingsec shadow">
            <div className="tabSec">
              <div
                className={`tabDiv ${
                  selectedTab === "upcoming" ? "activeTab" : ""
                }`}
                onClick={() => handleTabChange("upcoming")}
              >
                <div>
                  <BsFillLuggageFill color="#ff4500" size={25} />
                </div>
                <div className="tabFont">UPCOMING</div>
              </div>

              <div
                className={`tabDiv ${
                  selectedTab === "CANCELLED" ? "activeTab" : ""
                }`}
                onClick={() => setSelectedTab("CANCELLED")}
              >
                <div>
                  <MdCancelPresentation color="#ff4500" size={25} />
                </div>
                <div className="tabFont">CANCELLED</div>
              </div>

              <div
                className={`tabDiv ${
                  selectedTab === "completed" ? "activeTab" : ""
                }`}
                onClick={() => handleTabChange("completed")}
              >
                <div>
                  <BsBookmarkCheckFill color="#ff4500" size={25} />
                </div>
                <div className="tabFont">COMPLETED</div>
              </div>
            </div>

            {/* {currentData.length > 0 && (
              <div className="row my-3 justify-content-start justify-content-lg-around justify-content-md-center dashboar_resp_gap">
                <div className="col-lg-3 col-md-5">
                  <div className="text-center bkingtxt">Booking Date</div>
                  <div className="d-flex justify-content-start align-items-center align-items-center mt-3">
                    <div className="frmtxt text-lg-center text-start">From</div>
                    <div className="text-center w-100">
                      <div className="custom-date-picker booking_details_date_pickers">
                        <DatePicker
                          onChange={handleFromDateChange}
                          value={fromDate}
                          inputReadOnly={true}
                          format="DD-MM-YYYY"
                          placeholder="Select Date"
                          disabledDate={disabledDate2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-start align-items-center align-items-center mt-3">
                    <div className="frmtxt text-lg-center text-start">To</div>
                    <div className="custom-date-picker w-100 booking_details_date_pickers">
                      <DatePicker
                        onChange={handleToDateChange}
                        value={toDate}
                        inputReadOnly={true}
                        format="DD-MM-YYYY"
                        placeholder="Select Date"
                        disabledDate={(current) =>
                          fromDate
                            ? current && current.isBefore(fromDate, "day")
                            : false
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="text-center bkingtxt">Departure Date</div>
                  <div className="d-flex gap-1 justify-content-around align-items-center mt-3">
                    <div className="frmtxt w-25 text-center">From</div>
                    <div className="text-center w-75">
                      <div className="custom-date-picker booking_details_date_pickers">
                        <DatePicker
                          onChange={handleFromDateChange2}
                          inputReadOnly={true}
                          value={departureFromDate}
                          format="DD-MM-YYYY"
                          placeholder="Select Date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-1 justify-content-around align-items-center mt-3">
                    <div className="frmtxt w-25 text-center">To</div>
                    <div className="custom-date-picker w-75 booking_details_date_pickers">
                      <DatePicker
                        onChange={handleToDateChange2}
                        value={departureToDate}
                        inputReadOnly={true}
                        format="DD-MM-YYYY"
                        placeholder="Select Date"
                        disabledDate={(current) =>
                          departureFromDate
                            ? current &&
                              current.isBefore(departureFromDate, "day")
                            : false
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-5">
                  <div className="text-center bkingtxt">City Name</div>
                  <div className="my-3">
                    <div className="w-100 w-md-50">
                      <input
                        type="text"
                        className="txtinput txtinput_booking_details"
                        value={dep}
                        onChange={(e) => setDep(e.target.value)}
                        placeholder="Enter departure city name"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="txtinput txtinput_booking_details"
                      value={arr}
                      onChange={(e) => setArr(e.target.value)}
                      placeholder="Enter arrival city name"
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-md-5">
                  <div className="text-center bkingtxt">Search</div>
                  <div className="my-3">
                    <button
                      className="btn w-100 text-white fw-bold"
                      style={{ backgroundColor: "#ddb46b" }}
                      // onClick={()=>{filterFlights(dep,arr);}}
                      onClick={filterFlights}
                    >
                      Search
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-danger w-100"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            <div className="table-div">
              {getBookingDataFilter.length <= 0 ? (
                <p
                  style={{
                    color: "#000",
                    fontWeight: "700",
                    fontSize: "18px",
                    marginTop: "1rem",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No Data Found.
                </p>
              ) : (
                <>
                  <div className="container p-3 resp_view_main_sec">
                    <div className="row justify-content-start align-items-center">
                      {selectedTab === "upcoming" && (
                        <>
                          {/* <div
                            className="col-12 p-3 fs-5 mb-3 fw-bold"
                            style={{ color: "#dbb46b" }}
                          >
                            Your Booking Details
                          </div> */}
                          {currentData.map((item, index) => {
                            return (
                              <div className="completedmaintab">
                                <div className="completeheader">
                                  <div className="row align-items-center justify-content-around gap-2 resp_dashboard">
                                    <div className="col-lg-8 align-items-center d-flex resp_dashboard_inner">
                                      <div className="row resp_dashboard_inner_first_part">
                                        <div className="col-12 d-flex align-items-center gap-2 resp_justify_center">
                                          <div className="completeFrom">
                                            {item.departure_city}
                                          </div>
                                          <div className="">
                                            <FaLongArrowAltRight />
                                          </div>
                                          <div className="completeFrom">
                                            {item.arrival_city}
                                          </div>
                                        </div>
                                        <div className="col-12 d-flex flex-column flex-lg-row align-items-center gap-lg-3 gap-1 mt-2 resp_dashboard_inner_first resp_justify_center">
                                          <div className="text-warning">
                                            Upcoming
                                          </div>
                                          <div className="dot_flex">
                                            <div>
                                              <GoDotFill />
                                            </div>
                                            {item.is_return == 0 ? (
                                              <div className="fw-bold">
                                                One Way
                                              </div>
                                            ) : (
                                              <div className="fw-bold">
                                                Round Trip
                                              </div>
                                            )}
                                          </div>
                                          <div className="dot_flex">
                                            <div>
                                              <GoDotFill />
                                            </div>
                                            <div className="text-secondary">
                                              {item?.get_con === 0
                                                ? "Booking ID - "
                                                : "Reference ID - "}
                                            </div>
                                            <div className="text-secondary">
                                              {item?.booking_id
                                                ? item?.booking_id
                                                : "N/A"}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="circlegol">
                                          <img
                                            className="complane"
                                            src={images.planecompleted}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 d-flex align-items-center justify-content-center">
                                      <Link
                                        to={"/ViewBooking"}
                                        // onClick={BookingDetails}
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
                                      <div className="text-secondary">From</div>
                                      <div className="completedDate">
                                        {moment(item.departure_date).format(
                                          "DD MMM'YY"
                                        )}{" "}
                                        <span className="text-secondary fw-light completedTime">
                                          {item.departure_time}
                                        </span>
                                      </div>
                                      <div className="d-flex gap-3">
                                        <div className="fw-bold">
                                          {item.departure_city}
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
                                        {moment(item.arrival_date).format(
                                          "DD MMM'YY"
                                        )}{" "}
                                        <span className="text-secondary fw-light completedTime">
                                          {item.arrival_time}
                                        </span>
                                      </div>
                                      <div className="d-flex gap-3">
                                        <div className="fw-bold">
                                          {item.arrival_city}
                                        </div>
                                        <div className="text-muted">
                                          {item.terminal}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 d-flex flex-column align-items-start resp_dashboard_ticket_short_detail_icon_flex">
                                      <div className="d-flex flex-row gap-3 mb-2">
                                        <GiCommercialAirplane size={19} />
                                        <div>{item.airline_name}</div>
                                      </div>
                                      {item?.child?.length > 0 && (
                                        <div className="d-flex flex-row gap-3 align-items-center">
                                          <FaUser size={19} />
                                          <div>
                                            {item.child[0].first_name}{" "}
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
                                      <div>
                                        {(() => {
                                          const airline = item.airline_name;

                                          return airline ===
                                            "IndiGo Airlines" ||
                                            airline === "IndiGo" ? (
                                            <img
                                              src={images.IndiGoAirlines_logo}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "Neos" ? (
                                            <img
                                              src={images.neoslogo}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "SpiceJet" ? (
                                            <img
                                              src={images.spicejet}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "Air India" ? (
                                            <img
                                              src={images.airindialogo}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "Akasa Air" ? (
                                            <img
                                              src={images.akasalogo}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "Etihad" ? (
                                            <img
                                              src={images.etihadlogo}
                                              style={{
                                                backgroundColor: "#fffbdb",
                                                padding: "5px",
                                                borderRadius: "5px",
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                              // className="airline_logo"
                                            />
                                          ) : airline === "Vistara" ? (
                                            <img
                                              src={images.vistaralogo}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "AirAsia X" ? (
                                            <img
                                              src={images.airasiax}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "AirAsia" ? (
                                            <img
                                              src={images.airasia}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : airline === "Azul" ? (
                                            <img
                                              src={images.azul}
                                              // className="airline_logo"
                                              style={{
                                                width: "100px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ) : (
                                            <IoAirplaneSharp
                                              size={40}
                                              color="white"
                                            />
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                  {item.is_return === 1 && (
                                    <>
                                      <div className="row w-100 align-items-center justify-content-between ">
                                        <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                          <div className="text-secondary">
                                            From
                                          </div>
                                          <div className="completedDate">
                                            {moment(
                                              item.return_departure_date
                                            ).format("DD MMM'YY")}{" "}
                                            <span className="text-secondary fw-light completedTime">
                                              {item.return_departure_time}
                                            </span>
                                          </div>
                                          <div className="d-flex gap-3">
                                            <div className="fw-bold">
                                              {item.return_departure_city}
                                            </div>
                                            <div className="text-muted">
                                              {item?.terminal
                                                ? item.terminal
                                                : "Terminal 1"}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                          <div className="text-secondary">
                                            To
                                          </div>
                                          <div className="completedDate">
                                            {moment(
                                              item.return_arrival_date
                                            ).format("DD MMM'YY")}{" "}
                                            <span className="text-secondary fw-light completedTime">
                                              {item.return_arrival_time}
                                            </span>
                                          </div>
                                          <div className="d-flex gap-3">
                                            <div className="fw-bold">
                                              {item.return_arrival_city}
                                            </div>
                                            <div className="text-muted">
                                              {item?.terminal
                                                ? item.termial
                                                : "Terminal 1"}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-row flex-lg-column align-items-start justify-content-center gap-5 gap-lg-0 align-items-lg-start ">
                                          <div className="d-flex flex-row gap-3 mb-2">
                                            <GiCommercialAirplane size={19} />
                                            <div>
                                              {item.return_airline_name}
                                            </div>
                                          </div>
                                          {item?.child?.length > 0 && (
                                            <div className="d-flex flex-row gap-3 align-items-center">
                                              <FaUser size={19} />
                                              <div>
                                                {item.child[0].first_name}{" "}
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
                                          <div>
                                            {(() => {
                                              const airline = item.airline_name;

                                              return airline ===
                                                "IndiGo Airlines" ||
                                                airline === "IndiGo" ? (
                                                <img
                                                  src={
                                                    images.IndiGoAirlines_logo
                                                  }
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "Neos" ? (
                                                <img
                                                  src={images.neoslogo}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "SpiceJet" ? (
                                                <img
                                                  src={images.spicejet}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "Air India" ? (
                                                <img
                                                  src={images.airindialogo}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "Akasa Air" ? (
                                                <img
                                                  src={images.akasalogo}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "Etihad" ? (
                                                <img
                                                  src={images.etihadlogo}
                                                  style={{
                                                    backgroundColor: "#fffbdb",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                  // className="airline_logo"
                                                />
                                              ) : airline === "Vistara" ? (
                                                <img
                                                  src={images.vistaralogo}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "AirAsia X" ? (
                                                <img
                                                  src={images.airasiax}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "AirAsia" ? (
                                                <img
                                                  src={images.airasia}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : airline === "Azul" ? (
                                                <img
                                                  src={images.azul}
                                                  // className="airline_logo"
                                                  style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : (
                                                <IoAirplaneSharp
                                                  size={40}
                                                  color="white"
                                                />
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {selectedTab === "CANCELLED" && (
                        <>
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
                                    Looks empty, you've no Completed bookings.
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
                                                  {item.departure_city}
                                                </div>
                                                <div className="">
                                                  <FaLongArrowAltRight />
                                                </div>
                                                <div className="completeFrom">
                                                  {item.arrival_city}
                                                </div>
                                              </div>
                                              <div className="col-12 d-flex flex-column flex-lg-row align-items-center gap-lg-3 gap-1 mt-2 resp_dashboard_inner_first resp_justify_center">
                                                <div className="text-warning">
                                                  Upcoming
                                                </div>
                                                <div className="dot_flex">
                                                  <div>
                                                    <GoDotFill />
                                                  </div>
                                                  {item.is_return == 0 ? (
                                                    <div className="fw-bold">
                                                      One Way
                                                    </div>
                                                  ) : (
                                                    <div className="fw-bold">
                                                      Round Trip
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="dot_flex">
                                                  <div>
                                                    <GoDotFill />
                                                  </div>
                                                  <div className="text-secondary">
                                                    Booking ID -
                                                  </div>
                                                  <div className="text-secondary">
                                                    GDLAEF98532
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="circlegol">
                                                <img
                                                  className="complane"
                                                  src={images.planecompleted}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-3 d-flex align-items-center justify-content-center">
                                            <Link
                                              to={"/ViewBooking"}
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
                                                {item.departure_city}
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
                                              {moment(item.arrival_date).format(
                                                "DD MMM'YY"
                                              )}{" "}
                                              <span className="text-secondary fw-light completedTime">
                                                {item.arrival_time}
                                              </span>
                                            </div>
                                            <div className="d-flex gap-3">
                                              <div className="fw-bold">
                                                {item.arrival_city}
                                              </div>
                                              <div className="text-muted">
                                                {item.terminal}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-3 d-flex flex-column align-items-start resp_dashboard_ticket_short_detail_icon_flex">
                                            <div className="d-flex flex-row gap-3 mb-2">
                                              <GiCommercialAirplane size={19} />
                                              <div>{item.airline_name}</div>
                                            </div>
                                            {item?.child?.length > 0 && (
                                              <div className="d-flex flex-row gap-3 align-items-center">
                                                <FaUser size={19} />
                                                <div>
                                                  {item.child[0].first_name}{" "}
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
                                            <div>
                                              {(() => {
                                                const airline =
                                                  item.airline_name;

                                                return airline ===
                                                  "IndiGo Airlines" ||
                                                  airline === "IndiGo" ? (
                                                  <img
                                                    src={
                                                      images.IndiGoAirlines_logo
                                                    }
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "Neos" ? (
                                                  <img
                                                    src={images.neoslogo}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "SpiceJet" ? (
                                                  <img
                                                    src={images.spicejet}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "Air India" ? (
                                                  <img
                                                    src={images.airindialogo}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "Akasa Air" ? (
                                                  <img
                                                    src={images.akasalogo}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "Etihad" ? (
                                                  <img
                                                    src={images.etihadlogo}
                                                    style={{
                                                      backgroundColor:
                                                        "#fffbdb",
                                                      padding: "5px",
                                                      borderRadius: "5px",
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                    // className="airline_logo"
                                                  />
                                                ) : airline === "Vistara" ? (
                                                  <img
                                                    src={images.vistaralogo}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "AirAsia X" ? (
                                                  <img
                                                    src={images.airasiax}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "AirAsia" ? (
                                                  <img
                                                    src={images.airasia}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : airline === "Azul" ? (
                                                  <img
                                                    src={images.azul}
                                                    // className="airline_logo"
                                                    style={{
                                                      width: "100px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                ) : (
                                                  <IoAirplaneSharp
                                                    size={40}
                                                    color="white"
                                                  />
                                                );
                                              })()}
                                            </div>
                                          </div>
                                        </div>
                                        {item.is_return === 1 && (
                                          <>
                                            <div className="row w-100 align-items-center justify-content-between ">
                                              <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                                <div className="text-secondary">
                                                  From
                                                </div>
                                                <div className="completedDate">
                                                  {moment(
                                                    item.return_departure_date
                                                  ).format("DD MMM'YY")}{" "}
                                                  <span className="text-secondary fw-light completedTime">
                                                    {item.return_departure_time}
                                                  </span>
                                                </div>
                                                <div className="d-flex gap-3">
                                                  <div className="fw-bold">
                                                    {item.return_departure_city}
                                                  </div>
                                                  <div className="text-muted">
                                                    {item?.terminal
                                                      ? item.terminal
                                                      : "Terminal 1"}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-3 d-flex flex-column resp_dashboard_ticket_short_detail_main">
                                                <div className="text-secondary">
                                                  To
                                                </div>
                                                <div className="completedDate">
                                                  {moment(
                                                    item.return_arrival_date
                                                  ).format("DD MMM'YY")}{" "}
                                                  <span className="text-secondary fw-light completedTime">
                                                    {item.return_arrival_time}
                                                  </span>
                                                </div>
                                                <div className="d-flex gap-3">
                                                  <div className="fw-bold">
                                                    {item.return_arrival_city}
                                                  </div>
                                                  <div className="text-muted">
                                                    {item?.terminal
                                                      ? item.termial
                                                      : "Terminal 1"}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-3 d-flex flex-column align-items-start">
                                                <div className="d-flex flex-row gap-3 mb-2">
                                                  <GiCommercialAirplane
                                                    size={19}
                                                  />
                                                  <div>
                                                    {item.return_airline_name}
                                                  </div>
                                                </div>
                                                {item?.child?.length > 0 && (
                                                  <div className="d-flex flex-row gap-3 align-items-center">
                                                    <FaUser size={19} />
                                                    <div>
                                                      {item.child[0].first_name}{" "}
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
                                              <div className="col-lg-3 d-flex flex-column text-center">
                                                <div>
                                                  {(() => {
                                                    const airline =
                                                      item.airline_name;

                                                    return airline ===
                                                      "IndiGo Airlines" ||
                                                      airline === "IndiGo" ? (
                                                      <img
                                                        src={
                                                          images.IndiGoAirlines_logo
                                                        }
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline === "Neos" ? (
                                                      <img
                                                        src={images.neoslogo}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline ===
                                                      "SpiceJet" ? (
                                                      <img
                                                        src={images.spicejet}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline ===
                                                      "Air India" ? (
                                                      <img
                                                        src={
                                                          images.airindialogo
                                                        }
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline ===
                                                      "Akasa Air" ? (
                                                      <img
                                                        src={images.akasalogo}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline === "Etihad" ? (
                                                      <img
                                                        src={images.etihadlogo}
                                                        style={{
                                                          backgroundColor:
                                                            "#fffbdb",
                                                          padding: "5px",
                                                          borderRadius: "5px",
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                        // className="airline_logo"
                                                      />
                                                    ) : airline ===
                                                      "Vistara" ? (
                                                      <img
                                                        src={images.vistaralogo}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline ===
                                                      "AirAsia X" ? (
                                                      <img
                                                        src={images.airasiax}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline ===
                                                      "AirAsia" ? (
                                                      <img
                                                        src={images.airasia}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : airline === "Azul" ? (
                                                      <img
                                                        src={images.azul}
                                                        // className="airline_logo"
                                                        style={{
                                                          width: "100px",
                                                          height: "50px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : (
                                                      <IoAirplaneSharp
                                                        size={40}
                                                        color="white"
                                                      />
                                                    );
                                                  })()}
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
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
                // <table className="table table-bordered">
                //   <thead>
                //     <tr>
                //       <th className="text-white">S.No</th>
                //       <th className="text-white">Flight Name</th>
                //       <th className="text-white">Booking</th>
                //       <th className="text-white">Booking Date</th>
                //       <th className="text-white">No. of Persons</th>
                //       <th className="text-white">Amount</th>
                //       <th className="text-white">Action</th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {currentData.map((item, index) => (
                //       <tr
                //         key={index}
                //         style={{ borderBottom: "1px solid #ddb46b" }}
                //       >
                //         <td>{startIndex + index + 1}</td>
                //         <td>{item.airline_name}</td>
                //         <td>
                //           {item.child[0].first_name} {item.child[0].last_name}
                //         </td>
                //         <td>{moment(item?.updated_at).format("DD-MM-YYYY")}</td>
                //         <td>{item.total_travelers}</td>
                //         <td>{item.total_amount}</td>
                //         <td className="d-flex justify-content-around">
                //           <FaInfoCircle
                //             className="infobtn"
                //             size={18}
                //             onClick={() => {
                //               openModal();
                //               setModalData(item);
                //             }}
                //           />
                //           <FaShareAlt
                //             className="sharebtnhover"
                //             size={18}
                //             onClick={() => {
                //               openModal2();
                //               setModalData(item);
                //             }}
                //           />
                //         </td>
                //       </tr>
                //     ))}
                //   </tbody>
                // </table>
              )}
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
    </div>
  );
};

export default DashBoard;
