import React, { useEffect, useState } from "react";
import "./ContactUs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaPhone } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { Helmet } from "react-helmet";
import emailjs from "emailjs-com";
import Notification from "../../Utils/Notification";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [num, setNumber] = useState("");
  const [sub, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // This function is called when the form is submitted
  const sendEmail = (e) => {
    e.preventDefault();

    // Replace with your actual EmailJS IDs
    const serviceID = "service_4q2p2pn";
    const templateID = "template_370cxml";
    const userID = "gnjfWov2IlvSitA6p"; // sometimes called "userID"

    // The object keys below (e.g., "from_name", "from_email", etc.)
    // should match the placeholders in your EmailJS template
    const templateParams = {
      name: name,
      email: email,
      phone: num,
      subject: sub,
      message: message,
    };

    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        // Optionally clear the form
        setName("");
        setEmail("");
        setNumber("");
        setSubject("");
        setMessage("");
        // Or show a success message to the user
        Notification("success", "Success", "Form Submitted Successfully");
      })
      .catch((err) => {
        console.error("FAILED...", err);
        // Optionally show an error message to the user
      });
  };

  return (
    <>
      <Helmet>
        <title>Contact | Airline Booking</title>
      </Helmet>

      <PathHero name={"Contact Us"} />
      {/* <section className="container shadow formcont p-4">
        <div className="row align-items-center justify-content-center z-3">
          <div className="col-12 col-lg-8 text-center mb-3">
            <p className="fw-bold fs-4">
              Please Fill Out This Form and We Will Reach You Out{" "}
            </p>
          </div>
        </div>
        <div className="row align-items-center justify-content-center gap-3 gap-lg-2 mb-3">
          <div className="col-lg-5">
            <input
              type="text"
              value={name}
              placeholder="Name"
              className="inputdtails w-100 text-start p-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-lg-5">
            <input
              type="text"
              value={email}
              placeholder="Email"
              className="inputdtails w-100 text-start p-3"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
        </div>
        <div className="row align-items-center justify-content-center gap-3 gap-lg-2 mb-3">
          <div className="col-lg-5">
            <input
              type="text"
              value={num}
              placeholder="Mobile Number"
              className="inputdtails w-100 text-start p-3"
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="col-lg-5">
            <input
              type="text"
              value={sub}
              placeholder="Subject"
              className="inputdtails w-100 text-start p-3"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
        <div className="row align-items-center justify-content-center gap-2 mb-3">
          <div className="col-12 col-lg-10">
            <textarea
              value={message}
              rows={7}
              type="text"
              placeholder="Message"
              className="inputdtails w-100 text-start p-3"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-5"></div>
          <div className="col-lg-5 d-flex justify-content-end">
            <div className="sendbtndiv">
              <div className="divvv">Send Message</div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="container shadow formcont p-4">
        <form onSubmit={sendEmail}>
          <div className="row align-items-center justify-content-center z-3">
            <div className="col-12 col-lg-8 text-center mb-3">
              <p className="fw-bold fs-4" style={{ color: "#ffa500" }}>
                Please Fill Out This Form and We Will Reach You Out
              </p>
            </div>
          </div>

          <div className="row align-items-center justify-content-center gap-3 gap-lg-2 mb-3">
            <div className="col-lg-5">
              <input
                type="text"
                value={name}
                placeholder="Name"
                className="inputdtails w-100 text-start p-3"
                onChange={(e) => setName(e.target.value)}
                name="from_name" // Not mandatory, but can help with clarity
                required
              />
            </div>
            <div className="col-lg-5">
              <input
                type="email"
                value={email}
                placeholder="Email"
                className="inputdtails w-100 text-start p-3"
                onChange={(e) => setEmail(e.target.value)}
                name="from_email"
                required
              />
            </div>
          </div>

          <div className="row align-items-center justify-content-center gap-3 gap-lg-2 mb-3">
            <div className="col-lg-5">
              <input
                type="text"
                value={num}
                placeholder="Mobile Number"
                className="inputdtails w-100 text-start p-3"
                onChange={(e) => setNumber(e.target.value)}
                name="phone"
              />
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                value={sub}
                placeholder="Subject"
                className="inputdtails w-100 text-start p-3"
                onChange={(e) => setSubject(e.target.value)}
                name="subject"
                required
              />
            </div>
          </div>

          <div className="row align-items-center justify-content-center gap-2 mb-3">
            <div className="col-12 col-lg-10">
              <textarea
                value={message}
                rows={7}
                placeholder="Message"
                className="inputdtails w-100 text-start p-3"
                onChange={(e) => setMessage(e.target.value)}
                name="message"
                required
              />
            </div>
          </div>

          <div className="row align-items-center justify-content-center">
            <div className="col-lg-5"></div>
            <div className="col-lg-5 d-flex justify-content-end">
              {/* This button triggers form submission */}
              <button type="submit" className="sendbtndiv">
                <div className="sendbtndiv">Submit</div>
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="container shadow mapcont mt-4">
        <div className="row justify-content-between align-items-center resp_contact_map">
          <div className="col-12 col-lg-6 ">
            <div className="row align-items-center justify-content-center">
              <div className="col-3 d-flex justify-content-center">
                <div className="rounded-circle roundgod">
                  <HiBuildingOffice2 size={30} color="#fff" />
                </div>
              </div>
              <div className="col-7 d-flex flex-column">
                <div className="fs-5 fw-semibold">Address</div>
                <div className="fs-6 fw-normal">
                  <p>
                    Shop 4, Dalwani Building, Subhash Road, next to Hotel
                    Everland, Moti Tanki Chowk, Sadar, Rajkot, Gujarat 360001
                  </p>
                </div>
              </div>
            </div>
            <div className="row my-4 align-items-center justify-content-center">
              <div className="col-3 d-flex justify-content-center">
                <div className="rounded-circle roundgod">
                  <FaPhone size={25} color="#fff" />
                </div>
              </div>
              <div className="col-7 d-flex flex-column">
                <div className="fs-5 fw-semibold">Phone Number</div>
                <div className="fs-6 fw-normal">
                  <p>98795 99994</p>
                </div>
              </div>
            </div>
            <div className="row align-items-center justify-content-center">
              <div className="col-3 d-flex justify-content-center">
                <div className="rounded-circle roundgod">
                  <SiGmail size={25} color="#fff" />
                </div>
              </div>
              <div className="col-7 d-flex flex-column">
                <div className="fs-5 fw-semibold">Email</div>
                <div className="fs-6 fw-normal">
                  <p>
                    Shop 4, Dalwani Building, Subhash Road, next to Hotel
                    Everland, Moti Tanki Chowk, Sadar, Rajkot, Gujarat 360001
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1023.277981468753!2d70.7955504507843!3d22.296980120048232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca1c0eebd313%3A0x15fe516307641f4e!2sEagle%20Connect%20Novex!5e0!3m2!1sen!2sin!4v1739770878788!5m2!1sen!2sin"
              width="100%"
              className="mapview"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
