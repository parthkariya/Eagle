import React, { useState, useMemo, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Check, X, User, CreditCard, Info, Users } from "lucide-react";
import { DatePicker } from "antd";
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
import dayjs from "dayjs";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const RoomTypes = ({ hotelID }) => {
  const {
    rooms_rate_data,
    rooms_rate_loading,
    PriceCheckApi,
    price_check_data,
    price_check_loading,
    HotelRoomBooking,
    booked_data,
    booking_loading,
  } = useHotelContext();

  console.log("price_check_data", price_check_data);

  const [expandedPolicies, setExpandedPolicies] = useState({});
  const [selectedRates, setSelectedRates] = useState({});
  // const [hotelId, setHotelId] = useState(String(hotelID));
  const [hotelId] = useState(String(hotelID));
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBookmodal, setIsOpenBookModal] = useState(false);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [roomGuests, setRoomGuests] = useState([]);
  const [selectedOptionID, setSelectedOptionID] = useState("");
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  const createAdultGuest = (isLeadGuest = false) => {
    if (isLeadGuest) {
      return {
        title: "Mr",
        firstName: "",
        middleName: "",
        lastName: "",
        isLeadGuest: true,
        type: "adult",

        email: "",
        isdCode: "91",
        contactNumber: "",

        age: "",
        passportNumber: "",
        passportExpiry: "",
        passportIssue: "",

        panCardNumber: "",
        panCardName: "",
      };
    }
    // NON-LEAD GUEST
    return {
      title: "Mr",
      firstName: "",
      middleName: "",
      lastName: "",
      isLeadGuest: false,
      type: "adult",
      age: "",
      passportNumber: "",
      passportExpiry: "",
      panCardNumber: "",
    };
  };

  useEffect(() => {
    const occupancies =
      Object.values(price_check_data?.options || {})[0]?.rate?.occupancies ||
      [];
    if (!occupancies.length) return;
    const rooms = occupancies.map((occ) => {
      const adultCount = Number(occ.numOfAdults) || 1;

      return {
        roomId: occ.roomId,
        guests: Array.from({ length: adultCount }, (_, index) =>
          createAdultGuest(index === 0)
        ),
      };
    });

    setRoomGuests(rooms);
  }, [price_check_data]);

  const handleGuestChange = (roomIndex, guestIndex, field, value) => {
    setRoomGuests((prev) => {
      const updated = [...prev];
      updated[roomIndex].guests[guestIndex] = {
        ...updated[roomIndex].guests[guestIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    const traceIdd = await localStorage.getItem("hotelTraceID");
    e.preventDefault();
    const payload = {
      specialRequests: specialRequests.length ? specialRequests : null,
      optionId: selectedOptionID,
      traceId: traceIdd,
      hotelId: hotelID,
      roomDetails: roomGuests.map((room) => ({
        roomId: room.roomId,
        guests: room.guests.map((guest) => {
          const baseGuest = {
            title: guest.title,
            firstName: guest.firstName,
            middleName: guest.middleName || null,
            lastName: guest.lastName,
            isLeadGuest: guest.isLeadGuest,
            type: guest.type,

            age: guest.age || null,
            passportNumber: guest.passportNumber || null,
            passportExpiry: guest.passportExpiry || null,
            panCardNumber: guest.panCardNumber || null,
          };

          // ✅ Add extra fields ONLY for lead guest
          if (guest.isLeadGuest) {
            return {
              ...baseGuest,
              email: guest.email || null,
              isdCode: guest.isdCode || "91",
              contactNumber: guest.contactNumber || null,
              passportIssue: guest.passportIssue || null,
              passportFrontImage: guest.passportFrontImage || null,
              passportBackImage: guest.passportBackImage || null,
              panCardName: guest.panCardName || null,
            };
          }

          return baseGuest;
        }),
      })),
    };

    console.log("Booking Payload:", JSON.stringify(payload, null, 2));
    const data = HotelRoomBooking(payload);
    if (data) {
      setIsOpenBookModal(false);
      // toast.success("Booking confirmed! Your hotel room is reserved.");
    }
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

  let optionKey, option, rate;

  if (hasPriceData) {
    optionKey = Object.keys(price_check_data.options)[0];
    option = price_check_data.options[optionKey];
    rate = option.rate;
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoomOccupancies = () => {
    if (!hasPriceData) return [];

    const roomGroups = {};

    rate.occupancies.forEach((occupancy) => {
      const room = price_check_data.rooms[occupancy.roomId];

      if (!roomGroups[occupancy.roomId]) {
        roomGroups[occupancy.roomId] = {
          room: room,
          occupancies: [],
        };
      }

      roomGroups[occupancy.roomId].occupancies.push(occupancy);
    });

    return Object.values(roomGroups);
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
    setSelectedOptionID(optionId);

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
    // autoplay: roomsData.length > 3, // Only autoplay if multiple cards make sense
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    nextArrow: roomsData.length > 1 ? <NextArrow /> : null,
    prevArrow: roomsData.length > 1 ? <PrevArrow /> : null,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
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
            const selectedRateIndex = selectedRates[room.id] ?? 0;
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
                        onClick={() => {
                          setActiveRoom(room);
                          setIsRateModalOpen(true);
                        }}
                      >
                        View Prices
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
                  <h2 className="room-title">Booking Details</h2>

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
                  {/* Room-wise Guest Details */}
                  <div className="info-section">
                    <h3 className="info-title">
                      <Users size={18} />
                      Room & Guest Details
                    </h3>

                    {getRoomOccupancies().map((roomGroup, index) => (
                      <div
                        key={roomGroup.room.id}
                        className="room-occupancy-card"
                      >
                        <div className="room-occupancy-header">
                          <h4 className="room-name">
                            Room {index + 1}: {roomGroup.room.name}
                          </h4>
                          <span className="room-count-badge">
                            {roomGroup.occupancies.length}{" "}
                            {roomGroup.occupancies.length === 1
                              ? "Booking"
                              : "Bookings"}
                          </span>
                        </div>

                        {roomGroup.occupancies.map((occupancy, occIndex) => (
                          <div key={occIndex} className="occupancy-item">
                            <div className="occupancy-guests">
                              <User size={16} />
                              <span className="guest-info">
                                <strong>{occupancy.numOfAdults}</strong> Adult
                                {occupancy.numOfAdults > 1 ? "s" : ""}
                                {occupancy.numOfChildren > 0 && (
                                  <>
                                    , <strong>{occupancy.numOfChildren}</strong>{" "}
                                    Child
                                    {occupancy.numOfChildren > 1 ? "ren" : ""}
                                  </>
                                )}
                              </span>
                            </div>
                            {roomGroup.occupancies.length > 1 && (
                              <span className="occupancy-label">
                                Booking #{occIndex + 1}
                              </span>
                            )}
                          </div>
                        ))}

                        <div className="room-details-grid">
                          <div className="room-detail-item">
                            <span className="detail-label">Smoking</span>
                            <span className="detail-value">
                              {roomGroup.room.smokingAllowed
                                ? "Allowed"
                                : "Not Allowed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* General Booking Info */}
                  <div className="info-section">
                    <h3 className="info-title">
                      <Info size={18} />
                      General Information
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Board Basis</span>
                        <span className="info-value">
                          {rate.boardBasis.description}
                        </span>
                      </div>
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
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="bottom-sheet-content">
                <div className="booking-form">
                  {/* Booking Details */}
                  <div className="form-section">
                    <h3 className="section-title">Booking Details</h3>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requests?"
                      rows="3"
                      className="form-input form-textarea"
                    />
                  </div>

                  {/* ROOMS LOOP */}
                  {roomGuests.map((room, roomIndex) => (
                    <div key={room.roomId} className="form-section">
                      <h3 className="section-title">Room {roomIndex + 1}</h3>

                      {/* GUESTS LOOP */}
                      {room.guests.map((guest, guestIndex) => (
                        <div key={guestIndex} className="guest-card">
                          <h4
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            Guest {guestIndex + 1}
                            {guest.isLeadGuest && (
                              <span className="lead-badge">Lead Guest</span>
                            )}
                          </h4>

                          {/* Common fields for ALL guests */}
                          <div className="form-row">
                            <select
                              value={guest.title}
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
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

                            <input
                              type="text"
                              value={guest.firstName}
                              placeholder="First Name"
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              className="form-input"
                            />
                          </div>

                          <div className="form-row">
                            <input
                              type="text"
                              value={guest.middleName || ""}
                              placeholder="Middle Name"
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "middleName",
                                  e.target.value
                                )
                              }
                              className="form-input"
                            />

                            <input
                              type="text"
                              value={guest.lastName}
                              placeholder="Last Name"
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              className="form-input"
                            />
                          </div>

                          <div className="form-row">
                            <input
                              type="number"
                              value={guest.age || ""}
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "age",
                                  e.target.value
                                )
                              }
                              placeholder="Age"
                              className="form-input"
                            />

                            <input
                              type="text"
                              value={guest.passportNumber || ""}
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "passportNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Passport Number"
                              className="form-input"
                            />
                          </div>

                          <div className="form-row">
                            <DatePicker
                              placeholder="Passport Expiry Date"
                              className="form-input"
                              format="DD-MM-YYYY"
                              getPopupContainer={(trigger) =>
                                trigger.parentElement
                              }
                              value={
                                guest.passportExpiry
                                  ? dayjs(guest.passportExpiry)
                                  : null
                              }
                              onChange={(date) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "passportExpiry",
                                  date ? date.format("YYYY-MM-DD") : ""
                                )
                              }
                            />

                            <input
                              type="text"
                              value={guest.panCardNumber || ""}
                              onChange={(e) =>
                                handleGuestChange(
                                  roomIndex,
                                  guestIndex,
                                  "panCardNumber",
                                  e.target.value
                                )
                              }
                              placeholder="PAN Number"
                              className="form-input"
                            />
                          </div>

                          {/* ADDITIONAL FIELDS FOR LEAD GUEST ONLY */}
                          {guest.isLeadGuest && (
                            <>
                              <div className="form-row">
                                <input
                                  type="email"
                                  value={guest.email || ""}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Email"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-row">
                                <input
                                  type="text"
                                  value={guest.isdCode || "91"}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "isdCode",
                                      e.target.value
                                    )
                                  }
                                  placeholder="ISD Code"
                                  className="form-input"
                                  style={{ flex: "0 0 100px" }}
                                />
                                <input
                                  type="tel"
                                  value={guest.contactNumber || ""}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "contactNumber",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Contact Number"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-row">
                                <input
                                  type="text"
                                  value={guest.panCardName || ""}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "panCardName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="PAN Card Name"
                                  className="form-input"
                                />
                                <DatePicker
                                  placeholder="Passport Issue Date"
                                  className="form-input"
                                  format="DD-MM-YYYY"
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  value={
                                    guest.passportIssue
                                      ? dayjs(guest.passportIssue)
                                      : null
                                  }
                                  onChange={(date) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "passportIssue",
                                      date ? date.format("YYYY-MM-DD") : ""
                                    )
                                  }
                                />
                              </div>

                              <div className="form-row">
                                {/* Passport Front */}
                                <div
                                  className="form-input file-picker"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `passportFront-${roomIndex}-${guestIndex}`
                                      )
                                      .click()
                                  }
                                >
                                  {guest.passportFrontImage ? (
                                    <span>{guest.passportFrontImage.name}</span>
                                  ) : (
                                    <span>Passport Front Image</span>
                                  )}
                                </div>

                                <input
                                  type="file"
                                  id={`passportFront-${roomIndex}-${guestIndex}`}
                                  accept="image/*"
                                  hidden
                                  onChange={(e) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "passportFrontImage",
                                      e.target.files[0]
                                    )
                                  }
                                />

                                {/* Passport Back */}
                                <div
                                  className="form-input file-picker"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `passportBack-${roomIndex}-${guestIndex}`
                                      )
                                      .click()
                                  }
                                >
                                  {guest.passportBackImage ? (
                                    <span>{guest.passportBackImage.name}</span>
                                  ) : (
                                    <span>Passport Back Image</span>
                                  )}
                                </div>

                                <input
                                  type="file"
                                  id={`passportBack-${roomIndex}-${guestIndex}`}
                                  accept="image/*"
                                  hidden
                                  onChange={(e) =>
                                    handleGuestChange(
                                      roomIndex,
                                      guestIndex,
                                      "passportBackImage",
                                      e.target.files[0]
                                    )
                                  }
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bottom-sheet-actions">
                <button
                  className="btn-cancel-hotel"
                  onClick={() => setIsOpenBookModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-submit-hotel" onClick={handleSubmit}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRateModalOpen && activeRoom && (
        <div
          className="booking-modal-overlay"
          onClick={() => setIsRateModalOpen(false)}
        >
          <div
            className="booking-modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header modal-price-header">
              <h2>{activeRoom.name}</h2>
              <button
                className="close-btn"
                onClick={() => setIsRateModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Price Options */}
            <div className="price-options-section">
              <h4 className="price-options-title">Select Your Plan</h4>

              {activeRoom.allRates.map((rate, index) => (
                <div
                  key={index}
                  className={`price-option ${
                    (selectedRates[activeRoom.id] ?? 0) === index
                      ? "price-option-selected"
                      : ""
                  }`}
                  onClick={() => selectRate(activeRoom.id, rate, index)}
                >
                  <div className="price-option-left">
                    <FaUtensils />
                    <span>{rate.boardBasis.description}</span>

                    {!rate.refundable && (
                      <span className="refund-text">Non-Refundable</span>
                    )}
                  </div>

                  <div className="price-option-right">
                    ₹{rate.finalRate.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Policies Card */}
            {activeRoom.allRates[selectedRates[activeRoom.id] || 0]?.policies
              ?.length > 0 && (
              <div className="policy-card">
                <div
                  className="policy-header"
                  onClick={() => togglePolicies(activeRoom.id)}
                >
                  <div className="policy-title">
                    <FaInfoCircle />
                    <span>Room Policies</span>
                  </div>

                  <FaChevronUp
                    className={
                      expandedPolicies[activeRoom.id] ? "rotate" : "rotate-down"
                    }
                  />
                </div>

                {expandedPolicies[activeRoom.id] && (
                  <div className="policy-body">
                    {activeRoom.allRates[
                      selectedRates[activeRoom.id] || 0
                    ].policies.map((policy, index) => (
                      <div key={index} className="policy-info-box">
                        <strong>{policy.type}</strong>
                        <p>{policy.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancellation Box */}
            {activeRoom.allRates[selectedRates[activeRoom.id] ?? 0]
              ?.cancellationPolicies?.length > 0 && (
              <div className="cancellation-box">
                <strong>Cancellation:</strong> Charges of ₹
                {activeRoom.allRates[
                  selectedRates[activeRoom.id] || 0
                ].cancellationPolicies[0].estimatedValue.toLocaleString()}{" "}
                apply from{" "}
                {new Date(
                  activeRoom.allRates[
                    selectedRates[activeRoom.id] || 0
                  ].cancellationPolicies[0].start
                ).toLocaleDateString("en-IN")}
              </div>
            )}

            <div className="modal-footer sticky-footer">
              <div className="modal-price">
                ₹
                {activeRoom.allRates[
                  selectedRates[activeRoom.id] ?? 0
                ].finalRate.toLocaleString()}
                <span> / night</span>
                <p className="tax-note">Per night incl. taxes</p>
              </div>

              <button
                className="book-now-btn"
                onClick={() => {
                  setIsRateModalOpen(false);
                  handleBookNow(
                    roomsData.findIndex((r) => r.id === activeRoom.id)
                  );
                }}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypes;
