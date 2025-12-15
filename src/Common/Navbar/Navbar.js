import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";
import { IoCloseCircle, IoLogOut } from "react-icons/io5";
import ReactModal from "react-modal";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "../../Context/auth_context";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import {
  ACCEPT_HEADER,
  bookseatdetails,
  FetchTicketPrintData,
  get_state,
  getcompanylist,
  getcurrentaccountbalance,
  TicketStatus,
  TicketStatusApi,
  verifyCall,
  walletApi,
} from "../../Utils/Constant";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GrGoogle } from "react-icons/gr";
import { jwtDecode } from "jwt-decode";
import { LoginSocialFacebook } from "reactjs-social-login";
import { SiFacebook } from "react-icons/si";
import { LOGIN_BEGIN_AIR_LIVE } from "../../Actions";
import { useBusContext } from "../../Context/bus_context";
import Notification from "../../Utils/Notification";
import { useFlightContext } from "../../Context/flight_context";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    backgroundColor: "none",
    border: "none",
    borderRadius: "10px",
  },
  overlay: {
    zIndex: 10000,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
};
const Navbar = () => {
  const {
    GetBookSeatDetailsApi,
    fetchTicketPrintDataApi,
    TicketStatusApi,
    selectedTab,
  } = useBusContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenBookTicket, setisModalOpenBookTicket] = useState(false);
  const [getemail, setEmail] = useState("");
  const [getpassword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, SetLogin] = useState("");
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [userRole, setUserRole] = useState("agent");
  const [customernames, setCustomernames] = useState("");
  const [customeremail, setCustomeremail] = useState("");
  const [customerpassword, setCustomerpassword] = useState("");
  const [customerconfirmpassword, setCustomerconfirmpassword] = useState("");
  const [customermobile, setCustomermobile] = useState("");
  const [customerairportcode, setCustomerairportcode] = useState("");
  const [agentnames, setAgentnames] = useState("");
  const [agentemail, setAgentemail] = useState("");
  const [agentpassword, setAgentpassword] = useState("");
  const [agentconfirmpassword, setAgentconfirmpassword] = useState("");
  const [agentmobile, setAgentmobile] = useState("");
  const [agentairportcode, setAgentairportcode] = useState("");
  const [agentcompanyname, setAgentcompanyname] = useState("");
  const [agentcompanyaddress, setAgentcompanyaddress] = useState("");
  const [agentstate, setAgentstate] = useState("");
  const [agentcity, setAgentcity] = useState("");
  const [agentpincode, setAgentpincode] = useState("");
  const [agentgst, setAgentgst] = useState("");
  const [agentpan, setAgentpan] = useState("");
  const [agentaadhar, setAgentaadhar] = useState("");
  const [agentAccountNo, setAgentAccountNo] = useState("");
  const [agentBenificiaryName, setAgentBenificiaryName] = useState("");
  const [agentIfscCode, setAgentIfscCode] = useState("");
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [agentpanImage, setAgentpanImage] = useState(null);
  const [cancelcheque, setCancelCheque] = useState(null);
  const [getStateArray, SetState_Array] = useState([]);
  const [otpcondition, setOtpCondition] = useState(false);
  const [pnrNumber, setPnrNumber] = useState("");
  const [forgotemail, setForgotEmail] = useState("");
  const [condition, setCondition] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmnewPassword, setConfirmNewPassword] = useState("");

  const [showsignupconfirmPassword, setShowsignupConfirmPassword] =
    useState(false);
  const [showsignupPassword, setShowsignupPassword] = useState(false);

  const [agentshowPassword, setAgentShowPassword] = useState(false);
  const [agentshowconfirmPassword, setAgentShowConfirmPassword] =
    useState(false);

  const [userr, setUser] = useState("");
  // console.log("user", userr);

  const onDropAadharFront = (acceptedFiles) => {
    setAadharFront(acceptedFiles[0]);
  };
  const onDropAadharBack = (acceptedFiles) => {
    setAadharBack(acceptedFiles[0]);
  };
  const onDropPanImage = (acceptedFiles) => {
    setAgentpanImage(acceptedFiles[0]);
  };
  const onDropCancelCheque = (acceptedFiles) => {
    setCancelCheque(acceptedFiles[0]);
  };

  const {
    getRootProps: getRootPropsAadharFront,
    getInputProps: getInputPropsAadharFront,
  } = useDropzone({
    onDrop: onDropAadharFront,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsAadharBack,
    getInputProps: getInputPropsAadharBack,
  } = useDropzone({
    onDrop: onDropAadharBack,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsPanImage,
    getInputProps: getInputPropsPanImage,
  } = useDropzone({
    onDrop: onDropPanImage,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsCancelCheque,
    getInputProps: getInputPropsCancelCheque,
  } = useDropzone({
    onDrop: onDropCancelCheque,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const regEx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {
    setLogin,
    is_login,
    Loginn,
    confirmOtp,
    RegisterCustomer,
    forgotPassword,
    forgotPasswordOtp,
    login_loading,
    register_customer_loading,
    forgot_password_loading,
    forgot_password_otp_loading,
    LoginnAirLive,
    companyListBusApi,
    currentAccountBalanceApi,
    currentaccountbalance,
    NewLoginAPi,
  } = useAuthContext();

  const { GetBalance, balance_data } = useFlightContext();

  let navigate = useNavigate();

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    SetLogin(islogin);
    var user = localStorage.getItem("is_user");
    setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    currentAccountBalApi();
    FlightBalance();
    companyListApi();
    GetState();
  }, []);

  const handleSubmitPNR = () => {
    // your submit logic here
    // console.log("Submitted PNR:", pnrNumber);
    if (!pnrNumber || pnrNumber.trim() === "") {
      Notification("error", "Error!", "Please enter a valid PNR number.");
    }
    getBookSeatDetails();
  };

  const handlePrintPNR = () => {
    // your print logic here
    // window.print(); // or custom print logic
    getPrintTicket();
  };

  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload(false);
  }

  const modalopen2 = () => {
    setIsModalOpen2(true);
  };
  const modalopen3 = () => {
    setIsModalOpen3(true);
  };

  const getBookSeatDetails = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", bookseatdetails);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("pnrNo", pnrNumber);

    const data = await GetBookSeatDetailsApi(formdata);

    if (data) {
      console.log("get book seat data", data);
      if (data.status == 1) {
        setPnrNumber("");
      }
    }
  };

  const getPrintTicket = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", FetchTicketPrintData);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("pnrNo", pnrNumber);

    const data = await fetchTicketPrintDataApi(formdata);

    if (data) {
      console.log("get book seat data", data);
      if (data.status == 1) {
        setPnrNumber("");
      }
    }
  };

  const Login = async (e) => {
    // Create JSON object (Raw Data format)
    const params = {
      Username: "9555202202",
      Password: "112233344",
    };

    // Call API with JSON data
    const data = await setLogin(params);
    if (data) {
      console.log("data", data);
      // LoginAirLive();
      // if (data.success === 1) {
      // setIsModalOpen(false);
      // setEmail("");
      // setPassword("");
      // window.location.reload(false);
      // }
    }
  };

  // Company List API

  const companyListApi = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", getcompanylist);
    await formdata.append("verifyCall", verifyCall);

    const data = await companyListBusApi(formdata);
  };

  //  Current Account Balance API BUS
  const currentAccountBalApi = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", getcurrentaccountbalance);
    await formdata.append("verifyCall", verifyCall);

    const data = await currentAccountBalanceApi(formdata);
    if (data) {
      // window.location.reload(false);
    }
  };

  //  Flight Balance
  const FlightBalance = async () => {
    const token = localStorage.getItem("accessToken");

    const formdata = new FormData();
    formdata.append("type", "GET");
    formdata.append("url", walletApi);
    formdata.append("url_token", `Bearer ${token}`);

    await GetBalance(formdata);
  };

  // Login Air Live api

  const LoginAirLive = async (e) => {
    // Create JSON object (Raw Data format)
    const params = {
      AgentID: "AQAG053817",
      Username: "9898322222",
      Password: "9898322222",
    };

    // Call API with JSON data
    const data = await LoginnAirLive(params);
    if (data) {
      console.log("data", data);
      // if (data.success === 1) {
      // setIsModalOpen(false);
      // setEmail("");
      // setPassword("");
      // window.location.reload(false);
      // }
    }
  };

  const LoGin = async (e, email) => {
    try {
      if (e == 0 || e === "0") {
        if (getemail === "") {
          alert("Enter the Email.....!");
          return;
        } else if (regEx.test(getemail) === false) {
          alert("Enter the valid Email....!");
          return;
        } else {
          const formdata = new FormData();
          formdata.append("email", getemail);
          formdata.append("login_type", e);

          const data = await Loginn(formdata);
          if (data && data.success == 1) {
            setOtpCondition(true);
          }
        }
      } else {
        const formdata = new FormData();
        formdata.append("email", email);
        formdata.append("login_type", e);
        const data = await Loginn(formdata);
        if (data.success == 1) {
          localStorage.setItem("is_login", JSON.stringify(true));
          localStorage.setItem("logindata", JSON.stringify(data));
          localStorage.setItem("is_token", JSON.stringify(data.token));
          localStorage.setItem("is_id", JSON.stringify(data.user.id));
          localStorage.setItem("is_user", JSON.stringify(data.user));
          localStorage.setItem("is_role", JSON.stringify(data.user.role));
          await Login();
          await NewLoginAPi();
          await companyListApi();
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error in LoGin:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const ConfirmOtp = async () => {
    try {
      if (getpassword === "") {
        alert("Enter OTP....!");
        return;
      } else {
        const formdata = new FormData();
        formdata.append("otp", getpassword);
        formdata.append("email", getemail);
        const data = await confirmOtp(formdata);

        if (data && data.success == 1) {
          await NewLoginAPi();
          await Login();
          await companyListApi();
          setIsModalOpen(false);
          setEmail("");
          setPassword("");
          window.location.reload();
          // navigate("/profile-page");
        }
      }
    } catch (error) {
      console.error("Error in ConfirmOtp:", error);
      alert("An error occurred during OTP confirmation. Please try again.");
    }
  };

  // Signup api

  const Signin = async (type) => {
    const errors = [];
    const minLength = 8;
    const hasNumber = /[0-9]/.test(getpassword);
    const hasUpperCase = /[A-Z]/.test(getpassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(getpassword);

    if (customernames === "") {
      alert("Enter the Name......!");
    } else if (customermobile === "") {
      alert("Enter the Mobile No......!");
    } else if (customeremail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(customeremail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else if (customerpassword === "") {
      alert("Enter the Password......!");
      return;
    } else if (customerconfirmpassword === "") {
      alert("Enter the Confirm Password....!");
      return;
    } else if (customerconfirmpassword !== customerconfirmpassword) {
      alert("Password and confirm password are not same....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("role", 2);
      await formdata.append("first_name", customernames);
      await formdata.append("email", customeremail);
      await formdata.append("password", customerpassword);
      await formdata.append("confirm_password", customerconfirmpassword);
      await formdata.append("mobile_no", customermobile);
      await formdata.append("nearest_airport_code", customerairportcode);

      const data = await RegisterCustomer(formdata);
      if (data) {
        if (data.success == 1) {
          setIsModalOpen2(false);
          setCustomernames("");
          setCustomermobile("");
          setCustomeremail("");
          setCustomerpassword("");
          setCustomerconfirmpassword("");
          setCustomerairportcode("");

          // window.location.reload(false);
        } else if (data.success == 1) {
          setIsModalOpen2(false);
          setCustomernames("");
          setCustomermobile("");
          setCustomeremail("");
          setCustomerpassword("");
          setCustomerconfirmpassword("");
          setCustomerairportcode("");

          // window.location.reload(false);
        }
      }
    }
  };

  // Signup api

  const SigninAgent = async (type) => {
    const errors = [];
    const minLength = 8;
    const hasNumber = /[0-9]/.test(getpassword);
    const hasUpperCase = /[A-Z]/.test(getpassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(getpassword);

    if (agentnames === "") {
      alert("Enter the Name......!");
    } else if (agentmobile === "") {
      alert("Enter the Mobile No......!");
    } else if (agentemail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(agentemail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else if (agentairportcode === "") {
      alert("Enter Nearest Airport Code....!");
      return;
    } else if (agentstate === "") {
      alert("Select State....!");
      return;
    } else if (agentcompanyname === "") {
      alert("Enter Company Name....!");
      return;
    } else if (agentcompanyaddress === "") {
      alert("Enter Company Address....!");
      return;
    } else if (agentcity === "") {
      alert("Enter City Name....!");
      return;
    } else if (agentpincode === "") {
      alert("Enter ZipCode....!");
      return;
    } else if (agentaadhar === "") {
      alert("Enter Aadhar Number....!");
      return;
    } else if (agentpan === "") {
      alert("Enter PAN Number....!");
      return;
    } else if (aadharFront === null) {
      alert("Upload Aadhar Card Front Side....!");
      return;
    } else if (aadharBack === null) {
      alert("Upload Aadhar Card Back Side....!");
      return;
    } else if (agentpanImage === null) {
      alert("Upload PAN Card Image....!");
      return;
    } else if (cancelcheque === null) {
      alert("Upload Cancel Cheque Image....!");
      return;
    } else if (agentIfscCode === "") {
      alert("Enter IFSC Code....!");
      return;
    } else if (agentAccountNo === "") {
      alert("Enter Account Number....!");
      return;
    } else if (agentBenificiaryName === "") {
      alert("Enter Benificiary Name....!");
      return;
    } else if (agentgst === "") {
      alert("Enter GST Number....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("role", 3);
      await formdata.append("first_name", agentnames);
      await formdata.append("email", agentemail);
      await formdata.append("mobile_no", agentmobile);
      await formdata.append("nearest_airport_code", agentairportcode);
      await formdata.append("company_name", agentcompanyname);
      await formdata.append("address", agentcompanyaddress);
      await formdata.append("adhar_no", agentaadhar);
      await formdata.append("pan_no", agentpan);
      await formdata.append("gst_no", agentgst);
      await formdata.append("state_code", agentstate);
      await formdata.append("city", agentcity);
      await formdata.append("zip", agentpincode);
      await formdata.append("benefi_acc_no", agentAccountNo);
      await formdata.append("ifsc_code", agentIfscCode);
      await formdata.append("benefi_acc_name", agentBenificiaryName);
      if (aadharFront) {
        formdata.append("adhar_front", aadharFront);
      }
      if (aadharBack) {
        formdata.append("adhar_back", aadharBack);
      }
      if (agentpanImage) {
        formdata.append("pan_img", agentpanImage);
      }
      if (cancelcheque) {
        formdata.append("blank_cheque_img", cancelcheque);
      }

      console.table(Object.fromEntries(formdata.entries()));

      const data = await RegisterCustomer(formdata);
      if (data) {
        if (data.success == 1) {
          setIsModalOpen2(false);
          setAgentnames("");
          setAgentmobile("");
          setAgentemail("");
          setAgentpassword("");
          setAgentconfirmpassword("");
          setAgentairportcode("");
          setAgentcompanyname("");
          setAgentcompanyaddress("");
          setAgentstate("");
          setAgentaadhar("");
          setAgentpan("");
          setAgentcity("");
          setAgentpincode("");
          setAadharFront(null);
          setAadharBack(null);
          setAgentpanImage(null);
          setCancelCheque(null);
          setAgentgst("");
          setUserRole("agent");
          setAgentAccountNo("");
          setAgentIfscCode("");
          setAgentBenificiaryName("");

          // window.location.reload(false);
        }

        // else if (data.success == 1) {
        //   setIsModalOpen2(false);
        //   setAgentnames("");
        //   setAgentmobile("");
        //   setAgentemail("");
        //   setAgentpassword("");
        //   setAgentconfirmpassword("");
        //   setAgentairportcode("");
        //   setAgentcompanyname("");
        //   setAgentcompanyaddress("");
        //   setAgentstate("");
        //   setAgentcity("");
        //   setAgentpincode("");
        //   setAadharFront(null);
        //   setAadharBack(null);
        //   setAgentpanImage(null);
        //   setAgentgst("");
        //   // window.location.reload(false);
        // }
      }
    }
  };

  const ForgotPassApi = async (e) => {
    if (forgotemail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(forgotemail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("email", forgotemail);

      //
      const data = await forgotPassword(formdata);
      if (data) {
        if (data.success == 1) {
          setForgotEmail("");
          // setIsModalOpen3(false);
          setCondition(true);
        }
      }
    }
  };

  const ForgotPassOtpApi = async (e) => {
    if (otp === "") {
      alert("Enter the Email......!");
      return;
    } else if (newPassword === "") {
      alert("Enter the Password....!");
      return;
    } else if (confirmnewPassword === "") {
      alert("Enter the Confirm Password....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("otp", otp);
      await formdata.append("password", newPassword);
      await formdata.append("confirm_password", confirmnewPassword);

      //
      const data = await forgotPasswordOtp(formdata);
      if (data) {
        if (data.success == 1) {
          setCondition(false);
          setIsModalOpen3(false);
        }
      }
    }
  };

  const GetState = async () => {
    axios
      .get(get_state, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      })
      .then((res) => {
        if (res.data.success == 1) {
          // console.log("state data are", res.data);
          SetState_Array(res.data.data);
        } else {
        }
      })
      .catch((err) => {
        console.log("error11", err);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const modalopen = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = (resp) => {
    // setLoginType(1);
    // console.log("login", resp);
    const decode = jwtDecode(resp?.credential);
    setEmail(decode?.email);
    console.log(decode);
    LoGin(1, decode?.email);

    // window.location.reload(false);
  };

  const handleError = (err) => {
    console.log("err", err);
  };

  const [hoverOpen, setHoverOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const BusGetCurrentAccountBalance = async () => {
    try {
      const response = axios.post(
        getcurrentaccountbalance,
        {
          verifyCall: "ITS_UAT_74396040927B60436124249057b187C5erBNMLQo33ec3",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      console.log("Company List Navbar :", response.data.data);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        position: "sticky",
        top: "0px",
        zIndex: "999",
        backgroundColor: "var(--color-white)",
      }}
    >
      <div className="container containernav">
        <div className="navbarcont">
          {/* Logo */}
          <div>
            <Link to={"/"} className="linkHover">
              <img src={images.logo2} className="logoimg" alt="Logo" />
            </Link>
          </div>

          <div className="alllinks d-none d-md-flex">
            <Link to={"/"} className="navlinks">
              Home
            </Link>

            <Link to={"/about"} className="navlinks">
              About Us
            </Link>
            <Link to={"/contactus"} className="navlinks">
              Contact Us
            </Link>
            {login === "true" ? (
              <>
                {/* <div className="navlinks"
                onClick={logout}
              >
                <IoLogOut size={25} style={{ marginBottom: "3px" }} />
              </div> */}
                <div className="drop_down" ref={dropdownRef}>
                  <Link className="navlinks">
                    {/* <FaUser
                      size={20}
                      onClick={() => setHoverOpen(!hoverOpen)}
                    /> */}
                    <div
                      className="nav_acc_first_later"
                      onClick={() => setHoverOpen(!hoverOpen)}
                    >
                      {userr?.email && (
                        <div
                          className="navlinks d-block d-lg-block"
                          style={{
                            fontSize: "14px",
                            color: "#fff",
                            fontWeight: "600",
                          }}
                        >
                          {userr.email.charAt(0)}
                        </div>
                      )}
                    </div>
                  </Link>

                  {hoverOpen ? (
                    <div
                      className={`drop_down_content ${
                        hoverOpen ? "drop_down_content_open" : ""
                      }`}
                    >
                      <div className="d-block d-md-none d-lg-block text-center mb-3">
                        <div
                          className="fs-6 fw-bold "
                          style={{ color: "#362a60" }}
                        >
                          Current Balance
                        </div>
                        <div className="fw-bold" style={{ color: "#362a60" }}>
                          &#8377;{" "}
                          {selectedTab === "flights"
                            ? balance_data
                            : currentaccountbalance}
                        </div>
                      </div>

                      {userr?.email && (
                        <div
                          className="navlinks text-center d-block d-md-none d-lg-block"
                          style={{
                            fontSize: "11px",
                            maxWidth: "100%",
                            textTransform: "none",
                            marginBottom: "0.4rem",
                            wordWrap: "break-word",
                          }}
                        >
                          {userr?.email}
                        </div>
                      )}
                      <div
                        className="d-flex align-items-center w-100 gap-3"
                        style={{ marginBottom: "0.2rem" }}
                      >
                        <MdDashboard color="#362a60" size={20} />
                        <Link
                          to={"/dashboard"}
                          className="navlinks"
                          onClick={() => setHoverOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </div>

                      {/* <div
                        className="d-flex align-items-center w-100 gap-3"
                        style={{ marginBottom: "0.2rem" }}
                      >
                        <FaUserCircle color="#362a60" size={20} />
                        <Link
                          to={"/profile"}
                          className="navlinks"
                          onClick={() => setHoverOpen(false)}
                        >
                          Profile
                        </Link>
                      </div> */}
                      <div className="d-flex align-items-center w-100 gap-3">
                        <IoLogOut color="#362a60" size={20} />
                        <span className="navlinks" onClick={logout}>
                          Logout
                        </span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {/* 
                {userr?.email && (
                  <div className="navlinks d-block d-md-none d-lg-block">
                    ({userr?.email})
                  </div>
                )} */}
              </>
            ) : (
              <>
                <div className="navlinks" onClick={modalopen}>
                  <FaUserPlus size={25} style={{ marginBottom: "5px" }} />
                </div>
              </>
            )}

            {/* <div className="navlinks" onClick={modalopen2}>SignUP</div> */}
          </div>

          {/* Menu button for mobile */}
          {/* {login === false && isMenuOpen == true ? <> */}

          {/* </> : <></>} */}
          <div
            className="d-md-none"
            style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
          >
            {login === "true" ? (
              <></>
            ) : (
              <>
                <div className="navlinks" onClick={modalopen}>
                  <FaUserPlus size={25} />
                </div>
              </>
            )}

            <button className="d-md-none menubtn" onClick={toggleMenu}>
              {isMenuOpen ? (
                <RiCloseFill color="black" size={24} />
              ) : (
                <RiMenu3Fill color="black" size={24} />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}

        <div className={`mobileMenu ${isMenuOpen ? "open" : "close"}`}>
          <div className="responsivenavmain d-flex d-md-none">
            {userr?.email && <div className="navlinks">({userr?.email})</div>}
            <Link to={"/"} className="navlinks" onClick={toggleMenu}>
              Home
            </Link>
            {login === "true" ? (
              <>
                <Link
                  to={"/dashboard"}
                  className="navlinks"
                  onClick={toggleMenu}
                >
                  DashBoard
                </Link>
                {/* <Link to={"/profile"} className="navlinks" onClick={toggleMenu}>
                  Profile
                </Link> */}
              </>
            ) : (
              <></>
            )}
            <Link to={"/about"} className="navlinks" onClick={toggleMenu}>
              About Us
            </Link>
            <Link to={"/contactus"} className="navlinks" onClick={toggleMenu}>
              Contact Us
            </Link>
            {login === "true" ? (
              <Link
                className="navlinks"
                onClick={() => {
                  toggleMenu();
                  logout();
                }}
              >
                Logout
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={isModalOpen}
        style={customStyles}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <IoCloseCircle color="#e8381b" size={30} />
          </button>
          <div className="d-flex text-center my-4">
            <p
              className="fw-bold fs-4"
              style={{ color: "#362a60", marginBottom: "0px" }}
            >
              LOGIN
            </p>
          </div>

          <div className="modal_Logodiv">
            <img src={images.logo2} alt="" />
          </div>
          <div className="modal_headingdiv mt-4">
            <p className="fs-5">
              Welcome To{" "}
              <span style={{ fontWeight: "bolder", color: "#ff690f" }}>
                EagleConnect
              </span>{" "}
            </p>
          </div>

          <div className="modal_inputdiv">
            <div className="modal_inptheading">Email*</div>
            <input
              type="text"
              placeholder="Enter your Email"
              className="w-100 text-start modal_input"
              value={getemail}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpcondition ? true : false}
            />
          </div>
          {otpcondition ? (
            <div className="modal_inputdiv">
              <div className="modal_inptheading">OTP *</div>
              <div className="password-container">
                <input
                  placeholder="Enter OTP"
                  className="w-100 text-start modal_input2"
                  value={getpassword}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* <div className="forgot-getpassword text-end mt-3 w-100">
            <span
              className="signupbtn"
              style={{ color: "#362a60" }}
              // onClick={modalopen3}
            >
              Forgot Password?
            </span>
          </div> */}
          <div className="text-center my-4 ">
            <button
              disabled={login_loading === true ? true : false}
              style={{ opacity: login_loading === true ? "0.6" : "1" }}
              className="login-btn"
              onClick={() => {
                otpcondition === false ? LoGin(0, "") : ConfirmOtp();
              }}
            >
              {login_loading === true
                ? "Loading..."
                : otpcondition === false
                ? "Get OTP"
                : "Login"}
            </button>
          </div>

          <GoogleOAuthProvider clientId="856653713383-9f4a28rhes7lv6lakjb98tuh81ohattr.apps.googleusercontent.com">
            <GoogleLogin onSuccess={handleSuccess} onError={handleError}>
              <div
                className="d-flex text-secondary align-items-center gap-2 fw-bold"
                style={{ cursor: "pointer" }}
              >
                <GrGoogle size={18} />
                Continue with Google
              </div>
            </GoogleLogin>
          </GoogleOAuthProvider>
          {/* <LoginSocialFacebook
            appId="525183903968544"
            className={"mt-3"}
            onResolve={(res) => {
              console.log("FB NO RES ", res);
            }}
            onReject={(err) => {
              console.log("FB NI ERR", err);
            }}
          >
            <div
              className={"d-flex align-items-center gap-2"}
              style={{ cursor: "pointer" }}
            >
              <SiFacebook color="blue" size={18} />
              Continue with FaceBook
            </div>
          </LoginSocialFacebook> */}
          <div className="mt-3">
            Don't have an Account yet ?{" "}
            <span className="fw-bold signupbtn" onClick={modalopen2}>
              Signup For Agent{" "}
            </span>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isModalOpen2}
        style={customStyles}
        onRequestClose={() => setIsModalOpen2(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsModalOpen2(false);
            }}
          >
            <IoCloseCircle color="#e8381b" size={30} />
          </button>
          <div className="d-flex text-center my-3">
            <p className="fw-bold fs-4" style={{ color: "#362a60" }}>
              REGISTER
            </p>
          </div>

          <div className="d-flex justify-content-center align-items-center role-selection mb-3">
            {/* <label className="radio-label">
              <input
                type="radio"
                name="userRole"
                value="customer"
                checked={userRole === "customer"}
                onChange={() => setUserRole("customer")}
              />
              <span className="custom-radio"></span>
              Customer
            </label> */}

            <label className="radio-label ms-4">
              <input
                type="radio"
                name="userRole"
                value="agent"
                checked={userRole === "agent"}
                onChange={() => setUserRole("agent")}
              />
              <span className="custom-radio"></span>
              Agent
            </label>
          </div>

          {userRole === "customer" ? (
            <>
              {/* <div className="input-container">
                <div className="input-group">
                  <label className="input-heading">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-field"
                    value={customernames}
                    onChange={(e) => setCustomernames(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-heading">Mobile *</label>
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    className="input-field"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setCustomermobile(value);
                    }}
                    maxLength={10}
                    value={customermobile}
                  />
                </div>

                <div className="input-group">
                  <label className="input-heading">Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field"
                    value={customeremail}
                    onChange={(e) => setCustomeremail(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Password *</label>
                    <div className="password-container">
                      <input
                        type={showsignupPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="input-field"
                        value={customerpassword}
                        onChange={(e) => setCustomerpassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setShowsignupPassword(!showsignupPassword)
                        }
                      >
                        {showsignupPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">Confirm Password *</label>
                    <div className="password-container">
                      <input
                        type={showsignupconfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="input-field"
                        value={customerconfirmpassword}
                        onChange={(e) =>
                          setCustomerconfirmpassword(e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setShowsignupConfirmPassword(
                            !showsignupconfirmPassword
                          )
                        }
                      >
                        {showsignupconfirmPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-heading">Nearest Airport Code </label>
                  <input
                    type="text"
                    placeholder="Enter airport code"
                    className="input-field"
                    value={customerairportcode}
                    onChange={(e) => setCustomerairportcode(e.target.value)}
                  />
                </div>
              </div> */}
            </>
          ) : (
            <>
              <div className="input-container">
                <div className="input-group">
                  <label className="input-heading">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-field"
                    value={agentnames}
                    onChange={(e) => setAgentnames(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-heading">Mobile *</label>

                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    className="input-field"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                      setAgentmobile(value);
                    }}
                    maxLength={10}
                    value={agentmobile}
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label className="input-heading">Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field"
                    value={agentemail}
                    onChange={(e) => setAgentemail(e.target.value)}
                  />
                </div>

                {/* Password & Confirm Password (Side by Side) */}
                {/* <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Password *</label>
                    <div className="password-container">
                      <input
                        type={agentshowPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="input-field"
                        value={agentpassword}
                        onChange={(e) => setAgentpassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setAgentShowPassword(!agentshowPassword)}
                      >
                        {agentshowPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">Confirm Password *</label>
                    <div className="password-container">
                      <input
                        type={agentshowconfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="input-field"
                        value={agentconfirmpassword}
                        onChange={(e) =>
                          setAgentconfirmpassword(e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setAgentShowConfirmPassword(!agentshowconfirmPassword)
                        }
                      >
                        {agentshowconfirmPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div> */}

                {/* Nearest Airport Code */}
                <div className="input-group">
                  <label className="input-heading">
                    Nearest Airport Code *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter airport code"
                    className="input-field"
                    value={agentairportcode}
                    onChange={(e) => setAgentairportcode(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-heading">Company Name *</label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    className="input-field"
                    value={agentcompanyname}
                    onChange={(e) => setAgentcompanyname(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-heading">Address *</label>
                  <textarea
                    type="text"
                    placeholder="Enter address"
                    className="input-field"
                    value={agentcompanyaddress}
                    onChange={(e) => setAgentcompanyaddress(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-heading">State *</label>
                  <select
                    className="input-field"
                    value={agentstate}
                    onChange={(e) => setAgentstate(e.target.value)}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {getStateArray &&
                      getStateArray.map((item, index) => {
                        return (
                          <option value={item.id} key={index}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">City *</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="input-field"
                      value={agentcity}
                      onChange={(e) => setAgentcity(e.target.value)}
                    />
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">ZipCode *</label>
                    <input
                      type="text"
                      placeholder="Enter zipcode"
                      className="input-field"
                      value={agentpincode}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          setAgentpincode(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Aadhar No. *</label>
                    <input
                      type="text"
                      placeholder="Enter adhar number"
                      className="input-field"
                      value={agentaadhar}
                      maxLength={12}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        setAgentaadhar(numericValue);
                      }}
                    />
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">PAN No. *</label>
                    <input
                      type="text"
                      placeholder="Enter PAN number"
                      className="input-field"
                      value={agentpan}
                      onChange={(e) => setAgentpan(e.target.value)}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Aadhar Front *</label>
                    <div
                      {...getRootPropsAadharFront()}
                      className="dropzone-area"
                    >
                      <input {...getInputPropsAadharFront()} />
                      {aadharFront ? (
                        <div className="input-field">{aadharFront.name}</div>
                      ) : (
                        <p className="input-field">select an Image</p>
                      )}
                    </div>
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">Aadhar Back * </label>
                    <div
                      {...getRootPropsAadharBack()}
                      className="dropzone-area"
                    >
                      <input {...getInputPropsAadharBack()} />
                      {aadharBack ? (
                        <div className="input-field">{aadharBack.name}</div>
                      ) : (
                        <p className="input-field">select an Image</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">PAN Image Upload *</label>
                    <div {...getRootPropsPanImage()} className="dropzone-area">
                      <input {...getInputPropsPanImage()} />
                      {agentpanImage ? (
                        <div className="input-field">{agentpanImage?.name}</div>
                      ) : (
                        <p className="input-field">Select an image</p>
                      )}
                    </div>
                  </div>
                  <div className="input-group w-50">
                    <label className="input-heading">
                      Cancel Cheque Image *
                    </label>
                    <div
                      {...getRootPropsCancelCheque()}
                      className="dropzone-area"
                    >
                      <input {...getInputPropsCancelCheque()} />
                      {agentpanImage ? (
                        <div className="input-field">{cancelcheque?.name}</div>
                      ) : (
                        <p className="input-field">Select an image</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-heading">Benificiary Name *</label>
                  <input
                    type="text"
                    placeholder="Enter Benificiary Name"
                    className="input-field"
                    value={agentBenificiaryName}
                    onChange={(e) => setAgentBenificiaryName(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Account No.* </label>
                    <input
                      type="text"
                      placeholder="Enter Account Number"
                      className="input-field"
                      inputMode="numeric"
                      maxLength={15}
                      value={agentAccountNo}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        setAgentAccountNo(numericValue);
                      }}
                    />
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">IFSC Code*</label>
                    <input
                      type="text"
                      placeholder="Enter IFSC Code"
                      className="input-field"
                      value={agentIfscCode}
                      maxLength={11}
                      onChange={(e) => setAgentIfscCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-heading">GST No. *</label>
                  <input
                    type="text"
                    placeholder="Enter GST number"
                    className="input-field"
                    value={agentgst}
                    maxLength={15}
                    onChange={(e) => setAgentgst(e.target.value)}
                  />
                </div>

                <div className="text-secondary">
                  For billing purposes please submit your GST details.In case
                  you do not have GST, please write NA
                </div>
              </div>
            </>
          )}
          <button
            disabled={register_customer_loading === true ? true : false}
            style={{
              opacity: register_customer_loading === true ? "0.6" : "1",
            }}
            className="register-btn"
            onClick={() => {
              SigninAgent();
            }}
          >
            {register_customer_loading === "true" ? "Loading..." : "Register"}
          </button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isModalOpen3}
        style={customStyles}
        onRequestClose={() => setIsModalOpen3(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsModalOpen3(false);
            }}
          >
            <IoCloseCircle color="#ddb46b" size={30} />
          </button>

          <div className="d-flex text-center my-4">
            <p
              className="fw-bold fs-4"
              style={{ color: "#362a60", marginBottom: "0px" }}
            >
              Forgot Password
            </p>
          </div>
          {condition != true ? (
            <>
              <div className="modal_inputdiv">
                <div className=" modal_inptheading">Email *</div>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-100 text-start modal_input"
                  value={forgotemail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="text-secondary mt-3 d-flex justify-content-start w-100">
            Enter Your Email we will send you a OTP
          </div>

          {condition ? (
            <>
              <div className="modal_inputdiv">
                <div className=" modal_inptheading">OTP</div>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  className="w-100 text-start modal_input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="modal_inputdiv">
                <div className=" modal_inptheading">New Password</div>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="w-100 text-start modal_input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="modal_inputdiv">
                <div className=" modal_inptheading">Confirm Password</div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-100 text-start modal_input"
                  value={confirmnewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          {condition ? (
            <button
              disabled={forgot_password_otp_loading === true ? true : false}
              className="btn w-100 mt-3"
              style={{
                backgroundColor: "#ddb46b",
                color: "#fff",
                opacity: forgot_password_loading === true ? "0.6" : "1",
              }}
              onClick={() => {
                ForgotPassOtpApi();
              }}
            >
              {forgot_password_otp_loading === true ? "Loading..." : "Submit"}
            </button>
          ) : (
            <button
              disabled={forgot_password_loading === true ? true : false}
              className="btn w-100 mt-3"
              style={{
                backgroundColor: "#ddb46b",
                color: "#fff",
                opacity: forgot_password_loading === true ? "0.6" : "1",
              }}
              onClick={() => {
                // setCondition(true);
                ForgotPassApi();
              }}
            >
              {forgot_password_loading === true ? "Loading..." : "Send OTP"}
            </button>
          )}
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isModalOpenBookTicket}
        style={customStyles}
        onRequestClose={() => setisModalOpenBookTicket(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => setisModalOpenBookTicket(false)}
          >
            <IoCloseCircle color="#e8381b" size={30} />
          </button>

          <div className="d-flex text-center my-4">
            <p
              className="fw-bold fs-4"
              style={{ color: "#362a60", marginBottom: "0px" }}
            >
              Enter PNR Number
            </p>
          </div>

          <div className="modal_inputdiv">
            <div className="modal_inptheading">PNR Number *</div>
            <input
              type="text"
              placeholder="Enter your PNR Number"
              className="w-100 text-start modal_input"
              value={pnrNumber}
              onChange={(e) => setPnrNumber(e.target.value)}
            />
          </div>

          <div className="text-center mt-4 d-flex justify-content-center gap-3">
            <button className="login-btn" onClick={handleSubmitPNR}>
              Submit
            </button>
            <button className="login-btn" onClick={handlePrintPNR}>
              Print
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Navbar;
