import {
  CLEAR_SEARCHED_HOTEL,
  HOTEL_SEARCH_BEGIN,
  HOTEL_SEARCH_ERROR,
  HOTEL_SEARCH_SUCCESS,
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
