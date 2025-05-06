import React from "react";
import "./PathHero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";

const PathHero = ({ name }) => {
  return (
    <section className="container-fluid about_main mb-5">
      <div className="container">
        <div className="row banner-area mb-5">
          <div className="col-12 col-md-4">
            <img src={images.bags} alt="" className="left-imge" />
          </div>
          <div className="col-12 col-md-3">
            <div className="content-box">
              <h1 className="fw-bolder">{name}</h1>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <img src={images.Plane} alt="" className="right-imge" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathHero;
