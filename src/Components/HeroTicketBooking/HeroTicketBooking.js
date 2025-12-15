import React, { useEffect, useRef, useState } from "react";
import "./HeroTicketBooking.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { TbArrowsRightLeft } from "react-icons/tb";
import makeAnimated from "react-select/animated";
import { DatePicker, Space } from "antd";
import axios from "axios";
import Notification from "../../Utils/Notification";
import moment from "moment";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaPlaneDeparture, FaRupeeSign, FaSearch } from "react-icons/fa";
import images from "../../Constants/images";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { db } from "../../FireBase/firebase";
import { WiTime9 } from "react-icons/wi";
import { SlCalender } from "react-icons/sl";
import { IoIosPeople } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // Optional for nav arrows
import { Navigation } from "swiper/modules";

// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   orderBy,
// } from "firebase/firestore";
import {
  ACCEPT_HEADER,
  get_recent_search,
  recent_search,
} from "../../Utils/Constant";

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
  const [bookingtokenid, setbookingtokenid] = useState("");
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
  const [getDirectArrCityCode, setDirectArrCityCode] = useState("");
  const [getSeachCondition, setSearchCondition] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [defaultMonth, setDefaultMonth] = useState("");
  const [defaultMonth2, setDefaultMonth2] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [login, SetLogin] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isViewOpen2, setIsViewOpen2] = useState(false);
  const [isViewOpen3, setIsViewOpen3] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [RecentSelection, setRecentSelection] = useState([]);
  const [lowestPrice, setLowestPrice] = useState(null);

  // console.log("lowestPrice", lowestPrice);

  // AIR IQ API State Start

  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";
  // const isLocalhost = window.location.hostname === "localhost";
  // const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";
  const proxy = "https://cors-anywhere.herokuapp.com/";

  const [getSectorListNew, setSectorListNew] = useState([]);
  const [getAvailableDate, setAvailableDate] = useState([]);
  const [getSearchFlightListData, setSearchFlightListData] = useState([]);
  const [getSearchFlightListDatamsg, setSearchFlightListDatamsg] = useState();
  const [getSectorListFrom, setSectorListFrom] = useState([]);
  const [mergedData, setMergedData] = useState([]); // New merged state
  const [getSectorListTo, setSectorListTo] = useState([]);
  const [filteredFromdata, setFilteredFromData] = useState([]);
  const [filteredTodata, setFilteredToData] = useState([]);
  const [getCondition, setCondition] = useState();
  const [mergedDepartureList, setMergedDepartureList] = useState([]);
  const [recentSearchCondition, setRecentSearchCondition] = useState(false);

  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const recentSearches = [
    {
      from: "Dubai",
      to: "Houston",
      date: "29/4",
      travellers: "1 traveller, Economy",
      type: "One-way",
      price: "₹ 61,384",
      showPriceChange: false,
    },
    {
      from: "Melbourne",
      to: "Denpasar",
      date: "3/5",
      travellers: "1 traveller, Economy",
      type: "One-way",
      price: "₹ 34,463",
      oldPrice: "₹ 12,147",
      showPriceChange: true,
    },
    {
      from: "Melbourne",
      to: "Denpasar",
      date: "3/5",
      travellers: "1 traveller, Economy",
      type: "One-way",
      price: "₹ 34,463",
      oldPrice: "₹ 12,147",
      showPriceChange: true,
    },
    {
      from: "Melbourne",
      to: "Denpasar",
      date: "3/5",
      travellers: "1 traveller, Economy",
      type: "One-way",
      price: "₹ 34,463",
      oldPrice: "₹ 12,147",
      showPriceChange: true,
    },
  ];
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

  // console.log("selectedxxx", selectedIndex);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const toggleView = () => {
    setIsViewOpen(!isViewOpen);
    setIsViewOpen2(false);
  };

  const toggleView2 = () => {
    setIsViewOpen2(!isViewOpen2);
    setIsViewOpen(false);
  };

  const toggleView3 = () => {
    setIsViewOpen3(!isViewOpen3);
  };

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

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    SetLogin(islogin);

    var role = localStorage.getItem("is_role");
    if (islogin) {
      setUserRole(JSON.parse(role));
    }

    GetRecentSearch();
  }, []);

  const handleCounterChange = (type, change) => {
    // setSearchFlightList([]);
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
    const textData = e.target.value.toUpperCase();
    setSearchTerm(e.target.value);

    if (textData === "") {
      setMergedData(mergedData);
      return;
    }

    const newData = mergedData.filter((item) => {
      if (!item || !item.city_name) return false;
      return item.city_name.toUpperCase().includes(textData);
    });

    setFilteredFromData(newData);
  };

  const handleSearch2 = (e) => {
    const textData = e.target.value.toUpperCase();

    setSearchTerm2(e.target.value); // Update search term state

    if (textData === "") {
      // If input is cleared, restore the original list
      setSectorListTo(getSectorListTo);
      return;
    }

    const newData = getSectorListTo.filter((item) => {
      // console.log("ZEEL", item);

      if (!item || !item.destination) return false;

      // Extract city before "//" and check if it includes search input
      return item.destination.toUpperCase().includes(textData);
    });

    setFilteredToData(newData); // Update the filtered list
  };

  const handleSelect = (item) => {
    if (item.source === "getSectorListNew") {
      console.log("456", item);
      setCondition(0);
      // Handling GetSectorsIQ selection
      const selectedCity = item.city_name;
      const airportCode = item.airport_code;
      setDepCityCode(airportCode);
      setSelectedValue(`${selectedCity} (${airportCode})`);
      setIsDropdownOpen(false);
      setSelectedValue2("");
      setSearchTerm("");
      setSearchTerm2("");
      setSelectedDate(null);
      setDate1("");
      setSearchFlightListData([]);
      setDefaultMonth("");
      setSelectedIndex(null);

      // Filter sectors where the selected city appears before "//"
      const filteredSectors = getSectorListNew
        .filter((sector) => sector.Sector.startsWith(selectedCity + " //"))
        .map((sector) => ({
          destination: sector.Sector.split(" // ")[1].trim(),
          DestinationCode: sector.Destination,
        }))
        .sort((a, b) => a.destination.localeCompare(b.destination)); // Sort alphabetically

      setSectorListTo(filteredSectors);
    } else if (item.source === "getDepatureCityList") {
      console.log("123", item);
      setCondition(1);
      // Handling DepatureCityList selection
      setSelectedValue(`${item.city_name} (${item.airport_code})`);
      setSearchTerm(""); // Clear the search term after selection
      ArrivalCityList(item.city_code);
      SectorList(item.city_code);
      setDepCityCode(item.city_code);
      setIsDropdownOpen(false);
      setDefaultMonth("");
      setDefaultMonth2("");
      setSelectedDate(null);
      setSelectedDate2(null);
      setSelectedValue2("");
      setSearchFlightListData([]);
      setSelectedIndex(null);
    }
  };

  const handleSelect2 = (item) => {
    if (getCondition == 0) {
      setSelectedValue2(`${item.destination} (${item.DestinationCode})`);
      setSearchTerm2(""); // Clear the search term after selection
      // ArrivalCityList(getDepCityCode);
      setArrCityCode(item.DestinationCode);
      setIsDropdownOpen2(false);
      if (userRole === "2") {
        console.log("OKKKKKKKKK");
        dateAvailability(item.DestinationCode);
      } else if (userRole === "3") {
        console.log("OOOOOO");
        dateAvailabilitySupplier(item.DestinationCode);
      } else {
      }
      // getOnwardDate(item.city_code);
    } else if (getCondition == 1) {
      setSelectedValue2(`${item.city_name} (${item.airport_code})`);
      setSearchTerm2(""); // Clear the search term after selection
      ArrivalCityList(getDepCityCode);
      setArrCityCode(item.city_code);
      getOnwardDate(item.city_code);
      setIsDropdownOpen2(false);
    }
  };

  const onChange = (date, dateString) => {
    // Convert to YYYY-MM-DD format
    const formattedDate = moment(dateString).format("YYYY-MM-DD");

    setDate1(formattedDate); // Store formatted date in state
    setSelectedDate(date);

    if (selected == 1) {
      getReturnDate(formattedDate, 1, getArrCityCode); // Pass formatted date
    }
  };

  const onChange2 = (date, dateString) => {
    const formattedDate = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
    setDate2(formattedDate);
    setSelectedDate2(date);
  };

  const disablePastDates = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0); // Disable dates before today
  };

  const disableAllExceptApiDates = (current) => {
    if (getCondition == 0) {
      const formattedDate = current.format("YYYY-MM-DD");
      const onwardDates = getAvailableDate?.map((item) => item);
      return !onwardDates.includes(formattedDate);
    } else if (getCondition == 1) {
      const formattedDate = current.format("YYYY-MM-DD");
      const onwardDates = getOnwardDateList?.map((item) => item?.onward_date);
      return !onwardDates.includes(formattedDate);
    } else {
    }
  };

  // console.log("RecentSelection", RecentSelection);

  const disableDates = (current) => {
    const returndate = getReturnDateList.map(
      (date) => new Date(date.return_date).toISOString().split("T")[0]
    );

    return !returndate.includes(current.format("YYYY-MM-DD"));
  };

  const firstEnabledDate = dayjs(
    getReturnDateList[0]?.return_date || dayjs().format("YYYY-MM-DD")
  );

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip; // Returns the public IP
    } catch (error) {
      console.error("Error fetching public IP:", error);
      return null; // Handle errors by returning null or a default value
    }
  };

  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  }
  // const DepatureCityList = async () => {
  //   const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
  //   const publicIP = await getPublicIP();

  //   if (!publicIP) {
  //     console.error("Unable to fetch public IP. Request cannot be completed.");
  //     return;
  //   }

  //   const url = "https://devapi.fareboutique.com/v1/fbapi/dep_city";
  //   const payload = {
  //     trip_type: selected,
  //     end_user_ip: publicIP,
  //     token: token,
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     if (data.replyCode === "success") {
  //       console.log("Response from API:", data.data);
  //       setDepatureCityList(data.data);
  //       mergeDepartureData(data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error while fetching departure city list:", error);
  //   }
  // };

  // const mergeDepartureData = (newData) => {
  //   setMergedDepartureList((prevData) => {
  //     const mergedData = [...prevData, ...newData];

  //     // Remove duplicates based on city_name
  //     const uniqueData = mergedData.reduce((acc, current) => {
  //       if (!acc.some((item) => item.city_name === current.city_name)) {
  //         acc.push(current);
  //       }
  //       return acc;
  //     }, []);

  //     return uniqueData;
  //   });
  // };

  useEffect(() => {
    fetchData();
  }, [selected]);

  useEffect(() => {
    // if (getSearchFlightListData && getSearchFlightListData.length > 0) {
    //   const prices = getSearchFlightListData.map(item =>
    //     getCondition === 0 ? item?.price : item?.per_adult_child_price
    //   ).filter(price => price !== undefined && price !== null);
    //   const minPrice = Math.min(...prices);
    //   setLowestPrice(minPrice);
    // }
  }, [getSearchFlightListData, getCondition]);

  const getlowestprice = (data) => {
    if (data && data.length > 0) {
      const prices = data
        .map((item) =>
          getCondition === 0 ? item?.price : item?.per_adult_child_price
        )
        .filter((price) => price !== undefined && price !== null);

      const minPrice = Math.min(...prices);
      setLowestPrice(minPrice);
    }
  };

  const fetchData = async () => {
    try {
      // console.log("Fetching both APIs...");
      const departureData = await DepatureCityList(selected);
      const sectorData = await GetSectorsIQ();

      mergeData(departureData, sectorData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch Departure City List
  const DepatureCityList = async (selected) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP.");
      return [];
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

      const data = await response.json();

      if (data.replyCode === "success") {
        // console.log("Raw Departure Data:", data.data);
        return data.data.map((item) => ({
          ...item,
          source: "getDepatureCityList", // Identify the source
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching departure city list:", error);
      return [];
    }
  };

  const GetSectorsIQ = async () => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));

    try {
      const response = await axios.get(
        proxy + "https://omairiq.azurewebsites.net/sectors",
        {
          headers: {
            "api-key": API_KEY,
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        const data = response.data.data;
        // console.log("Raw Sector Data:", data);
        const uniqueCitiesMap = new Map();
        data.forEach((item) => {
          if (item.Sector) {
            const sectorParts = item.Sector.split(" // ");
            const originCity = sectorParts[0].trim();
            if (!uniqueCitiesMap.has(originCity)) {
              uniqueCitiesMap.set(originCity, {
                city_name: originCity,
                airport_code: item.Origin,
                airport_name: "",
                source: "getSectorListNew", // Identify the source
              });
            }
          }
        });
        setSectorListNew(data);

        return Array.from(uniqueCitiesMap.values());
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching sectors:", error);
      return [];
    }
  };

  // Merge Both Data Sources
  const mergeData = (departureData, sectorData) => {
    if (!Array.isArray(departureData) || !Array.isArray(sectorData)) {
      console.error("Invalid data format: ", departureData, sectorData);
      return;
    }

    const merged = [...departureData, ...sectorData]; // Combine both arrays

    // Sort the merged data alphabetically by city_name
    merged.sort((a, b) => {
      if (a.city_name < b.city_name) return -1;
      if (a.city_name > b.city_name) return 1;
      return 0;
    });
    // console.log("Merged and Sorted Data:", merged);
    setMergedData(merged);
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
          // "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data);
        const sortedCities = data.data.sort((a, b) => {
          if (a.city_name < b.city_name) return -1;
          if (a.city_name > b.city_name) return 1;
          return 0;
        });

        setSectorListTo(sortedCities);
        // Notification("success", "Success!", data.message);
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
          // "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data);
        setSectorList(data.data);
        // Notification("success", "Success!", data.message);
      } else {
        // Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
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
          // "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        // console.log("Response Dates from API ZEEL:", data);
        setOnwardDateList(data.data);

        const months = [
          ...new Set(
            data.data.map((item) => moment(item.onward_date).format("YYYY-MM"))
          ),
        ];
        const defaultmonth = moment(data.data[0].onward_date, "YYYY-MM-DD");
        getReturnDate(defaultmonth._i, 2, citycode);
        setDefaultMonth(defaultmonth);
        setAvailableMonths(months);
        console.log("defaultmonth._i", defaultmonth._i);
      } else {
        console.log("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
    }
  };

  const getReturnDate = async (citycode, code, arrCityCode) => {
    console.log("getArrCityCode", getArrCityCode);

    console.log("citycode zk", citycode);
    // console.log("code", code);

    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    const formateddate = moment(citycode).format("YYYY-MM-DD");

    console.log("Formated xd", formateddate);

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
      onward_date: code == 2 ? citycode : formateddate,
      arr_city_code: arrCityCode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        setReturnDateList(data.data);
        const defaultmonth = moment(data.data[0].return_date, "YYYY-MM-DD");
        setDefaultMonth2(defaultmonth);

        // Notification("success", "Success!", data.message);
      } else {
        // Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
    }
  };
  const searchFlight = async (isRecentClick = false, recentItem = null) => {
    setSearchCondition(false);

    const formattedDate = moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD");
    console.log("formattedDate", date1);

    const formattedDate1 = moment(defaultMonth, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    const formateddate = moment(date2).format("YYYY-MM-DD");

    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    const fromCity = recentItem ? recentItem.departure_city : selectedValue;
    const toCity = recentItem ? recentItem.arrival_city : selectedValue2;

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      setSearchFlightListLoading(false);
      return;
    }
    if (!fromCity) {
      alert("Please Select From City");
      setSearchFlightListLoading(false);
      return;
    }
    if (!toCity) {
      alert("Please Select To City");
      setSearchFlightListLoading(false);
      return;
    }
    if (selected == 1 && recentItem == null) {
      console.log("selectedindex", selectedIndex);

      if (
        selected == 1 &&
        (!defaultMonth2 || (defaultMonth2 && defaultMonth2._i === ""))
      ) {
        alert("Please Select Return Date");
        setSearchFlightListLoading(false);
        return;
      } else {
        console.log("false");

        setIsDropdownOpenTravellers(false);
        setSearchFlightListLoading(true);

        const url = "https://devapi.fareboutique.com/v1/fbapi/search";

        const payload = {
          trip_type: selected,
          end_user_ip: "183.83.43.117",
          token: token,
          dep_city_code: recentItem
            ? recentItem.departure_city_code
            : getDepCityCode,
          arr_city_code: recentItem
            ? recentItem.arrival_city_code
            : getArrCityCode,
          onward_date: recentItem
            ? recentItem.departure_date
            : formattedDate == "Invalid date"
            ? defaultMonth._i
            : date1,
          return_date: recentItem
            ? recentItem.return_departure_date
            : formateddate == "Invalid date"
            ? defaultMonth2._i
            : formateddate,
          adult: recentItem
            ? Number(recentItem.adult_travelers)
            : travellers?.adult,
          children: recentItem
            ? Number(recentItem.child_travelers)
            : travellers?.child,
          infant: recentItem
            ? Number(recentItem.infant_travelers)
            : travellers?.infant,
        };

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              // "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (data.errorCode == 0) {
            const arrdate = data.data?.arr_date || "";
            // addSelection(
            //   selectedValue,
            //   selectedValue2,
            //   formattedDate == "Invalid date" ? defaultMonth._i : formattedDate,
            //   selected == 1
            //     ? formateddate == "Invalid date"
            //       ? defaultMonth2._i
            //       : formateddate
            //     : "",
            //   travellers?.adult,
            //   travellers?.child,
            //   travellers?.infant,
            //   totalTravellers,
            //   selected,
            //   token,
            //   getDepCityCode,
            //   getArrCityCode
            // );

            const prices = data?.data
              ?.map((item) =>
                getCondition === 0 ? item?.price : item?.per_adult_child_price
              )
              .filter((price) => price !== undefined && price !== null);

            const minPrice = Math.min(...prices);
            setLowestPrice(minPrice);
            setSearchFlightListData(data.data);
            setbookingtokenid(data.booking_token_id);
            setSearchFlightListLoading(false);
            setSearchFlightListMsg("");
            // fareQuote();
            // Notification("success", "Success!", data.message);

            if (!isRecentClick) {
              RecentSearch(
                selectedValue,
                selectedValue2,
                travellers?.adult,
                travellers?.child,
                travellers?.infant,
                totalTravellers,
                formattedDate == "Invalid date" ? defaultMonth._i : date1,
                arrdate,
                getDepCityCode,
                getArrCityCode,
                getCondition,
                selected,
                formateddate == "Invalid date"
                  ? defaultMonth2._i
                  : formateddate,
                minPrice
              );
            }
          } else if (data.errorCode == 1) {
            setSearchCondition(true);
            setSearchFlightList([]);
            setSearchFlightListMsg(data.errorMessage);
            setSearchFlightListLoading(false);
          } else {
            Notification(
              "error",
              "Error!",
              data.message || data.errorMessage || "Something went wrong"
            );
            setSearchFlightListLoading(false);
            setSearchFlightListData([]);
          }
        } catch (error) {
          setSearchFlightListLoading(false);
          console.error("Error while fetching departure city list:", error);
          Notification("error", "Error!", "Failed to fetch data");
        }
      }
    } else {
      console.log("false");

      if (
        selected == 1 &&
        (!recentItem?.return_departure_date ||
          recentItem?.return_departure_date == "")
      ) {
        alert("Please Select Return Date");
        setSearchFlightListLoading(false);
        return;
      } else {
        setIsDropdownOpenTravellers(false);
        setSearchFlightListLoading(true);

        const url = "https://devapi.fareboutique.com/v1/fbapi/search";

        const payload = {
          trip_type: selected,
          end_user_ip: "183.83.43.117",
          token: token,
          dep_city_code: recentItem
            ? recentItem.departure_city_code
            : getDepCityCode,
          arr_city_code: recentItem
            ? recentItem.arrival_city_code
            : getArrCityCode,
          onward_date: recentItem
            ? recentItem.departure_date
            : formattedDate == "Invalid date"
            ? defaultMonth._i
            : date1,
          return_date: recentItem
            ? recentItem.return_departure_date
            : formateddate == "Invalid date"
            ? defaultMonth2._i
            : formateddate,
          adult: recentItem
            ? Number(recentItem.adult_travelers)
            : travellers?.adult,
          children: recentItem
            ? Number(recentItem.child_travelers)
            : travellers?.child,
          infant: recentItem
            ? Number(recentItem.infant_travelers)
            : travellers?.infant,
        };

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              // "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (data.errorCode == 0) {
            const arrdate = data.data?.arr_date || "";
            // addSelection(
            //   selectedValue,
            //   selectedValue2,
            //   formattedDate == "Invalid date" ? defaultMonth._i : formattedDate,
            //   selected == 1
            //     ? formateddate == "Invalid date"
            //       ? defaultMonth2._i
            //       : formateddate
            //     : "",
            //   travellers?.adult,
            //   travellers?.child,
            //   travellers?.infant,
            //   totalTravellers,
            //   selected,
            //   token,
            //   getDepCityCode,
            //   getArrCityCode
            // );

            // getlowestprice(data.data)

            const prices = data?.data
              ?.map((item) =>
                getCondition === 0 ? item?.price : item?.per_adult_child_price
              )
              .filter((price) => price !== undefined && price !== null);

            const minPrice = Math.min(...prices);
            setLowestPrice(minPrice);

            setSearchFlightListData(data.data);
            setbookingtokenid(data.booking_token_id);
            setSearchFlightListLoading(false);
            setSearchFlightListMsg("");
            // fareQuote();
            // Notification("success", "Success!", data.message);

            if (!isRecentClick) {
              RecentSearch(
                selectedValue,
                selectedValue2,
                travellers?.adult,
                travellers?.child,
                travellers?.infant,
                totalTravellers,
                formattedDate == "Invalid date"
                  ? defaultMonth._i
                  : formattedDate,
                arrdate,
                getDepCityCode,
                getArrCityCode,
                getCondition,
                selected,
                formateddate == "Invalid date"
                  ? defaultMonth2._i
                  : formateddate,
                minPrice
              );
            }
          } else if (data.errorCode == 1) {
            setSearchCondition(true);
            setSearchFlightListData([]);
            setSearchFlightListMsg(data.errorMessage);
            setSearchFlightListLoading(false);
          } else {
            Notification(
              "error",
              "Error!",
              data.message || data.errorMessage || "Something went wrong"
            );
            setSearchFlightListLoading(false);
          }
        } catch (error) {
          setSearchFlightListLoading(false);
          console.error("Error while fetching departure city list:", error);
          Notification("error", "Error!", "Failed to fetch data");
        }
      }
    }
  };

  // const RecentSearch = async (
  //   selectedValue,
  //   selectedValue2,
  //   adult,
  //   child,
  //   infant,
  //   totalTravellers,
  //   depdate,
  //   arrdate,
  //   getDepCityCode,
  //   getArrCityCode,
  //   condition,
  //   selected,
  //   returndate,
  //   lowestPrice,
  // ) => {
  //   console.log("selected",selected);

  //   const token = JSON.parse(localStorage.getItem("is_token"));

  //   const formdata = new FormData();
  //   await formdata.append("departure_city", selectedValue);
  //   await formdata.append("arrival_city", selectedValue2);
  //   await formdata.append("adult_travelers", adult);
  //   await formdata.append("child_travelers", child);
  //   await formdata.append("infant_travelers", infant);
  //   await formdata.append("total_travelers", totalTravellers);
  //   await formdata.append("departure_date", depdate);
  //   await formdata.append("arrival_date", arrdate);
  //   await formdata.append("departure_city_code", getDepCityCode);
  //   await formdata.append("arrival_city_code", getArrCityCode);
  //   await formdata.append("get_condition", condition);
  //   await formdata.append("is_return", selected);
  //   await formdata.append("price", lowestPrice);

  //   if (selected == 1) {
  //     await formdata.append(
  //       "return_departure_date",
  //       returndate ? returndate : ""
  //     );
  //   }

  //   console.table(Object.fromEntries(formdata.entries()));
  //   axios
  //     .post(recent_search, formdata, {
  //       headers: {
  //         Accept: ACCEPT_HEADER,
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data.status === "Token is Expired") {
  //         logout();
  //       } else if (res.data.success == 1) {
  //         // console.log("resS", res);
  //         GetRecentSearch();
  //       } else {
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("ERROR in recent search ", err);
  //     });
  // };

  const RecentSearch = (
    selectedValue,
    selectedValue2,
    adult,
    child,
    infant,
    totalTravellers,
    depdate,
    arrdate,
    getDepCityCode,
    getArrCityCode,
    condition,
    selected,
    returndate,
    lowestPrice
  ) => {
    console.log("selected", selected);

    const token = JSON.parse(localStorage.getItem("is_token"));

    const formdata = new FormData();
    formdata.append("departure_city", selectedValue);
    formdata.append("arrival_city", selectedValue2);
    formdata.append("adult_travelers", adult);
    formdata.append("child_travelers", child);
    formdata.append("infant_travelers", infant);
    formdata.append("total_travelers", totalTravellers);
    formdata.append("departure_date", depdate);
    formdata.append("arrival_date", arrdate);
    formdata.append("departure_city_code", getDepCityCode);
    formdata.append("arrival_city_code", getArrCityCode);
    formdata.append("get_condition", condition);
    formdata.append("is_return", selected);
    formdata.append("price", lowestPrice);

    if (selected == 1) {
      formdata.append("return_departure_date", returndate ? returndate : "");
    }

    console.table(Object.fromEntries(formdata.entries()));

    // setTimeout(() => {
    axios
      .post(recent_search, formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.status === "Token is Expired") {
          logout();
        } else if (res.data.success == 1) {
          GetRecentSearch();
        }
      })
      .catch((err) => {
        console.log("ERROR in recent search ", err);
      });
    // }, 3000); // 1 second delay
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
          // "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        // setSearchFlightList(data.data);
        // Notification("success", "Success!", data.message);
      } else {
        Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const handleRecentClick = async (item) => {
    setSelectedIndex(item);
    setSelectedValue(item?.departure_city);
    setSelectedValue2(item?.arrival_city);
    setSelectedDate(item.departure_date);
    if (item.is_return == 1) {
      setSelectedDate2(item.return_departure_date);
    }
    setTravellers({
      adult: Number(item.adult_travelers),
      child: Number(item.child_travelers),
      infant: Number(item.infant_travelers),
    });
    // setIsViewOpen3(false);
    setCondition(item?.get_condition);
    // setRecentSearchCondition(false);

    await new Promise((resolve) => setTimeout(resolve, 0));
    if (item?.get_condition == 0) {
      searchFlightData(true, item);
    } else if (item?.get_condition == 1) {
      searchFlight(true, item);
    } else {
    }
  };

  const dateAvailability = async (destinationcode) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));

    const payload = {
      origin: getDepCityCode,
      destination: destinationcode,
    };

    try {
      const response = await fetch(
        proxy + "https://omairiq.azurewebsites.net/availability",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "api-key": API_KEY,
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.message !== "Data not found") {
        console.log("Response Available Date from API:", data);

        const formattedDates = data?.data?.map((date) => {
          let [day, month, year] = date.split("-");
          return `${year}-${monthMap[month]}-${day}`;
        });
        // console.log("formatted numeric date", formattedDates);
        setAvailableDate(formattedDates); // Set formatted dates

        const months = [
          ...new Set(
            formattedDates.map((item) => moment(item).format("YYYY-MM"))
          ),
        ];

        const defaultmonth = moment(formattedDates[0], "YYYY-MM-DD"); // Ensure correct format
        setDefaultMonth(defaultmonth);
        setAvailableMonths(months);
        console.log("defaultmonth._i", defaultmonth);

        // Notification("success", "Success!", data.message);
      } else {
        // Notification("error", "Error!", data.message || "Something went wrong");
        setAvailableDate([]);
        setSelectedDate("");
        setDefaultMonth("");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const dateAvailabilitySupplier = async (destinationcode) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));

    const payload = {
      origin: getDepCityCode,
      destination: destinationcode,
    };

    try {
      const response = await fetch(
        proxy + "https://omairiq.azurewebsites.net/supplieravailability",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "api-key": API_KEY,
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.message !== "Data not found") {
        console.log("Response Available Date from API:", data);

        const formattedDates = data?.data?.map((date) => {
          let [day, month, year] = date.split("-");
          return `${year}-${monthMap[month]}-${day}`;
        });
        // console.log("formatted numeric date", formattedDates);
        setAvailableDate(formattedDates); // Set formatted dates

        const months = [
          ...new Set(
            formattedDates.map((item) => moment(item).format("YYYY-MM"))
          ),
        ];

        const defaultmonth = moment(formattedDates[0], "YYYY-MM-DD"); // Ensure correct format
        setDefaultMonth(defaultmonth);
        setAvailableMonths(months);
        console.log("defaultmonth._i", defaultmonth);

        // Notification("success", "Success!", data.message);
      } else {
        // Notification("error", "Error!", data.message || "Something went wrong");
        setAvailableDate([]);
        setSelectedDate("");
        setDefaultMonth("");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const searchFlightData = async (isRecentClick = false, recentItem = null) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    setSearchCondition(false);

    const formattedDate =
      date1 || moment(defaultMonth, "DD-MMM-YYYY").format("YYYY-MM-DD");

    const formattedDate1 = moment(defaultMonth, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    const formateddate = moment(date2, "DD-MM-YYYY").format("YYYY-MM-DD");

    const fromCity = recentItem ? recentItem.departure_city : selectedValue;
    const toCity = recentItem ? recentItem.arrival_city : selectedValue2;

    if (!fromCity) {
      alert("Please Select From City");
      setSearchFlightListLoading(false);
      return;
    }
    if (!toCity) {
      alert("Please Select To City");
      setSearchFlightListLoading(false);
      return;
    } else {
      setIsDropdownOpenTravellers(false);
      setSearchFlightListLoading(true);
      const departureDate =
        selected == 0
          ? formattedDate
          : moment(formattedDate, "YYYY-MM-DD").format("YYYY/MM/DD");

      const payload = {
        origin: recentItem ? recentItem.departure_city_code : getDepCityCode,
        destination: recentItem ? recentItem.arrival_city_code : getArrCityCode,
        departure_date: recentItem ? recentItem.departure_date : departureDate,
        adult: recentItem
          ? Number(recentItem.adult_travelers)
          : travellers?.adult,
        children: recentItem
          ? Number(recentItem.child_travelers)
          : travellers?.child,
        infant: recentItem
          ? Number(recentItem.infant_travelers)
          : travellers?.infant,
      };

      let apiUrl = "";

      if (userRole === "2") {
        apiUrl = proxy + "https://omairiq.azurewebsites.net/search";
      } else if (userRole === "3") {
        apiUrl = proxy + "https://omairiq.azurewebsites.net/suppliersearch";
      } else {
        console.error("Invalid selection value");
        return;
      }

      try {
        const response = await fetch(
          // proxy + "https://omairiq.azurewebsites.net/search", {
          apiUrl,
          {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              "api-key": API_KEY,
              Authorization: token,
            },
            body: JSON.stringify(payload),
          }
        );

        // Parse the JSON response
        const data = await response.json();

        if (data.status === "success") {
          console.log("Response Search Data from API airiq:", data.data);
          const prices = data?.data
            ?.map((item) =>
              getCondition === 0 ? item?.price : item?.per_adult_child_price
            )
            .filter((price) => price !== undefined && price !== null);

          const minPrice = Math.min(...prices);
          setSearchFlightListData(data.data);
          setbookingtokenid(data.booking_token_id);
          setSearchFlightListDatamsg(data.message);
          setSearchFlightListLoading(false);
          if (!isRecentClick) {
            RecentSearch2(
              selectedValue,
              selectedValue2,
              travellers?.adult,
              travellers?.child,
              travellers?.infant,
              totalTravellers,
              departureDate ? departureDate : selectedIndex.departure_date,
              getDepCityCode
                ? getDepCityCode
                : selectedIndex.departure_city_code,
              getArrCityCode ? getArrCityCode : selectedIndex.arrival_city_code,
              getCondition,
              minPrice
            );
          }
        }
        //  else if (data.errorCode == 1) {
        //   setSearchCondition(true);
        //   setSearchFlightList([]);
        //   setSearchFlightListMsg(data.errorMessage);
        //   setSearchFlightListLoading(false);
        // }
        else {
          setSearchFlightListLoading(false);
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

  const RecentSearch2 = async (
    selectedValue,
    selectedValue2,
    adult,
    child,
    infant,
    totalTravellers,
    depdate,
    getDepCityCode,
    getArrCityCode,
    condition,
    lowestPrice
  ) => {
    const token = JSON.parse(localStorage.getItem("is_token"));

    const formdata = new FormData();
    await formdata.append("departure_city", selectedValue);
    await formdata.append("arrival_city", selectedValue2);
    await formdata.append("adult_travelers", adult);
    await formdata.append("child_travelers", child);
    await formdata.append("infant_travelers", infant);
    await formdata.append("total_travelers", totalTravellers);
    await formdata.append("departure_date", depdate);
    await formdata.append("departure_city_code", getDepCityCode);
    await formdata.append("arrival_city_code", getArrCityCode);
    await formdata.append("get_condition", condition);
    await formdata.append("price", lowestPrice);

    axios
      .post(recent_search, formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.status === "Token is Expired") {
          logout();
        } else if (res.data.success == 1) {
          // console.log("resS", res);
          GetRecentSearch();
        } else {
        }
      })
      .catch((err) => {
        console.log("ERROR in recent search ", err);
      });
  };

  const GetRecentSearch = () => {
    const token = JSON.parse(localStorage.getItem("is_token"));

    axios
      .get(get_recent_search, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.status === "Token is Expired") {
          logout();
        } else if (res.data.success === 1) {
          // console.log("RRRR", res.data.data);
          setRecentSelection(res.data.data);
        } else {
        }
      })
      .catch((err) => {
        console.log("ERR in getRecent search api", err);
      });
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
              setSelectedDate(null);
              setSelectedDate2(null);
              setDefaultMonth(null);
              setDefaultMonth2(null);
              DepatureCityList(0);
              setSearchFlightList([]);
            }}
          />
          <label htmlFor="oneWay">
            <h4>One Way</h4>
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
              setSelectedDate(null);
              setSelectedDate2(null);
              setDefaultMonth(null);
              setDefaultMonth2(null);
              DepatureCityList(1);
              setSearchFlightList([]);
            }}
          />
          <label htmlFor="roundTrip">
            <h4>Round Trip</h4>
          </label>

          {/* {login && (
            <div className="recentSearchbtn" onClick={() => toggleView3()}>
              <h4
                className={`recentbtnselected1 ${
                  isViewOpen3 ? "recentbtnselected" : ""
                }`}
              >
                Recent Search
              </h4>
            </div>
          )} */}
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
            <div className={`${getCondition === 0} col-12 col-lg-6`}>
              <div className="row align-items-center pb-3 p-md-0">
                <div className="col-md-5 d-flex flex-column gap-2">
                  <div className="fromtxt">From</div>
                  <div className="dropdown-container" ref={dropdownRef}>
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
                          placeholder="Search city..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e)}
                          className="dropdown-search-input"
                        />

                        {searchTerm ? (
                          filteredFromdata?.length > 0 ? (
                            filteredFromdata.map((item, index) => (
                              <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleSelect(item)}
                              >
                                <div className="city-name">
                                  {item.city_name}
                                </div>
                                <div className="airport-details">
                                  {item.airport_name && `${item.airport_name} `}
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
                          )
                        ) : mergedData?.length > 0 ? (
                          mergedData.map((item, index) => (
                            <div
                              key={index}
                              className="dropdown-item"
                              onClick={() => handleSelect(item)}
                            >
                              <div className="city-name">{item.city_name}</div>
                              <div className="airport-details">
                                {item.airport_name && `${item.airport_name} `}
                                <span className="airport-code">
                                  ({item.airport_code})
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-no-results">
                            No Results Found
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

                  <div className="dropdown-container" ref={dropdownRef2}>
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
                        <input
                          type="text"
                          placeholder="Search city..."
                          value={searchTerm2}
                          onChange={(e) => handleSearch2(e)}
                          className="dropdown-search-input"
                        />
                        {searchTerm2 ? (
                          <>
                            {filteredTodata?.length > 0 ? (
                              filteredTodata?.map((item, index) => (
                                <div
                                  key={index}
                                  className="dropdown-item"
                                  onClick={() => handleSelect2(item)}
                                >
                                  <div className="city-name">
                                    {item.destination}
                                  </div>
                                  <div className="airport-details">
                                    <span className="airport-code">
                                      ({item.DestinationCode})
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="dropdown-no-results">
                                No Results Found
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {getSectorListTo?.length > 0 ? (
                              getSectorListTo?.map((item, index) => (
                                <div
                                  key={index}
                                  className="dropdown-item"
                                  onClick={() => {
                                    handleSelect2(item);
                                  }}
                                >
                                  <div className="city-name">
                                    {getCondition == 0 ? (
                                      <>{item.destination}</>
                                    ) : (
                                      <>{item.city_name}</>
                                    )}
                                  </div>
                                  <div className="airport-details">
                                    {getCondition == 1 ? (
                                      <>{item.airport_name} </>
                                    ) : (
                                      <></>
                                    )}
                                    <span className="airport-code">
                                      (
                                      {getCondition == 1
                                        ? item.airport_code
                                        : item.DestinationCode}
                                      )
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="dropdown-no-results">
                                No Results Found
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
              <div className="row align-items-center gap-3 gap-md-0 search_tickert_space_around">
                <div
                  className={` ${
                    getCondition === 0 ? "col-md-5" : "col-md-4"
                  } col-12  d-flex flex-column gap-2`}
                >
                  <div className="departtxt">Departure</div>
                  <div className="custom-date-picker">
                    <DatePicker
                      onChange={onChange}
                      placeholder="Select Date"
                      format="DD-MMM-YYYY"
                      disabledDate={disableAllExceptApiDates}
                      value={
                        selectedDate || defaultMonth
                          ? dayjs(selectedDate || defaultMonth)
                          : null
                      }
                    />
                  </div>
                </div>
                {getCondition === 0 || selected === 0 ? (
                  <></>
                ) : (
                  <>
                    <div
                      className={`${
                        getCondition === 0 ? "col-md-5" : "col-md-4"
                      } d-flex flex-column gap-2`}
                    >
                      <div className="departtxt">Return</div>
                      <div
                        className={`${
                          selected === 0 && getCondition === 1
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
                          // value={date2 ? moment(date2, "DD-MM-YYYY") : null}
                          value={
                            selectedDate2 || defaultMonth2
                              ? dayjs(selectedDate2 || defaultMonth2)
                              : null
                          }
                          placeholder="Select Date"
                          defaultPickerValue={firstEnabledDate}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div
                  className={` ${
                    getCondition === 0 ? "col-md-5" : "col-md-4"
                  } col-md-4 d-flex flex-column gap-2 mb-3 mb-md-0`}
                >
                  <div className="departtxt">Travelers</div>
                  <div className="travellers-container">
                    {/* Display View */}
                    <div
                      className="travellers-summary"
                      onClick={toggleDropdownTraveler}
                    >
                      <p>{totalTravellers} Travelers</p>
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
                        {/* <button
                          className="apply-button"
                          onClick={toggleDropdownTraveler}
                        >
                          APPLY
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btnn w-25 h-100 align-self-center d-flex align-item-center justify-content-center"
              disabled={selectedIndex !== null}
              style={{
                backgroundColor: selectedIndex !== null ? "#ececec" : "#fffbdb",
              }}
              onClick={() => {
                // setRecentSearchCondition(true);

                if (getCondition == 0) {
                  searchFlightData();
                  setSelectedIndex(null);
                } else if (getCondition == 1) {
                  searchFlight();
                  setSelectedIndex(null);
                }
              }}
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
            {getSearchFlightListDatamsg === "Data not found" ||
            getSearchFlightListMsg === "No data found" ? (
              <>
                <p className="no_flight_search_line">No Flights Available.</p>
              </>
            ) : (
              <>
                {getSearchFlightListData?.length > 0 ? (
                  <>
                    <div className="flightcounter">
                      <h5 className="hero_ticket_book_resp_font_size">
                        We have{" "}
                        <span>{getSearchFlightListData?.length} Flight</span>{" "}
                        from{" "}
                        <span>
                          {getSearchFlightListData[0]?.dep_city_name
                            ? getSearchFlightListData[0]?.dep_city_name
                            : getSearchFlightListData[0]?.origin}
                        </span>{" "}
                        to {""}
                        <span>
                          {getSearchFlightListData[0]?.arr_city_name
                            ? getSearchFlightListData[0]?.arr_city_name
                            : getSearchFlightListData[0]?.destination}
                        </span>{" "}
                        {totalTravellers} Traveller
                      </h5>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {getSeachCondition === true ? (
                  <>
                    <p className="no_flight_search_line">
                      No Flights Available.
                    </p>
                  </>
                ) : (
                  <>
                    {[...getSearchFlightListData]
                      .sort((a, b) => {
                        const priceA =
                          getCondition === 0
                            ? a.price
                            : a.per_adult_child_price;
                        const priceB =
                          getCondition === 0
                            ? b.price
                            : b.per_adult_child_price;
                        return priceA - priceB; // ascending order
                      })
                      .map((item, index) => {
                        const calculateDuration = (departure, arrival) => {
                          const depTime = moment(departure, "HH:mm");
                          const arrTime = moment(arrival, "HH:mm");
                          const duration = moment.duration(
                            arrTime.diff(depTime)
                          );
                          return `${Math.floor(
                            duration.asHours()
                          )}h ${duration.minutes()}m`;
                        };
                        return (
                          <>
                            <div className="flightsavailable shadow">
                              <div className="row align-items-center">
                                <div className="col-12 col-lg-9 justify-content-space-between">
                                  <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                                    <div className="airlinename col-12 col-lg-3">
                                      <div>
                                        {(() => {
                                          const airline =
                                            getCondition === 1
                                              ? item.airline_name
                                              : item.airline;

                                          return airline ===
                                            "IndiGo Airlines" ||
                                            airline === "IndiGo" ? (
                                            <img
                                              src={images.IndiGoAirlines_logo}
                                              className="airline_logo"
                                            />
                                          ) : airline === "Neos" ? (
                                            <img
                                              src={images.neoslogo}
                                              className="airline_logo"
                                            />
                                          ) : airline === "SpiceJet" ? (
                                            <img
                                              src={images.spicejet}
                                              className="airline_logo"
                                            />
                                          ) : airline === "Air India" ? (
                                            <img
                                              src={images.airindialogo}
                                              className="airline_logo"
                                            />
                                          ) : airline === "Akasa Air" ? (
                                            <img
                                              src={images.akasalogo}
                                              className="airline_logo"
                                            />
                                          ) : airline === "Etihad" ? (
                                            <img
                                              src={images.etihadlogo}
                                              style={{
                                                backgroundColor: "#fffbdb",
                                                padding: "5px",
                                                borderRadius: "5px",
                                              }}
                                              className="airline_logo"
                                            />
                                          ) : airline === "Vistara" ? (
                                            <img
                                              src={images.vistaralogo}
                                              className="airline_logo"
                                            />
                                          ) : airline === "AirAsia X" ? (
                                            <img
                                              src={images.airasiax}
                                              className="airline_logo"
                                            />
                                          ) : airline === "AirAsia" ? (
                                            <img
                                              src={images.airasia}
                                              className="airline_logo"
                                            />
                                          ) : airline === "Azul" ? (
                                            <img
                                              src={images.azul}
                                              className="airline_logo"
                                            />
                                          ) : (
                                            <IoAirplaneSharp
                                              size={40}
                                              color="white"
                                            />
                                          );
                                        })()}
                                      </div>

                                      <div className="planecomp">
                                        {getCondition == 0 ? (
                                          <>{item?.airline}</>
                                        ) : (
                                          <>{item?.airline_name}</>
                                        )}
                                      </div>
                                      <div className="flightnum">
                                        {item?.flight_number}
                                      </div>
                                    </div>
                                    <div className="flight-details col-12 col-lg-6 justify-content-center">
                                      <div className="flight-departure text-center">
                                        <h5 className="flighttime">
                                          {getCondition == 0 ? (
                                            <>{item?.departure_time}</>
                                          ) : (
                                            <>{item?.dep_time}</>
                                          )}
                                        </h5>
                                        <h5 className="airportname">
                                          {getCondition == 0 ? (
                                            <>{item?.origin}</>
                                          ) : (
                                            <>{item?.dep_city_code}</>
                                          )}
                                        </h5>

                                        <p className="alldate text-white">
                                          {getCondition == 0 ? (
                                            <>
                                              {moment(
                                                item?.departure_date
                                              ).format("DD-MM-YYYY")}{" "}
                                            </>
                                          ) : (
                                            <>
                                              {moment(item?.onward_date).format(
                                                "DD-MM-YYYY"
                                              )}{" "}
                                            </>
                                          )}
                                        </p>
                                      </div>
                                      <div className="d-flex align-items-center gap-2 gap-lg-3">
                                        <span className="text-white">From</span>
                                        <div className="from-to text-center">
                                          {/* <h6 className="text-white">
                                      {item?.duration &&
                                        `${item.duration.split(":")[0]}h ${item.duration.split(":")[1]
                                        }min`}
                                    </h6> */}
                                          <h6 className="text-white">
                                            {getCondition == 0 ? (
                                              <>
                                                {calculateDuration(
                                                  item?.departure_time,
                                                  item?.arival_time
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                {item?.duration &&
                                                  `${
                                                    item.duration.split(":")[0]
                                                  }h ${
                                                    item.duration.split(":")[1]
                                                  }min`}
                                              </>
                                            )}
                                          </h6>
                                          <img
                                            src={images.vimaan}
                                            alt=""
                                            className="imagerouteplane"
                                          />
                                          <h6 className="text-white">
                                            {getCondition == 0 ? (
                                              <>{item?.flight_route}</>
                                            ) : (
                                              <>{item?.no_of_stop} stop</>
                                            )}
                                          </h6>
                                        </div>
                                        <span className="text-white">To</span>
                                      </div>
                                      <div className="flight-departure text-center">
                                        <h5 className="flighttime">
                                          {getCondition == 0 ? (
                                            <>{item?.arival_time}</>
                                          ) : (
                                            <>{item?.arr_time}</>
                                          )}
                                        </h5>
                                        <h5 className="airportname">
                                          {getCondition == 0 ? (
                                            <>{item?.destination}</>
                                          ) : (
                                            <>{item?.arr_city_code}</>
                                          )}
                                        </h5>
                                        <p className="alldate">
                                          {getCondition == 0 ? (
                                            <>
                                              {moment(item?.arival_date).format(
                                                "DD-MM-YYYY"
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {moment(item?.arr_date).format(
                                                "DD-MM-YYYY"
                                              )}
                                            </>
                                          )}
                                        </p>
                                      </div>
                                    </div>

                                    {/* <div className="nanolito"></div> */}
                                    {/* <div className="pricediv col-lg-3">
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
                              </div> */}
                                  </div>
                                  {item?.return_flight_data ? (
                                    <>
                                      <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                                        <div className="airlinename col-12 col-lg-3">
                                          <div>
                                            {(() => {
                                              const airline =
                                                getCondition === 1
                                                  ? item.airline_name
                                                  : item.airline;

                                              return airline ===
                                                "IndiGo Airlines" ||
                                                airline === "IndiGo" ? (
                                                <img
                                                  src={
                                                    images.IndiGoAirlines_logo
                                                  }
                                                  className="airline_logo"
                                                />
                                              ) : airline === "Neos" ? (
                                                <img
                                                  src={images.neoslogo}
                                                  className="airline_logo"
                                                />
                                              ) : airline === "SpiceJet" ? (
                                                <img
                                                  src={images.spicejet}
                                                  className="airline_logo"
                                                />
                                              ) : airline === "Air India" ? (
                                                <img
                                                  src={images.airindialogo}
                                                  className="airline_logo"
                                                />
                                              ) : airline === "Akasa Air" ? (
                                                <img
                                                  src={images.akasalogo}
                                                  className="airline_logo"
                                                />
                                              ) : airline === "Etihad" ? (
                                                <img
                                                  src={images.etihadlogo}
                                                  style={{
                                                    backgroundColor: "#fffbdb",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                  }}
                                                  className="airline_logo"
                                                />
                                              ) : airline === "Vistara" ? (
                                                <img
                                                  src={images.vistaralogo}
                                                  className="airline_logo"
                                                />
                                              ) : airline === "AirAsia X" ? (
                                                <img
                                                  src={images.airasiax}
                                                  className="airline_logo"
                                                />
                                              ) : (
                                                <IoAirplaneSharp
                                                  size={40}
                                                  color="white"
                                                />
                                              );
                                            })()}
                                          </div>

                                          <div className="planecomp">
                                            {item?.airline}
                                          </div>
                                          <div className="flightnum">
                                            {
                                              item?.return_flight_data
                                                ?.return_flight_number
                                            }
                                          </div>
                                        </div>
                                        <div className="flight-details col-12 col-lg-6 justify-content-center">
                                          <div className="flight-departure text-center">
                                            <h5 className="flighttime">
                                              {
                                                item?.return_flight_data
                                                  ?.return_dep_time
                                              }
                                            </h5>
                                            <h5 className="airportname">
                                              {
                                                item?.return_flight_data
                                                  ?.return_dep_city_name
                                              }
                                            </h5>
                                            <p className="alldate">
                                              {moment(
                                                item?.return_flight_data
                                                  ?.return_dep_date
                                              ).format("DD-MM-YYYY")}
                                            </p>
                                          </div>
                                          <div className="d-flex align-items-center gap-2 gap-lg-3">
                                            <span className="text-white">
                                              To
                                            </span>
                                            <div className="from-to text-center">
                                              <h6 className="text-white">
                                                {`${item?.return_flight_data?.return_trip_duration}h`}
                                              </h6>
                                              <img
                                                src={images.vimaan}
                                                alt=""
                                                className="imagerouteplane"
                                              />
                                              <h6 className="text-white">
                                                {item?.return_no_of_stop} Stop
                                              </h6>
                                            </div>
                                            <span className="text-white">
                                              From
                                            </span>
                                          </div>
                                          <div className="flight-departure text-center">
                                            <h5 className="flighttime">
                                              {
                                                item?.return_flight_data
                                                  ?.return_arr_time
                                              }
                                            </h5>
                                            <h5 className="airportname">
                                              {
                                                item?.return_flight_data
                                                  ?.return_arr_city_name
                                              }
                                            </h5>
                                            <p className="alldate">
                                              {moment(
                                                item?.return_flight_data
                                                  ?.return_arr_date
                                              ).format("DD-MM-YYYY")}
                                            </p>
                                          </div>
                                        </div>

                                        {/* <div className="nanolito"></div> */}
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                <div className="col-12 col-lg-3">
                                  <div className="pricediv col-lg-3 mb-3 mb-lg-0">
                                    <div className="d-flex align-items-center">
                                      <FaRupeeSign size={20} color="#fff" />
                                      <h4 className="text-white fw-bold dijit">
                                        {/* {
                                  (item?.price * ((travellers?.adult || 0) + (travellers?.child || 0))) + (item?.infant_price * (travellers?.infant || 0))
                                  } */}
                                        {getCondition == 0 ? (
                                          <>{item?.price}</>
                                        ) : (
                                          <>
                                            {/* {(
                                        item?.total_payable_price /
                                        totalTravellers
                                      )?.toFixed(2)} */}
                                            {item?.per_adult_child_price}
                                          </>
                                        )}
                                      </h4>
                                    </div>
                                    {/* <div className="text-white">
                                Total Fare for {totalTravellers}
                              </div> */}
                                    {login ? (
                                      <Link
                                        to={"/TicketBookingDetails"}
                                        state={{
                                          item: item,
                                          totaltraveller: totalTravellers,
                                          adulttraveler: travellers.adult,
                                          childtraveler: travellers.child,
                                          infanttraveler: travellers.infant,
                                          bookingtokenid: bookingtokenid,
                                          ticket_id: item?.ticket_id,
                                          selected: selected,
                                          getCondition: getCondition,
                                        }}
                                        className="bookBtn"
                                      >
                                        Book
                                      </Link>
                                    ) : (
                                      <Link
                                        onClick={() =>
                                          alert(
                                            "Please log in to proceed with booking."
                                          )
                                        }
                                        className="bookBtn"
                                      >
                                        Book
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="flightcounter">
                        <div className="row align-items-center justify-content-center">
                          <div className="row row-gap-4 p-0 align-items-center justify-content-center col-revv">
                            <div
                              className="col-md-6 col-lg-3 d-flex align-items-center justify-content-lg-center gap-2 weightdiv"
                              onClick={toggleView}
                            >

                              <div>
                                <BsFillLuggageFill size={20} color="" />
                              </div>
                              <div className="d-flex flex-column">
                                <div className="kilogram available_seat_sec_resp_font_size">
                                  {item?.check_in_baggage_adult} KG
                                </div>
                                <div className="text-secondary available_seat_sec_resp_font_size">see more</div>
                              </div>
                            </div>
                            <div
                              className="col-md-6 col-lg-3 d-flex align-items-center justify-content-lg-center gap-2 weightdiv"
                              onClick={toggleView2}
                            >

                              <div>
                                <GiStopSign size={20} color="" />

                              </div>
                              <div className="kilogram available_seat_sec_resp_font_size">
                                Stop Details
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2 justify-content-lg-center resp_view">
                              <div className="fw-bold fs-5 available_seat_sec_resp_font_size">
                                Refund:
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2 justify-content-lg-start">
                              <div>
                                <MdOutlineAirlineSeatReclineExtra size={20} />
                              </div>
                              <div className="fw-bold fs-5 lh-1 available_seat_sec_resp_font_size">
                                Available Seats
                              </div>
                              <div className="fw-bold fs-5 available_seat_sec_resp_font_size">
                                {item?.available_seats}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`transition-view ${isViewOpen ? "show" : "hide"
                              }`}
                          >
                            <div className="row align-items-center baggage_details">
                              <div className="col-12" style={{ width: "100%" }}>
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
                                          <div className="text-secondary">
                                            Age 12+ yrs
                                          </div>
                                        </th>
                                        <th>
                                          <div className="fw-bold">
                                            Children
                                          </div>
                                          <div className="text-secondary">
                                            Age 2-12 yrs
                                          </div>
                                        </th>
                                        <th>
                                          <div className="fw-bold">Infant</div>
                                          <div className="text-secondary">
                                            Age 2 yrs
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th className="fw-bold">Check-In</th>
                                        <td>{`${item?.check_in_baggage_adult} KG`}</td>
                                        <td>{`${item?.check_in_baggage_children} KG`}</td>
                                        <td>{`${item?.check_in_baggage_infant} KG`}</td>
                                      </tr>
                                      <tr>
                                        <th className="fw-bold">Cabin</th>
                                        <td>{`${item?.cabin_baggage_adult} KG`}</td>
                                        <td>{`${item?.cabin_baggage_children} KG`}</td>
                                        <td>{`${item?.cabin_baggage_infant} KG`}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                            </div>
                          </div>
                          <div
                            className={`transition-view ${isViewOpen2 ? "show" : "hide"
                              }`}
                          >
                            <div className="col-12 mt-3">
                              <div className="col-12">
                                <p className="fw-bold">Stop Details</p>
                              </div>
                              <div className="table-responsive">
                                <table className="table table-bordered text-center">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>
                                        <div className="fw-bold">City</div>
                                      </th>
                                      <th>
                                        <div className="fw-bold">Arrival</div>
                                      </th>
                                      <th>
                                        <div className="fw-bold">
                                          Layover Duration
                                        </div>
                                      </th>
                                      <th>
                                        <div className="fw-bold">Departure</div>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th className="fw-bold">Going</th>
                                      
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                          </>
                        );
                      })}
                  </>
                )}
              </>
            )}
            {login && (
              <div
                onClick={() => toggleView3()}
                className="fw-bold mx-lg-5 px-lg-4 fs-4"
                style={{
                  marginTop: "1.5rem",
                  whiteSpace: "normal",
                  width: "auto",
                  // backgroundColor: "red",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  cursor: "pointer",
                }}
              >
                {/* <div>
                  <WiTime9
                    size={30}
                    color={isViewOpen3 ? "#dbb46b" : "black"}
                  />
                </div>
                <div style={{ color: isViewOpen3 ? "#dbb46b" : "black" }}>
                  Recent Search
                </div> */}
              </div>
            )}
            {isViewOpen3 && (
              <>
                {/* <div className="recenttabMain">
                  <div
                    className="row justify-content-between"
                    style={{
                      borderBottom: "1px dashed #fff",
                      paddingBottom: "12px",
                      flexWrap: "nowrap",
                      minWidth: "600px",
                    }}
                  >
                    <div className={`col text-center fw-bold text-white fs-5`}>
                      From
                    </div>
                    <div className={`col text-center fw-bold text-white fs-5`}>
                      To
                    </div>
                    <div className={`col text-center fw-bold text-white fs-5`}>
                      Departure
                    </div>
                    {selected == 1 && (
                      <div className="col text-center fw-bold text-white fs-5">
                        Return
                      </div>
                    )}
                    <div className={`col text-center fw-bold text-white fs-5`}>
                      Travelers
                    </div>
                  </div>

                  <div className="recent-scroll-container">
                    {RecentSelection.length > 0 &&
                    RecentSelection.filter((item) =>
                      selected == 1
                        ? item?.is_return == 1
                        : item?.is_return == 0
                    ).length > 0 ? (
                      RecentSelection.filter((item) =>
                        selected == 1
                          ? item?.is_return == 1
                          : item?.is_return == 0
                      )
                        .slice(0, 5)
                        .map((item, index) => (
                          <div
                            key={index}
                            className={`row my-3 recentsearchselect justify-content-between ${
                              selectedIndex === item ? "selected" : ""
                            }`}
                            onClick={() => handleRecentClick(item)}
                            style={{
                              cursor: "pointer",
                              backgroundColor:
                                selectedIndex === item
                                  ? "#0d6efd"
                                  : "transparent",
                              color: "#fff",
                              flexWrap: "nowrap",
                              minWidth: "600px",
                            }}
                          >
                            <div className="col text-center">
                              {item.departure_city}
                            </div>
                            <div className="col text-center">
                              {item.arrival_city}
                            </div>
                            <div className="col text-center">
                              {item.departure_date}
                            </div>
                            {selected == 1 && (
                              <div className="col text-center">
                                {item?.return_departure_date
                                  ? item.return_departure_date
                                  : "N/A"}
                              </div>
                            )}
                            <div className="col text-center">
                              {item.total_travelers}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="mt-4 text-center text-white fw-semibold">
                        {selected == 1
                          ? "Uh Oh! No Recent Searches Found for Return Trips."
                          : "Uh Oh! No Recent Searches Found for One-Way Trips."}
                      </div>
                    )}
                  </div>
                </div> */}
                {login == "true" ? (
                  <>
                    <div className="recent-searches-wrapper">
                      <h2 className="recent_search_head">Recent Searches</h2>
                      {RecentSelection.length > 0 &&
                      RecentSelection.filter((item) =>
                        selected == 1
                          ? item?.is_return == 1
                          : item?.is_return == 0
                      ).length > 0 ? (
                        <Swiper
                          modules={[Navigation]}
                          navigation
                          spaceBetween={20}
                          slidesPerView={3}
                          breakpoints={{
                            320: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                          }}
                          className="recent-search-swiper"
                        >
                          {RecentSelection.filter((item) =>
                            selected == 1
                              ? item?.is_return == 1
                              : item?.is_return == 0
                          )
                            .slice(0, 5)
                            .map((item, index) => (
                              <SwiperSlide key={index}>
                                <div
                                  className="search-card"
                                  onClick={() => handleRecentClick(item)}
                                >
                                  <div className="icon-title">
                                    <div className="circlegol2">
                                      <img
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                        className="complane"
                                        src={images.airplane}
                                        alt="plane"
                                      />
                                    </div>
                                    <span>
                                      {item.departure_city} <b>›</b>{" "}
                                      {item.arrival_city}
                                    </span>
                                  </div>

                                  <div className="recent_search_icon_flex">
                                    {/* <img className="recent_search_icons" src={images.calender} alt="" /> */}
                                    <div className="date">
                                      {item.departure_date}{" "}
                                      {item?.return_departure_date ? "›" : ""}{" "}
                                      {item.return_departure_date}
                                    </div>
                                  </div>

                                  <div className="recent_search_icon_flex">
                                    {/* <img className="recent_search_icons" src={images.traveler} alt="" /> */}
                                    <div className="desc">
                                      {item.total_travelers} Traveler
                                    </div>
                                  </div>

                                  <div className="recent_search_icon_flex">
                                    {/* <img className="recent_search_icons" src={images.wmremovetransformed} alt="" /> */}
                                    <div className="desc">
                                      {item.is_return == 0
                                        ? "One Way"
                                        : "Round Trip"}
                                    </div>
                                  </div>

                                  <div className="recent_search_icon_flex recent_search_icon_flex_last">
                                    <img
                                      className="recent_search_icons"
                                      src={images.rupees}
                                      alt=""
                                    />
                                    <div className="price"></div>
                                    <b style={{ fontSize: "24px" }}>
                                      {item.price}
                                    </b>
                                    {item.oldPrice && (
                                      <span className="old-price">
                                        Was {item.oldPrice}
                                      </span>
                                    )}
                                  </div>

                                  <button className="search-btn">
                                    <FaSearch className="recent_search_icon" />
                                  </button>
                                </div>
                              </SwiperSlide>
                            ))}
                        </Swiper>
                      ) : (
                        <div className="mt-4 text-center text-white fw-semibold">
                          {selected == 1
                            ? "Uh Oh! No Recent Searches Found for Return Trips."
                            : "Uh Oh! No Recent Searches Found for One-Way Trips."}
                        </div>
                      )}

                      {/* Static "Start new search" card */}
                      {/* <div className="search-card new-search-card">
        <div className="plus-icon">+</div>
        <p>Start a new search</p>
        <div className="search-options">
          <div className="icon-box">✈️</div>
          <div className="icon-box">🏨</div>
          <div className="icon-box">🚗</div>
          <div className="icon-box">🏖️</div>
        </div>
      </div> */}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeroTicketBooking;
