import { createContext, useContext, useReducer } from "react";
import flight_reducer from "../Reducer/flight_reducer";
import axios from "axios";

import {
  ACCEPT_HEADER,
  ACCEPT_HEADER1,
  getFare,
  GetPassengerDetails,
  newFlightApi,
  newFlightApi_dynamic,
  PassengerDetails_url,
  reprice,
  searchcurl,
  walletApi,
} from "../Utils/Constant";
import {
  BOOKING_BEGIN,
  BOOKING_ERROR,
  BOOKING_SUCCESS,
  CLEAR_FLIGHT_DATA,
  CREATE_ITINERARY_BEGIN,
  CREATE_ITINERARY_ERROR,
  CREATE_ITINERARY_SUCCESS,
  FARE_RULES_BEGIN,
  FARE_RULES_ERROR,
  FARE_RULES_SUCCESS,
  FLIGHT_SEARCH_AIRIQ_BEGIN,
  FLIGHT_SEARCH_AIRIQ_ERROR,
  FLIGHT_SEARCH_AIRIQ_SUCCESS,
  FLIGHT_SEARCH_BEGIN,
  FLIGHT_SEARCH_ERROR,
  FLIGHT_SEARCH_SUCCESS,
  GET_BOOKING_BEGIN,
  GET_BOOKING_ERROR,
  GET_BOOKING_SUCCESS,
  GET_ITINERARY_BEGIN,
  GET_ITINERARY_ERROR,
  GET_ITINERARY_SUCCESS,
  GET_PASSENGER_DETAILS_BEGIN,
  GET_PASSENGER_DETAILS_ERROR,
  GET_PASSENGER_DETAILS_SUCCESS,
  PASSENGER_DETAILS_BEGIN,
  PASSENGER_DETAILS_ERROR,
  PASSENGER_DETAILS_SUCCESS,
  REPRICE_BEGIN,
  REPRICE_ERROR,
  REPRICE_SUCCESS,
  SAVE_PASSENGER_DETAILS_BEGIN,
  SAVE_PASSENGER_DETAILS_ERROR,
  SAVE_PASSENGER_DETAILS_SUCCESS,
  WALLET_API_BEGIN,
  WALLET_API_ERROR,
  WALLET_API_SUCCESS,
} from "../Actions";
import Notification from "../Utils/Notification";

const initialState = {
  flight_Data: [],
  flightAirIq_Data: [],
  return_flight_data: [],
  flight_Loading: false,
  hasSearched: false,
  flightAiriq_Loading: false,
  fare_rules: [],
  fare_rules_Loading: false,
  itinerary_data: {},
  itinerary_loading: false,
  getitinerary_data: {},
  getitinerary_loading: false,
  passenger_loading: false,
  reprice_data: {},
  reprice_loading: false,
  booking_loading: false,
  booking_data: {},
  balance_loading: false,
  balance_data: "",
  get_booking_data: {},
  return_get_booking_data: {},
  get_booking_loading: false,
  passenger_Details: [],
  passenger_loading_details: false,
  add_passenger_loading: false,
};

const FlightContext = createContext();
export const FlightProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flight_reducer, initialState);

  const FlightSearch = async (params) => {
    dispatch({ type: FLIGHT_SEARCH_BEGIN });
    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      if (resp.data?.error) {
        const apiMessage =
          resp.data.error.errorMessage || "Something went wrong";
        Notification("error", "Error", apiMessage);
        dispatch({ type: FLIGHT_SEARCH_ERROR });
        return;
      }

      const flightdata = resp.data.response.results;

      localStorage.setItem("traceID", resp.data.response.traceId);
      dispatch({ type: FLIGHT_SEARCH_SUCCESS, payload: flightdata });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.error?.errorMessage ||
        error?.message ||
        "Something went wrong";

      Notification("error", "Error", apiMessage);
      dispatch({ type: FLIGHT_SEARCH_ERROR });
      console.log("Error in New Flight Search Api:", error);
    }
  };

  const FlightSearchAiriq = async (params) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));

    // create headers using new Headers()
    const headers = new Headers(ACCEPT_HEADER1);
    headers.append("Authorization", `Bearer ${token}`);

    dispatch({ type: FLIGHT_SEARCH_AIRIQ_BEGIN });

    try {
      const response = await fetch(searchcurl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params),
      });

      const resp = await response.json();

      if (resp?.error) {
        const apiMessage = resp.error.errorMessage || "Something went wrong";
        Notification("error", "Error", apiMessage);
        dispatch({ type: FLIGHT_SEARCH_AIRIQ_ERROR });
        return;
      }

      const flightdata = resp?.data;
      console.log("flightdata Airiq", flightdata);

      dispatch({ type: FLIGHT_SEARCH_AIRIQ_SUCCESS, payload: flightdata });
    } catch (error) {
      console.log("Error in New Flight Search Api:", error);
      dispatch({ type: FLIGHT_SEARCH_AIRIQ_ERROR });
    }
  };

  const GetFareRules = async (params) => {
    dispatch({ type: FARE_RULES_BEGIN });

    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });

      const fareRuleData = resp.data.results;
      console.log("fareRuleData", fareRuleData);

      dispatch({ type: FARE_RULES_SUCCESS, payload: fareRuleData });
    } catch (error) {
      dispatch({ type: FARE_RULES_ERROR });
      console.log("Error in New Flight Fare Api ", error);
      // throw error;
    }
  };

  const CreateItinerary = async (params) => {
    dispatch({ type: CREATE_ITINERARY_BEGIN });

    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });

      if (resp.data?.error) {
        const apiMessage =
          resp.data.error.errorMessage || "Something went wrong";
        Notification("error", "Error", apiMessage);
        dispatch({ type: CREATE_ITINERARY_ERROR });
        return;
      }

      const itineraryData = resp.data.results;

      dispatch({ type: CREATE_ITINERARY_SUCCESS, payload: itineraryData });
      localStorage.setItem("itineraryCode", itineraryData.itineraryCode);
      return itineraryData;
    } catch (error) {
      dispatch({ type: CREATE_ITINERARY_ERROR });
      console.log("Error in New Flight Itinerary Api ", error);
      // throw error;
    }
  };

  const GetSavedItinerary = async (params) => {
    dispatch({ type: GET_ITINERARY_BEGIN });
    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      const getitineraryData = resp.data.results;
      console.log("Get Itinerary Data", getitineraryData);
      dispatch({ type: GET_ITINERARY_SUCCESS, payload: getitineraryData });
      return resp.data.results;
    } catch (error) {
      dispatch({ type: GET_ITINERARY_ERROR });
      console.log("Error in New Flight Get Itinerary Api ", error);
    }
  };

  const SavePassengerDetails = async (params) => {
    dispatch({ type: SAVE_PASSENGER_DETAILS_BEGIN });
    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      console.log("Passenger APi REsponse ", resp.data);
      dispatch({ type: SAVE_PASSENGER_DETAILS_SUCCESS });
      return resp.data;
    } catch (error) {
      dispatch({ type: SAVE_PASSENGER_DETAILS_ERROR });
      console.log("Error in Save Passenger API", error);
    }
  };

  const CheckReprice = async (params) => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    dispatch({ type: REPRICE_BEGIN });
    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Reprice API Response", resp.data);
      dispatch({ type: REPRICE_SUCCESS, payload: resp.data });
    } catch (error) {
      console.log("Error in Reprice API", error);
      dispatch({ type: REPRICE_ERROR });
    }
  };

  const Booking = async (params) => {
    dispatch({ type: BOOKING_BEGIN });

    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      console.log("Booking API Response", resp.data);
      dispatch({ type: BOOKING_SUCCESS, payload: resp.data });

      return resp.data;
    } catch (error) {
      dispatch({ type: BOOKING_ERROR });
      console.log("Error in Booking API", error);
    }
  };

  const GetBalance = async (params) => {
    dispatch({ type: WALLET_API_BEGIN });

    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      dispatch({ type: WALLET_API_SUCCESS, payload: resp.data.balance });
      return resp.data;
    } catch (error) {
      dispatch({ type: WALLET_API_ERROR });
      console.log("Wallet API ERROR", error);
    }
  };

  const GetBookingFlight = async (params) => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    dispatch({ type: GET_BOOKING_BEGIN });

    try {
      const resp = await axios.post(newFlightApi_dynamic, params, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res", resp.data);

      dispatch({
        type: GET_BOOKING_SUCCESS,
        payload: resp.data.booking_details,
      });

      return resp.data;
    } catch (error) {
      dispatch({ type: GET_BOOKING_ERROR });
      console.log("Error in Get Booking API", error);
    }
  };

  const ClearFlightData = () => {
    dispatch({ type: CLEAR_FLIGHT_DATA });
  };

  const GetPassengersDetails = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    dispatch({ type: GET_PASSENGER_DETAILS_BEGIN });
    axios
      .get(GetPassengerDetails, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success === 1) {
          dispatch({
            type: GET_PASSENGER_DETAILS_SUCCESS,
            payload: res.data.data,
          });
        } else {
          dispatch({ type: GET_PASSENGER_DETAILS_ERROR });
        }
      })
      .catch((err) => {
        dispatch({ type: GET_PASSENGER_DETAILS_ERROR });
        console.log("Error in Get Passenger Details API", err);
      });
  };

  const PassengerDetails = async (params) => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    dispatch({ type: PASSENGER_DETAILS_BEGIN });
    axios
      .post(PassengerDetails_url, params, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("ADDD NO DATA ", res.data);

        if (res.data.success === 1) {
          dispatch({ type: PASSENGER_DETAILS_SUCCESS });
          // GetPassengersDetails();
        } else {
          dispatch({ type: PASSENGER_DETAILS_ERROR });
        }
      })
      .catch((err) => {
        dispatch({ type: PASSENGER_DETAILS_ERROR });
        console.log("Error in Passenger Details API", err);
      });
  };

  return (
    <FlightContext.Provider
      value={{
        ...state,
        FlightSearch,
        FlightSearchAiriq,
        GetFareRules,
        CreateItinerary,
        GetSavedItinerary,
        SavePassengerDetails,
        CheckReprice,
        Booking,
        ClearFlightData,
        GetBalance,
        GetBookingFlight,
        FlightSearchAiriq,
        GetPassengersDetails,
        PassengerDetails,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export const useFlightContext = () => {
  return useContext(FlightContext);
};
