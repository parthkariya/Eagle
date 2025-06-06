// const BaseUrl2 = "https://plance.in/eagleconnect/public/api/v1/";
const BaseUrl2 = "https://erp.applified.co.in/eagleconnect/public/api/v1/";
const BaseUrl = "https://omairiq.azurewebsites.net/";
const AirIQLiveBaseUrl = "http://testairiq.mywebcheck.in/TravelAPI.svc/";

export const ACCEPT_HEADER = "application/x.eagleconnect.v1+json";

   const myHeaders = new Headers();
    myHeaders.append("Accept", "application/x.eagleconnect.v1+json");
    myHeaders.append("Content-Type", "application/json");

    export const ACCEPT_HEADER1 =  myHeaders

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
export const update_profile = BaseUrl + "update-profile";
export const recent_search = BaseUrl2 + "recent-search";
export const get_recent_search = BaseUrl2 + "get-recent-search";
export const logincurl = BaseUrl2 + "logincurl";
export const sectorscurl = BaseUrl2 + "sectorscurl";
export const availabilitycurl = BaseUrl2 + "availabilitycurl";
export const searchcurl = BaseUrl2 + "searchcurl";
export const bookcurl = BaseUrl2 + "bookcurl";
export const ticketcurl = BaseUrl2 + "ticketcurl";
export const supplieravailabilitycurl = BaseUrl2 + "supplieravailabilitycurl";
export const suppliersearchcurl = BaseUrl2 + "suppliersearchcurl";
export const supplierbookcurl = BaseUrl2 + "supplierbookcurl";
export const supplierticketcurl = BaseUrl2 + "supplierticketcurl";


// Air IQ API
export const sectors = BaseUrl + "sectors";
export const availability = BaseUrl + "availability";
export const search = BaseUrl + "search";



// Air IQ Live API
export const login_airiq_live = AirIQLiveBaseUrl + "Login";
export const availability_airiq_live = AirIQLiveBaseUrl + "Availability";
export const getFareRule_airiq_live = AirIQLiveBaseUrl + "GetFareRule";
