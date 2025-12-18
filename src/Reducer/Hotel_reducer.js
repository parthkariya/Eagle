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

const hotel_reducer = (state, action) => {
  switch (action.type) {
    case HOTEL_SEARCH_BEGIN:
      return {
        ...state,
        hotel_loading: true,
      };
    case HOTEL_SEARCH_SUCCESS:
      return {
        ...state,
        hotel_loading: false,
        hotel_data: action.payload,
      };
    case HOTEL_SEARCH_ERROR:
      return {
        ...state,
        hotel_loading: false,
        hotel_data: [],
      };

    case MAIN_SEARCH_BEGIN:
      return {
        ...state,
        main_hotel_loading: true,
        hasSearched: true,
      };
    case MAIN_SEARCH_SUCCESS:
      return {
        ...state,
        main_hotel_loading: false,
        Hotel_Main_data: action.payload,
        hasSearched: false,
      };
    case MAIN_SEARCH_ERROR:
      return {
        ...state,
        main_hotel_loading: false,
        Hotel_Main_data: [],
      };

    case STATIC_CONTENT_BEGIN:
      return {
        ...state,
        static_content_load: true,
      };
    case STATIC_CONTENT_SUCCESS:
      return {
        ...state,
        Static_content_data: action.payload,
        static_content_load: false,
      };
    case STATIC_CONTENT_ERROR:
      return {
        ...state,
        Static_content_data: [],
        static_content_load: false,
      };

    case GET_ROOMS_RATE_BEGIN:
      return {
        ...state,
        rooms_rate_loading: true,
      };
    case GET_ROOMS_RATE_SUCCESS:
      return {
        ...state,
        rooms_rate_data: action.payload,
        rooms_rate_loading: false,
      };
    case GET_ROOMS_RATE_ERROR:
      return {
        ...state,
        rooms_rate_loading: false,
        rooms_rate_data: {},
      };

    case HOTEL_PRICE_CHECK_BEGIN:
      return {
        ...state,
        price_check_loading: true,
      };
    case HOTEL_PRICE_CHECK_SUCCESS:
      return {
        ...state,
        price_check_loading: false,
        price_check_data: action.payload,
      };
    case HOTEL_PRICE_CHECK_ERROR:
      return {
        ...state,
        price_check_loading: false,
        price_check_data: {},
      };

    case CLEAR_SEARCHED_HOTEL:
      return {
        ...state,
        hotel_loading: false,
        hotel_data: [],
      };

    default:
      return state;
  }
};

export default hotel_reducer;
