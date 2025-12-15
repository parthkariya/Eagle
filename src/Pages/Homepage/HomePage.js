import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Homepage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeHero from "../../Components/HomeHero/HomeHero";
import HeroTicketBooking from "../../Components/HeroTicketBooking/HeroTicketBooking";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import PartnerAirline from "../../Components/PartnerAirlines/PartnerAirline";
import { Helmet } from "react-helmet";
import ReactModal from "react-modal";
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

const HomePage = () => {
  const { getCancellationPolicyApi } = useAuthContext();
  const [modalWidth, setModalWidth] = useState("90%");

    const {
      FlightSearch,
      FlightSearchAiriq,
      flight_Data,
      flightAirIq_Data,
    } = useFlightContext();

  useLayoutEffect(() => {
    const updateWidth = () => {
      setModalWidth(window.innerWidth <= 1180 ? "90%" : "1140px");
    };

    updateWidth(); // Set width immediately on page load
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
    },
    overlay: {
      zIndex: 10000,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingid, setBookingId] = useState(null);
  const [login, SetLogin] = useState("");
  const [getCompanyId, setCompanyId] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    var companyid = localStorage.getItem("companyid");
    setCompanyId(companyid);

    SetLogin(islogin);

    console.log("getCompanyId", companyid);

    var role = localStorage.getItem("is_role");
    if (islogin) {
      setUserRole(JSON.parse(role));
    }

    // if (getCompanyId){
    //   console.log("truueeeee");

    // }
  }, []);

  useEffect(() => {
    getCancellationPolicy();
  }, []);

  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";
  const isLocalhost = window.location.hostname === "localhost";

  const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";
  // const proxy = "https://proxy.cors.sh/";

  useEffect(() => {
    window.scroll(0, 0);
    var bookingid = localStorage.getItem("booking_id");
    // console.log("Booking Id in Homepage", bookingid);
    setBookingId(bookingid);
    if (bookingid !== null) {
      setModalOpen(true);
      // BookingDetails(bookingid);
      setTimeout(() => {
        BookingDetails(bookingid);
      }, 1000);
    }

    const token = JSON.parse(localStorage.getItem("is_token"));

    // console.log("HomePage Ma Token No Log aapni api no", token);
  }, [userRole]);

  const BookingDetails = async (bookingid) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    setLoading(true);
    let apiUrl = "";

    if (userRole === "2") {
      // apiUrl = proxy + "https://omairiq.azurewebsites.net/search";
      apiUrl = `${ticketcurl}/${bookingid}`;
    } else if (userRole === "3") {
      // apiUrl = proxy + "https://omairiq.azurewebsites.net/suppliersearch";
      apiUrl = `${supplierticketcurl}/${bookingid}`;
    } else {
      console.error("Invalid selection value");
      return;
    }
    try {
      console.log("2222222222222222222");

      // const res = await axios.get(`${ticketcurl}/${bookingid}`,
      const res = await axios.get(
        apiUrl,
        // proxy +
        //   `https://omairiq.azurewebsites.net/ticket?booking_id=${bookingid}`,

        {
          headers: {
            // "api-key": API_KEY,
            // "x-cors-api-key": "temp_e35dd3b63f82139abededcd2891cb340",
            // Authorization: token,
            // "Content-Type": "application/json",
            "api-key": API_KEY,
            Authorization: token,
            Accept: ACCEPT_HEADER,
          },
        }
      );
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

  const { selectedTabMainHome, selectedTab, ClearRouteData } = useBusContext();

  // Company List API

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

  return (
    <div className="">
      <Helmet>
        <title>Home | Airline Booking</title>
      </Helmet>
      <HomeHero />
      {/* <HeroTicketBooking /> */}

      {selectedTab === "buses" ? (
        <>
          <HappySection />
          <WhyChooseUsBus />
          <CountSection />
        </>
      ) : (
        <>
        {flight_Data?.length > 0 || flightAirIq_Data?.length > 0 ? <></> : <>
          <WhyChooseUs />
          <PartnerAirline />
        </>}
          
        </>
      )}

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
                    {/* <th className="text-white">S.No</th> */}
                    <th className="text-black">Airline</th>
                    <th className="text-black">Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* <td>1</td> */}
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
                            <tr>
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
                            <tr>
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
                            <tr>
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
    </div>
  );
};

export default HomePage;
