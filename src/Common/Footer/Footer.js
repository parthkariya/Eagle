import React from "react";
import "./Footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMailBulk } from "react-icons/fa";
import images from "../../Constants/images";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="container-fluid footermain">
        <div className="container-md container-fluid py-5">
          <div className="row align-items-center gap-4 gap-lg-0">
            <div className="col-lg-6">
              <div className="row align-items-center gap-2 ">
                <div className="col-lg-1">
                  <FaMailBulk size={50} color="#192024" />
                </div>
                <div className="col-lg-10">
                  <div className="row flex-column">
                    <div className="newletterhead">
                      Your Travel Journey Starts Here
                    </div>
                    <div className="newsletterpara">
                      Sign up and we`'ll send the best deals to you
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row justify-content-center justify-content-sm-start align-items-center ">
                <div className="col-12 col-sm-7 col-md-7">
                  <input className="newsletterinpt" placeholder="Your Email" />
                </div>
                <div className="col-4 col-lg-3 mt-3 mt-sm-0 d-flex justify-content-center">
                  <button className="subsbtn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid container-md whitefooter">
        <div className="row align-items-center mt-5 gap-4 gap-md-0">
          <div className="col-md-4 d-flex justify-content-md-center align-self-start ">
            <Link to={"/"}>
              <img src={images.logo} className="footerlogo" />
            </Link>
          </div>
          <div className="col-sm-4 flex-column justify-content-center">
            <div className="linkstitle ">Useful Links</div>
            <div className="row gap-3 mt-3">
              <Link to={"/"} className="linkkk">
                Home
              </Link>
              <Link to={"/about"} className="linkkk">
                About Us
              </Link>
              <Link to={"/contactus"} className="linkkk">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="col-sm-4 flex-column justify-content-center">
            <div className="linkstitle ">Support</div>
            <div className="row gap-3 mt-3">
              <Link to={"/"} className="linkkk">
                Legal Notice
              </Link>
              <Link to={"/"} className="linkkk">
                Privacy Policy
              </Link>
              <Link to={"/"} className="linkkk">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
        <div className="row mt-3 copyrightrow">
          <div className="col text-center">
            <p className="copyright">
              <span>&copy;</span>
              2025 By EAGLECONNECT All Rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
