import React from "react";
import "./WhyChooseUs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaThumbsUp } from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri";
import images from "../../Constants/images";

const WhyChooseUs = () => {
  return (
    <div className="container-fluid whychoosmain my-lg-5 my-0 py-5" style={{marginTop:"0px !important"}}>
      <div className="innnerdiv pb-4">
        <h1>Why Choose Us</h1>
      </div>
      <div className="d-flex text-center justify-content-center pb-5">
        <p className="col-lg-8 whychoseuppara">
          Choose us for your flight booking needs and enjoy unbeatable prices, a
          wide selection of flights, and a hassle-free booking experience. With
          secure payment options and 24/7 customer support, we ensure that your
          journey begins smoothly. Plus, our exclusive offers and flexible
          travel options give you the peace of mind to travel with confidence.
          Trusted by thousands of satisfied customers.
        </p>
      </div>
      <div className="container">
        <div className="row ok align-items-center gap-4 gap-md-0">
          <div
            className="col-md-4 col-lg-3 p-4 carddiv"
            style={{
              backgroundImage: `url(${images.window})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              position: "relative",
              color: "white",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 50% transparency
                zIndex: 1,
              }}
            ></div>

            {/* Content */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div className="icondiv">
                <FaThumbsUp size={30} />
              </div>
              <div className="hdingdiv">Best Price Guarantee</div>
              <div className="txtdiv">
                Enjoy the confidence of booking with our Best Price Guarantee,
                ensuring you get the lowest fares every time. If you find a
                better price elsewhere, we’ll match it!
              </div>
            </div>
          </div>

          <div
            className="col-md-4 col-lg-3 p-3 carddiv"
            style={{
              backgroundImage: `url(${images.window})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              position: "relative",
              color: "white",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 50% transparency
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div className="icondiv">
                <IoTicketSharp size={30} />
              </div>
              <div className="hdingdiv">Easy & Quick Booking</div>
              <div className="txtdiv">
                Experience hassle-free travel planning with our easy and quick
                booking process. Get your tickets in just a few clicks and focus
                on enjoying your journey!
              </div>
            </div>
          </div>
          <div
            className="col-md-4 col-lg-3 p-3 carddiv"
            style={{
              backgroundImage: `url(${images.window})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              position: "relative",
              color: "white",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 50% transparency
                zIndex: 1,
              }}
            ></div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div className="icondiv">
                <RiCustomerService2Fill size={30} />
              </div>
              <div className="hdingdiv">Customer Care 24/7</div>
              <div className="txtdiv">
                Our 24/7 Customer Care ensures you're never alone on your
                journey. From booking to arrival, we're here to assist with all
                your needs, day or night.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
