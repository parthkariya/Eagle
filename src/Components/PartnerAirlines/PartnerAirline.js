import React from "react";
import "./PartnerAirline.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Marquee from "react-fast-marquee";
import images from "../../Constants/images";

const PartnerAirline = () => {
  return (
    <div className="container-fluid m-0 p-0 parallex">
      <div className="container">
        <div className="row headingrowpa">
          <div className="col-12 d-flex justify-content-center">
            <h1 className="paheading">Partner Airlines</h1>
          </div>
        </div>
        <div className="row my-5">
          <div>
            <Marquee>
              <div className="marquee-container">
                <img src={images.one} alt="" className="airlineimages" />
                <img src={images.two} alt="" className="airlineimages" />
                <img src={images.three} alt="" className="airlineimages" />
                <img src={images.four} alt="" className="airlineimages" />
                <img src={images.five} alt="" className="airlineimages" />
                <img src={images.six} alt="" className="airlineimages" />
                <img src={images.seven} alt="" className="airlineimages" />
                <img src={images.eight} alt="" className="airlineimages" />
                <img src={images.nine} alt="" className="airlineimages" />
                <img src={images.ten} alt="" className="airlineimages" />
                <img src={images.eleven} alt="" className="airlineimages" />
                <img src={images.twelve} alt="" className="airlineimages" />
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerAirline;
