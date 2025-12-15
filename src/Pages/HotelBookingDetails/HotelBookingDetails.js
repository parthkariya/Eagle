import React, { useState } from "react";
import Modal from "react-modal";
import {
  FaRunning,
  FaWifi,
  FaSnowflake,
  FaBroom,
  FaSwimmingPool,
  FaUtensils,
  FaBed,
  FaCar,
  FaConciergeBell,
  FaSmokingBan,
  FaDog,
  FaCreditCard,
  FaCalendarAlt,
  FaChild,
  FaUser,
} from "react-icons/fa";
import { MdDashboard, MdAccessTime, MdEventNote } from "react-icons/md";
import { GiLion, GiForest, GiPartyPopper } from "react-icons/gi";
import { BsBuildingFill, BsClockHistory } from "react-icons/bs";
import "./HotelBookingDetails.css";
import RoomTypes from "../../Components/RoomType/RoomTypes";

Modal.setAppElement("#root");

const hotelImages = {
  all: [
    {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      category: "Facilities",
    },
    {
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      category: "Dining",
    },
    {
      url: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800&h=600&fit=crop",
      category: "Property views",
    },
    {
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      category: "Nearby attraction",
    },
  ],
  rooms: [
    {
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
      category: "Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      category: "Rooms",
    },
  ],
  facilities: [
    {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      category: "Facilities",
    },
  ],
  dining: [
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      category: "Dining",
    },
  ],
  propertyViews: [
    {
      url: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800&h=600&fit=crop",
      category: "Property views",
    },
  ],
  nearbyAttraction: [
    {
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      category: "Nearby attraction",
    },
  ],
};

function HotelBookingDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getImagesByTab = () => {
    switch (activeTab) {
      case "all":
        return hotelImages.all;
      case "rooms":
        return hotelImages.rooms;
      case "facilities":
        return hotelImages.facilities;
      case "dining":
        return hotelImages.dining;
      case "propertyViews":
        return hotelImages.propertyViews;
      case "nearbyAttraction":
        return hotelImages.nearbyAttraction;
      default:
        return hotelImages.all;
    }
  };

  return (
    <div className="hotel-container">
      <div className="hotel-header">
        <div className="hotel-info">
          <h1 className="hotel-name-details">
            Woods at Sasan
            <span className="rating-stars">★★★★★</span>
          </h1>
          <p className="hotel-address">Sasan Talala Road, Sasan Gir 362 135</p>
          <div className="review-badge">
            <span className="score">8.7</span>
            <span className="review-text">Very good</span>
            <span className="review-count">97 reviews</span>
          </div>
        </div>
        <div className="hotel-pricing">
          <div className="price">₹ 23,890</div>
          <div className="price-detail">Nightly including VAT</div>
          <div className="action-buttons">
            <button className="btn-primary">Confirm Deal</button>
          </div>
        </div>
      </div>

      <div className="gallery-grid">
        <div className="gallery-item main-image" onClick={openModal}>
          <img
            src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop"
            alt="Main bedroom view"
          />
          <div className="photo-count">All photos (51)</div>
        </div>

        <div className="gallery-item" onClick={openModal}>
          <img
            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop"
            alt="Other view"
          />
          <div className="photo-label">Rooms (8)</div>
        </div>

        <div className="gallery-item" onClick={openModal}>
          <img
            src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop"
            alt="Bathroom"
          />
          <div className="photo-label">Property views (26)</div>
        </div>

        <div className="gallery-item" onClick={openModal}>
          <img
            src="https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=400&h=300&fit=crop"
            alt="Outdoor view"
          />
          <div className="photo-label">Facilities (11)</div>
        </div>

        <div className="gallery-item" onClick={openModal}>
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop"
            alt="Bedroom"
          />
          <div className="photo-label">Dining (4)</div>
          <button className="view-all-btn" onClick={openModal}>
            View all photos
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h2 className="section-title">About us</h2>
        <p className="about-text">
          Get your trip off to a great start with a stay at this property, which
          offers free Wi-Fi in all rooms. Conveniently situated in the Sasan Gir
          part of Sasan Gir, this property puts you close to attractions and
          interesting dining options. Don't leave before paying a visit to the
          famous Gir National Park. Rated with 5 stars, this high-quality
          property provides guests with access to massage, restaurant and
          fitness center on-site.
        </p>
      </div>

      {/* Highlights Section */}
      <div className="highlights-section">
        <h2 className="section-title">Highlights</h2>
        <div className="highlights-grid">
          <div className="highlight-item">
            <FaRunning className="highlight-icon" />
            <span className="highlight-text">Great for activities</span>
          </div>
          <div className="highlight-item">
            <MdDashboard className="highlight-icon" />
            <span className="highlight-text">Front desk [24-hour]</span>
          </div>
          <div className="highlight-item">
            <FaWifi className="highlight-icon" />
            <span className="highlight-text">Free Wi-Fi in all rooms</span>
          </div>
          <div className="highlight-item">
            <FaSnowflake className="highlight-icon" />
            <span className="highlight-text">Air conditioning</span>
          </div>
          <div className="highlight-item">
            <FaBroom className="highlight-icon" />
            <span className="highlight-text">Daily housekeeping</span>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="facilities-section">
        <h2 className="section-title">Facilities</h2>
        <div className="facilities-grid">
          <div className="facility-item">
            <FaSwimmingPool className="facility-icon" />
            <span>Swimming pool</span>
          </div>
          <div className="facility-item">
            <FaWifi className="facility-icon" />
            <span>Free Wi-Fi</span>
          </div>
          <div className="facility-item">
            <FaUtensils className="facility-icon" />
            <span>Restaurants</span>
          </div>
          <div className="facility-item">
            <FaConciergeBell className="facility-icon" />
            <span>Room service</span>
          </div>
          <div className="facility-item">
            <MdDashboard className="facility-icon" />
            <span>Front desk [24-hour]</span>
          </div>
          <div className="facility-item">
            <FaCar className="facility-icon" />
            <span>Shuttle service</span>
          </div>
          <div className="facility-item">
            <FaCar className="facility-icon" />
            <span>Car park</span>
          </div>
          <div className="facility-item">
            <FaBroom className="facility-icon" />
            <span>Daily housekeeping</span>
          </div>
        </div>
      </div>

      {/* Closest Landmarks Section */}
      <div className="landmarks-section">
        <h2 className="section-title">Closest landmarks</h2>
        <div className="landmarks-list">
          <div className="landmark-item">
            <GiLion className="landmark-icon" />
            <span className="landmark-name">Devalia Safari Park</span>
            <span className="landmark-distance">2.2 km</span>
          </div>
          <div className="landmark-item">
            <BsBuildingFill className="landmark-icon" />
            <span className="landmark-name">
              Devaliya Park Interpretation Zone
            </span>
            <span className="landmark-distance">6.6 km</span>
          </div>
          <div className="landmark-item">
            <GiForest className="landmark-icon" />
            <span className="landmark-name">GIR Safari</span>
            <span className="landmark-distance">7.4 km</span>
          </div>
        </div>
      </div>

      {/* Property Rules Section */}
      <div className="property-rules-section">
        <h2 className="section-title">Property Rules</h2>
        <div className="rules-grid">
          <div className="rule-category">
            <h3 className="rule-category-title">Check-in / Check-out</h3>
            <div className="rule-item">
              <MdAccessTime className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Check-in from</span>
                <span className="rule-value">12:00 PM</span>
              </div>
            </div>
            <div className="rule-item">
              <BsClockHistory className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Check-out until</span>
                <span className="rule-value">10:00 AM</span>
              </div>
            </div>
          </div>

          <div className="rule-category">
            <h3 className="rule-category-title">General Policies</h3>
            <div className="rule-item">
              <FaSmokingBan className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Smoking</span>
                <span className="rule-value">Not allowed</span>
              </div>
            </div>
            <div className="rule-item">
              <FaDog className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Pets</span>
                <span className="rule-value">Not allowed</span>
              </div>
            </div>
            <div className="rule-item">
              <GiPartyPopper className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Parties/events</span>
                <span className="rule-value">Not allowed</span>
              </div>
            </div>
          </div>

          <div className="rule-category">
            <h3 className="rule-category-title">Age Requirements</h3>
            <div className="rule-item">
              <FaUser className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Minimum check-in age</span>
                <span className="rule-value">18 years</span>
              </div>
            </div>
            <div className="rule-item">
              <FaChild className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Children allowed</span>
                <span className="rule-value">Yes, all ages welcome</span>
              </div>
            </div>
          </div>

          <div className="rule-category">
            <h3 className="rule-category-title">Payment & Cancellation</h3>
            <div className="rule-item">
              <FaCreditCard className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Payment options</span>
                <span className="rule-value">Cash, Credit/Debit cards</span>
              </div>
            </div>
            <div className="rule-item">
              <FaCalendarAlt className="rule-icon" />
              <div className="rule-content">
                <span className="rule-label">Cancellation policy</span>
                <span className="rule-value">
                  Free cancellation up to 24 hours before check-in
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoomTypes />

      {/* React Modal Bottom Sheet */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={300}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: "flex",
            alignItems: "flex-end",
          },
          content: {
            position: "relative",
            inset: "auto",
            border: "none",
            background: "white",
            overflow: "visible",
            borderRadius: "16px 16px 0 0",
            padding: 0,
            width: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All (51)
              </button>
              <button
                className={`tab-btn ${activeTab === "rooms" ? "active" : ""}`}
                onClick={() => setActiveTab("rooms")}
              >
                Rooms (8)
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "propertyViews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("propertyViews")}
              >
                Property views (26)
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "facilities" ? "active" : ""
                }`}
                onClick={() => setActiveTab("facilities")}
              >
                Facilities (11)
              </button>
              <button
                className={`tab-btn ${activeTab === "dining" ? "active" : ""}`}
                onClick={() => setActiveTab("dining")}
              >
                Dining (4)
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "nearbyAttraction" ? "active" : ""
                }`}
                onClick={() => setActiveTab("nearbyAttraction")}
              >
                Nearby attraction (2)
              </button>
            </div>
          </h2>
          <button className="close-btn" onClick={closeModal}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="image-grid">
            {getImagesByTab().map((image, index) => (
              <div key={index} className="image-grid-item">
                <img src={image.url} alt={`${image.category} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HotelBookingDetails;
