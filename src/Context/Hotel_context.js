import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import hotel_reducer from "../Reducer/Hotel_reducer";
import {
  CLEAR_SEARCHED_HOTEL,
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
  locationAutosuggestApi,
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
      axios
        .post(SearchHotelMainApi, params, {
          headers: {
            Authorization: "Bearer " + token,
            source: "website",
          },
        })
        .then((res) => {
          if (res.data.error === false) {
            dispatch({
              type: MAIN_SEARCH_SUCCESS,
              payload: res?.data?.results?.data,
            });
            localStorage.setItem("hotelTraceID", res.data?.results?.traceId);
            return res?.data?.results?.data;
          } else {
            dispatch({ type: MAIN_SEARCH_ERROR });
          }
        });
    } catch (error) {
      dispatch({ type: MAIN_SEARCH_ERROR });
      console.log("Error in Main Search API ", error);
    }
  };

  const StaticContentAPi = async (hotelId) => {
    const token = localStorage.getItem("accessToken");
    dispatch({ type: STATIC_CONTENT_BEGIN });
    axios
      .get(`${proxy}${StaticContentApi}/${hotelId}/static-content`, {
        headers: {
          Authorization: "Bearer " + token,
          "Authorization-Type": "external-service",
          source: "website",
        },
      })
      .then((res) => {
        if (res.data?.error === false) {
          dispatch({
            type: STATIC_CONTENT_SUCCESS,
            payload: res?.data?.results[0]?.data,
          });
        } else {
          dispatch({ type: STATIC_CONTENT_ERROR });
        }
      })
      .catch((err) => {
        dispatch({ type: STATIC_CONTENT_ERROR });
        console.log("Error in Static content api", err);
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
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelContext = () => useContext(HotelContext);
