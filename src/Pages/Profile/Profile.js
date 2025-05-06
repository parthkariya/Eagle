import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import { useDropzone } from "react-dropzone";
import { useAuthContext } from "../../Context/auth_context";
import { ACCEPT_HEADER, update_profile } from "../../Utils/Constant";
import Notification from "../../Utils/Notification";
import { Helmet } from "react-helmet";

const Profile = () => {
  const [getRole, setRole] = useState(null);
  const [getUser, setUser] = useState(null);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("is_role"));
    setRole(role);

    const user = JSON.parse(localStorage.getItem("is_user"));
    setUser(user);
  }, []);

  const [customerpassword, setCustomerpassword] = useState("");
  const [updateData, setUpdateData] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerconfirmpassword, setCustomerconfirmpassword] = useState("");
  const [customernames, setCustomernames] = useState("");
  const [customeremail, setCustomeremail] = useState("");
  const [customermobile, setCustomermobile] = useState("");
  const [customerairportcode, setCustomerairportcode] = useState("");
  const [showsignupPassword, setShowsignupPassword] = useState(false);
  const [showsignupconfirmPassword, setShowsignupConfirmPassword] =
    useState(false);

  useEffect(() => {
    if (getUser) {
      setCustomernames(getUser.first_name || "");
      setCustomeremail(getUser.email || "");
      setCustomermobile(getUser.mobile_no || "");
      setCustomerairportcode(getUser.nearest_airport_code || "");
      setAgentnames(getUser?.first_name || "");
      setAgentmobile(getUser?.mobile_no || "");
      setAgentemail(getUser.email || "");
      setAgentcompanyname(getUser?.company_name || "");
      setAgentcompanyaddress(getUser?.address || "");
      setAgentcity(getUser?.city || "");
      setAgentpincode(getUser?.zip || "");
      setAgentaadhar(getUser?.adhar_no || "");
      setAgentpan(getUser?.pan_no || "");
      setAgentgst(getUser?.gst_no || "");
    }
  }, [getUser]);

  // Agent state

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
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [agentpanImage, setAgentpanImage] = useState(null);
  const [getStateArray, SetState_Array] = useState([]);

  const [agentshowPassword, setAgentShowPassword] = useState(false);
  const [agentshowconfirmPassword, setAgentShowConfirmPassword] =
    useState(false);

  console.log("GET USER", getUser);

  const {
    setLogin,
    is_login,
    RegisterCustomer,
    forgotPassword,
    forgotPasswordOtp,
    login_loading,
    register_customer_loading,
    forgot_password_loading,
    forgot_password_otp_loading,
  } = useAuthContext();

  const onDropAadharFront = (acceptedFiles) => {
    setAadharFront(acceptedFiles[0]);
  };

  const onDropAadharBack = (acceptedFiles) => {
    setAadharBack(acceptedFiles[0]);
  };

  const onDropPanImage = (acceptedFiles) => {
    setAgentpanImage(acceptedFiles[0]);
  };
  const {
    getRootProps: getRootPropsAadharFront,
    getInputProps: getInputPropsAadharFront,
  } = useDropzone({
    onDrop: onDropAadharFront,
    accept: "image/*",
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsAadharBack,
    getInputProps: getInputPropsAadharBack,
  } = useDropzone({
    onDrop: onDropAadharBack,
    accept: "image/*",
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsPanImage,
    getInputProps: getInputPropsPanImage,
  } = useDropzone({
    onDrop: onDropPanImage,
    accept: "image/*",
    maxFiles: 1,
  });

  const regEx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // console.log("getUser", getUser);

  const profileUpdateApi = async (e) => {
    const token = JSON.parse(localStorage.getItem("is_token"));

    let formdata = {};

    if (getRole == "2") {
      if (customernames === "") {
        alert("Enter the Name!");
        return;
      } else if (customermobile === "") {
        alert("Enter the Mobile No!");
        return;
      } else if (customeremail === "") {
        alert("Enter the Email!");
        return;
      } else if (regEx.test(customeremail) === false) {
        alert("Enter a valid Email!");
        return;
      }
      //   else if (customerpassword === "") {
      //     alert("Enter the Password!");
      //     return;
      //   }
      //   else if (customerconfirmpassword === "") {
      //     alert("Enter the Confirm Password!");
      //     return;
      //   }
      else {
        formdata = {
          first_name: customernames,
          mobile_no: customermobile,
          email: customeremail,
        };
      }
      console.log("Fomrdaata role 2", formdata);
    } else if (getRole == "3") {
      if (agentnames === "") {
        alert("Enter the Name!");
        return;
      } else if (agentmobile === "") {
        alert("Enter the Mobile No!");
        return;
      } else if (agentemail === "") {
        alert("Enter the Email!");
        return;
      } else if (regEx.test(agentemail) === false) {
        alert("Enter a valid Email!");
        return;
      }
      //   else if (agentpassword === "") {
      //     alert("Enter the Password!");
      //     return;
      //   }
      //   else if (agentconfirmpassword === "") {
      //     alert("Enter the Confirm Password!");
      //     return;
      //   }
      else if (agentcompanyaddress === "") {
        alert("Enter company address");
      } else {
        formdata = {
          first_name: agentnames,
          mobile_no: agentmobile,
          email: agentemail,
          address: agentcompanyaddress,
        };
      }
      setLoading(true);
      console.log("Formdata ", formdata);
    }
    try {
      const response = await fetch(update_profile, {
        method: "POST",
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
          "Content-Type": "application/json", // Correct header
        },
        body: JSON.stringify(formdata), // Send plain JSON instead of FormData
      });

      const data = await response.json();

      if (data.success === 1) {
        console.log("Profile Updated:", data.data);
        setUpdateData(data.data);
        setLoading(false);
        Notification("success", "Success!", data.message); // Show success notification
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while updating profile:", error);
      Notification("error", "Error!", "Failed to fetch data");
      setLoading(false);
    } finally {
      setLoading(false); // Ensure loading state is updated in all cases
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <PathHero name={"Profile"} />

      {getRole == 2 ? (
        <>
          <div className="profile_con">
            <div className="input-container">
              {/* Name */}
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

              {/* Mobile */}
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
                    setCustomermobile(value);
                  }}
                  maxLength={10}
                  value={customermobile}
                />
              </div>

              {/* Email */}
              <div className="input-group">
                <label className="input-heading">Email *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field"
                  value={customeremail}
                  disabled
                  onChange={(e) => setCustomeremail(e.target.value)}
                />
              </div>

              {/* Nearest Airport Code */}
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
              <button
                disabled={register_customer_loading === true ? true : false}
                style={{
                  opacity: register_customer_loading === true ? "0.6" : "1",
                  width: "200px",
                  alignSelf: "center",
                }}
                className="register-btn"
                onClick={() => {
                  // profileUpdateApi();
                }}
              >
                {loading === "true" ? "Loading..." : "Update"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="profile_con">
          <div className="input-container">
            {/* Name */}
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

            {/* Mobile */}
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

            {/* Nearest Airport Code */}
            <div className="input-group">
              <label className="input-heading">Nearest Airport Code</label>
              <input
                type="text"
                disabled
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
                disabled
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
                disabled
                className="input-field"
                value={agentstate}
                onChange={(e) => setAgentstate(e.target.value)}
              >
                <option value="">{getUser?.state?.name}</option>
                {/* {getStateArray &&
                  getStateArray.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    );
                  })} */}
              </select>
            </div>

            <div className="d-flex gap-3">
              <div className="input-group w-50">
                <label className="input-heading">City *</label>
                <input
                  type="text"
                  disabled
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
                  disabled
                  placeholder="Enter zipcode"
                  className="input-field"
                  value={agentpincode}
                  onChange={(e) => setAgentpincode(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex gap-3">
              <div className="input-group w-50">
                <label className="input-heading">Aadhar No.</label>
                <input
                  type="text"
                  disabled
                  placeholder="Enter adhar number"
                  className="input-field"
                  value={agentaadhar}
                  onChange={(e) => setAgentaadhar(e.target.value)}
                />
              </div>

              <div className="input-group w-50">
                <label className="input-heading">PAN No.</label>
                <input
                  type="text"
                  disabled
                  placeholder="Enter PAN number"
                  className="input-field"
                  value={agentpan}
                  onChange={(e) => setAgentpan(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex gap-3">
              <div className="input-group w-50">
                <label className="input-heading">Aadhar Front</label>
                <div {...getRootPropsAadharFront()} className="dropzone-area">
                  <input
                    {...getInputPropsAadharFront()}
                    disabled={getUser?.adhar_front}
                  />
                  {aadharFront ? (
                    <div className="input-field">{aadharFront.name}</div>
                  ) : getUser?.adhar_front_image_full_path ? (
                    <img
                      src={getUser?.adhar_front_image_full_path}
                      alt="Aadhar Front"
                      className="uploaded-image"
                    />
                  ) : (
                    <p className="input-field">Select an Image</p>
                  )}
                </div>
              </div>

              <div className="input-group w-50">
                <label className="input-heading">Aadhar Back</label>
                <div {...getRootPropsAadharBack()} className="dropzone-area">
                  <input
                    {...getInputPropsAadharBack()}
                    disabled={getUser?.adhar_back}
                  />
                  {aadharBack ? (
                    <div className="input-field">{aadharBack.name}</div>
                  ) : getUser?.adhar_back_image_full_path ? (
                    <img
                      src={getUser?.adhar_back_image_full_path}
                      alt="Aadhar Back"
                      className="uploaded-image"
                    />
                  ) : (
                    <p className="input-field">select an Image</p>
                  )}
                </div>
              </div>
            </div>
            <div className="input-group">
              <label className="input-heading">PAN Image Upload</label>
              <div
                {...getRootPropsPanImage()}
                className="dropzone-area text-start"
              >
                <input
                  {...getInputPropsPanImage()}
                  disabled={getUser?.pan_img}
                />
                {agentpanImage ? (
                  <div className="input-field">{agentpanImage.name}</div>
                ) : getUser?.pan_img_image_full_path ? (
                  <img
                    src={getUser?.pan_img_image_full_path}
                    alt="PAN Card"
                    className="uploaded-image"
                  />
                ) : (
                  <p className="input-field">Select an image</p>
                )}
              </div>
            </div>

            <div className="input-group">
              <label className="input-heading">GST No.</label>
              <input
                type="text"
                disabled
                style={{ cursor: "" }}
                placeholder="Enter GST number"
                className="input-field"
                value={agentgst}
                onChange={(e) => setAgentgst(e.target.value)}
              />
            </div>

            <div className="text-secondary">
              For billing purposes please submit your GST details.In case you do
              not have GST, please write NA
            </div>

            <button
              disabled={loading === true ? true : false}
              style={{
                opacity: loading === true ? "0.6" : "1",
                width: "200px",
                alignSelf: "center",
              }}
              className="register-btn"
              // onClick={() => profileUpdateApi()}
            >
              {loading == true ? "Loading..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
