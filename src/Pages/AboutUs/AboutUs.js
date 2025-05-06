import React, { useEffect } from "react";
import "./Aboutus.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import HappyClients from "../../Components/HappyClients/HappyClients";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import { Helmet } from "react-helmet";

const AboutUs = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About | Airline Booking</title>
      </Helmet>
      <PathHero name={"About Us"} />

      <section className="container videosection">
        <div className="row align-items-center justify-content-center pt-4 gap-3">
          <div className="col-lg-8 col-12 text-center">
            <h1 className="fw-bolder">
              Where Your Journey Begins with Quality and Reliability
            </h1>
          </div>
          <div className="col-lg-8 col-12 text-center">
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae non
              molestias tempora, debitis distinctio id nemo praesentium fuga
              quas eveniet harum esse nisi quasi sed saepe unde doloribus
              reiciendis placeat eaque laboriosam vel quidem sunt! Minus
              laudantium earum explicabo quibusdam,
            </p>
          </div>
        </div>

        <div className="row px-3 pb-4">
          <div className="videodiv">
            <iframe
              width="100%"
              height="500px"
              src="https://www.youtube.com/embed/HN6PDeBejIc?si=xnTYb6gO05TgSrLc"
              title="YouTube video player"
              frameborder="1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="videodiv"
            ></iframe>
          </div>
        </div>
      </section>

      <HappyClients />
    </>
  );
};

export default AboutUs;
