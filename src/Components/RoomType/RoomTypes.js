import React, { useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Check, X, User, CreditCard, Info } from "lucide-react";

import {
  FaBed,
  FaUsers,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUtensils,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdKingBed } from "react-icons/md";
import "./RoomTypes.css";
import { useHotelContext } from "../../Context/Hotel_context";

const RoomTypes = ({ hotelID }) => {
  const {
    rooms_rate_data,
    rooms_rate_loading,
    PriceCheckApi,
    price_check_data,
    price_check_loading,
  } = useHotelContext();

  const [expandedPolicies, setExpandedPolicies] = useState({});
  const [selectedRates, setSelectedRates] = useState({});
  const [hotelId, setHotelId] = useState(String(hotelID));
  const [isOpen, setIsOpen] = useState(false);

  const togglePolicies = (roomId) => {
    setExpandedPolicies((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const hasPriceData =
    price_check_data &&
    price_check_data.options &&
    Object.keys(price_check_data.options).length > 0 &&
    price_check_data.rooms;

  let optionKey, option, rate, occupancy, room;

  if (hasPriceData) {
    optionKey = Object.keys(price_check_data.options)[0];
    option = price_check_data.options[optionKey];
    rate = option.rate;
    occupancy = rate.occupancies[0];
    room = price_check_data.rooms[occupancy.roomId];
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectRate = (roomId, room, rateIndex) => {
    setSelectedRates((prev) => ({
      ...prev,
      [roomId]: rateIndex,
    }));
  };
  const handleBookNow = (roomIndex) => {
    const room = roomsData[roomIndex];

    if (!room) return;

    const rateIndex = selectedRates[room.id] ?? 0;
    const optionId = room.allRates?.[rateIndex]?.optionId;

    if (!optionId) {
      console.error("Option ID not found");
      return;
    }

    const traceId = localStorage.getItem("hotelTraceID");
    if (!traceId) {
      console.error("Trace ID not found");
      return;
    }

    const payload = {
      traceId,
      optionId,
      hotelId,
    };

    setIsOpen(true);

    PriceCheckApi(payload);
  };

  const roomsData = useMemo(() => {
    if (!rooms_rate_data) {
      console.log("No rooms_rate_data.results found");
      return [];
    }

    const { options, rooms, standardizedRooms } = rooms_rate_data;

    if (!options || !rooms || !standardizedRooms) {
      console.log("Missing required data structures");
      return [];
    }

    if (Object.keys(options).length === 0) {
      console.log("No options available");
      return [];
    }

    const parsedRooms = [];
    const roomGroups = {};

    Object.entries(options).forEach(([optionId, optionData]) => {
      const { rate } = optionData;

      if (!rate || !rate.occupancies || rate.occupancies.length === 0) {
        console.log(`Invalid rate structure for option ${optionId}`);
        return;
      }

      const occupancy = rate.occupancies[0];
      const roomId = occupancy.roomId;
      const stdRoomId = occupancy.stdRoomId;

      if (!standardizedRooms[stdRoomId] || !rooms[roomId]) {
        console.log(
          `Missing room data for stdRoomId: ${stdRoomId}, roomId: ${roomId}`
        );
        return;
      }

      if (!roomGroups[stdRoomId]) {
        roomGroups[stdRoomId] = {
          stdRoom: standardizedRooms[stdRoomId],
          room: rooms[roomId],
          rates: [],
        };
      }

      roomGroups[stdRoomId].rates.push({
        optionId,
        ...rate,
      });
    });

    Object.entries(roomGroups).forEach(([stdRoomId, group]) => {
      const { stdRoom, room, rates } = group;

      rates.sort((a, b) => a.finalRate - b.finalRate);

      const amenities = [];
      if (stdRoom.facilities && Array.isArray(stdRoom.facilities)) {
        stdRoom.facilities.forEach((f) => {
          if (f.name && f.name.trim()) {
            amenities.push(f.name);
          }
        });
      }

      if (amenities.length < 6) {
        const defaultAmenities = [
          "Free Wi-Fi",
          "Air conditioning",
          "Flat-screen TV",
          "Room service",
          "Daily housekeeping",
          "Private bathroom",
        ];

        // Add default amenities that aren't already in the list
        defaultAmenities.forEach((amenity) => {
          if (!amenities.includes(amenity) && amenities.length < 8) {
            amenities.push(amenity);
          }
        });
      }

      // Limit to 8 amenities
      const finalAmenities = amenities.slice(0, 8);
      // Extract image URLs
      const imageLinks = stdRoom.images?.[0]?.links || [];
      parsedRooms.push({
        id: stdRoomId,
        name: stdRoom.name || room.name || "Standard Room",
        description:
          room.description ||
          `Comfortable ${stdRoom.name || "room"} with modern amenities`,
        maxGuests: parseInt(stdRoom.maxGuestAllowed) || 2,
        maxAdults: parseInt(stdRoom.maxAdultAllowed) || 2,
        maxChildren: parseInt(stdRoom.maxChildrenAllowed) || 0,
        images: imageLinks,
        amenities: finalAmenities,
        facilities: stdRoom.facilities || [],
        beds: stdRoom.beds || [],
        allRates: rates,
      });
    });

    console.log("Parsed rooms:", parsedRooms);
    return parsedRooms;
  }, [rooms_rate_data]);

  // Custom Arrow Components
  const NextArrow = ({ onClick }) => (
    <div className="slick-arrow slick-next" onClick={onClick}>
      <FaChevronRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow slick-prev" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (rooms_rate_loading) {
    return (
      <div className="room-types-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading available rooms...</p>
        </div>
      </div>
    );
  }

  if (roomsData.length === 0) {
    return (
      <div className="room-types-container">
        <div className="no-rooms-container">
          <p>No rooms available for the selected dates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-types-container">
      <div className="room-types-header">
        <h2 className="room-types-title">Available Room Types</h2>
        <p className="room-types-subtitle">
          Choose from our selection of comfortable and luxurious accommodations
        </p>
      </div>

      <div className="rooms-grid">
        {roomsData.map((room, ind) => {
          const imageUrls = room.images.map((img) => img.url);
          const hasImages = imageUrls.length > 0;
          const selectedRateIndex = selectedRates[room.id] || 0;
          const selectedRate = room.allRates[selectedRateIndex];

          return (
            <div key={room.id} className="room-card">
              {/* Slider Image Carousel */}
              <div className="room-image-container">
                {hasImages ? (
                  <Slider {...sliderSettings}>
                    {imageUrls.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={`${room.name} - View ${index + 1}`}
                          className="room-image"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop";
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="room-image-placeholder">
                    <FaBed className="placeholder-icon" />
                    <p>No image available</p>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="room-content">
                <div className="room-header-section">
                  <h3 className="room-name">{room.name}</h3>
                </div>

                <p className="room-description">{room.description}</p>

                {/* Room Specs */}
                <div className="room-specs">
                  <div className="spec-item">
                    <FaUsers className="spec-icon" />
                    <div className="spec-content">
                      <span className="spec-label">Max Guests</span>
                      <span className="spec-value">
                        {room.maxGuests} guests
                      </span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <MdKingBed className="spec-icon" />
                    <div className="spec-content">
                      <span className="spec-label">Adults</span>
                      <span className="spec-value">{room.maxAdults} max</span>
                    </div>
                  </div>

                  {room.maxChildren > 0 && (
                    <div className="spec-item">
                      <FaUsers className="spec-icon" />
                      <div className="spec-content">
                        <span className="spec-label">Children</span>
                        <span className="spec-value">
                          {room.maxChildren} max
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                {room.amenities.length > 0 && (
                  <div className="room-amenities">
                    <h4 className="amenities-title">Room Features</h4>
                    <div className="amenities-grid">
                      {room.amenities.slice(0, 6).map((amenity, index) => (
                        <div key={index} className="amenity-item">
                          <FaCheckCircle className="amenity-icon" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Options - NEW SECTION */}
                <div className="price-options-section">
                  <h4 className="price-options-title">Select Your Plan</h4>
                  <div className="price-options-list">
                    {room.allRates.map((rate, index) => (
                      <div
                        key={index}
                        className={`price-option ${
                          selectedRateIndex === index
                            ? "price-option-selected"
                            : ""
                        }`}
                        onClick={() => {
                          selectRate(room.id, rate, index);
                        }}
                      >
                        <div className="price-option-left">
                          <div className="price-option-meal">
                            <FaUtensils className="meal-icon" />
                            <span className="meal-text">
                              {rate.boardBasis.description}
                            </span>
                          </div>
                          <div className="price-option-details">
                            <span className="availability-text">
                              {rate.availability} rooms available
                            </span>
                            {!rate.refundable && (
                              <span className="refund-text">
                                Non-Refundable
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="price-option-right">
                          <span className="option-price">
                            ₹{rate.finalRate.toLocaleString()}
                          </span>
                          <span className="option-currency">
                            {rate.currency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                {selectedRate.policies && selectedRate.policies.length > 0 && (
                  <div className="room-policies-section">
                    <div
                      className="policies-toggle"
                      onClick={() => togglePolicies(room.id)}
                    >
                      <div className="policies-toggle-left">
                        <FaInfoCircle className="policies-icon" />
                        <span className="policies-title">Room Policies</span>
                      </div>
                      {expandedPolicies[room.id] ? (
                        <FaChevronUp className="policies-chevron" />
                      ) : (
                        <FaChevronDown className="policies-chevron" />
                      )}
                    </div>

                    {expandedPolicies[room.id] && (
                      <div className="policies-content">
                        {selectedRate.policies.map((policy, index) => (
                          <div key={index} className="policy-item">
                            <div className="policy-type">{policy.type}</div>
                            <div className="policy-text">{policy.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cancellation Policy */}
                {selectedRate.cancellationPolicies &&
                  selectedRate.cancellationPolicies.length > 0 && (
                    <div className="cancellation-info">
                      <p className="cancellation-text">
                        <strong>Cancellation:</strong> Charges of ₹
                        {selectedRate.cancellationPolicies[0].estimatedValue.toLocaleString()}{" "}
                        apply from{" "}
                        {new Date(
                          selectedRate.cancellationPolicies[0].start
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                {/* Pricing & CTA */}
                <div className="room-footer">
                  <div className="pricing-section">
                    <div className="price-container">
                      <span className="current-price">
                        ₹{selectedRate.finalRate.toLocaleString()}
                      </span>
                      <span className="currency-code">
                        {selectedRate.currency}
                      </span>
                    </div>
                    <span className="price-note">Per night incl. taxes</span>
                  </div>
                  <button
                    className="book-now-btn"
                    onClick={() => handleBookNow(ind)}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isOpen && (
        <div className="booking-modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="booking-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {price_check_loading || !hasPriceData ? (
              <>
                <div className="room-types-container">
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading ...</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <button
                    className="close-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={20} />
                  </button>
                  <h2 className="room-title">{room.name}</h2>

                  <div className="availability-badge">
                    <Check size={16} />
                    {rate.availability} rooms available
                  </div>
                </div>

                <div className="modal-body">
                  <div className="price-section">
                    <div className="price-label">Total Price</div>
                    <h1 className="price-amount">
                      ₹{rate.finalRate.toLocaleString("en-IN")}
                    </h1>
                    {!price_check_data.priceChangeData.isPriceChanged && (
                      <div className="price-status">
                        <Check size={16} />
                        Price Confirmed
                      </div>
                    )}
                  </div>

                  <div className="info-section">
                    <h3 className="info-title">
                      <User size={18} />
                      Guest Details
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Adults</span>
                        <span className="info-value">
                          {occupancy.numOfAdults} Guests
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Children</span>
                        <span className="info-value">
                          {occupancy.numOfChildren} Children
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Board Basis</span>
                        <span className="info-value">
                          {rate.boardBasis.description}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Smoking</span>
                        <span className="info-value">
                          {room.smokingAllowed ? "Allowed" : "Not Allowed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="info-title">
                      <CreditCard size={18} />
                      Booking Information
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Refundability</span>
                        <span className="badge badge-danger">
                          {rate.refundability}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Package Rate</span>
                        <span className="badge badge-info">
                          {rate.isPackageRate ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Passport Required</span>
                        <span className="badge badge-success">
                          {rate.IsPassportMandatory ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">PAN Required</span>
                        <span className="badge badge-success">
                          {rate.IsPANMandatory ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="policies-section">
                    <h3 className="info-title">
                      <Info size={18} />
                      Hotel Policies
                    </h3>
                    {rate.policies.map((policy, index) => (
                      <div key={index} className="policy-item">
                        <div className="policy-type">{policy.type}</div>
                        <p className="policy-text">{policy.text}</p>
                      </div>
                    ))}
                  </div>

                  {rate.cancellationPolicies.length > 0 && (
                    <div className="cancellation-policy">
                      <h4 className="cancellation-title">
                        Cancellation Policy
                      </h4>
                      <p className="cancellation-text">
                        Cancellation charges of ₹
                        {rate.cancellationPolicies[0].estimatedValue.toLocaleString(
                          "en-IN"
                        )}{" "}
                        apply from{" "}
                        {formatDate(rate.cancellationPolicies[0].start)}{" "}
                        onwards.
                      </p>
                    </div>
                  )}

                  <button className="confirm-btn-price-check">
                    Proceed to Book
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypes;
