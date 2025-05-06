// const BaseUrl2 = "https://plance.in/eagleconnect/public/api/v1/";
const BaseUrl2 = "https://erp.applified.co.in/eagleconnect/public/api/v1/";
const BaseUrl = "https://omairiq.azurewebsites.net/";

export const ACCEPT_HEADER = "application/x.eagleconnect.v1+json";

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

// Air IQ API
export const sectors = BaseUrl + "sectors";
export const availability = BaseUrl + "availability";
export const search = BaseUrl + "search";
