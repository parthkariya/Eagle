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
      };
    case MAIN_SEARCH_SUCCESS:
      return {
        ...state,
        main_hotel_loading: false,
        Hotel_Main_data: action.payload,
      };
    case MAIN_SEARCH_ERROR:
      return {
        ...state,
        main_hotel_loading: false,
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
