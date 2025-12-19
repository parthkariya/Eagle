import React, { useState, useMemo, useEffect } from "react";
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
  FaNewspaper,
} from "react-icons/fa";
import { MdDashboard, MdAccessTime, MdEventNote } from "react-icons/md";
import { GiLion, GiForest, GiPartyPopper, GiElevator } from "react-icons/gi";
import { BsBuildingFill, BsClockHistory } from "react-icons/bs";
import "./HotelBookingDetails.css";
import RoomTypes from "../../Components/RoomType/RoomTypes";
import { useLocation } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa6";
import { useHotelContext } from "../../Context/Hotel_context";

Modal.setAppElement("#root");

function HotelBookingDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const location = useLocation();
  const [hotelData, setHotelData] = useState(location.state?.hotelData);
  console.log("Hotel Data:", hotelData);

  const hotelId = hotelData?.id;

  const { GetRoomsAndRates, rooms_rate_loading } = useHotelContext();

  useEffect(() => {
    window.scroll(0, 0);
    const traceId = localStorage.getItem("hotelTraceID");
    if (!traceId || !hotelId) {
      console.warn("traceId or hotelId missing");
      return;
    }
    const params = {
      traceId,
      hotelId,
    };

    // console.log("pppp", params);

    GetRoomsAndRates(params);
  }, []);

  const groupedImages = useMemo(() => {
    if (!hotelData?.images) return {};

    const groups = {};

    hotelData.images
      .filter(
        (image) =>
          Array.isArray(image.links) &&
          image.links.some((link) => link.size === "Xl")
      )
      .forEach((image) => {
        const groupKey =
          image.caption?.trim() || image.category?.trim() || "Other";

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }

        groups[groupKey].push(image);
      });

    return groups;
  }, [hotelData?.images]);

  // Get all categories with counts
  const categories = useMemo(() => {
    const cats = Object.keys(groupedImages).map((key) => ({
      key: key.toLowerCase().replace(/\s+/g, ""),
      label: key,
      count: groupedImages[key].length,
    }));
    return cats;
  }, [groupedImages]);

  const getImageUrl = (links) => {
    if (!links || links.length === 0) return "";
    // const xxl = links.find((link) => link.size === "Xxl");
    const xl = links.find((link) => link.size === "Xl");
    return xl?.url || links[0]?.url || "";
  };

  // const getImageUrl = (links) => {
  //   if (!links || !Array.isArray(links)) {
  //     return "";
  //   }
  //   const xl = links.find((link) => link.size === "Xl");
  //   return xl ? xl.url : "";
  // };

  // Get images for modal based on active tab
  const getImagesByTab = () => {
    if (activeTab === "all") {
      return hotelData?.images || [];
    }

    const category = categories.find((cat) => cat.key === activeTab);
    if (category) {
      return groupedImages[category.label] || [];
    }

    return [];
  };

  // Get grid display images (first 5 categories)
  const getGridDisplayData = () => {
    const displayCategories = categories.slice(0, 5);
    return displayCategories.map((cat) => ({
      ...cat,
      image: groupedImages[cat.label][0],
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const totalImages = hotelData?.images?.length || 0;
  const gridData = getGridDisplayData();

  const getFacilityIcon = (facilityName) => {
    const name = facilityName.toLowerCase();

    // Map facility names to icons
    if (name.includes("wi-fi") || name.includes("wifi")) {
      return <FaWifi className="facility-icon" />;
    } else if (
      name.includes("restaurant") ||
      name.includes("café") ||
      name.includes("cafe")
    ) {
      return <FaUtensils className="facility-icon" />;
    } else if (
      name.includes("reception") ||
      name.includes("front desk") ||
      name.includes("concierge")
    ) {
      return <FaConciergeBell className="facility-icon" />;
    } else if (name.includes("shuttle") || name.includes("airport")) {
      return <FaCar className="facility-icon" />;
    } else if (name.includes("car park") || name.includes("parking")) {
      return <FaCar className="facility-icon" />;
    } else if (
      name.includes("laundry") ||
      name.includes("housekeeping") ||
      name.includes("dryer")
    ) {
      return <FaBroom className="facility-icon" />;
    } else if (name.includes("pool") || name.includes("swimming")) {
      return <FaSwimmingPool className="facility-icon" />;
    } else if (name.includes("conference") || name.includes("meeting")) {
      return <MdDashboard className="facility-icon" />;
    } else if (name.includes("newspapers")) {
      return <FaRegNewspaper className="facility-icon" />;
    } else if (name.includes("lift access")) {
      return <GiElevator className="facility-icon" />;
    } else {
      // Default icon for unmatched facilities
      return <FaConciergeBell className="facility-icon" />;
    }
  };

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
          {/* <div className="hotel-address2">{hotelData?.contact?.phones[0]}</div> */}
          <div className="review-badge">
            <span className="score">8.7</span>
            <span className="review-text">Very good</span>
            <span className="review-count">97 reviews</span>
          </div>
        </div>
        <div className="hotel-map-card">
          <div className="map-header">
            {/* <h3>Location</h3> */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${hotelData.geoCode.lat},${hotelData.geoCode.long}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-larger-link"
            >
              View in Google Maps
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
          <div className="map-container">
            <iframe
              src={`https://www.google.com/maps?q=${hotelData.geoCode.lat},${hotelData.geoCode.long}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Hotel Location"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Gallery Grid */}
      {gridData.length > 0 && (
        <div className="gallery-grid">
          {/* Main Image */}
          <div className="gallery-item main-image" onClick={openModal}>
            <img
              src={getImageUrl(gridData[0]?.image?.links)}
              alt={gridData[0]?.label}
            />
            <div className="photo-count">All photos ({totalImages})</div>
          </div>

          {/* Other Category Images */}
          {gridData.slice(1, 5).map((item, index) => (
            <div key={item.key} className="gallery-item" onClick={openModal}>
              <img src={getImageUrl(item.image?.links)} alt={item.label} />
              <div className="photo-label">
                {item.label} ({item.count})
              </div>
              {index === 3 && (
                <button className="view-all-btn" onClick={openModal}>
                  View all photos
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* About Section */}
      <div className="about-section">
        <h2 className="section-title">About us</h2>
        {hotelData.descriptions &&
          hotelData.descriptions.map((description, index) => (
            <div key={index}>
              {description.type !== "General" && (
                <h3 className="description-type">{description.type}</h3>
              )}
              <p className="about-text">{description.text}</p>
            </div>
          ))}
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
          {hotelData.facilities &&
            hotelData.facilities.map((facility) => (
              <div key={facility.id} className="facility-item">
                {/* {getFacilityIcon(facility.name)} */}
                <span>{facility.name}</span>
              </div>
            ))}
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

      <RoomTypes hotelID={hotelId} />

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
        <div className="modal-headerrr">
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
          <button className="cloj-btn" onClick={closeModal}>
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
