import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HomeHeroHotel.css";

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

  return (
    <div className="hotel-list">
      {hotels.map((hotel) => (
        <div className="hotel-card" key={hotel.id}>
          <div className="hotel-card-inner">
            {/* Image Carousel */}
            <div className="hotel-image-section">
              <Swiper
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
                  <SwiperSlide key={index}>
                    <img src={img} alt={`Hotel ${index}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Hotel Info */}
            <div className="hotel-details-container">
              <div className="info-and-comparison-column">
                <div className="hotel-info">
                  <h2 className="hotel-name">{hotel.name}</h2>
                  <p className="hotel-location">{hotel.location}</p>

                  <div className="rating-container">
                    <span className="rating-badge">{hotel.rating}</span>
                    <span className="rating-text">{hotel.ratingText}</span>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
              </div>

              {/* Price Column */}
              <div className="agoda-price-column">
                <div className="discount-badge">30% less than usual</div>

                <div className="price-container">
                  <div className="price">
                    <span className="currency">₹</span>
                    <span className="amount">{hotel.price}</span>
                  </div>
                  <div className="breakfast-info">Free breakfast</div>
                  <button className="view-deal-btn">View Deal</button>
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
