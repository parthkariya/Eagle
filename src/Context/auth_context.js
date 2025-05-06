import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import auth_reducer from "../Reducer/auth_reducer";
import Notification from "../Utils/Notification";

import {
  REGISTER_CUSTOMER_BEGIN,
  REGISTER_CUSTOMER_SUCCESS,
  REGISTER_CUSTOMER_FAIL,
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_BEGIN,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_OTP_BEGIN,
  FORGOT_PASSWORD_OTP_SUCCESS,
  FORGOT_PASSWORD_OTP_FAIL,
} from "../Actions";

import {
  ACCEPT_HEADER,
  change_password,
  forgot_password,
  login,
  login2,
  register,
  verify_otp,
} from "../Utils/Constant";
// import { useMallContext } from "./mall_context";

const initialState = {
  register_customer_loading: false,
  forgot_password_loading: false,
  forgot_password_otp_loading: false,
  register_customer_data: [],
  login_loading: false,
  login_data: {},
  is_token: "",
};

const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auth_reducer, initialState);
  //   const { is_login, is_token } = useMallContext();

  //   Register customer

  const RegisterCustomer = async (params) => {
    const url = "http://192.168.1.21:8069/signup_ecom"; // Fixed missing const
    dispatch({ type: REGISTER_CUSTOMER_BEGIN });
    try {
      const response = await axios.post(register, params, {
        headers: {
          Accept: ACCEPT_HEADER,
          //   Authorization: "Bearer " + is_token,
        },
      });
      const registercustomerdata = response.data;

      if (registercustomerdata.success == 1) {
        dispatch({
          type: REGISTER_CUSTOMER_SUCCESS,
          payload: registercustomerdata,
        });
        Notification("success", "Success!", response.data.message);
      } else if (registercustomerdata.success == 0) {
        Notification("error", "Error!", registercustomerdata.message);
        // alert(response.data.message);
        dispatch({ type: REGISTER_CUSTOMER_FAIL });
      } else {
        Notification("error", "Error!", response.data.message);
        //    alert(response.data.message);
        dispatch({ type: REGISTER_CUSTOMER_FAIL });
      }
      return response.data;
    } catch (error) {
      dispatch({ type: REGISTER_CUSTOMER_FAIL });
      //   ("error", error);
      console.log("err11", error);
    }
  };

  // const setLogin = async (params) => {
  //     const url = "http://192.168.1.21:8069/login_ecom"; // Fixed missing const
  //     dispatch({ type: LOGIN_BEGIN });

  //     try {
  //       const response = await axios.post(login, params,{
  //         headers: {
  //           api: ACCEPT_HEADER,
  //         },
  //       });

  //       const logindata = response.data;
  //       console.log("login data---login", logindata);
  //       if (logindata.status !== "failed") {
  //         dispatch({ type: LOGIN_SUCCESS, payload: logindata });

  //         localStorage.setItem("is_login", JSON.stringify(true));
  //         localStorage.setItem("logindata", JSON.stringify(logindata));
  //         localStorage.setItem("is_token", JSON.stringify(logindata.token));
  //         localStorage.setItem("is_id", JSON.stringify(logindata.user.id));
  //         localStorage.setItem("is_user", JSON.stringify(logindata.user));
  //         localStorage.setItem("is_role", JSON.stringify(logindata.user.role));

  //       } else {
  //         alert(logindata.message);
  //         dispatch({ type: LOGIN_FAIL });
  //       }

  //       return logindata; // Return the login data
  //     } catch (error) {
  //       dispatch({ type: LOGIN_FAIL });
  //       localStorage.setItem("is_login", JSON.stringify(false));
  //       console.error("Login error:", error);

  //       return null; // Explicitly return null on error
  //     }
  //   };

  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

  const isLocalhost = window.location.hostname === "localhost";

  const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";

  const setLogin = async (params) => {
    console.log("params", params);

    dispatch({ type: LOGIN_BEGIN });

    try {
      const response = await fetch(
        proxy + "https://omairiq.azurewebsites.net/login",
        {
          method: "POST",
          headers: {
            "api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      const responseData = await response.json(); // Parse response JSON

      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! Status: ${response.status}`
        );
      }
      if (responseData.status !== "failed") {
        dispatch({ type: LOGIN_SUCCESS, payload: responseData });

        localStorage.setItem("is_login_airiq", JSON.stringify(true));
        localStorage.setItem("logindata_airiq", JSON.stringify(responseData));
        localStorage.setItem(
          "is_token_airiq",
          JSON.stringify(responseData.token)
        );
        localStorage.setItem(
          "is_id_airiq",
          JSON.stringify(responseData.user.id)
        );
        localStorage.setItem(
          "is_user_airiq",
          JSON.stringify(responseData.user)
        );
        localStorage.setItem(
          "is_role_airiq",
          JSON.stringify(responseData.user.role)
        );
      } else {
        alert(responseData.message); // Show error message from API
        dispatch({ type: LOGIN_FAIL });
      }

      return responseData;
    } catch (err) {
      alert(err.message);
      dispatch({ type: LOGIN_FAIL });
      localStorage.setItem("is_login_airiq", JSON.stringify(false));
      console.log("Login error:", err.message);
      return null;
    }
  };

  const Loginn = async (params) => {
    dispatch({ type: LOGIN_BEGIN });

    try {
      const resp = await axios.post(login2, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      const loginData = resp.data;
      if (loginData.success == 1) {
        dispatch({ type: LOGIN_SUCCESS, payload: loginData });
        Notification("success", "Success!", loginData.message);
      } else {
        alert(loginData.message);
        dispatch({ type: LOGIN_FAIL });
      }
      return loginData;
    } catch (error) {
      dispatch({ type: LOGIN_FAIL });
      localStorage.setItem("is_login", JSON.stringify(false));
      console.error("Login error:", error);
      return null;
    }
  };

  const confirmOtp = async (params) => {
    dispatch({ type: LOGIN_BEGIN });

    try {
      const response = await axios.post(verify_otp, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });

      const verifyOtpData = response.data;

      if (verifyOtpData.success === 1) {
        dispatch({ type: LOGIN_SUCCESS, payload: verifyOtpData });

        console.log("Confirm OTP data:", verifyOtpData);

        localStorage.setItem("is_login", JSON.stringify(true));
        localStorage.setItem("logindata", JSON.stringify(verifyOtpData));
        localStorage.setItem("is_token", JSON.stringify(verifyOtpData.token));
        localStorage.setItem("is_id", JSON.stringify(verifyOtpData.user.id));
        localStorage.setItem("is_user", JSON.stringify(verifyOtpData.user));
        localStorage.setItem(
          "is_role",
          JSON.stringify(verifyOtpData.user.role)
        );
      } else {
        alert(verifyOtpData.message);
        // Notification("error", "Error !", verifyOtpData.message);
        dispatch({ type: LOGIN_FAIL });
      }

      return verifyOtpData;
    } catch (error) {
      alert(error.message);
      dispatch({ type: LOGIN_FAIL });
      localStorage.setItem("is_login", JSON.stringify(false));
      console.error("Login error:", error);
      return null;
    }
  };

  const forgotPassword = async (params) => {
    dispatch({ type: FORGOT_PASSWORD_BEGIN });
    try {
      const response = await axios.post(forgot_password, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      const logindata = response.data;

      if (logindata.success == 1) {
        // localStorage.setItem("cusimg", response.data.user.store_logo_path);
        Notification("success", "Success!", response.data.message);
        console.log("forgot password response", logindata);
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: logindata });
      } else {
        alert(logindata.message);
      }
      return response.data;
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_FAIL });
      console.log("forgot password error", error);
      console.log("error11", error);
    }
  };

  const forgotPasswordOtp = async (params) => {
    const url = "http://192.168.1.21:8069/forget_pasword_ecom"; // Fixed missing const

    dispatch({ type: FORGOT_PASSWORD_OTP_BEGIN });
    try {
      const response = await axios.post(change_password, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      const logindata = response.data;

      if (logindata.success == 1) {
        // localStorage.setItem("cusimg", response.data.user.store_logo_path);
        Notification("success", "Success!", response.data.message);
        console.log("forgot password response", logindata);
        dispatch({ type: FORGOT_PASSWORD_OTP_SUCCESS, payload: logindata });
      } else {
        alert(logindata.message);
      }
      return response.data;
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_OTP_FAIL });
      console.log("forgot password error", error);
      console.log("error11", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setLogin,
        confirmOtp,
        Loginn,
        RegisterCustomer,
        forgotPassword,
        forgotPasswordOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
