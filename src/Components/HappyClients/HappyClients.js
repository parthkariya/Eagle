import React from "react";
import "./HappyClients.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { ImHappy } from "react-icons/im";
import { FaUsers } from "react-icons/fa";

const HappyClients = () => {
  return (
    <div className="container-fluid Hpyclients">
      <div className="container hpyclientscont">
        <div className="row mb-5 pb-4">
          <div className="col-12 aboutustitle">Our Achievement</div>
        </div>
        <div className="row row-gap-4 gap-lg-0 align-items-center justify-content-center">
          <div className="col-md-6 col-lg-3 d-flex gap-4 gap-lg-3">
            <div className="iconcont">
              <FaCheckCircle size={40} color="#ff4500" />
            </div>
            <div className="d-flex flex-column">
              <h1 className="fw-bolder hpyclienttotal">120K</h1>
              <h4 className="fs-5">Booking Done</h4>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex gap-4 gap-lg-3">
            <div className="iconcont">
              <FaEarthAmericas size={40} color="#ff4500" />
            </div>
            <div className="d-flex flex-column">
              <h1 className="fw-bolder hpyclienttotal">200+</h1>
              <h4 className="fs-5">Our Destination</h4>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex gap-4 gap-lg-3">
            <div className="iconcont">
              <ImHappy size={40} color="#ff4500" />
            </div>
            <div className="d-flex flex-column">
              <h1 className="fw-bolder hpyclienttotal">40K</h1>
              <h4 className="fs-5">Happy Clients</h4>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex gap-4 gap-lg-3">
            <div className="iconcont">
              <FaUsers size={40} color="#ff4500" />
            </div>
            <div className="d-flex flex-column">
              <h1 className="fw-bolder hpyclienttotal">180+</h1>
              <h4 className="fs-5">Our Partners</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HappyClients;
