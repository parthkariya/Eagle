import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import hotel_reducer from "../Reducer/Hotel_reducer";
import {
  CLEAR_SEARCHED_HOTEL,
  HOTEL_SEARCH_BEGIN,
  HOTEL_SEARCH_ERROR,
  HOTEL_SEARCH_SUCCESS,
} from "../Actions";
import { locationAutosuggestApi } from "../Utils/Constant";

const initialState = {
  hotel_data: [],
  hotel_loading: false,
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

  const clearHotelData = () => {
    dispatch({ type: CLEAR_SEARCHED_HOTEL });
  };

  return (
    <HotelContext.Provider
      value={{
        ...state,
        LocationSearchHotel,
        clearHotelData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelContext = () => useContext(HotelContext);
