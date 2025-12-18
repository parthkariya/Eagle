import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HomeHeroHotel.css";
import { useHotelContext } from "../../Context/Hotel_context";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaCoffee,
  FaCheckCircle,
  FaUndo,
  FaCreditCard,
  FaTag,
  FaPercent,
} from "react-icons/fa";

const HomeHeroHotel = () => {
  const navigate = useNavigate();

  const {
    Static_content_data,
    static_content_load,
    Hotel_Main_data,
    main_hotel_loading,
    hasSearched,
  } = useHotelContext();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(price));
  };

  if (static_content_load || main_hotel_loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading hotels...</p>
      </div>
    );
  }

  if (
    hasSearched &&
    (!Static_content_data || Static_content_data.length === 0)
  ) {
    return (
      <div className="no-data-container">
        <p>No hotels available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="hotel-list">
      {Static_content_data.map((hotel, index) => {
        // Get rate data from Hotel_Main_data by index
        const rateData = Hotel_Main_data?.[index]?.availability || null;
        const rate = rateData?.rate;
        const options = rateData?.options;

        return (
          <div className="hotel-card" key={hotel.id}>
            <div className="hotel-card-inner">
              {/* Image Carousel */}
              <div className="hotel-image-section">
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
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <span key={index} style={{ fontSize: "20px" }}>
                            {index < Number(hotel.starRating) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rate Details */}
                    {rate && (
                      <div className="rate-details-section">
                        <div className="board-basis">
                          <span className="board-basis-text">
                            {rate.boardBasis?.description || "Room Only"}
                          </span>
                        </div>

                        {/* Amenities Tags */}
                        <div className="amenities-tags">
                          {options?.freeBreakfast && (
                            <span className="amenity-tag breakfast">
                              Free Breakfast
                            </span>
                          )}
                          {options?.freeCancellation && (
                            <span className="amenity-tag cancellation">
                              ✓ Free Cancellation
                            </span>
                          )}
                          {rate.refundability === "Refundable" && (
                            <span className="amenity-tag refundable">
                              ↺ Refundable
                            </span>
                          )}
                          {rate.payAtHotel && (
                            <span className="amenity-tag pay-hotel">
                              💳 Pay at Hotel
                            </span>
                          )}
                        </div>

                        {/* Offers */}
                        {rate.offers && rate.offers.length > 0 && (
                          <div className="offers-section">
                            {rate.offers.map(
                              (offer, idx) =>
                                offer.discountOffer &&
                                parseFloat(offer.discountOffer) !== 0 && (
                                  <div key={idx} className="offer-badge">
                                    <span className="offer-icon">🎉</span>
                                    <span className="offer-text">
                                      {offer?.title}: Save ₹
                                      {Math.abs(
                                        parseFloat(offer.discountOffer)
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Column */}
                <div className="agoda-price-column">
                  {rate && (
                    <>
                      {rate.refundability === "NonRefundable" && (
                        <div className="non-refundable-badge">
                          Non-Refundable
                        </div>
                      )}

                      <div className="price-container">
                        <div className="price">
                          <span className="currency">₹</span>
                          <span className="amount">
                            {formatPrice(rate.finalRate)}
                          </span>
                        </div>
                        <div className="price-subtext">Total price</div>

                        {rate.finalRate !== rate.pRpNFinalRate && (
                          <div className="original-price">
                            ₹{formatPrice(rate.pRpNFinalRate)}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <button
                    className="view-deal-btn"
                    onClick={() =>
                      navigate("/hoteldetails", {
                        state: {
                          hotelData: hotel,
                          rateData: rateData,
                        },
                      })
                    }
                  >
                    View Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeHeroHotel;
