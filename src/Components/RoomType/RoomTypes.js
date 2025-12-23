import React, { useState, useMemo, useEffect } from "react";
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
import Modal from "react-modal";

Modal.setAppElement("#root");

const RoomTypes = ({ hotelID }) => {
  const {
    rooms_rate_data,
    rooms_rate_loading,
    PriceCheckApi,
    price_check_data,
    price_check_loading,
  } = useHotelContext();

  console.log("price_check_data", price_check_data);

  const [expandedPolicies, setExpandedPolicies] = useState({});
  const [selectedRates, setSelectedRates] = useState({});
  // const [hotelId, setHotelId] = useState(String(hotelID));
  const [hotelId] = useState(String(hotelID));
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBookmodal, setIsOpenBookModal] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [guests, setGuests] = useState([]);

  const numOfAdults = Number(
    Object.values(price_check_data?.options || {})[0]?.rate?.occupancies?.[0]
      ?.numOfAdults || 1
  );

  const createAdultGuest = (isLeadGuest = false) => ({
    title: "Mr",
    firstName: "",
    middleName: "",
    lastName: "",
    isLeadGuest,
    type: "adult",

    email: isLeadGuest ? "" : "",
    isdCode: isLeadGuest ? "91" : "",
    contactNumber: isLeadGuest ? "" : "",

    age: "",
    passportNumber: "",
    passportExpiry: "",
    passportIssue: "",
    panCardNumber: "",
    panCardName: "",
  });

  useEffect(() => {
    if (!numOfAdults) return;
    const generatedGuests = Array.from({ length: numOfAdults }, (_, index) =>
      createAdultGuest(index === 0)
    );
    setGuests(generatedGuests);
  }, [numOfAdults]);

  const handleGuestChange = (guestIndex, field, value) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[guestIndex] = {
        ...updated[guestIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      specialRequests: specialRequests || null,
      optionId: "abc",
      traceId: "",
      hotelId: hotelID,
      guests: guests.map((guest) => ({
        title: guest.title,
        firstName: guest.firstName,
        middleName: guest.middleName || null,
        lastName: guest.lastName,
        isLeadGuest: guest.isLeadGuest,
        type: guest.type,
        email: guest.isLeadGuest ? guest.email : undefined,
        isdCode: guest.isLeadGuest ? guest.isdCode : undefined,
        contactNumber: guest.isLeadGuest ? guest.contactNumber : undefined,
        age: guest.age || null,
        passportNumber: guest.passportNumber || null,
        passportExpiry: guest.passportExpiry || null,
        passportIssue: guest.isLeadGuest
          ? guest.passportIssue || null
          : undefined,
        passportFrontImage: guest.isLeadGuest
          ? guest.passportFrontImage || null
          : undefined,
        passportBackImage: guest.isLeadGuest
          ? guest.passportBackImage || null
          : undefined,
        panCardNumber: guest.panCardNumber || null,
        panCardName: guest.isLeadGuest ? guest.panCardName || null : undefined,
      })),
    };

    console.log("Booking Payload:", JSON.stringify(payload, null, 2));
    alert("Booking submitted! Check console for payload.");
  };

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
    if (!rooms_rate_data) return [];

    const { options, rooms, standardizedRooms } = rooms_rate_data;

    if (
      !options ||
      !rooms ||
      !standardizedRooms ||
      Object.keys(options).length === 0
    ) {
      return [];
    }

    const roomGroups = {};

    Object.entries(options).forEach(([optionId, optionData]) => {
      const { rate } = optionData;
      if (!rate || !rate.occupancies || rate.occupancies.length === 0) return;

      const occupancy = rate.occupancies[0];
      const roomId = occupancy.roomId;
      const stdRoomId = occupancy.stdRoomId;

      if (!standardizedRooms[stdRoomId] || !rooms[roomId]) return;

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

    const parsedRooms = [];

    Object.entries(roomGroups).forEach(([stdRoomId, group]) => {
      const { stdRoom, room, rates } = group;

      rates.sort((a, b) => a.finalRate - b.finalRate);

      let amenities = [];
      if (stdRoom.facilities && Array.isArray(stdRoom.facilities)) {
        amenities = stdRoom.facilities
          .filter((f) => f.name && f.name.trim())
          .map((f) => f.name);
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
        defaultAmenities.forEach((amenity) => {
          if (!amenities.includes(amenity) && amenities.length < 8) {
            amenities.push(amenity);
          }
        });
      }

      const finalAmenities = amenities.slice(0, 8);
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

    return parsedRooms;
  }, [rooms_rate_data]);

  // Custom Arrow Components
  const NextArrow = ({ onClick }) => (
    <div className="slick-arrow slick-next" onClick={onClick}>
      <FaChevronRight size={24} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow slick-prev" onClick={onClick}>
      <FaChevronLeft size={24} />
    </div>
  );

  const imageSliderSettings = {
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

  const roomCardsSettings = {
    dots: true,
    infinite: roomsData.length > 1,
    speed: 500,
    slidesToScroll: 1,
    autoplay: roomsData.length > 3, // Only autoplay if multiple cards make sense
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: roomsData.length > 1 ? <NextArrow /> : null,
    prevArrow: roomsData.length > 1 ? <PrevArrow /> : null,
    slidesToShow: 3, // Default for largest screens (>1280px)
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280, // 1025px to 1280px → show 2 cards
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // 769px to 1024px → show 2 cards
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // ≤768px → show 1 card
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "30px",
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
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
        <Slider {...roomCardsSettings}>
          {roomsData.map((room, ind) => {
            const imageUrls = room.images.map((img) => img.url);
            const hasImages = imageUrls.length > 0;
            const selectedRateIndex = selectedRates[room.id] || 0;
            const selectedRate = room.allRates[selectedRateIndex];

            return (
              <div key={room.id} className="room-card-wrapper">
                <div className="room-card">
                  {/* Image Carousel */}
                  <div className="room-image-container">
                    {hasImages ? (
                      <Slider {...imageSliderSettings}>
                        {imageUrls.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image}
                              alt={`${room.name} - View ${index + 1}`}
                              className="room-image"
                              onError={(e) =>
                                (e.target.src =
                                  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop")
                              }
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="room-image-placeholder">
                        <FaBed className="placeholder-icon" size={60} />
                        <p>No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Room Content */}
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
                          <span className="spec-value">
                            {room.maxAdults} max
                          </span>
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

                    {/* Price Options */}
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
                            onClick={() => selectRate(room.id, index)}
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Policies Toggle */}
                    {selectedRate.policies &&
                      selectedRate.policies.length > 0 && (
                        <div className="room-policies-section">
                          <div
                            className="policies-toggle"
                            onClick={() => togglePolicies(room.id)}
                          >
                            <div className="policies-toggle-left">
                              <FaInfoCircle className="policies-icon" />
                              <span className="policies-title">
                                Room Policies
                              </span>
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
                                  <div className="policy-type">
                                    {policy.type}
                                  </div>
                                  <div className="policy-text">
                                    {policy.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    {/* Cancellation Info */}
                    {selectedRate.cancellationPolicies &&
                      selectedRate.cancellationPolicies.length > 0 && (
                        <div className="cancellation-info">
                          <p className="cancellation-text">
                            <strong>Cancellation:</strong> Charges of ₹
                            {selectedRate.cancellationPolicies[0].estimatedValue.toLocaleString()}{" "}
                            apply from{" "}
                            {new Date(
                              selectedRate.cancellationPolicies[0].start
                            ).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      )}

                    {/* Footer - Price & Book Button */}
                    <div className="room-footer">
                      <div className="pricing-section">
                        <div className="price-container">
                          <span className="current-price">
                            ₹{selectedRate.finalRate.toLocaleString()}
                          </span>
                        </div>
                        <span className="price-note">
                          Per night incl. taxes
                        </span>
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
              </div>
            );
          })}
        </Slider>
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

                  <button
                    className="confirm-btn-price-check"
                    onClick={() => {
                      setIsOpenBookModal(true);
                      setIsOpen(false);
                    }}
                  >
                    Proceed to Book
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isOpenBookmodal && (
        <div
          className={`bottom-sheet-overlay ${isOpenBookmodal ? "open" : ""}`}
          onClick={(e) => {
            if (e.target.className.includes("bottom-sheet-overlay")) {
              setIsOpenBookModal(false);
            }
          }}
        >
          <div className="bottom-sheet-modal">
            <div className="bottom-sheet-container">
              {/* Drag Handle */}
              <div className="bottom-sheet-handle">
                <div className="handle-bar"></div>
              </div>

              {/* Header */}
              <div className="bottom-sheet-header">
                <h2 className="bottom-sheet-title">Book Hotel Room</h2>
                <button
                  className="bottom-sheet-close"
                  onClick={() => setIsOpenBookModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="bottom-sheet-content">
                <div className="booking-form">
                  {/* Booking Details Section */}
                  <div className="form-section">
                    <h3 className="section-title">Booking Details</h3>
                    <div className="form-group">
                      <label className="form-label">Special Requests</label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requests?"
                        rows="3"
                        className="form-input form-textarea"
                      />
                    </div>
                  </div>

                  {/* Guest Cards */}
                  {guests.map((guest, guestIndex) => (
                    <div key={guestIndex} className="form-section">
                      <h3 className="section-title">
                        Guest {guestIndex + 1}
                        {guest.isLeadGuest && (
                          <span className="lead-badge">Lead Guest</span>
                        )}
                      </h3>

                      <div className="guest-card">
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Title *</label>
                            <select
                              required
                              value={guest.title}
                              onChange={(e) =>
                                handleGuestChange(
                                  guestIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="form-input"
                            >
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                              <option value="Miss">Miss</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input
                              type="text"
                              required
                              value={guest.firstName}
                              onChange={(e) =>
                                handleGuestChange(
                                  guestIndex,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              placeholder="First name"
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Middle Name</label>
                            <input
                              type="text"
                              value={guest.middleName}
                              onChange={(e) =>
                                handleGuestChange(
                                  guestIndex,
                                  "middleName",
                                  e.target.value
                                )
                              }
                              placeholder="Middle name"
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input
                              type="text"
                              required
                              value={guest.lastName}
                              onChange={(e) =>
                                handleGuestChange(
                                  guestIndex,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              placeholder="Last name"
                              className="form-input"
                            />
                          </div>
                        </div>

                        {guest.isLeadGuest && (
                          <>
                            <div className="form-group">
                              <label className="form-label">Email *</label>
                              <input
                                type="email"
                                required
                                value={guest.email}
                                onChange={(e) =>
                                  handleGuestChange(
                                    guestIndex,
                                    "email",
                                    e.target.value
                                  )
                                }
                                placeholder="email@example.com"
                                className="form-input"
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group form-group-small">
                                <label className="form-label">ISD Code *</label>
                                <input
                                  type="text"
                                  required
                                  value={guest.isdCode}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      guestIndex,
                                      "isdCode",
                                      e.target.value
                                    )
                                  }
                                  placeholder="+91"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  Contact Number *
                                </label>
                                <input
                                  type="tel"
                                  required
                                  value={guest.contactNumber}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      guestIndex,
                                      "contactNumber",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Contact number"
                                  className="form-input"
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">
                                  PAN Card Number
                                </label>
                                <input
                                  type="text"
                                  value={guest.panCardNumber}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      guestIndex,
                                      "panCardNumber",
                                      e.target.value
                                    )
                                  }
                                  placeholder="PAN number"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  PAN Card Name
                                </label>
                                <input
                                  type="text"
                                  value={guest.panCardName}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      guestIndex,
                                      "panCardName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Name on PAN"
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                              type="number"
                              value={guest.age}
                              onChange={(e) =>
                                handleGuestChange(
                                  guestIndex,
                                  "age",
                                  e.target.value
                                )
                              }
                              placeholder="Age"
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Passport Number
                            </label>
                            <input
                              type="text"
                              value={guest.passportNumber}
                              onChange={(e) =>
                                handleGuestChange(
                                  guestIndex,
                                  "passportNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Passport number"
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Passport Expiry</label>
                          <input
                            type="date"
                            value={guest.passportExpiry}
                            onChange={(e) =>
                              handleGuestChange(
                                guestIndex,
                                "passportExpiry",
                                e.target.value
                              )
                            }
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Action Buttons */}
              <div className="bottom-sheet-actions">
                <button
                  type="button"
                  className="btn-cancel-hotel"
                  onClick={() => setIsOpenBookModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-submit-hotel"
                  onClick={handleSubmit}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypes;
