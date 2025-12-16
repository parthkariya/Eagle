import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HomeHeroHotel.css";
import { useHotelContext } from "../../Context/Hotel_context";
import { useNavigate } from "react-router-dom";

const HomeHeroHotel = () => {
  const hotels = [
    {
      id: 1,
      name: "The Fern Gir Forest Resort, Sasan Gir - A Fern Crown Collection Resort",
      location: "Sasan Gir",
      rating: 8.6,
      ratingText: "Very good (198)",
      price: "14,897",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      ],
    },

    {
      id: 2,
      name: "River View Retreat Resort, Sasan",
      location: "Sasan",
      rating: 8.9,
      ratingText: "Excellent (120)",
      price: "12,499",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      ],
    },

    {
      id: 3,
      name: "Wilderness Resort & Spa",
      location: "Gir Forest",
      rating: 9.1,
      ratingText: "Superb (310)",
      price: "18,990",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      ],
    },
  ];

  const comparisonDeals = [
    {
      provider: "Expedia",
      class: "provider-expedia",
      breakfast: "Free breakfast",
      price: "20,020",
    },
    {
      provider: "Hotels.com",
      class: "provider-hotelscom",
      breakfast: "Free breakfast",
      price: "21,282",
    },
  ];

  const navigate = useNavigate();

  const { Static_content_data, static_content_load } = useHotelContext();

  console.log("Static_content_data", Static_content_data);

  // Show loader while data is loading
  if (static_content_load) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading hotels...</p>
      </div>
    );
  }

  // Show message if no data available
  if (!Static_content_data || Static_content_data.length === 0) {
    return (
      <div className="no-data-container">
        <p>No hotels available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="hotel-list">
      {Static_content_data.map((hotel) => (
        <div className="hotel-card" key={hotel.id}>
          <div className="hotel-card-inner">
            {/* Image Carousel */}
            <div className="hotel-image-section">
              {/* <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                slidesPerView={1}
                spaceBetween={20}
                className="hotel-swiper"
              >
                {hotel.images.map((img, index) => (
                <SwiperSlide
                key={index}
                >
                  <img src={hotel?.heroImage} />
                </SwiperSlide>
                ))}
              </Swiper> */}
              {hotel?.heroImage ? (
                <img
                  src={hotel?.heroImage}
                  style={{ objectFit: "fill", height: "100%", width: "100%" }}
                  alt={hotel.name}
                />
              ) : (
                <div className="no-image-placeholder">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p>No Image Available</p>
                </div>
              )}
            </div>

            {/* Hotel Info */}
            <div className="hotel-details-container">
              <div className="info-and-comparison-column">
                <div className="hotel-info">
                  <h2 className="hotel-name">{hotel.name}</h2>
                  <p className="hotel-location">
                    {hotel.contact?.address?.line1}
                  </p>
                  <p className="hotel-location">
                    {hotel.contact?.address?.city?.name}
                  </p>
                  <div className="rating-container">
                    {/* <span className="rating-badge">{hotel.rating}</span>
                    <span className="rating-text">{hotel.ratingText}</span> */}
                    <div className="stars">
                      {[...Array(5)].map((_, index) => (
                        <span key={index} style={{ fontSize: "20px" }}>
                          {index < Number(hotel.starRating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Column */}
              <div className="agoda-price-column">
                {/* <div className="discount-badge">30% less than usual</div> */}

                <div className="price-container">
                  {/* <div className="price">
                    <span className="currency">₹</span>
                    <span className="amount">{hotel.price}</span>
                  </div>
                  <div className="breakfast-info">Free breakfast</div> */}
                  <button
                    className="view-deal-btn"
                    onClick={() =>
                      navigate("/hoteldetails", { state: { hotelData: hotel } })
                    }
                  >
                    View Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeHeroHotel;
