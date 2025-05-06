import React, { useEffect, useRef, useState } from "react";
import "./ViewBooking.css";
import { Helmet } from "react-helmet";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { MdLuggage } from "react-icons/md";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { GoDotFill } from "react-icons/go";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { IoAirplaneSharp } from "react-icons/io5";
import images from "../../Constants/images";
import { WiSunrise } from "react-icons/wi";
import { MdAirplaneTicket } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { BsCalendarDate } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import { SiGmail } from "react-icons/si";

const ViewBooking = () => {
  const location = useLocation();
  const [data, setData] = useState(location?.state?.item);
  const [viewopen, setViewopen] = useState(false);
  const [viewopen2, setViewopen2] = useState(false);
  const invoiceRef = useRef(null);
  const [data2, setData2] = useState(null);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    if (data?.get_con === 0) {
      BookingDetails();
    }
  }, []);

  const toggleview = () => {
    setViewopen(!viewopen);
  };

  const toggleview2 = () => {
    setViewopen2(!viewopen2);
  };

  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Ticket.pdf");

    // const opt = {
    //   margin: 0.5,
    //   filename: "invoice.pdf",
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 3 },
    //   jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    // };

    // setTimeout(() => {
    //   html2pdf().set(opt).from(element).save();
    // }, 100); // small delay
  };

  console.log("DATOOO", data);

  const isLocalhost = window.location.hostname === "localhost";

  const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";

  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

  const BookingDetails = async () => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    setLoading2(true);
    try {
      const res = await axios.get(
        proxy +
          `https://omairiq.azurewebsites.net/ticket?booking_id=${data?.booking_id}`,
        {
          headers: {
            "api-key": API_KEY,
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.status === "success") {
        const data = res.data.data;
        console.log("Ticket no data", res.data.data);
        setData2(data);
        setLoading2(false);
      } else {
        setLoading2(false);
      }
    } catch (error) {
      console.log("Error in Ticket Details Api ", error);
      setLoading2(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard | View Booking</title>
      </Helmet>
      <PathHero name={"View Booking"} />
      <section>
        <div className="container-fluid p-3" ref={invoiceRef}>
          <div className="row">
            {/* Left Side */}
            <div className="col-lg-8 col-md-7 col-12 mb-3">
              {data?.get_con === 0 && (
                <div className="d-flex justify-content-end align-items-center gap-3 mb-2">
                  <BsCalendarDate size={18} />
                  <div>BOOKING DATE - </div>
                  <div>
                    {moment(data2?.booking_date, "DD MMM YYYY HH:mm")
                      .format("DD MMM'YY hh:mm a")
                      .toLowerCase()}
                  </div>
                </div>
              )}
              <div className="cardd p-3 shadow-sm mb-3">
                <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2 mb-5">
                  <h4 className="fw-bold">
                    {data?.departure_city} ⇌ {data?.arrival_city}
                  </h4>{" "}
                  <div className="fs-6 text-muted">
                    BOOKING ID -{" "}
                    {data.get_con === 0 ? (
                      <>{data2?.booking_id ? data2?.booking_id : "N/A"}</>
                    ) : (
                      <>{data?.booking_id ? data?.booking_id : "N/A"}</>
                    )}{" "}
                  </div>
                </div>
                <div className="row flex-row responRow">
                  <div className="col-5 col-md-5 childcardd cardd">
                    <h5 className="d-flex flex-column flex-lg-row align-items-center gap-2">
                      <strong>
                        {data?.departure_city} → {data?.arrival_city}
                      </strong>{" "}
                    </h5>
                    <div className="d-flex gap-2 align-items-center justify-content-lg-start justify-content-center">
                      {moment(data.departure_date).format("ddd DD MMM'YY")}
                      <GoDotFill />
                      {data?.total_travelers} Traveller(s)
                    </div>
                  </div>
                  {data?.is_return == 1 && (
                    <div className="col-5 col-md-5 cardd childcardd2">
                      <h5 className="d-flex flex-column  flex-lg-row align-items-center gap-2">
                        <strong>
                          {data?.return_departure_city} →{" "}
                          {data?.return_arrival_city}
                        </strong>{" "}
                      </h5>
                      <div className="d-flex gap-2 align-items-center justify-content-lg-start justify-content-center">
                        {moment(data.return_departure_date).format(
                          "ddd DD MMM'YY"
                        )}
                        <GoDotFill />
                        {data?.total_travelers} Traveller(s)
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`cardd p-3 shadow-sm classokkaro`}>
                <div className="divviewopen" onClick={toggleview}>
                  <h4 className="d-flex gap-2">
                    <strong>
                      {data?.departure_city} → {data?.arrival_city}
                    </strong>
                  </h4>
                  <div>
                    {viewopen ? (
                      <CiCircleChevUp size={25} />
                    ) : (
                      <CiCircleChevDown size={25} />
                    )}
                  </div>
                </div>
                {viewopen && (
                  <>
                    <div className="d-flex flex-column flex-lg-row align-items-center mt-5 mt-lg-4">
                      <div className="d-flex plannicompany">
                        <div>
                          {(() => {
                            const airline = data.airline_name;

                            return airline === "IndiGo Airlines" ||
                              airline === "IndiGo" ? (
                              <img
                                src={images.IndiGoAirlines_logo}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "Neos" ? (
                              <img
                                src={images.neoslogo}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "SpiceJet" ? (
                              <img
                                src={images.spicejet}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "Air India" ? (
                              <img
                                src={images.airindialogo}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "Akasa Air" ? (
                              <img
                                src={images.akasalogo}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
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
                                  width: "80px",
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
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "AirAsia X" ? (
                              <img
                                src={images.airasiax}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "AirAsia" ? (
                              <img
                                src={images.airasia}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : airline === "Azul" ? (
                              <img
                                src={images.azul}
                                // className="airline_logo"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <IoAirplaneSharp size={40} color="white" />
                            );
                          })()}
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <div className="text-muted">{data.airline_name}</div>
                          <div className="text-muted">{data.airline_code}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mt-3 w-100 justify-content-between justify-content-lg-around">
                        <div className="d-flex flex-column text-center text-md-start">
                          <div className="fw-bold fs-6 fs-lg-4 ">
                            {data.departure_city}
                          </div>
                          <div className="d-flex align-items-center flex-column flex-lg-row">
                            <WiSunrise
                              size={20}
                              color="orange"
                              className="d-none d-lg-block"
                            />
                            <div className="fw-bold">
                              {moment(data.departure_time, "HH:mm:ss").format(
                                "HH:mm"
                              )}
                              ,
                            </div>
                            <div className="fw-bold">
                              {moment(data.departure_date).format("DD MMM'YY")}
                            </div>
                          </div>
                          <div
                            className=""
                            style={{
                              borderBottom: "1px dashed gray",
                              marginTop: "10px",
                              width: "100%",
                            }}
                          />
                          <div className="d-flex flex-column mt-2">
                            <div className="text-muted">
                              {data?.departure_airport_name}
                            </div>
                            {data?.departure_terminal_no && (
                              <div className="text-muted">
                                Terminal - {data?.departure_terminal_no}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="durationdiv">
                          <div>
                            <img
                              src={images.planecompleted}
                              style={{
                                height: "40px",
                                width: "50px",
                                objectFit: "fill",
                              }}
                            />
                          </div>
                          <div className="d-flex w-100 align-items-center">
                            <GoDotFill size={25} color="gray" />
                            <div
                              style={{
                                border: "1px dashed gray",
                                width: "100%",
                              }}
                            />
                            <GoDotFill size={25} color="gray" />
                          </div>

                          <p className="small">
                            {" "}
                            {(() => {
                              const departureDateTime = moment(
                                `${data.departure_date} ${data.departure_time}`,
                                "YYYY-MM-DD HH:mm:ss"
                              );
                              const arrivalDateTime = moment(
                                `${data.arrival_date} ${data.arrival_time}`,
                                "YYYY-MM-DD HH:mm:ss"
                              );

                              const duration = moment.duration(
                                arrivalDateTime.diff(departureDateTime)
                              );
                              const hours = duration.hours();
                              const minutes = duration.minutes();

                              return `${hours}h ${minutes}m`;
                            })()}
                          </p>
                        </div>
                        <div className="d-flex flex-column text-center text-md-start">
                          <div className="fw-bold fs-6 fs-lg-4">
                            {data.arrival_city}
                          </div>
                          <div className="d-flex align-items-center flex-column flex-lg-row">
                            <WiSunrise
                              size={20}
                              color="orange"
                              className="d-none d-lg-block"
                            />
                            <div className="fw-bold">
                              {moment(data.arrival_time, "HH:mm:ss").format(
                                "HH:mm"
                              )}
                              ,
                            </div>
                            <div className="fw-bold">
                              {moment(data.arrival_date).format("DD MMM'YY")}
                            </div>
                          </div>
                          <div
                            className=""
                            style={{
                              borderBottom: "1px dashed gray",
                              marginTop: "10px",
                              width: "100%",
                            }}
                          />
                          <div className="d-flex flex-column mt-2">
                            <div className="text-muted">
                              {data?.arrival_airport_name}
                            </div>
                            {data?.arrival_terminal_no && (
                              <div className="text-muted">
                                Terminal - {data?.arrival_terminal_no}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-lg-3 d-flex align-items-center gap-2">
                        <MdAirplaneTicket size={20} color="#dbb46b" />
                        <div className="fw-bold text-muted">Base Fare</div>
                      </div>
                      <div className="col-lg-3 d-flex align-items-center gap-2">
                        <MdAirplaneTicket size={20} color="#dbb46b" />
                        <div className="text-muted fw-bold">Economy</div>
                      </div>
                      <div className="col-lg-3"></div>
                      <div className="col-lg-3"></div>
                    </div>
                    <div className="d-flex flex-column flex-md-row mt-2 gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <MdLuggage size={20} color="#dbb46b" />
                        <div className="fw-bold text-muted">Check In</div>
                        <div className="text-danger">
                          - Details Not Available
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <MdAirplaneTicket size={20} color="#dbb46b" />
                        <div>Carry On </div>
                        <div className="text-danger">
                          - Details Not Available
                        </div>
                      </div>
                    </div>

                    <div className="passengerDiv my-4">
                      <div className="table-responsive border rounded">
                        <table className="table mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Traveller</th>
                              <th>PNR/E-Ticket Number</th>
                              <th className="text-center">Seat</th>
                              <th className="text-center">Meal</th>
                              <th className="text-center">Excess Baggage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.child?.map((passenger, index) => (
                              <tr key={index}>
                                <td className="fw-semibold">
                                  {passenger.first_name} {passenger.last_name}
                                </td>
                                <td className="text-uppercase fw-semibold">
                                  {data?.get_con === 0 ? (
                                    <>{data2?.pnr ? data2.pnr : "N/A"}</>
                                  ) : (
                                    <>{`N/A`}</>
                                  )}
                                </td>
                                <td className="text-center">-</td>
                                <td className="text-center">-</td>
                                <td className="text-center">-</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* <div className="mt-3">
                      <div className="">
                        <strong className="fs-4 fw-bold">Air India</strong>{" "}
                      </div>
                      <div className="text-muted small">Economy</div>
                    </div> */}
                  </>
                )}
              </div>

              {data?.is_return == 1 && (
                <>
                  <div className={`cardd p-3 shadow-sm mt-3`}>
                    <div className="divviewopen" onClick={toggleview2}>
                      <h4 className="d-flex gap-2">
                        <strong>
                          {data?.return_departure_city} →{" "}
                          {data?.return_arrival_city}
                        </strong>
                      </h4>
                      <div>
                        {viewopen2 ? (
                          <CiCircleChevUp size={25} />
                        ) : (
                          <CiCircleChevDown size={25} />
                        )}
                      </div>
                    </div>
                    {viewopen2 && (
                      <>
                        <div className="d-flex flex-column flex-lg-row align-items-center mt-5 mt-lg-4">
                          <div className="d-flex plannicompany">
                            <div>
                              {(() => {
                                const airline = data.airline_name;

                                return airline === "IndiGo Airlines" ||
                                  airline === "IndiGo" ? (
                                  <img
                                    src={images.IndiGoAirlines_logo}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : airline === "Neos" ? (
                                  <img
                                    src={images.neoslogo}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : airline === "SpiceJet" ? (
                                  <img
                                    src={images.spicejet}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "fill",
                                    }}
                                  />
                                ) : airline === "Air India" ? (
                                  <img
                                    src={images.airindialogo}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : airline === "Akasa Air" ? (
                                  <img
                                    src={images.akasalogo}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
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
                                      width: "80px",
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
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : airline === "AirAsia X" ? (
                                  <img
                                    src={images.airasiax}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : airline === "AirAsia" ? (
                                  <img
                                    src={images.airasia}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : airline === "Azul" ? (
                                  <img
                                    src={images.azul}
                                    // className="airline_logo"
                                    style={{
                                      width: "80px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : (
                                  <IoAirplaneSharp size={40} color="white" />
                                );
                              })()}
                            </div>
                            <div className="d-flex flex-column gap-1">
                              <div className="text-muted">
                                {data.return_airline_name}
                              </div>
                              <div className="text-muted">
                                {data?.return_airline_code === "undefined"
                                  ? "N/A"
                                  : data?.return_airline_code}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center mt-3 w-100 justify-content-between justify-content-lg-around">
                            <div className="d-flex flex-column text-center text-md-start">
                              <div className="fw-bold fs-6 fs-lg-4 ">
                                {data.return_departure_city}
                              </div>
                              <div className="d-flex align-items-center flex-column flex-lg-row">
                                <WiSunrise
                                  size={20}
                                  color="orange"
                                  className="d-none d-lg-block"
                                />
                                <div className="fw-bold">
                                  {moment(
                                    data.return_departure_time,
                                    "HH:mm:ss"
                                  ).format("HH:mm")}
                                  ,
                                </div>
                                <div className="fw-bold">
                                  {moment(data.return_departure_date).format(
                                    "DD MMM'YY"
                                  )}
                                </div>
                              </div>
                              <div
                                className=""
                                style={{
                                  borderBottom: "1px dashed gray",
                                  marginTop: "10px",
                                  width: "100%",
                                }}
                              />
                              <div className="d-flex flex-column mt-2">
                                <div className="text-muted">
                                  {data?.departure_airport_name}
                                </div>
                                {data?.departure_terminal_no && (
                                  <div className="text-muted">
                                    Terminal - {data?.departure_terminal_no}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="durationdiv">
                              <div>
                                <img
                                  src={images.planecompleted}
                                  style={{
                                    height: "40px",
                                    width: "50px",
                                    objectFit: "fill",
                                  }}
                                />
                              </div>
                              <div className="d-flex w-100 align-items-center">
                                <GoDotFill size={25} color="gray" />
                                <div
                                  style={{
                                    border: "1px dashed gray",
                                    width: "100%",
                                  }}
                                />
                                <GoDotFill size={25} color="gray" />
                              </div>

                              <p className="small">
                                {" "}
                                {(() => {
                                  const departureDateTime = moment(
                                    `${data.return_departure_date} ${data.return_departure_time}`,
                                    "YYYY-MM-DD HH:mm:ss"
                                  );
                                  const arrivalDateTime = moment(
                                    `${data.return_arrival_date} ${data.return_arrival_time}`,
                                    "YYYY-MM-DD HH:mm:ss"
                                  );

                                  const duration = moment.duration(
                                    arrivalDateTime.diff(departureDateTime)
                                  );
                                  const hours = duration.hours();
                                  const minutes = duration.minutes();

                                  return `${hours}h ${minutes}m`;
                                })()}
                              </p>
                            </div>
                            <div className="d-flex flex-column text-center text-md-start">
                              <div className="fw-bold fs-6 fs-lg-4">
                                {data.return_arrival_city}
                              </div>
                              <div className="d-flex align-items-center flex-column flex-lg-row">
                                <WiSunrise
                                  size={20}
                                  color="orange"
                                  className="d-none d-lg-block"
                                />
                                <div className="fw-bold">
                                  {moment(
                                    data.return_arrival_time,
                                    "HH:mm:ss"
                                  ).format("HH:mm")}
                                  ,
                                </div>
                                <div className="fw-bold">
                                  {moment(data.return_arrival_date).format(
                                    "DD MMM'YY"
                                  )}
                                </div>
                              </div>
                              <div
                                className=""
                                style={{
                                  borderBottom: "1px dashed gray",
                                  marginTop: "10px",
                                  width: "100%",
                                }}
                              />
                              <div className="d-flex flex-column mt-2">
                                <div className="text-muted">
                                  {data?.arrival_airport_name}
                                </div>
                                {data?.arrival_terminal_no && (
                                  <div className="text-muted">
                                    Terminal - {data?.arrival_terminal_no}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-lg-3 d-flex align-items-center gap-2">
                            <MdAirplaneTicket size={20} color="#dbb46b" />
                            <div className="fw-bold text-muted">Base Fare</div>
                          </div>
                          <div className="col-lg-3 d-flex align-items-center gap-2">
                            <MdAirplaneTicket size={20} color="#dbb46b" />
                            <div className="text-muted fw-bold">Economy</div>
                          </div>
                          <div className="col-lg-3"></div>
                          <div className="col-lg-3"></div>
                        </div>
                        <div className="d-flex flex-column flex-md-row mt-2 gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <MdLuggage size={20} color="#dbb46b" />
                            <div className="fw-bold text-muted">Check In</div>
                            <div className="text-danger">
                              - Details Not Available
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <MdAirplaneTicket size={20} color="#dbb46b" />
                            <div>Carry On </div>
                            <div className="text-danger">
                              - Details Not Available
                            </div>
                          </div>
                        </div>

                        <div className="passengerDiv my-4">
                          <div className="table-responsive border rounded">
                            <table className="table mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Traveller</th>
                                  <th>PNR/E-Ticket Number</th>
                                  <th className="text-center">Seat</th>
                                  <th className="text-center">Meal</th>
                                  <th className="text-center">
                                    Excess Baggage
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data?.child?.map((passenger, index) => (
                                  <tr key={index}>
                                    <td className="fw-semibold">
                                      {passenger.first_name}{" "}
                                      {passenger.last_name}
                                    </td>
                                    <td className="text-uppercase fw-semibold">
                                      {passenger.pnr ? passenger.pnr : "N/A"}
                                    </td>
                                    <td className="text-center">-</td>
                                    <td className="text-center">-</td>
                                    <td className="text-center">-</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* <div className="mt-3">
                      <div className="">
                        <strong className="fs-4 fw-bold">Air India</strong>{" "}
                      </div>
                      <div className="text-muted small">Economy</div>
                    </div> */}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* <hr /> */}
              {/* <div className="cardd p-3 shadow-sm mt-3">
                <h6>
                  <strong className="fs-4 fw-bold">TRAVELLER(S) (2)</strong>
                </h6>
                <div className="mt-3 d-flex align-items-start justify-content-between gap-3">
                  <div className="d-flex align-items-start gap-2 gap-lg-3">
                    <FaUser size={19} color="#dbb46b" />
                    <p className="">
                      <strong>Vishavaben</strong> - 32yrs, Female
                    </p>
                  </div>
                  <p className="small text-muted">Economy</p>
                </div>
                <div className="mt-1 d-flex align-items-start justify-content-between gap-lg-3">
                  <div className="d-flex align-items-start gap-2 gap-lg-3">
                    <FaUser size={19} color="#dbb46b" />
                    <p className="">
                      <strong>Bhavin Dineshbhai Patel</strong> - 31yrs, Male
                    </p>
                  </div>
                  <p className="small text-muted">Economy</p>
                </div>
              </div> */}

              <div className="cardd my-4">
                <div className="info-box p-3 p-md-4 rounded shadow-sm">
                  <h6 className="fw-bold text-uppercase text-warning mb-3">
                    <i className="me-2 border-start border-4 border-warning ps-2">
                      Important Information
                    </i>
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3">
                      <span className="fw-semibold">
                        🟤 Check travel guidelines and baggage information
                        below:
                      </span>
                      <br />
                      Carry no more than 1 check-in baggage and 1 hand baggage
                      per passenger. If violated, airline may levy extra
                      charges.
                    </li>
                    <li className="mb-3">
                      <span className="fw-semibold">
                        🟤 Unaccompanied Minors Travelling:
                      </span>
                      <br />
                      An unaccompanied minor usually refers to a child traveling
                      without an adult aged 18 or older. Please check with the
                      airline for their rules and regulations regarding
                      unaccompanied minors, as these can differ between
                      airlines.
                    </li>
                    <li>
                      <span className="fw-semibold">
                        🟤 Valid ID proof needed:
                      </span>
                      <br />
                      Carry a valid photo identification proof (Driver Licence,
                      Aadhar Card, Pan Card or any other Government recognised
                      photo identification)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="cardd mt-3 shadow-sm p-3">
                <div>
                  <strong className="fs-4 fw-bold">CANCELLATION</strong>
                </div>
                <div>
                  Your Flight has already departed, online cancellation is not
                  allowed
                </div>
              </div>

              {/* <hr /> */}
              <div className="cardd mt-3 shadow-sm p-3">
                <h6>
                  <strong className="fs-4 fw-bold">CONTACT INFORMATION</strong>
                </h6>
                <div>
                  Our Airline or our service experts might connect with you on{" "}
                  below contact details
                </div>
                <div className="mt-4 d-flex align-items-start gap-2">
                  <FaUser size={19} color="gray" />
                  <p className="">
                    <strong>
                      {data?.child[0]?.first_name} {data?.child[0]?.last_name}
                    </strong>
                  </p>
                </div>
                <div className="d-flex align-items-start gap-2">
                  <IoMdMail size={19} color="gray" />
                  <p className="small text-dark">
                    {data?.child[0]?.email ? data?.child[0]?.email : "N/A"}
                  </p>
                </div>
                <div className="d-flex align-items-start gap-2 mt-2">
                  <FaPhoneAlt size={19} color="gray" />
                  <p className="small text-dark">
                    {data?.child[0]?.phone_no
                      ? data?.child[0]?.phone_no
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="col-lg-4 col-md-5 col-12">
              <div className="cardd p-3 shadow-sm mb-3">
                <h6>
                  <strong>Ticket Invoice</strong>
                </h6>
                <button
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={handleDownload}
                >
                  Download Ticket
                </button>
              </div>

              <div className="cardd p-3 shadow-sm mb-3">
                <h6>
                  <strong>PRICING BREAKUP</strong>
                </h6>
                <div className="d-flex justify-content-between">
                  <span>Base Fare</span>
                  <span>₹ {data?.base_fare}</span>
                </div>
                <div className="d-flex justify-content-between text-dark">
                  <span>Service Fee</span>
                  <span>- ₹ {data?.service_fees}</span>
                </div>
                <div className="d-flex justify-content-between text-dark">
                  <span>Texes & Others</span>
                  <span>- ₹ {data?.taxes_and_others}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total cost</strong>
                  <strong className="text-success">
                    ₹ {data?.total_amount}
                  </strong>
                </div>
              </div>

              <div className="cardd p-3 shadow-sm ">
                <div className="d-flex justify-content-between align-items-center ">
                  <div className="fw-bold">Share On</div>
                  <div className="d-flex gap-4">
                    <div className="whatsappiocnn">
                      <IoLogoWhatsapp size={25} color="green" />
                    </div>
                    <div className="whatsappiocnn">
                      <SiGmail size={25} color="gray" />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="cardd p-3 shadow-sm">
                <h6>
                  <strong>Amount Already Paid</strong>
                </h6>
                <div className="d-flex justify-content-between">
                  <span>ICICIUPIINTENT</span>
                  <span>₹ 3280</span>
                </div>
                <button className="btn btn-outline-primary btn-sm mt-2">
                  Download Invoice
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewBooking;
