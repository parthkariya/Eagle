import React, { useState, useMemo } from "react";
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
import { useLocation } from "react-router-dom";

Modal.setAppElement("#root");

function HotelBookingDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const location = useLocation();
  const [hotelData, setHotelData] = useState(location.state?.hotelData);

  console.log("Hotel Data:", hotelData);
  console.log("Hotel Images:", hotelData?.images);

  // Group images by caption dynamically
  const groupedImages = useMemo(() => {
    if (!hotelData?.images || !Array.isArray(hotelData.images)) {
      console.log("No images found in hotelData");
      return {};
    }

    const groups = {};

    hotelData.images.forEach((image, idx) => {
      console.log(`Image ${idx}:`, image);
      const caption = image.caption || "Other";
      if (!groups[caption]) {
        groups[caption] = [];
      }
      groups[caption].push(image);
    });

    console.log("Grouped Images:", groups);
    return groups;
  }, [hotelData?.images]);

  // Get all categories with counts
  const categories = useMemo(() => {
    const cats = Object.keys(groupedImages).map((key) => ({
      key: key.toLowerCase().replace(/\s+/g, ""),
      label: key,
      count: groupedImages[key].length,
    }));
    console.log("Categories:", cats);
    return cats;
  }, [groupedImages]);

  // Get the best quality image URL
  const getImageUrl = (links) => {
    console.log("links", links);

    if (!links || links.length === 0) {
      console.log("No links found");
      return "";
    }
    const xxl = links.find((link) => link.size === "Xxl");
    const xl = links.find((link) => link.size === "Xl");
    const standard = links.find((link) => link.size === "Standard");
    const url = xxl?.url || xl?.url || standard?.url || links[0]?.url || "";
    console.log("url", url);

    return url;
  };

  // Get images for modal based on active tab
  const getImagesByTab = () => {
    if (activeTab === "all") {
      return hotelData?.images || [];
    }

    // Find the category by matching the key
    const categoryLabel = Object.keys(groupedImages).find(
      (label) => label.toLowerCase().replace(/\s+/g, "") === activeTab
    );

    if (categoryLabel) {
      console.log(
        `Getting images for category: ${categoryLabel}`,
        groupedImages[categoryLabel]
      );
      return groupedImages[categoryLabel] || [];
    }

    return [];
  };

  // Get grid display images (first 5 categories)

  const getGridDisplayData = () => {
    const displayCategories = categories.slice(0, 5);
    console.log("displayCategories", displayCategories);

    return displayCategories.map((cat) => ({
      ...cat,
      image: groupedImages[cat.label][0],
    }));
  };

  const openModal = (tab = "all") => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const totalImages = hotelData?.images?.length || 0;
  const gridData = getGridDisplayData();

  console.log("Grid Data:", gridData);
  console.log("Total Images:", totalImages);

  return (
    <div className="hotel-container">
      <div className="hotel-header">
        <div className="hotel-info">
          <h1 className="hotel-name-details">
            {hotelData?.name}
            <span className="rating-stars">
              {[...Array(5)].map((_, index) => (
                <span key={index} style={{ fontSize: "20px" }}>
                  {index < Number(hotelData?.starRating) ? "★" : "☆"}
                </span>
              ))}
            </span>
          </h1>
          <p className="hotel-address">{hotelData?.contact?.address?.line1}</p>
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

      {/* Dynamic Gallery Grid */}
      {gridData.length > 0 ? (
        <div className="gallery-grid">
          {/* Main Image */}
          <div
            className="gallery-item main-image"
            onClick={() => openModal("all")}
          >
            <img
              src={getImageUrl(gridData[0]?.image?.links)}
              alt={gridData[0]?.label}
            />
            <div className="photo-count">All photos ({totalImages})</div>
          </div>

          {/* Other Category Images */}
          {gridData.slice(1, 5).map((item, index) => (
            <div
              key={item.key}
              className="gallery-item"
              onClick={() => openModal(item.key)}
            >
              <img src={getImageUrl(item.image?.links)} alt={item.label} />
              <div className="photo-label">
                {item.label} ({item.count})
              </div>
              {index === 3 && (
                <button
                  className="view-all-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal("all");
                  }}
                >
                  View all photos
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>No images available</p>
        </div>
      )}

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
                All ({totalImages})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`tab-btn ${activeTab === cat.key ? "active" : ""}`}
                  onClick={() => setActiveTab(cat.key)}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
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
                <img
                  src={getImageUrl(image.links)}
                  alt={`${image.caption} ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HotelBookingDetails;
