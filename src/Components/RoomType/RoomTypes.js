import React, { useState } from "react";
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
} from "react-icons/fa";
import { MdBalcony, MdKingBed } from "react-icons/md";
import "./RoomTypes.css";

const roomsData = [
  {
    id: 1,
    name: "Deluxe Room",
    price: 18990,
    originalPrice: 24500,
    discount: 23,
    size: 350,
    maxGuests: 2,
    beds: "1 King Bed",
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
    ],
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Flat-screen TV",
      "Mini bar",
      "Room service",
      "Daily housekeeping",
    ],
    features: ["City view", "Private bathroom", "Work desk", "Wardrobe"],
    description:
      "Elegant and comfortable room with modern amenities, perfect for couples seeking a luxurious stay.",
    available: 5,
  },
  {
    id: 2,
    name: "Premium Suite",
    price: 32890,
    originalPrice: 42000,
    discount: 22,
    size: 550,
    maxGuests: 3,
    beds: "1 King Bed + 1 Sofa Bed",
    bedrooms: 1,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop",
    ],
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Flat-screen TV",
      "Mini bar",
      "Coffee machine",
      "Room service",
      "Daily housekeeping",
      "Bathtub",
    ],
    features: [
      "Forest view",
      "Private balcony",
      "Separate living area",
      "Luxury bathroom",
      "Work desk",
    ],
    description:
      "Spacious suite with separate living area and stunning forest views, ideal for families or extended stays.",
    available: 3,
  },
  {
    id: 3,
    name: "Family Villa",
    price: 45890,
    originalPrice: 58000,
    discount: 21,
    size: 850,
    maxGuests: 6,
    beds: "2 King Beds + 2 Single Beds",
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop",
    ],
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Multiple flat-screen TVs",
      "Full kitchen",
      "Coffee machine",
      "Washing machine",
      "Room service",
      "Daily housekeeping",
      "Private pool",
    ],
    features: [
      "Garden view",
      "Private entrance",
      "Multiple balconies",
      "Dining area",
      "Living room",
      "Kids play area",
    ],
    description:
      "Luxurious villa perfect for large families, featuring private pool and multiple bedrooms with premium amenities.",
    available: 2,
  },
  {
    id: 4,
    name: "Standard Room",
    price: 14890,
    originalPrice: 19000,
    discount: 22,
    size: 280,
    maxGuests: 2,
    beds: "1 Queen Bed",
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=800&h=600&fit=crop",
    ],
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Flat-screen TV",
      "Mini fridge",
      "Room service",
      "Daily housekeeping",
    ],
    features: ["Garden view", "Private bathroom", "Work desk", "Wardrobe"],
    description:
      "Cozy and affordable room with essential amenities, perfect for budget-conscious travelers.",
    available: 8,
  },
];

const RoomTypes = () => {
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
          return (
            <div key={room.id} className="room-card">
              {/* Swiper Image Carousel */}
              <div className="room-image-container">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation={{
                    nextEl: `.swiper-button-next-${room.id}`,
                    prevEl: `.swiper-button-prev-${room.id}`,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={true}
                  speed={500}
                  //   centeredSlides={true}
                  //   slidesPerView={1.15}
                  className="room-swiper"
                >
                  {room.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${room.name} - View ${index + 1}`}
                        className="room-image"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {room.discount > 0 && (
                  <div className="discount-badge">{room.discount}% OFF</div>
                )}

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
              </div>

              {/* Room Details */}
              <div className="room-content">
                <div className="room-header-section">
                  <h3 className="room-name">{room.name}</h3>
                  <div className="room-availability">
                    <span className="availability-dot"></span>
                    {room.available} rooms left
                  </div>
                </div>

                <p className="room-description">{room.description}</p>

                {/* Room Specs */}
                <div className="room-specs">
                  <div className="spec-item">
                    <FaRuler className="spec-icon" />
                    <div className="spec-content">
                      <span className="spec-label">Room Size</span>
                      <span className="spec-value">{room.size} sq ft</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <FaBed className="spec-icon" />
                    <div className="spec-content">
                      <span className="spec-label">Beds</span>
                      <span className="spec-value">{room.beds}</span>
                    </div>
                  </div>

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
                      <span className="spec-label">Bedrooms</span>
                      <span className="spec-value">
                        {room.bedrooms} bedroom{room.bedrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <FaBath className="spec-icon" />
                    <div className="spec-content">
                      <span className="spec-label">Bathrooms</span>
                      <span className="spec-value">
                        {room.bathrooms} bathroom{room.bathrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="room-amenities">
                  <h4 className="amenities-title">Room Amenities</h4>
                  <div className="amenities-grid">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <FaCheckCircle className="amenity-icon" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="room-features">
                  <h4 className="features-title">Key Features</h4>
                  <div className="features-list">
                    {room.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="room-footer">
                  <div className="pricing-section">
                    <div className="price-container">
                      <span className="original-price">
                        ₹{room.originalPrice.toLocaleString()}
                      </span>
                      <span className="current-price">
                        ₹{room.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="price-note">Per night incl. VAT</span>
                  </div>
                  <div className="book-now-btn">Book Now</div>
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
