import React, { useEffect, useRef, useState } from "react";
import "./HeroTicketBooking.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { TbArrowsRightLeft } from "react-icons/tb";
import makeAnimated from "react-select/animated";
import { DatePicker, Space } from "antd";
import axios from "axios";
import Notification from "../../Utils/Notification";
// import "antd/dist/antd.css"; // Ensure you import Ant Design's styles
import moment from "moment";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import images from "../../Constants/images";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { BsFillLuggageFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

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
  const [getDepatureCityListFilterData, setDepatureCityListFilterData] =
    useState([]);
  const [getArrivalCityList, setArrivalCityList] = useState([]);
  const [getArrivalCityListFilterData, setArrivalCityListFilterData] = useState(
    []
  );
  const [getSectorList, setSectorList] = useState([]);
  const [getOnwardDateList, setOnwardDateList] = useState([]);
  const [getReturnDateList, setReturnDateList] = useState([]);
  const [getSearchFlightList, setSearchFlightList] = useState([]);
  const [searchedfromcity, setSearchedFromcity] = useState("");
  const [getSearchFlightListLoading, setSearchFlightListLoading] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueCity, setSelectedValueCity] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [getDepCityCode, setDepCityCode] = useState("");
  const [getArrCityCode, setArrCityCode] = useState("");
  const [getSearchFlightListMsg, setSearchFlightListMsg] = useState("");
  const [getSeachCondition, setSearchCondition] = useState(false);

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

  // console.log("getSearchFlightList",getSearchFlightList);

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

  // const handleSearch = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);

  //   const filtered = getDepatureCityList?.filter(
  //     (item) =>
  //       item.city_name.toLowerCase().includes(term) ||
  //       item.airport_name.toLowerCase().includes(term) ||
  //       item.airport_code.toLowerCase().includes(term)
  //   );

  //   setDepatureCityList(filtered);
  // };

  // console.log("getDepatureCityList", getDepatureCityList);

  const handleSearch = (e) => {
    const textData = e.target.value.toUpperCase(); // Get input value
    setSearchTerm(e.target.value); // Update search term state

    const newData = getDepatureCityList.filter((item) => {
      const cityName = item.city_name ? item.city_name.toUpperCase() : "";
      const airportName = item.airport_name
        ? item.airport_name.toUpperCase()
        : "";

      // Check if textData matches cityName or airportName
      return (
        cityName.indexOf(textData) > -1 || airportName.indexOf(textData) > -1
      );
    });

    setDepatureCityListFilterData(newData); // Update the filtered list
  };

  // const handleSearch2 = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm2(term);

  //   const filtered = getArrivalCityList?.filter(
  //     (item) =>
  //       item.city_name.toLowerCase().includes(term) ||
  //       item.airport_name.toLowerCase().includes(term) ||
  //       item.airport_code.toLowerCase().includes(term)
  //   );

  //   setArrivalCityList(filtered);
  // };

  const handleSearch2 = (e) => {
    const textData = e.target.value.toUpperCase(); // Get input value
    setSearchTerm2(e.target.value); // Update search term state

    const newData = getArrivalCityList.filter((item) => {
      const cityName = item.city_name ? item.city_name.toUpperCase() : "";
      const airportName = item.airport_name
        ? item.airport_name.toUpperCase()
        : "";

      // Check if textData matches cityName or airportName
      return (
        cityName.indexOf(textData) > -1 || airportName.indexOf(textData) > -1
      );
    });

    setArrivalCityListFilterData(newData); // Update the filtered list
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

    setIsDropdownOpen2(false);
  };

  const onChange = (date, dateString) => {
    setDate1(dateString);
    if (selected == 1) {
      getReturnDate(dateString);
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

  // const customDateRender = (current) => {
  //   const formattedDate = current.format("YYYY-MM-DD");

  //   if (getOnwardDateList.includes(formattedDate)) {
  //     return (
  //       <div
  //         className="ant-picker-cell-inner"
  //         style={{
  //           backgroundColor: "green",
  //           color: "white",
  //           borderRadius: "50%",
  //         }}
  //       >
  //         {current.date()}
  //       </div>
  //     );
  //   }

  //   return <div className="ant-picker-cell-inner">{current.date()}</div>;
  // };

  const disableAllExceptApiDates = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");
    const onwardDates = getOnwardDateList.map((item) => item.onward_date);
    return !onwardDates.includes(formattedDate);
  };

  const disableDates = (current) => {
    const returndate = getReturnDateList.map(
      (date) => new Date(date.return_date).toISOString().split("T")[0]
    );

    return !returndate.includes(current.format("YYYY-MM-DD"));
  };

  const firstEnabledDate = dayjs(
    getReturnDateList[0]?.return_date || dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    DepatureCityList(selected);
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

  const DepatureCityList = async (selected) => {
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
          "Content-Type": "application/json",
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
          "Content-Type": "application/json",
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
          "Content-Type": "application/json",
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Dates from API ZEEL:", data);
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

    const formateddate = moment(citycode, "DD-MM-YYYY").format("YYYY-MM-DD");

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/return_date";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      dep_city_code: getDepCityCode,
      onward_date: formateddate,
      arr_city_code: getArrCityCode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        setReturnDateList(data.data);
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
    setSearchCondition(false);

    const formattedDate = moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD");
    const formateddate = moment(date2, "DD-MM-YYYY").format("YYYY-MM-DD");

    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    } else if (selectedValue === "") {
      alert("Please Select From City");
    } else if (selectedValue2 === "") {
      alert("Please Select To City");
    } else if (date1 === "") {
      alert("Please Select Departure Date");
    } else if (selected == 1 && date2 === "") {
      alert("Please Select Departure Date");
    } else {
      setSearchFlightListLoading(true);
      const url = "https://devapi.fareboutique.com/v1/fbapi/search";
      const payload = {
        trip_type: selected,
        end_user_ip: "183.83.43.117",
        token: token,
        dep_city_code: getDepCityCode,
        arr_city_code: getArrCityCode,
        onward_date: formattedDate,
        return_date: formateddate,
        adult: travellers?.adult,
        children: travellers?.child,
        infant: travellers?.infant,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // Parse the JSON response
        const data = await response.json();

        if (data.errorCode == 0) {
          console.log(
            "Response Search Data from API:",
            data.data?.dep_city_name
          );
          setSearchFlightList(data.data);
          // setSearchedFromcity(data.data[0].dep_city_name);
          setSearchFlightListLoading(false);
          // fareQuote();
          Notification("success", "Success!", data.message);
        } else if (data.errorCode == 1) {
          setSearchCondition(true);
          setSearchFlightList([]);
          setSearchFlightListMsg(data.errorMessage);
          setSearchFlightListLoading(false);
        } else {
          Notification(
            "error",
            "Error!",
            data.message || "Something went wrong"
          );
        }
      } catch (error) {
        setSearchFlightListLoading(false);
        console.error("Error while fetching departure city list:", error);
        Notification("error", "Error!", "Failed to fetch data");
      }
    }
  };

  const fareQuote = async () => {
    const formattedDate = moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD");

    const formattedDate2 = date2 ? moment(date2).format("YYYY-MM-DD") : "";
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/fare_quote";
    const payload = {
      id: 415,
      end_user_ip: "183.83.43.117",
      token: token,
      onward_date: formattedDate,
      adult_children: travellers?.adult + travellers.child,
      infant: travellers?.infant,
      static: "0--21--354",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        // setSearchFlightList(data.data);
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
    <div className="container contt" id="#bookingcont">
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
              setDate1(null);
              setDate2(null);
              DepatureCityList(0);
              setSearchFlightList([]);
            }}
          />
          <label htmlFor="oneWay">
            <h4>ONE WAY</h4>
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
              setDate1(null);
              setDate2(null);
              DepatureCityList(1);
              setSearchFlightList([]);
            }}
          />
          <label htmlFor="roundTrip">
            <h4>ROUND TRIP</h4>
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
                          onChange={(e) => handleSearch(e)}
                          className="dropdown-search-input"
                        />

                        {searchTerm ? (
                          <>
                            {getDepatureCityListFilterData?.length > 0 ? (
                              getDepatureCityListFilterData?.map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(item)}
                                  >
                                    <div className="city-name">
                                      {item.city_name}
                                    </div>
                                    <div className="airport-details">
                                      {item.airport_name}{" "}
                                      <span className="airport-code">
                                        ({item.airport_code})
                                      </span>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="dropdown-no-results">
                                No results found
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {getDepatureCityList?.length > 0 ? (
                              getDepatureCityList?.map((item, index) => (
                                <div
                                  key={index}
                                  className="dropdown-item"
                                  onClick={() => handleSelect(item)}
                                >
                                  <div className="city-name">
                                    {item.city_name}
                                  </div>
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
                          </>
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
                          onChange={(e) => handleSearch2(e)}
                          className="dropdown-search-input"
                        />
                        {searchTerm2 ? (
                          <>
                            {getArrivalCityListFilterData?.length > 0 ? (
                              getArrivalCityListFilterData?.map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSelect2(item)}
                                  >
                                    <div className="city-name">
                                      {item.city_name}
                                    </div>
                                    <div className="airport-details">
                                      {item.airport_name}{" "}
                                      <span className="airport-code">
                                        ({item.airport_code})
                                      </span>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="dropdown-no-results">
                                No results found
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {getArrivalCityList?.length > 0 ? (
                              getArrivalCityList?.map((item, index) => (
                                <div
                                  key={index}
                                  className="dropdown-item"
                                  onClick={() => handleSelect2(item)}
                                >
                                  <div className="city-name">
                                    {item.city_name}
                                  </div>
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
                          </>
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
                  <div className="departtxt">Departure</div>
                  <div className="custom-date-picker">
                    <DatePicker
                      onChange={onChange}
                      placeholder="Select Date"
                      format="DD-MM-YYYY"
                      value={date1 ? dayjs(date1, "DD-MM-YYYY") : null}
                      disabledDate={disableAllExceptApiDates}
                    />
                  </div>
                </div>
                <div className="col-md-4 d-flex flex-column gap-2">
                  <div className="departtxt">Return</div>
                  <div
                    className={`${
                      selected === 0
                        ? "disabledatepicker"
                        : "custom-date-picker"
                    }`}
                  >
                    <DatePicker
                      disabled={selected == 0 ? true : false}
                      style={{ opacity: selected == 0 ? 0.6 : 1 }}
                      onChange={onChange2}
                      format="DD-MM-YYYY"
                      disabledDate={disableDates}
                      value={date2 ? moment(date2, "DD-MM-YYYY") : null}
                      placeholder="Select Date"
                      defaultPickerValue={firstEnabledDate}
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
        {getSearchFlightListLoading === true ? (
          <>
            <div
              style={{
                width: "100%",
                // height: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="loader">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {getSearchFlightList.length > 0 ? (
              <>
                <div className="flightcounter">
                  <h5>
                    We have <span>{getSearchFlightList.length} Flight</span>{" "}
                    from <span>{getSearchFlightList[0].dep_city_name}</span> to{" "}
                    {""}
                    <span>{getSearchFlightList[0].arr_city_name}</span>{" "}
                    {totalTravellers} Traveller
                  </h5>
                </div>
              </>
            ) : (
              <></>
            )}

            {getSeachCondition === true ? (
              <>
                <p className="no_flight_search_line">No Flights Available.</p>
              </>
            ) : (
              <>
                {getSearchFlightList.map((item, index) => {
                  return (
                    <>
                      <div className="flightsavailable shadow">
                        <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                          <div className="airlinename col-12 col-lg-3">
                            <div>
                              {item.airline_name === "IndiGo Airlines" ? (
                                <>
                                  <img
                                    src={images.IndiGoAirlines_logo}
                                    className="airline_logo"
                                  />
                                </>
                              ) : item.airline_name === "Neos" ? (
                                <>
                                  <img
                                    src={images.neoslogo}
                                    className="airline_logo"
                                  />
                                </>
                              ) : item.airline_name === "SpiceJet" ? (
                                <>
                                  <img
                                    src={images.spicejetlogo}
                                    className="airline_logo"
                                  />
                                </>
                              ) : item.airline_name === "Air India" ? (
                                <>
                                  <img
                                    src={images.airindialogo}
                                    className="airline_logo"
                                  />
                                </>
                              ) : item.airline_name === "Akasa Air" ? (
                                <>
                                  <img
                                    src={images.akasalogo}
                                    className="airline_logo"
                                  />
                                </>
                              ) : item.airline_name === "Etihad" ? (
                                <>
                                  <img
                                    src={images.etihadlogo}
                                    style={
                                      item.airline_name === "Etihad"
                                        ? {
                                            backgroundColor: "#fffbdb",
                                            padding: "5px",
                                            borderRadius: "5px",
                                          }
                                        : ""
                                    }
                                    className="airline_logo"
                                  />
                                </>
                              ) : item.airline_name === "Vistara" ? (
                                <>
                                  <img
                                    src={images.vistaralogo}
                                    className="airline_logo"
                                  />
                                </>
                              ) : (
                                <>
                                  <IoAirplaneSharp size={40} color="white" />
                                </>
                              )}
                            </div>
                            <div className="planecomp">
                              {item?.airline_name}
                            </div>
                            <div className="flightnum">
                              {item?.flight_number}
                            </div>
                          </div>
                          <div className="flight-details col-12 col-lg-6 justify-content-center">
                            <div className="flight-departure">
                              <h5 className="flighttime">{item?.dep_time}</h5>
                              <h5 className="airportname">
                                {item?.dep_city_name}
                              </h5>
                            </div>
                            <div className="d-flex align-items-center gap-2 gap-lg-3">
                              <span className="text-white">To</span>
                              <div className="from-to text-center">
                                <h6 className="text-white">
                                  {item?.duration &&
                                    `${item.duration.split(":")[0]}h ${
                                      item.duration.split(":")[1]
                                    }min`}
                                </h6>
                                <img
                                  src={images.vimaan}
                                  alt=""
                                  className="imagerouteplane"
                                />
                                <h6 className="text-white">
                                  {item?.no_of_stop} Stop
                                </h6>
                              </div>
                              <span className="text-white">From</span>
                            </div>
                            <div className="flight-departure">
                              <h5 className="flighttime">{item?.arr_time}</h5>
                              <h5 className="airportname">
                                {item?.arr_city_name}
                              </h5>
                            </div>
                          </div>

                          {/* <div className="nanolito"></div> */}
                          <div className="pricediv col-lg-3">
                            <div className="d-flex align-items-center">
                              <FaRupeeSign size={20} color="#fff" />
                              <h4 className="text-white fw-bold dijit">
                                {item?.total_payable_price}
                              </h4>
                            </div>
                            <div className="text-white">
                              Total Fare for {totalTravellers}
                            </div>
                            <Link
                              to={"/TicketBookingDetails"}
                              state={{
                                item: item,
                                totaltraveller: totalTravellers,
                              }}
                              className="bookBtn"
                            >
                              Book
                            </Link>
                          </div>
                        </div>
                        {item?.return_flight_data ? (
                          <>
                            <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                              <div className="airlinename col-12 col-lg-3">
                                <div>
                                  {item.airline_name === "IndiGo Airlines" ? (
                                    <>
                                      <img
                                        src={images.IndiGoAirlines_logo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Neos" ? (
                                    <>
                                      <img
                                        src={images.neoslogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "SpiceJet" ? (
                                    <>
                                      <img
                                        src={images.spicejetlogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Air India" ? (
                                    <>
                                      <img
                                        src={images.airindialogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Akasa Air" ? (
                                    <>
                                      <img
                                        src={images.akasalogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Etihad" ? (
                                    <>
                                      <img
                                        src={images.etihadlogo}
                                        style={
                                          item.airline_name === "Etihad"
                                            ? {
                                                backgroundColor: "#fffbdb",
                                                padding: "5px",
                                                borderRadius: "5px",
                                              }
                                            : ""
                                        }
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Vistara" ? (
                                    <>
                                      <img
                                        src={images.vistaralogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <IoAirplaneSharp
                                        size={40}
                                        color="white"
                                      />
                                    </>
                                  )}
                                </div>
                                <div className="planecomp">
                                  {item?.airline_name}
                                </div>
                                <div className="flightnum">
                                  {
                                    item?.return_flight_data
                                      ?.return_flight_number
                                  }
                                </div>
                              </div>
                              <div className="flight-details col-12 col-lg-6 justify-content-center">
                                <div className="flight-departure">
                                  <h5 className="flighttime">
                                    {item?.return_flight_data?.return_dep_time}
                                  </h5>
                                  <h5 className="airportname">
                                    {
                                      item?.return_flight_data
                                        ?.return_dep_city_name
                                    }
                                  </h5>
                                </div>
                                <div className="d-flex align-items-center gap-2 gap-lg-3">
                                  <span className="text-white">To</span>
                                  <div className="from-to text-center">
                                    {/* <h6 className="text-white">
                                  {item?.return_flight_data?.return_trip_duration &&
                                    `${item?.return_flight_data?.return_trip_duration.split(":")[0]}h ${
                                      item?.return_flight_data?.return_trip_duration.split(":")[1]
                                    }min`}
                                </h6> */}
                                    <img
                                      src={images.vimaan}
                                      alt=""
                                      className="imagerouteplane"
                                    />
                                    <h6 className="text-white">
                                      {item?.return_no_of_stop} Stop
                                    </h6>
                                  </div>
                                  <span className="text-white">From</span>
                                </div>
                                <div className="flight-departure">
                                  <h5 className="flighttime">
                                    {item?.return_flight_data?.return_arr_time}
                                  </h5>
                                  <h5 className="airportname">
                                    {
                                      item?.return_flight_data
                                        ?.return_arr_city_name
                                    }
                                  </h5>
                                </div>
                              </div>

                              {/* <div className="nanolito"></div> */}
                              <div className="pricediv col-lg-3">
                                <div className="d-flex align-items-center">
                                  <FaRupeeSign size={20} color="#fff" />
                                  <h4 className="text-white fw-bold dijit">
                                    {item?.total_payable_price}
                                  </h4>
                                </div>
                                <div className="text-white">
                                  Total Fare for {totalTravellers}
                                </div>
                                <Link
                                  to={"/TicketBookingDetails"}
                                  state={{
                                    item: item,
                                    totaltraveller: totalTravellers,
                                  }}
                                  className="bookBtn"
                                >
                                  Book
                                </Link>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="flightcounter">
                        <div className="row align-items-center justify-content-center">
                          <div className="row p-0 align-items-center justify-content-center col-revv">
                            <div className="col-md-4 d-flex align-items-start justify-content-lg-end gap-2 weightdiv">
                              <div>
                                <BsFillLuggageFill size={20} color="" />
                              </div>
                              <div>
                                <p className="kilogram">
                                  {item?.check_in_baggage_adult} KG
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-start gap-2 justify-content-lg-center">
                              <div className="fw-bold fs-5">
                                {" "}
                                <p>Refund:</p>
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
                                <p className="fw-bold fs-5">
                                  {" "}
                                  {item?.available_seats}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeroTicketBooking;
