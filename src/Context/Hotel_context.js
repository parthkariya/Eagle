import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import hotel_reducer from "../Reducer/Hotel_reducer";
import { toast } from "react-toastify";
import {
  CLEAR_SEARCHED_HOTEL,
  GET_ROOMS_RATE_BEGIN,
  GET_ROOMS_RATE_ERROR,
  GET_ROOMS_RATE_SUCCESS,
  HOTEL_PRICE_CHECK_BEGIN,
  HOTEL_PRICE_CHECK_ERROR,
  HOTEL_PRICE_CHECK_SUCCESS,
  HOTEL_SEARCH_BEGIN,
  HOTEL_SEARCH_ERROR,
  HOTEL_SEARCH_SUCCESS,
  MAIN_SEARCH_BEGIN,
  MAIN_SEARCH_ERROR,
  MAIN_SEARCH_SUCCESS,
  STATIC_CONTENT_BEGIN,
  STATIC_CONTENT_ERROR,
  STATIC_CONTENT_SUCCESS,
} from "../Actions";
import {
  getRoomsandrates,
  locationAutosuggestApi,
  priceCheckurl,
  SearchHotelMainApi,
  StaticContentApi,
} from "../Utils/Constant";

const initialState = {
  hotel_data: [],
  hotel_loading: false,
  Hotel_Main_data: [],
  main_hotel_loading: false,
  Static_content_data: [],
  static_content_load: false,
  rooms_rate_data: {},
  rooms_rate_loading: false,
  price_check_data: {},
  price_check_loading: false,
  hasSearched: false,
};

const HotelContext = createContext();

const proxy = "https://cors-anywhere.herokuapp.com/";

export const HotelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hotel_reducer, initialState);

  const LocationSearchHotel = async (searchString) => {
    if (!searchString?.trim()) return;

    dispatch({ type: HOTEL_SEARCH_BEGIN });

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(proxy + locationAutosuggestApi, {
        params: {
          searchString: searchString,
        },
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "Authorization-Type": "external-service",
          source: "website",
        },
      });

      const hotelsOnly =
        response?.data?.results?.filter((item) => item.type === "Hotel") || [];
      dispatch({
        type: HOTEL_SEARCH_SUCCESS,
        payload: hotelsOnly,
      });
    } catch (error) {
      console.error("Location search failed:", error);
      dispatch({ type: HOTEL_SEARCH_ERROR });
    }
  };

  const SearchHotelMain = async (params) => {
    const token = localStorage.getItem("accessToken");
    dispatch({ type: MAIN_SEARCH_BEGIN });

    try {
      const res = await axios.post(SearchHotelMainApi, params, {
        headers: {
          Authorization: "Bearer " + token,
          source: "website",
        },
      });

      if (res.data?.error === false) {
        dispatch({
          type: MAIN_SEARCH_SUCCESS,
          payload: res.data?.results?.data,
        });

        localStorage.setItem("hotelTraceID", res.data?.results?.traceId);
        return res.data?.results?.data; // ✅ success
      } else {
        dispatch({ type: MAIN_SEARCH_ERROR });
        throw new Error(res.data?.message || "Search API failed");
      }
    } catch (error) {
      dispatch({ type: MAIN_SEARCH_ERROR });

      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
      console.error("Error in Main Search API:", error);

      throw error; // ✅ important
    }
  };

  const StaticContentAPi = async (hotelId) => {
    const token = localStorage.getItem("accessToken");
    dispatch({ type: STATIC_CONTENT_BEGIN });

    try {
      const res = await axios.get(
        `${proxy}${StaticContentApi}/${hotelId}/static-content`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Authorization-Type": "external-service",
            source: "website",
          },
        }
      );

      if (res.data?.error === false) {
        dispatch({
          type: STATIC_CONTENT_SUCCESS,
          payload: {
            hotelId,
            data: res?.data?.results[0]?.data?.[0],
          },
        });
      } else {
        dispatch({ type: STATIC_CONTENT_ERROR });
      }
    } catch (err) {
      dispatch({ type: STATIC_CONTENT_ERROR });
      console.log("Error in Static content api", err);
    }
  };
  const GetRoomsAndRates = async (params) => {
    const token = localStorage.getItem("accessToken");
    dispatch({ type: GET_ROOMS_RATE_BEGIN });

    axios
      .post(proxy + getRoomsandrates, params, {
        headers: {
          Authorization: "Bearer " + token,
          source: "website",
        },
      })
      .then((res) => {
        if (res.data.error === false) {
          dispatch({
            type: GET_ROOMS_RATE_SUCCESS,
            payload: res?.data?.results,
          });
        } else dispatch({ type: GET_ROOMS_RATE_ERROR });
      })
      .catch((err) => {
        dispatch({ type: GET_ROOMS_RATE_ERROR });
        console.log("Error in rooms and rate api ", err);
      });
  };

  const PriceCheckApi = async (params) => {
    const token = localStorage.getItem("accessToken");
    dispatch({ type: HOTEL_PRICE_CHECK_BEGIN });
    axios
      .post(priceCheckurl, params, {
        headers: {
          Authorization: "Bearer " + token,
          source: "website",
        },
      })
      .then((res) => {
        if (res.data.error === false) {
          dispatch({
            type: HOTEL_PRICE_CHECK_SUCCESS,
            payload: res?.data?.results,
          });
        } else dispatch({ type: HOTEL_PRICE_CHECK_ERROR });
      })
      .catch((err) => {
        dispatch({ type: HOTEL_PRICE_CHECK_ERROR });
        console.log("Error in hotel price check api ", err);
      });
  };

  const clearHotelData = () => {
    dispatch({ type: CLEAR_SEARCHED_HOTEL });
  };

  return (
    <HotelContext.Provider
      value={{
        ...state,
        LocationSearchHotel,
        clearHotelData,
        SearchHotelMain,
        StaticContentAPi,
        GetRoomsAndRates,
        PriceCheckApi,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelContext = () => useContext(HotelContext);
