import React from "react";
import "./PathHero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import { Link, useLocation } from "react-router-dom";



const PathHero = ({ name }) => {

  const location = useLocation();

  const path = location.pathname.split("/")[1];
  const breadcrumbLabel = path.charAt(0).toUpperCase() + path.slice(1);


  return (
    <section className="container-fluid about_main mb-5">
      <div className="bg_color">
        <div className="container">
          <div className="row banner-area mb-5">
            <div className="col-12 col-md-4">
              {/* <img src={images.bags} alt="" className="left-imge" /> */}
            </div>
            <div className="col-12 col-md-4">
              <div className="content-box content-box2">
                <h1 style={{ color: "#fff" }} className="fw-bolder">{name}</h1>
                <div className="content-box_inner_flex">
                  <Link to={breadcrumbLabel === "ViewBooking" ? "/dashboard" : "/"} className="header_link">{breadcrumbLabel === "ViewBooking" ? "Dashboard" : "Home"}</Link>
                  {path && (
                    <Link to={`/${path}`} className="header_link_current">
                      <span className="header_link"> /</span> {breadcrumbLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              {/* <img src={images.Plane} alt="" className="right-imge" /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathHero;
