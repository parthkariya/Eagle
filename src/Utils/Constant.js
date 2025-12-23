// const BaseUrl2 = "https://plance.in/eagleconnect/public/api/v1/";
const BaseUrl2 = "https://erp.applified.co.in/eagleconnect/public/api/v1/";

// const BaseUrl2 = "https://erp.applified.co.in/eagletest/public/api/v1/";

const BaseUrl = "https://omairiq.azurewebsites.net/";
const AirIQLiveBaseUrl = "http://testairiq.mywebcheck.in/TravelAPI.svc/";

const newAirlineURL =
  "https://flight-aggregator-api-sandbox.travclan.com/api/v2/flights/";

const BusBaseUrl = "http://itsplatformv2.itspl.net/api/";
export const verifyCall =
  "ITS_UAT_743960409278b60436124249057b187c5erBNWLQo33ec3";

export const ACCEPT_HEADER = "application/x.eagleconnect.v1+json";

const myHeaders = new Headers();
myHeaders.append("Accept", "application/x.eagleconnect.v1+json");
myHeaders.append("Content-Type", "application/json");

export const ACCEPT_HEADER1 = myHeaders;

// API

export const get_state = BaseUrl2 + "get-state";
export const register = BaseUrl2 + "register";
export const login = BaseUrl + "login";
export const login2 = BaseUrl2 + "login";
export const verify_otp = BaseUrl2 + "login-otp-verify";
export const forgot_password = BaseUrl + "forgot-password";
export const change_password = BaseUrl + "change-password";
export const booking = BaseUrl + "booking";
export const Booking = BaseUrl2 + "booking";
export const get_booking = BaseUrl2 + "get-booking";
export const get_flight_Booking = BaseUrl2 + "get-flights-booking";
export const update_profile = BaseUrl + "update-profile";
export const recent_search = BaseUrl2 + "recent-search";
export const get_recent_search = BaseUrl2 + "get-recent-search";
export const logincurl = BaseUrl2 + "logincurl";
export const sectorscurl = BaseUrl2 + "sectorscurl";
export const availabilitycurl = BaseUrl2 + "availabilitycurl";
export const searchcurl = BaseUrl2 + "searchcurl";
export const bookcurl = BaseUrl2 + "bookcurl";
export const ticketcurl = BaseUrl2 + "ticketcurl";
export const get_all_flights_booking = BaseUrl2 + "get-all-flights-booking";
export const supplieravailabilitycurl = BaseUrl2 + "supplieravailabilitycurl";
export const suppliersearchcurl = BaseUrl2 + "suppliersearchcurl";
export const supplierbookcurl = BaseUrl2 + "supplierbookcurl";
export const supplierticketcurl = BaseUrl2 + "supplierticketcurl";
export const dynamic_curl = BaseUrl2 + "dynamic_curl";
export const get_bus_booking = BaseUrl2 + "get-bus-booking";
export const newFlightApi_dynamic = BaseUrl2 + "dynamic_flights_curl";
export const PassengerDetails_url = BaseUrl2 + "passenger-details";
export const GetPassengerDetails = BaseUrl2 + "get-passenger-details";

// Air IQ API
export const sectors = BaseUrl + "sectors";
export const availability = BaseUrl + "availability";
export const search = BaseUrl + "search";

// Air IQ Live API
export const login_airiq_live = AirIQLiveBaseUrl + "Login";
export const availability_airiq_live = AirIQLiveBaseUrl + "Availability";
export const getFareRule_airiq_live = AirIQLiveBaseUrl + "GetFareRule";

// Bus API

export const getcompanylist = BusBaseUrl + "GetCompanyList";
export const getcurrentaccountbalance = BusBaseUrl + "GetCurrentAccountBalance";
export const getcancellationpolicy = BusBaseUrl + "GetCancellationPolicy";
export const getSources = BusBaseUrl + "GetSources";
export const getDestination = BusBaseUrl + "GetDestinationsBasedOnSource";
export const getRoutes = BusBaseUrl + "GetAvailableRoutes";
export const seararrangementdetails =
  BusBaseUrl + "GetSeatArrangementDetailsV3";
export const getamenities = BusBaseUrl + "GetAmenities";
export const getcitypair = BusBaseUrl + "GetCityPair";
export const bookseat = BusBaseUrl + "BookSeatV3";
export const bookseatdetails = BusBaseUrl + "BookSeatDetails";
export const FetchTicketPrintData = BusBaseUrl + "FetchTicketPrintData";
export const TicketStatus = BusBaseUrl + "TicketStatus";

export const canceldetails = BusBaseUrl + "CancelDetails";
export const confirmCancellationUrl = BusBaseUrl + "ConfirmCancellation";
export const cancellationPolicy = BusBaseUrl + "GetCancellationPolicy";
export const GetJourneyDateWiseCancellationPolicy =
  BusBaseUrl + "GetJourneyDateWiseCancellationPolicy";
export const GetRouteWiseCancellationPolicy =
  BusBaseUrl + "GetRouteWiseCancellationPolicy";
export const partialcancellationdetails =
  BusBaseUrl + "GetPartialCancellationDetails";
export const confirmpartialcancellation =
  BusBaseUrl + "ConfirmPartialCancellation";

export const getRouteMiddleCitySequence =
  BusBaseUrl + "GetRouteMiddleCitySequence";

//new Flight Api TRAVCLAN

export const travclanLogin =
  "https://trav-auth-sandbox.travclan.com/authentication/internal/service/login";

export const flightsearch = newAirlineURL + "search";
export const getFare = newAirlineURL + "fare-rules";
export const createItinerary = newAirlineURL + "itinerary";
export const getItinerary = newAirlineURL + "itinerary";
export const savePassenger = newAirlineURL + "itinerary";
export const reprice = newAirlineURL + "itinerary";
export const bookFlight = newAirlineURL + "itinerary";
export const walletApi = newAirlineURL + "wallet";
export const bookingget = newAirlineURL + "bookings";

export const Payment_Api = BaseUrl2 + "payment-initiate";

// Hotel API
const HotelBaseUrl = "https://hotel-api-sandbox.travclan.com/api/v1/";

export const locationAutosuggestApi = HotelBaseUrl + "locations/search/";
export const SearchHotelMainApi =
  "https://hotel-volt-api-sandbox.travclan.com/api/v1/search";

export const StaticContentApi = HotelBaseUrl + "hotels";
export const getRoomsandrates =
  "https://hotel-volt-api-sandbox.travclan.com/api/v1/roomsandrates";

export const priceCheckurl =
  "https://hotel-volt-api-sandbox.travclan.com/api/v1/price-check";

export const bookRoomHotelUrl =
  "https://hotel-volt-api-sandbox.travclan.com/api/v1/book";
