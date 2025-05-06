// import React, { useState } from "react";
// import "./HeroTicketBooking.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { TbArrowsRightLeft } from "react-icons/tb";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import { DatePicker, Space } from "antd";
// // import "antd/dist/antd.css"; // Ensure you import Ant Design's styles

// const option = [
//   { value: "ocean", label: "Ocean", color: "#00B8D9" },
//   { value: "blue", label: "Blue", color: "#0052CC" },
//   { value: "purple", label: "Purple", color: "#5243AA" },
//   { value: "red", label: "Red", color: "#FF5630" },
//   { value: "orange", label: "Orange", color: "#FF8B00" },
//   { value: "yellow", label: "Yellow", color: "#FFC400" },
//   { value: "green", label: "Green", color: "#36B37E" },
//   { value: "forest", label: "Forest", color: "#00875A" },
//   { value: "slate", label: "Slate", color: "#253858" },
//   { value: "silver", label: "Silver", color: "#666666" },
// ];
// const option2 = [
//   { value: "ocean", label: "Ocean", color: "#00B8D9" },
//   { value: "blue", label: "Blue", color: "#0052CC" },
//   { value: "purple", label: "Purple", color: "#5243AA" },
//   { value: "red", label: "Red", color: "#FF5630" },
//   { value: "orange", label: "Orange", color: "#FF8B00" },
//   { value: "yellow", label: "Yellow", color: "#FFC400" },
//   { value: "green", label: "Green", color: "#36B37E" },
//   { value: "forest", label: "Forest", color: "#00875A" },
//   { value: "slate", label: "Slate", color: "#253858" },
//   { value: "silver", label: "Silver", color: "#666666" },
// ];

// const HeroTicketBooking = () => {
//   const [selected, setSelected] = useState("oneWay");
//   const [selectedClass, setSelectedClass] = useState("Economy");
//   const animatedComponents = makeAnimated();
//   const [traveller, setTraveller] = useState("");
//   const [date1, setDate1] = useState("");
//   const [date2, setDate2] = useState("");

//   const onChange = (date, dateString) => {
//     setDate1(dateString);
//     console.log(dateString);
//   };

//   const onChange2 = (date, dateString) => {
//     setDate2(dateString);
//     console.log(dateString);
//   };

//   const disablePastDates = (current) => {
//     return current && current < new Date().setHours(0, 0, 0, 0); // Disable dates before today
//   };

//   return (
//     <div className="container contt">
//       <div className="row align-items-center radiobtnsec">
//         <div className="d-flex align-items-center gap-3">
//           <input
//             type="radio"
//             className="rdbtn"
//             name="trip"
//             id="oneWay"
//             checked={selected === "oneWay"}
//             onChange={() => setSelected("oneWay")}
//           />
//           <label htmlFor="oneWay">
//             <h4>ONE WAY</h4>
//           </label>

//           <input
//             type="radio"
//             className="rdbtn"
//             name="trip"
//             id="roundTrip"
//             checked={selected === "roundTrip"}
//             onChange={() => setSelected("roundTrip")}
//           />
//           <label htmlFor="roundTrip">
//             <h4>ROUND TRIP</h4>
//           </label>
//         </div>

//         <div className="classcat  d-md-flex justify-content-center p-md-3 gap-md-5">
//           <div
//             className={`classnm ${
//               selectedClass === "Economy" ? "selected" : ""
//             }`}
//             onClick={() => setSelectedClass("Economy")}
//           >
//             Economy
//           </div>
//           <div
//             className={`classnm ${
//               selectedClass === "Business Class" ? "selected" : ""
//             }`}
//             onClick={() => setSelectedClass("Business Class")}
//           >
//             Business Class
//           </div>
//           <div
//             className={`classnm ${
//               selectedClass === "First Class" ? "selected" : ""
//             }`}
//             onClick={() => setSelectedClass("First Class")}
//           >
//             First Class
//           </div>
//         </div>

//         <div className="dateselectdiv">
//           <div className="row align-items-center gap-3 gap-lg-0  p-2 p-md-3">
//             <div className="col-12 col-lg-6">
//               <div className="row align-items-center pb-3 p-md-0">
//                 <div className="col-md-5 d-flex flex-column gap-2 ">
//                   <div className="fromtxt">From</div>
//                   <div>
//                     <Select
//                       closeMenuOnSelect={false}
//                       styles={{
//                         container: (provided) => ({
//                           ...provided,
//                           backgroundColor: "#fffbdb",
//                           borderRadius: "10px",
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           backgroundColor: "transparent",
//                           //   border: "1px solid #fff",
//                           boxShadow: "none",
//                           borderRadius: "10px",
//                           overflow: "hidden",
//                         }),
//                         menu: (provided) => ({
//                           ...provided,
//                           backgroundColor: "#fff", // Make dropdown menu transparent
//                         }),
//                         option: (provided, state) => ({
//                           ...provided,
//                           backgroundColor: state.isFocused
//                             ? "#dbb46b"
//                             : "transparent", // Highlight focused option
//                           color: state.isFocused ? "#fff" : "#000", // Adjust text color
//                         }),
//                       }}
//                       components={animatedComponents}
//                       className="selectmenu"
//                       options={option}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2 d-flex justify-content-center  p-3 p-md-0 align-self-center">
//                   <TbArrowsRightLeft size={30} color="#fff" />
//                 </div>
//                 <div className="col-md-5 d-flex flex-column gap-2">
//                   <div className="fromtxt">To</div>
//                   <div>
//                     <Select
//                       closeMenuOnSelect={false}
//                       styles={{
//                         container: (provided) => ({
//                           ...provided,
//                           backgroundColor: "#fffbdb",
//                           borderRadius: "10px",
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           backgroundColor: "transparent",
//                           //   border: "1px solid #fff",
//                           boxShadow: "none",
//                           borderRadius: "10px",
//                           overflow: "hidden",
//                         }),
//                         menu: (provided) => ({
//                           ...provided,
//                           backgroundColor: "#fff", // Make dropdown menu transparent
//                         }),
//                         option: (provided, state) => ({
//                           ...provided,
//                           backgroundColor: state.isFocused
//                             ? "#dbb46b"
//                             : "transparent", // Highlight focused option
//                           color: state.isFocused ? "#fff" : "#000", // Adjust text color
//                         }),
//                       }}
//                       components={animatedComponents}
//                       className="selectmenu"
//                       options={option2}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-12 col-lg-6">
//               <div className="row align-items-center gap-3 gap-md-0">
//                 <div className="col-12 col-md-4 d-flex flex-column gap-2">
//                   <div className="departtxt">Departing</div>
//                   <div className="custom-date-picker">
//                     <DatePicker
//                       onChange={onChange}
//                       format="DD-MM-YYYY"
//                       disabledDate={disablePastDates}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-4 d-flex flex-column gap-2">
//                   <div className="departtxt">Returning</div>
//                   <div className="custom-date-picker">
//                     <DatePicker
//                       onChange={() => onChange2()}
//                       format="DD-MM-YYYY"
//                       disabledDate={disablePastDates}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-4 d-flex flex-column gap-2 mb-3 mb-md-0">
//                   <div className="departtxt">Travellers</div>
//                   <input
//                     onChange={(e) => setTraveller(e.target.value)}
//                     value={traveller}
//                     className="travellarinpt"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroTicketBooking;

import React, { useEffect, useRef, useState } from "react";
import "./HeroTicketBooking.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { TbArrowsRightLeft } from "react-icons/tb";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { DatePicker, Space } from "antd";
import axios from "axios";
import Notification from "../../Utils/Notification"; // Adjust the path based on your project structure
// import "antd/dist/antd.css"; // Ensure you import Ant Design's styles
import moment from "moment";
import { IoAirplaneSharp } from "react-icons/io5";
import images from "../../Constants/images";
import { FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsFillLuggageFill } from "react-icons/bs";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";

const option = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];
const option2 = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

const HeroTicketBooking = () => {
  const [selected, setSelected] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [getDepatureCityList, setDepatureCityList] = useState([]);
  const [getArrivalCityList, setArrivalCityList] = useState([]);
  const [getSectorList, setSectorList] = useState([]);
  const [getOnwardDateList, setOnwardDateList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [getDepCityCode, setDepCityCode] = useState("");
  const [getArrCityCode, setArrCityCode] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [travellers, setTravellers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [isDropdownOpenTraveler, setIsDropdownOpenTravellers] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  const animatedComponents = makeAnimated();
  const [traveller, setTraveller] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const toggleView = () => {
    setIsViewOpen(!isViewOpen);
  };

  // console.log("getOnwardDateList",getOnwardDateList);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setIsDropdownOpen2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCounterChange = (type, change) => {
    setTravellers((prev) => {
      const newValue = prev[type] + change;

      // Ensure "Adult" value does not go below 1
      if (type === "adult" && newValue < 1) {
        return prev;
      }

      // Prevent other categories (child, infant) from going below 0
      if (newValue < 0) {
        return prev;
      }

      return { ...prev, [type]: newValue };
    });
  };

  const totalTravellers =
    travellers.adult + travellers.child + travellers.infant;

  const toggleDropdownTraveler = () => {
    setIsDropdownOpenTravellers((prev) => !prev);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = getDepatureCityList?.filter(
      (item) =>
        item.city_name.toLowerCase().includes(term) ||
        item.airport_name.toLowerCase().includes(term) ||
        item.airport_code.toLowerCase().includes(term)
    );

    setDepatureCityList(filtered);
  };
  const handleSearch2 = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = getArrivalCityList?.filter(
      (item) =>
        item.city_name.toLowerCase().includes(term) ||
        item.airport_name.toLowerCase().includes(term) ||
        item.airport_code.toLowerCase().includes(term)
    );

    setArrivalCityList(filtered);
  };

  const handleSelect = (item) => {
    setSelectedValue(`${item.city_name} (${item.airport_code})`);
    setSearchTerm(""); // Clear the search term after selection
    ArrivalCityList(item.city_code);
    SectorList(item.city_code);
    setDepCityCode(item.city_code);
    setIsDropdownOpen(false); // Close the dropdown
  };
  const handleSelect2 = (item) => {
    setSelectedValue2(`${item.city_name} (${item.airport_code})`);
    setSearchTerm2(""); // Clear the search term after selection
    ArrivalCityList(getDepCityCode);
    setArrCityCode(item.city_code);
    getOnwardDate(item.city_code);

    setIsDropdownOpen2(false); // Close the dropdown
  };

  const onChange = (date, dateString) => {
    setDate1(dateString);
    if (selected == 1) {
      getReturnDate(date1);
    }

    console.log(dateString);
  };

  const onChange2 = (date, dateString) => {
    setDate2(dateString);
    console.log(dateString);
  };

  const disablePastDates = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0); // Disable dates before today
  };

  const customDateRender = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");

    if (getOnwardDateList.includes(formattedDate)) {
      return (
        <div
          className="ant-picker-cell-inner"
          style={{
            backgroundColor: "green",
            color: "white",
            borderRadius: "50%",
          }}
        >
          {current.date()}
        </div>
      );
    }

    return <div className="ant-picker-cell-inner">{current.date()}</div>;
  };

  useEffect(() => {
    DepatureCityList();
  }, []);

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip; // Returns the public IP
    } catch (error) {
      console.error("Error fetching public IP:", error);
      return null; // Handle errors by returning null or a default value
    }
  };

  const DepatureCityList = async () => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/dep_city";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data.data);
        setDepatureCityList(data.data);

        Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const ArrivalCityList = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/arr_city";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      city_code: citycode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data);
        setArrivalCityList(data.data);
        Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const SectorList = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/sector";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      city_code: citycode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data);
        setSectorList(data.data);
        Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const getOnwardDate = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/onward_date";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      dep_city_code: getDepCityCode,
      arr_city_code: citycode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Dates from API:", data);
        setOnwardDateList(data.data);
        Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const getReturnDate = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/return_date";
    const payload = {
      trip_type: selected == 1 ? "return" : "",
      end_user_ip: publicIP,
      token: token,
      dep_city_code: getDepCityCode,
      onward_date: citycode,
      arr_city_code: getArrCityCode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        setOnwardDateList(data.data);
        Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      Notification("error", "Error!", "Failed to fetch data");
    }
  };
  const searchFlight = async () => {
    const formattedDate1 = moment(date1).format("YYYY-MM-DD");
    const formattedDate2 = date2 ? moment(date2).format("YYYY-MM-DD") : "";
    const token = "U4YuxXWYMqeozz3peZTDJ1zgtuir1OMqQN7pHFJysAAZW";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/search";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      dep_city_code: getDepCityCode,
      arr_city_code: getArrCityCode,
      departure_date: moment(date1).format("YYYY-MM-DD"),
      return_date: date2,
      adult: travellers?.adult,
      children: travellers?.child,
      infant: travellers?.infant,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        setOnwardDateList(data.data);
        Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      Notification("error", "Error!", "Failed to fetch data");
    }
  };

  return (
    <div className="container contt">
      <div className="row align-items-center radiobtnsec">
        <div className="d-flex align-items-center gap-3">
          <input
            type="radio"
            className="rdbtn"
            name="trip"
            id="oneWay"
            checked={selected == 0}
            onChange={() => {
              setSelected(0);
              setSelectedValue("");
              setSelectedValue2("");
            }}
          />
          <label htmlFor="oneWay">
            <h4 className="w-auto">ONE WAY</h4>
          </label>

          <input
            type="radio"
            className="rdbtn"
            name="trip"
            id="roundTrip"
            checked={selected === 1}
            onChange={() => {
              setSelected(1);
              setSelectedValue("");
              setSelectedValue2("");
            }}
          />
          <label htmlFor="roundTrip">
            <h4 className="w-auto">ROUND TRIP</h4>
          </label>
        </div>

        <div className="classcat d-md-flex justify-content-center p-md-3 gap-md-5">
          <div
            className={`classnm ${
              selectedClass === "Economy" ? "selected" : ""
            }`}
            onClick={() => setSelectedClass("Economy")}
          >
            Economy
          </div>
          <div
            className={`classnm ${
              selectedClass === "Business Class" ? "selected" : ""
            }`}
            onClick={() => setSelectedClass("Business Class")}
          >
            Business Class
          </div>
          <div
            className={`classnm ${
              selectedClass === "First Class" ? "selected" : ""
            }`}
            onClick={() => setSelectedClass("First Class")}
          >
            First Class
          </div>
        </div>

        <div className="dateselectdiv">
          <div className="row align-items-center gap-3 gap-lg-0  p-2 p-md-3">
            <div className="col-12 col-lg-6">
              <div className="row align-items-center pb-3 p-md-0">
                <div className="col-md-5 d-flex flex-column gap-2 ">
                  <div className="fromtxt">From</div>
                  {/* <Select
                      closeMenuOnSelect={false}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          backgroundColor: "#fffbdb",
                          borderRadius: "10px",
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          //   border: "1px solid #fff",
                          boxShadow: "none",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor: "#fff", // Make dropdown menu transparent
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? "#dbb46b"
                            : "transparent", // Highlight focused option
                          color: state.isFocused ? "#fff" : "#000", // Adjust text color
                        }),
                      }}
                      components={animatedComponents}
                      className="selectmenu"
                      options={option}
                    /> */}

                  <div className="dropdown-container" ref={dropdownRef}>
                    {/* Input to display the selected value */}
                    <input
                      type="text"
                      placeholder="Select airport..."
                      value={selectedValue}
                      onClick={toggleDropdown}
                      readOnly
                      className="dropdown-input"
                    />

                    {isDropdownOpen && (
                      <div className="dropdown-list">
                        <input
                          type="text"
                          placeholder="Search airport..."
                          value={searchTerm}
                          onChange={handleSearch}
                          className="dropdown-search-input"
                        />

                        {getDepatureCityList?.length > 0 ? (
                          getDepatureCityList?.map((item, index) => (
                            <div
                              key={index}
                              className="dropdown-item"
                              onClick={() => handleSelect(item)}
                            >
                              <div className="city-name">{item.city_name}</div>
                              <div className="airport-details">
                                {item.airport_name}{" "}
                                <span className="airport-code">
                                  ({item.airport_code})
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-no-results">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-2 d-flex justify-content-center  p-3 p-md-0 align-self-center">
                  <TbArrowsRightLeft size={30} color="#fff" />
                </div>
                <div className="col-md-5 d-flex flex-column gap-2">
                  <div className="fromtxt">To</div>
                  {/* <Select
                      closeMenuOnSelect={false}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          backgroundColor: "#fffbdb",
                          borderRadius: "10px",
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          //   border: "1px solid #fff",
                          boxShadow: "none",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor: "#fff", // Make dropdown menu transparent
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? "#dbb46b"
                            : "transparent", // Highlight focused option
                          color: state.isFocused ? "#fff" : "#000", // Adjust text color
                        }),
                      }}
                      components={animatedComponents}
                      className="selectmenu"
                      options={option2}
                    /> */}

                  <div className="dropdown-container" ref={dropdownRef2}>
                    {/* Input to display the selected value */}
                    <input
                      type="text"
                      placeholder="Select airport..."
                      value={selectedValue2}
                      onClick={toggleDropdown2}
                      readOnly
                      className="dropdown-input"
                    />

                    {isDropdownOpen2 && (
                      <div className="dropdown-list">
                        {/* Search input inside the dropdown */}
                        <input
                          type="text"
                          placeholder="Search airport..."
                          value={searchTerm2}
                          onChange={handleSearch2} // Pass the event directly
                          className="dropdown-search-input"
                        />

                        {getArrivalCityList?.length > 0 ? (
                          getArrivalCityList?.map((item, index) => (
                            <div
                              key={index}
                              className="dropdown-item"
                              onClick={() => handleSelect2(item)}
                            >
                              <div className="city-name">{item.city_name}</div>
                              <div className="airport-details">
                                {item.airport_name}{" "}
                                <span className="airport-code">
                                  ({item.airport_code})
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-no-results">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="row align-items-center gap-3 gap-md-0">
                <div className="col-12 col-md-4 d-flex flex-column gap-2">
                  <div className="departtxt">Departing</div>
                  <div className="custom-date-picker">
                    {/* <Space direction="vertical"> */}
                    <DatePicker
                      onChange={onChange}
                      format="DD-MM-YYYY"
                      disabledDate={disablePastDates}
                      dateRender={customDateRender}
                    />
                    {/* </Space> */}
                  </div>
                </div>
                <div className="col-md-4 d-flex flex-column gap-2">
                  <div className="departtxt">Returning</div>
                  <div className="custom-date-picker">
                    <DatePicker
                      disabled={selected == 0 ? true : false}
                      onChange={() => onChange2()}
                      format="DD-MM-YYYY"
                      disabledDate={disablePastDates}
                    />
                  </div>
                </div>
                <div className="col-md-4 d-flex flex-column gap-2 mb-3 mb-md-0">
                  <div className="departtxt">Travellers</div>
                  <div className="travellers-container">
                    {/* Display View */}
                    <div
                      className="travellers-summary"
                      onClick={toggleDropdownTraveler}
                    >
                      <p>{totalTravellers} Travellers</p>
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpenTraveler && (
                      <div className="travellers-dropdown">
                        <div className="traveller-category">
                          <span>Adult 12+Yrs</span>
                          <div className="counter">
                            <button
                              className="minus"
                              onClick={() => handleCounterChange("adult", -1)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={travellers.adult}
                              readOnly
                            />
                            <button
                              className="plus"
                              onClick={() => handleCounterChange("adult", 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="traveller-category">
                          <span>Child 2-12 Yrs</span>
                          <div className="counter">
                            <button
                              className="minus"
                              onClick={() => handleCounterChange("child", -1)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={travellers.child}
                              readOnly
                            />
                            <button
                              className="plus"
                              onClick={() => handleCounterChange("child", 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="traveller-category">
                          <span>Infant 0-2 Yrs</span>
                          <div className="counter">
                            <button
                              className="minus"
                              onClick={() => handleCounterChange("infant", -1)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={travellers.infant}
                              readOnly
                            />
                            <button
                              className="plus"
                              onClick={() => handleCounterChange("infant", 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          className="apply-button"
                          onClick={toggleDropdownTraveler}
                        >
                          APPLY
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btnn w-25 h-100 align-self-center d-flex align-item-center justify-content-center"
              onClick={() => searchFlight()}
            >
              Search
            </button>
          </div>
        </div>

        <div className="flightcounter">
          <h5>
            We have <span>1 Flight</span> from <span>Ahmedabad</span> to {""}
            <span>Srinagar</span> 1 Traveller
          </h5>
        </div>
        <div className="flightsavailable shadow">
          <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row  p-3">
            <div className="airlinename col-12 col-lg-3">
              <div>
                <IoAirplaneSharp size={40} color="white" />
              </div>
              <div className="planecomp">Air India</div>
              <div className="flightnum">6E715</div>
            </div>
            <div className="flight-details col-12 col-lg-6 justify-content-center">
              <div className="flight-departure">
                <h5 className="flighttime">12:00</h5>
                <h5 className="airportname">DUB</h5>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="text-white">To</span>
                <div className="from-to text-center">
                  <h6 className="text-white">0h 50m</h6>
                  <img src={images.vimaan} alt="" className="imagerouteplane" />
                  <h6 className="text-white">1 stop</h6>
                </div>
                <span className="text-white">From</span>
              </div>
              <div className="flight-departure">
                <h5 className="flighttime">12:00</h5>
                <h5 className="airportname">DUB</h5>
              </div>
            </div>

            {/* <div className="nanolito"></div> */}
            <div className="pricediv col-lg-3">
              <div className="d-flex align-items-center">
                <FaRupeeSign size={20} color="#fff" />
                <h4 className="text-white fw-bold dijit">8840</h4>
              </div>
              <div className="text-white">Total Fare for 1</div>
              <Link to={"/TicketBookingDetails"} className="bookBtn">
                Book
              </Link>
            </div>
          </div>
        </div>

        <div className="flightcounter">
          <div className="row align-items-center justify-content-center">
            <div className="row p-0 align-items-center justify-content-center col-revv">
              <div
                className="col-md-4 d-flex align-items-start justify-content-lg-end gap-2 weightdiv"
                onClick={toggleView}
              >
                <div>
                  <BsFillLuggageFill size={20} color="" />
                </div>
                <div>
                  <p className="kilogram">15 KG</p>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-start gap-2 justify-content-lg-center">
                <div className="fw-bold fs-5">
                  {" "}
                  <p>Refund : </p>
                </div>
                <div>
                  {" "}
                  <p className="fs-5">Non-Refundable</p>{" "}
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-start gap-2 justify-content-lg-start">
                <div>
                  <MdOutlineAirlineSeatReclineExtra size={20} />
                </div>
                <div>
                  <p className="fw-bold fs-5">Available Seats</p>
                </div>
                <div>
                  <p className="fw-bold fs-5">08</p>
                </div>
              </div>
            </div>

            <div className={`transition-view ${isViewOpen ? "show" : "hide"}`}>
              <div className="row align-items-center">
                <div className="col-12 col-lg-6">
                  <div className="col-12">
                    <p className="fw-bold">Baggage Details</p>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered text-center">
                      <thead>
                        <tr>
                          <th></th>
                          <th>
                            <div className="fw-bold">Adult</div>
                            <div className="text-secondary">Age 12+ yrs</div>
                          </th>
                          <th>
                            <div className="fw-bold">Children</div>
                            <div className="text-secondary">Age 2-12 yrs</div>
                          </th>
                          <th>
                            <div className="fw-bold">Infant</div>
                            <div className="text-secondary">Age 2 yrs</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-bold">Check-In</th>
                          <td>15 KG</td>
                          <td>15 KG</td>
                          <td>0 KG</td>
                        </tr>
                        <tr>
                          <th className="fw-bold">Cabin</th>
                          <td>7 KG</td>
                          <td>7 KG</td>
                          <td>7 KG</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* <div className="col-12 col-lg-6">
                  <div className="col-12">
                    <p className="fw-bold">Stop Details</p>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered text-center">
                      <thead>
                        <tr>
                          <th></th>
                          <th>
                            <div className="fw-bold">Adult</div>
                            <div className="text-secondary">Age 12+ yrs</div>
                          </th>
                          <th>
                            <div className="fw-bold">Children</div>
                            <div className="text-secondary">Age 2-12 yrs</div>
                          </th>
                          <th>
                            <div className="fw-bold">Infant</div>
                            <div className="text-secondary">Age 2 yrs</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-bold">Check-In</th>
                          <td>15 KG</td>
                          <td>15 KG</td>
                          <td>0 KG</td>
                        </tr>
                        <tr>
                          <th className="fw-bold">Cabin</th>
                          <td>7 KG</td>
                          <td>7 KG</td>
                          <td>7 KG</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroTicketBooking;
