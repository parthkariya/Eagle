import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaBed,
  FaRuler,
  FaUsers,
  FaWifi,
  FaSnowflake,
  FaTv,
  FaCoffee,
  FaBath,
  FaCouch,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUtensils,
} from "react-icons/fa";
import { MdBalcony, MdKingBed } from "react-icons/md";
import "./RoomTypes.css";
import { useHotelContext } from "../../Context/Hotel_context";
import { FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const RoomTypes = () => {
  const { rooms_rate_data, rooms_rate_loading } = useHotelContext();

  const [expandedPolicies, setExpandedPolicies] = useState({});

  // Add this function to toggle policies
  const togglePolicies = (roomId) => {
    setExpandedPolicies((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  // Parse and structure the room data from API
  const roomsData = useMemo(() => {
    if (!rooms_rate_data) {
      console.log("No rooms_rate_data.results found");
      return [];
    }

    const { options, rooms, standardizedRooms } = rooms_rate_data;

    // Validate that all required objects exist
    if (!options || !rooms || !standardizedRooms) {
      console.log("Missing required data structures");
      return [];
    }

    // Check if options object has any entries
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

      // Check if the standardized room and room exist
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

      // Get the cheapest rate
      const cheapestRate = rates[0];
      const hasBreakfast = rates.some(
        (r) => r.boardBasis?.type === "BedAndBreakfast"
      );

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
        optionId: cheapestRate.optionId,
        name: stdRoom.name || room.name || "Standard Room",
        description:
          room.description ||
          `Comfortable ${stdRoom.name || "room"} with modern amenities`,
        price: cheapestRate.finalRate || 0,
        currency: cheapestRate.currency || "INR",
        availability: parseInt(cheapestRate.availability) || 0,
        refundable: cheapestRate.refundable || false,
        boardBasis: cheapestRate.boardBasis || {
          description: "Room Only",
          type: "RoomOnly",
        },
        maxGuests: parseInt(stdRoom.maxGuestAllowed) || 2,
        maxAdults: parseInt(stdRoom.maxAdultAllowed) || 2,
        maxChildren: parseInt(stdRoom.maxChildrenAllowed) || 0,
        images: imageLinks,
        amenities: finalAmenities,
        facilities: stdRoom.facilities || [],
        beds: stdRoom.beds || [],
        hasBreakfast: hasBreakfast,
        allRates: rates,
        cancellationPolicies: cheapestRate.cancellationPolicies || [],
        policies: cheapestRate.policies || [],
      });
    });

    console.log("Parsed rooms:", parsedRooms);
    return parsedRooms;
  }, [rooms_rate_data]);

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
        {roomsData.map((room) => {
          const imageUrls = room.images.map((img) => img.url);
          const hasImages = imageUrls.length > 0;

          return (
            <div key={room.id} className="room-card">
              {/* Swiper Image Carousel */}
              <div className="room-image-container">
                {hasImages ? (
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    // navigation={{
                    //   nextEl: `.swiper-button-next-${room.id}`,
                    //   prevEl: `.swiper-button-prev-${room.id}`,
                    // }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    loop={imageUrls.length > 1}
                    speed={500}
                    className="room-swiper"
                  >
                    {imageUrls.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${room.name} - View ${index + 1}`}
                          className="room-image"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop";
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="room-image-placeholder">
                    <FaBed className="placeholder-icon" />
                    <p>No image available</p>
                  </div>
                )}

                {!room.refundable && (
                  <div className="non-refundable-badge">Non-Refundable</div>
                )}

                {imageUrls.length > 1 && (
                  <>
                    <div
                      className={`swiper-button-prev swiper-button-prev-${room.id}`}
                    >
                      <FaChevronLeft />
                    </div>
                    <div
                      className={`swiper-button-next swiper-button-next-${room.id}`}
                    >
                      <FaChevronRight />
                    </div>
                  </>
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

                  <div className="spec-item">
                    <FaUtensils className="spec-icon" />
                    <div className="spec-content">
                      <span className="spec-label">Board Basis</span>
                      <span className="spec-value">
                        {room.boardBasis.description}
                      </span>
                    </div>
                  </div>
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

                {/* Additional Info */}
                <div className="room-features">
                  <h4 className="features-title">Booking Details</h4>
                  <div className="features-list">
                    {room.refundable ? (
                      <span className="feature-tag feature-tag-success">
                        Refundable
                      </span>
                    ) : (
                      <span className="feature-tag feature-tag-warning">
                        Non-Refundable
                      </span>
                    )}
                    {room.hasBreakfast && (
                      <span className="feature-tag">Breakfast Available</span>
                    )}
                    <span className="feature-tag">
                      {room.availability} rooms available
                    </span>
                  </div>
                </div>

                {room.policies && room.policies.length > 0 && (
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
                        {/* Room Policies */}
                        {room.policies.map((policy, index) => (
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
                {room.cancellationPolicies &&
                  room.cancellationPolicies.length > 0 && (
                    <div className="cancellation-info">
                      <p className="cancellation-text">
                        <strong>Cancellation:</strong> Charges of ₹
                        {room.cancellationPolicies[0].estimatedValue.toLocaleString()}{" "}
                        apply from{" "}
                        {new Date(
                          room.cancellationPolicies[0].start
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                {/* Pricing & CTA */}
                <div className="room-footer">
                  <div className="pricing-section">
                    <div className="price-container">
                      <span className="current-price">
                        ₹{room.price.toLocaleString()}
                      </span>
                      <span className="currency-code">{room.currency}</span>
                    </div>
                    <span className="price-note">Per night incl. taxes</span>
                  </div>
                  <button className="book-now-btn">Book Now</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomTypes;
