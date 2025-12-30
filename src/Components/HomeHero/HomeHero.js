import React, { useState, useRef, useEffect, useMemo } from "react";
import "./Homehero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import Modal from "react-modal";
import { IoInformationCircleOutline } from "react-icons/io5";
import {
  FaPlaneDeparture,
  FaBed,
  FaCar,
  FaIndianRupeeSign,
  FaTv,
  FaBottleWater,
} from "react-icons/fa6";
import {
  BsBusFront,
  BsFillHandbagFill,
  BsFillLuggageFill,
  BsInfoCircle,
} from "react-icons/bs";
import { IoAirplaneSharp } from "react-icons/io5";
import { BiBlanket, BiSolidPlaneAlt } from "react-icons/bi";
import { LuLampDesk } from "react-icons/lu";
import {
  FaChevronDown,
  FaExchangeAlt,
  FaSearch,
  FaRupeeSign,
  FaWifi,
  FaHotel,
} from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  ACCEPT_HEADER,
  ACCEPT_HEADER1,
  availabilitycurl,
  createItinerary,
  flightsearch,
  get_recent_search,
  getamenities,
  getcancellationpolicy,
  getcitypair,
  getcompanylist,
  getDestination,
  getFare,
  getRoutes,
  getSources,
  locationAutosuggestApi,
  recent_search,
  seararrangementdetails,
  searchcurl,
  SearchHotelMainApi,
  sectorscurl,
  supplieravailabilitycurl,
  suppliersearchcurl,
  verifyCall,
} from "../../Utils/Constant";
import axios from "axios";
import Notification from "../../Utils/Notification";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosBatteryCharging } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import { useAuthContext } from "../../Context/auth_context";
import { toast } from "react-toastify";
import { MdFilterList } from "react-icons/md";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
} from "framer-motion";
import { useBusContext } from "../../Context/bus_context";
import Divider, { dividerClasses } from "@mui/material/Divider";
import { useFlightContext } from "../../Context/flight_context";
import { useHotelContext } from "../../Context/Hotel_context";
import {
  Tabs,
  Tab,
  Box,
  Skeleton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import airportData from "../../airports_airlines_data.json";
import HomeHeroHotel from "../HomeHeroHotel/HomeHeroHotel";

const tabs = [
  { name: "Flights", icon: <FaPlaneDeparture size={25} />, key: "flights" },
  {
    name: "Buses",
    icon: <BsBusFront size={25} />,
    key: "buses",
  },
  { name: "Stays", icon: <FaBed size={25} />, key: "stays" },
  { name: "Car Rental", icon: <FaCar size={25} />, key: "car" },
];
const options = [
  { id: 1, name: "One-way" },
  { id: 2, name: "Round-Trip" },
  { id: 3, name: "Multi-city" },
];
const classes = [
  // { id: 1, name: "All" },
  { id: 2, name: "Economy" },
  { id: 4, name: "Business" },
  { id: 6, name: "First" },
  { id: 5, name: "Premium Business" },
  { id: 3, name: "Premium Economy" },
];

const HomeHero = () => {
  const { RangePicker } = DatePicker;

  const animatedComponents = makeAnimated();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedtab, setSelectedtab] = useState(() => {
    return localStorage.getItem("selectedTab") || "flights";
  });
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [selected, setSelected] = useState(0);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [searchedHotelIDs, setSearchHotelIds] = useState([]);
  const storedHotelIdsRef = useRef(new Set());
  const [isSwapping, setIsSwapping] = useState(false);
  const [isDropdownOpenTraveler, setIsDropdownOpenTravellers] = useState(false);
  const [isDropdownOpenCabin, setIsDropdownOpenCabin] = useState(false);
  const [travellers, setTravellers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [visibleCount, setVisibleCount] = useState(10);
  const [resmodifyToggle, setResmodifyToggle] = useState(false);

  const handleResModifyToggle = () => {
    setResmodifyToggle(!resmodifyToggle);
  };

  const { cancellation_policy } = useAuthContext();

  const AirportOptions = airportData.airport.map((a) => ({
    value: a.code,
    label: `${a.Name} (${a.code}) - ${a.cityName}, ${a.countryName}`,
  }));

  useEffect(() => {
    localStorage.setItem("selectedTab", selectedtab);
  }, [selectedtab]);

  const handleSelecttripoption = (opt) => {
    if (opt.name === "One-way") {
      setSelected(0);
      setSelectedValue("");
      setSelectedValue2("");
      setDate1(null);
      setDate2(null);
      setFrom("");
      setTo("");
      setResultIndex([]);
      setSelectedDate(null);
      setSelectedDate2(null);
      setDefaultMonth(null);
      setDefaultMonth2(null);
    } else if (opt.name === "Round-Trip") {
      setSelected(1);
      setSelectedValue("");
      setSelectedValue2("");
      setDate1(null);
      setDate2(null);
      setFrom("");
      setTo("");
      setResultIndex([]);
      setSelectedDate(null);
      setSelectedDate2(null);
      setDefaultMonth(null);
      setDefaultMonth2(null);
    } else {
      setSelected(2);
      setSelectedValue("");
      setSelectedValue2("");
      setDate1(null);
      setDate2(null);
      setFrom("");
      setTo("");
      setResultIndex([]);
      setSelectedDate(null);
      setSelectedDate2(null);
      setDefaultMonth(null);
      setDefaultMonth2(null);
    }

    setSelectedOption(opt);
    setIsOpen(false);
  };

  const swapLocations = () => {
    const newFrom = to?.value;
    const newTo = from?.value;
    setFrom(newFrom);
    setTo(newTo);
    dateAvailability(newFrom.city_code, newTo.city_code);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      minHeight: "initial",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
      width: "100%",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "300px",
      overflowY: "auto",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: 0,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "2px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    // ✅ Add this to remove the blue highlight
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4a90e2" : "white", // customize this as needed
      color: state.isFocused ? "white" : "black",
      cursor: "pointer",
    }),
  };

  const [selectedClass, setSelectedClass] = useState(2);
  const [selectedClassName, seSelectedClassName] = useState("Economy");
  const [getOnwardDateList, setOnwardDateList] = useState([]);
  const [getReturnDateList, setReturnDateList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue2, setSelectedValue2] = useState("");
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [getDepCityCode, setDepCityCode] = useState("");
  const [getArrCityCode, setArrCityCode] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [defaultMonth, setDefaultMonth] = useState("");
  const [defaultMonth2, setDefaultMonth2] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [login, SetLogin] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [RecentSelection, setRecentSelection] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [getindex, setIndex] = useState("");
  const [flightdata, setFlightData] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1, "day")]);

  // For filter
  const [selectedItem, setSelectedItem] = useState(null);
  const [show, setShow] = useState(false);
  const [uniqueFlightNames, setUniqueFlightNames] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueStops, setUniqueStops] = useState([]);

  // console.log("filteredFlights", filteredFlights);

  const [filters, setFilters] = useState({
    stops: [],
    cabinType: "",
    airlines: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // now dynamic
  const [sortOption, setSortOption] = useState("cheapest"); // new state for sorting

  // AIR IQ API State Start
  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

  const [getAvailableDate, setAvailableDate] = useState([]);
  const [getSectorListTo, setSectorListTo] = useState([]);
  const [getCondition, setCondition] = useState();
  const [depcitylistload, setdepcitylistload] = useState(false);
  const [arrcitylistload, setarrcitylistload] = useState(false);
  // const [sortedFlights, setsortedFlights] = useState([]);
  const [sortedCheapFlights, setsortedCheapFlights] = useState([]);
  const [fromBusId, setFromBusId] = useState();
  const [toBusId, setToBusId] = useState();
  const [returnflightTab, setReturnFlightTab] = useState(0);
  const [resultIndex, setResultIndex] = useState([]);
  const [flightProName, setFlightProName] = useState("travclan");
  const [hotelSearchtext, setHotelSearchText] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isHotelDropdownOpen, setIsHotelDropdownOpen] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [staycondition, setStayCondition] = useState(false);

  const handleReturnFlightTabChange = (newValue) => {
    setReturnFlightTab(newValue);
  };

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

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [getCompanyId, setCompanyId] = useState();

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    var companyid = localStorage.getItem("companyid");
    if (companyid) {
      setCompanyId(companyid);
    }

    // const getAmenitiesBus = async () => {
    //   const formdata = new FormData();
    //   await formdata.append("type", "POST");
    //   await formdata.append("url", getamenities);
    //   await formdata.append("verifyCall", verifyCall);
    //   await formdata.append("companyID", companyid);

    //   const data = await GetAmenitiesApi(formdata);

    //   if (data) {
    //     // console.log("Amenities data", data);
    //   }
    // };

    // return getAmenitiesBus();
  }, []);

  const navigate = useNavigate();

  const [getfilerdata, setfilterData] = useState([]);
  const [recentswap, setrecentswap] = useState(0);

  useEffect(() => {
    if (flightdata?.length > 0) {
      // ✅ Unique Classes
      const allClasses = flightdata.map((item) => {
        const classId = item.sg?.[0]?.cC;
        const className =
          classes.find((cls) => cls.id === classId)?.name || "Unknown Class";
        return className;
      });
      const uniqueClassList = [...new Set(allClasses)];
      setUniqueClasses(uniqueClassList);

      // ✅ Unique Flight Names
      const allFlightNames = flightdata.map(
        (item) => item.sg?.[0]?.al?.alN || "N/A"
      );
      const uniqueNames = [...new Set(allFlightNames)];
      setUniqueFlightNames(uniqueNames);

      // ✅ Unique Stop Types
      const allStops = flightdata.map((item) => {
        const stops = item?.sg?.length ? item.sg.length - 1 : 0;

        if (stops === 0) return "Non Stop";
        else if (stops === 1) return "1 Stop";
        else if (stops === 2) return "2 Stops";
        else return "2+ Stops";
      });

      const uniqueStopList = [...new Set(allStops)];
      setUniqueStops(uniqueStopList);
    }
  }, [flightdata]);

  const handleSelect = async (item, skipToReset = false) => {
    if (!item) {
      setFrom(null);
      return;
    }

    const selectedCity = item.city_name;
    const airportCode = item.airport_code ?? item.city_code;
    setDepCityCode(item.airport_code ?? item.city_code);
    setSelectedValue(`${selectedCity} (${airportCode})`);
    setIsDropdownOpen(false);
    setSelectedValue2("");
    setTo(null);
    setSelectedDate(null);
    setDate1("");
    setDefaultMonth("");
    setSelectedIndex(null);
    setCondition(1);
    setDefaultMonth2("");
    setSelectedDate2(null);
    setSelectedValue2("");
    setFrom(item);
  };

  const handleCounterChange = (type, change) => {
    setfilterData([]);
    // setsortedFlights([]);
    setsortedCheapFlights([]);

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

  const toggleDropdownCabin = () => {
    setIsDropdownOpenCabin((prev) => !prev);
  };

  const onDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCounter = (type, delta) => {
    if (type === "rooms") {
      setRooms((prevRooms) => {
        const newRooms = Math.max(1, prevRooms + delta);
        const maxAdults = newRooms * 3;

        setAdults((prevAdults) => Math.min(prevAdults, maxAdults));

        return newRooms;
      });
    } else if (type === "adults") {
      setAdults((prev) => {
        const maxAdults = rooms * 3;
        return Math.max(1, Math.min(prev + delta, maxAdults));
      });
    } else if (type === "children") {
      setChildren((prev) => {
        const newCount = Math.max(0, prev + delta);

        if (newCount > prev) {
          setChildrenAges((prevAges) => [
            ...prevAges,
            ...Array(newCount - prev).fill(""),
          ]);
        } else if (newCount < prev) {
          setChildrenAges((prevAges) => prevAges.slice(0, newCount));
        }

        return newCount;
      });
    }
  };

  const handleChildAge = (index, age) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    setChildrenAges(newAges);
  };

  const handleSelect2 = (item) => {
    setrecentswap(0);
    if (!item) {
      setTo(null);
      return;
    }
    if (to?.city_code === item.city_code) return;
    setTo(item);
    setDate1("");
    setSelectedDate(null);
    setDefaultMonth(null);
    setSelectedValue2(item.city_name);
    setArrCityCode(item.city_code);
    setIsDropdownOpen2(false);
    getOnwardDate(from?.city_code || getDepCityCode, item.city_code);
    if (userRole === "2") {
    } else if (userRole === "3") {
      dateAvailabilitySupplier(item.city_code);
    }
  };

  const onChange = (date, dateString) => {
    const momentDate = moment(dateString, "ddd D/M");
    const formattedDate = momentDate.format("YYYY-MM-DD");
    const formattedDatee = dayjs(date)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");

    setDate1(formattedDatee);
    setSelectedDate(date);
    localStorage.setItem("selectedDateFlight", date);

    if (selected == 1) {
      getReturnDate(formattedDate, 1, getArrCityCode);
    }
    setIsDatePickerOpen(false);
  };

  const onChange2 = (date, dateString) => {
    const formattedDate = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
    const formattedDatee = dayjs(date)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");
    setDate2(formattedDatee);
    setSelectedDate2(date);
  };

  useEffect(() => {
    const onwardDates = (getOnwardDateList || []).map(
      (item) => item?.onward_date
    );
    const formattedAvailableDates = (getAvailableDate || []).map(
      (item) => item
    );
    let allDates = [...onwardDates, ...formattedAvailableDates];
    const today = moment();
    const futureDates = allDates
      .map((date) => moment(date, "YYYY-MM-DD"))
      .filter((date) => date.isValid() && date.isSameOrAfter(today))
      // .sort((a, b) => a.diff(today));
      .sort((a, b) => a.diff(b));

    if (futureDates.length > 0) {
      const months = [
        ...new Set(futureDates.map((item) => item.format("YYYY-MM"))),
      ];
      const defaultmonth = futureDates[0];
      setDefaultMonth(defaultmonth);
      setAvailableMonths(months);
    } else {
      setDefaultMonth(null);
      setAvailableMonths([]);
    }
  }, [getOnwardDateList, getAvailableDate]);

  const disableAllExceptApiDates = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");
    const onwardDates = (getOnwardDateList || []).map(
      (item) => item?.onward_date
    );

    const formattedAvailableDates = (getAvailableDate || []).map(
      (item) => item
    );

    const allDates = [...onwardDates, ...formattedAvailableDates];

    return !allDates.includes(formattedDate);
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

  const getOnwardDate = async (dep_city_code, citycode) => {
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
      // dep_city_code: getDepCityCode,
      dep_city_code: dep_city_code,
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
      } else {
        console.log("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
    }
  };

  const getReturnDate = async (citycode, code, arrCityCode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();
    const formateddate = moment(citycode).format("YYYY-MM-DD");

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
    // console.log("selected", selected);

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

  const handleRecentClick = async (item) => {
    if (recentswap == 0) {
      setrecentswap(1);
    } else {
    }

    // Step 1: Create From Option manually
    const fromOption = {
      value: item?.departure_city_code || item?.city_code,
      label: item?.departure_city,
      airport_name: item?.departure_airport_name,
      airport_code: item?.departure_city_code,
      city_name: item?.departure_city,
    };

    setSelectedIndex(item);
    setFrom(fromOption || null);
    setSelectedValue(fromOption);

    // Step 2: Create To Option manually
    const toOption = {
      value: item?.arrival_city_code,
      label: item?.arrival_city,
      airport_name: item?.arrival_airport_name,
      airport_code: item?.arrival_city_code,
      city_name: item?.arrival_city,
    };
    setTo(toOption || null);
    setSelectedValue2(toOption);

    // Step 3: Set Dates
    setSelectedDate(item.departure_date);
    if (item.is_return == 1) {
      setSelectedDate2(item.return_departure_date);
    }

    // Step 4: Set Travellers
    setTravellers({
      adult: Number(item.adult_travelers),
      child: Number(item.child_travelers),
      infant: Number(item.infant_travelers),
    });

    // Step 5: Set condition

    setCondition(item?.get_condition);
  };

  const dateAvailability = async (destinationcode) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    const headers = new Headers(ACCEPT_HEADER1);
    headers.append("Authorization", token);

    const payload = {
      origin: from?.value,
      destination: destinationcode,
    };

    try {
      const response = await fetch(availabilitycurl, {
        method: "POST",
        headers: headers,
        Authorization: token,
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      const data = await response.json();

      if (data.status === "success") {
        const formattedDates = data?.data?.map((date) => {
          let [day, month, year] = date.split("-");
          return `${year}-${monthMap[month]}-${day}`;
        });
        setAvailableDate(formattedDates);

        const months = [
          ...new Set(
            formattedDates.map((item) => moment(item).format("YYYY-MM"))
          ),
        ];

        const defaultmonth = moment(formattedDates[0], "YYYY-MM-DD");
        setDefaultMonth(defaultmonth);
        setAvailableMonths(months);
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
    const headers = new Headers(ACCEPT_HEADER1);
    headers.append("Authorization", token);

    const payload = {
      origin: getDepCityCode,
      destination: destinationcode,
    };

    try {
      const response = await fetch(
        supplieravailabilitycurl,
        // proxy + "https://omairiq.azurewebsites.net/supplieravailability",

        // {
        //   method: "POST",
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-Type": "application/json",
        //     "api-key": API_KEY,
        //     Authorization: token,
        //   },
        //   body: JSON.stringify(payload),
        // }

        {
          method: "POST",
          headers: headers,
          Authorization: token,
          body: JSON.stringify(payload),
          redirect: "follow",
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.message !== "Data not found") {
        const formattedDates = data?.data?.map((date) => {
          let [day, month, year] = date.split("-");
          return `${year}-${monthMap[month]}-${day}`;
        });
        setAvailableDate(formattedDates); // Set formatted dates

        // const months = [
        //   ...new Set(
        //     formattedDates.map((item) => moment(item).format("YYYY-MM"))
        //   ),
        // ];

        // const defaultmonth = moment(formattedDates[0], "YYYY-MM-DD"); // Ensure correct format
        // setDefaultMonth(defaultmonth);
        // setAvailableMonths(months);
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

  const containerRef = useRef(null);
  const listRef = useRef(null);

  const { scrollY } = useScroll();
  const y1Scroll = useTransform(scrollY, [0, 300], [0, -80]);
  const y2Scroll = useTransform(scrollY, [0, 300], [0, 80]);

  const y1 = useMotionValue(50);
  const y2 = useMotionValue(-50);

  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const {
    GetSources,
    GetDestination,
    destination_data,
    source_data,
    GetRoutes,
    route_data,
    GetSeatArrangementDetail,
    GetAmenitiesApi,
    GetCityPairApi,
    route_loading,
    Fromcity,
    Tocity,
    from_city,
    to_city,
    TabSelection,
    selectedTabMainHome,
    amenities_data,
    ClearRouteData,
  } = useBusContext();

  const {
    FlightSearch,
    FlightSearchAiriq,
    flight_Data,
    hasSearched,
    return_flight_data,
    flight_Loading,
    flightAiriq_Loading,
    GetFareRules,
    fare_rules,
    fare_rules_Loading,
    CreateItinerary,
    itinerary_loading,
    ClearFlightData,
    flightAirIq_Data,
    handleFlightTo,
    handleFlightFrom,
  } = useFlightContext();

  const {
    LocationSearchHotel,
    hotel_data,
    hotel_loading,
    clearHotelData,
    SearchHotelMain,
    StaticContentAPi,
    clearStaticData,
  } = useHotelContext();

  const tokennn = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!hotelSearchtext.trim()) {
      clearHotelData();
      return;
    }
    if (hotelSearchtext.length < 3) return;
    const delay = setTimeout(() => {
      const formdata = new FormData();
      formdata.append("type", "GET");
      formdata.append(
        "url",
        `${locationAutosuggestApi}?searchString=${hotelSearchtext}`
      );
      formdata.append("url_token", `Bearer ${tokennn}`);
      LocationSearchHotel(formdata);
    }, 500);

    return () => clearTimeout(delay);
  }, [hotelSearchtext]);

  useEffect(() => {
    if (from_city) {
      setFrom(from_city);
      setFromBusId(from_city.CityID);
      getDestinationBus(from_city.CityID);
    } else {
    }
    if (to_city) {
      setTo(to_city);
      setToBusId(to_city.CityID);
    } else {
    }
  }, [to_city, from_city]);

  const handleSelectBus = async (item) => {
    if (item) {
      setFrom(item);
      Fromcity(item);
      setFromBusId(item.CityID);
      getDestinationBus(item.CityID);
    } else {
      setFrom(null);
      Fromcity("");
      setTo(null);
      setFromBusId(null);
      setToBusId(null);
      getDestinationBus(null);
    }
  };

  const handleSelectBusTo = async (item) => {
    if (item) {
      setTo(item);
      Tocity(item);
      setToBusId(item.CityID);
      // GetRoutes(item.CityID);
    } else {
      setTo(null);
      Tocity("");
      setToBusId(null);
    }
  };

  const [activeTabIndex, setActiveTabIndex] = useState(null);
  const [activeTabName, setActiveTabName] = useState("");
  const [airIQSearchData, setAirIQSearchData] = useState([]);

  const toggleTab = (index, tab) => {
    if (activeTabIndex === index && activeTabName === tab) {
      setActiveTabIndex(null);
      setActiveTabName("");
    } else {
      setActiveTabIndex(index);
      setActiveTabName(tab);
    }
  };

  const transformAirIQData = (airIQData) => {
    return airIQData.map((item) => {
      const arrivalTime = item.arival_time || item.arrival_time || "00:00";
      const arrivalDate =
        item.arival_date || item.arrival_date || item.departure_date;

      // Normalize departure and arrival times to remove seconds
      const departureDateTime = moment(
        `${item.departure_date} ${item.departure_time}`,
        "YYYY/MM/DD HH:mm"
      ).startOf("minute");
      const arrivalDateTime = moment(
        `${arrivalDate} ${arrivalTime}`,
        "YYYY/MM/DD HH:mm"
      ).startOf("minute");

      let durationMinutes = 0;
      if (departureDateTime.isValid() && arrivalDateTime.isValid()) {
        durationMinutes = arrivalDateTime.diff(departureDateTime, "minutes");
        if (durationMinutes < 0) {
          durationMinutes += 24 * 60; // Handle overnight flights
        }
        durationMinutes = Math.round(durationMinutes / 5) * 5; // Round to nearest 5 minutes
      }

      const flightNumberParts = item.flight_number
        ? item.flight_number.split(" ")
        : ["", item.flight_number || "Unknown"];
      const airlineCode = flightNumberParts[0] || "UNK";
      const flightNumber =
        flightNumberParts[1] || item.flight_number || "Unknown";
      const airlineName = (item.airline || "Unknown Airline")
        .toLowerCase()
        .replace(/\s/g, "");

      return {
        aR: null,
        iR: false,
        rI:
          item.ticket_id || `airIQ_${Math.random().toString(36).substr(2, 9)}`,
        iL: true,
        pr: "P3",
        pF: item.price || 0,
        cr: "INR",
        bF: item.price || 0,
        paxFareBreakUp: [
          {
            currency: "INR",
            paxType: 1,
            tax: 0,
            baseFare: item.price || 0,
            yqTax: 0,
            yrTax: 0,
            gst: 0,
          },
        ],
        sF: 0,
        pFC: "Regular",
        sg: [
          {
            bg: item.hand_luggage || "Reconfirm with Airline",
            cBg: item.cabin_baggage || "Reconfirm with Airline",
            cC: 2,
            al: {
              alC: airlineCode,
              alN: airlineName,
              fN: flightNumber,
              fC: "R",
              oC: null,
              fCFC: "R_Regular",
            },
            nOSA: null,
            or: {
              aC: item.origin || "UNK",
              aN: item.origin ? `${item.origin} Airport` : "Unknown Airport",
              tr: "1",
              cC: item.origin || "UNK",
              cN: item.origin || "Unknown City",
              dT: departureDateTime.isValid()
                ? departureDateTime.toISOString()
                : null,
              cnN: item.isinternational ? "International" : "India",
            },
            ds: {
              aC: item.destination || "UNK",
              aN: item.destination
                ? `${item.destination} Airport`
                : "Unknown Airport",
              tr: "1",
              cC: item.destination || "UNK",
              cN: item.destination || "Unknown City",
              aT: arrivalDateTime.isValid()
                ? arrivalDateTime.toISOString()
                : null,
              cnN: item.isinternational ? "International" : "India",
            },
            aD: durationMinutes >= 0 ? durationMinutes : 0,
            dr: durationMinutes >= 0 ? durationMinutes : 0,
            sO: false,
            sP: null,
            sPAT: null,
            sPDT: null,
            sD: null,
          },
        ],
        sC: item.flight_route === "Non - Stop" ? 0 : 1,
        sA: null,
        db: "D1",
        fF: item.price || 0,
        tAS: 0,
        fFWAM: item.price || 0,
        fareIdentifier: {
          name: "Published",
          code: "airIQ_fare",
          colorCode: "#0077CE",
        },
        groupId: null,
        airIQPrice: item.price || 0,
      };
    });
  };

  const mergeAndDeduplicateFlights = (airIQData, flightData) => {
    const transformedAirIQ = transformAirIQData(airIQData || []);
    let uniqueFlights = [...(flightData || [])];
    // Preserve original fareIdentifier for flight_Data, with fallback
    uniqueFlights = uniqueFlights.map((flight) => ({
      ...flight,
      fareIdentifier: {
        name: flight.fareIdentifier?.name || "Published",
        code: flight.fareIdentifier?.code || "flight_Data_fare", // Fallback if code is missing
        colorCode: flight.fareIdentifier?.colorCode || "#3b82f6",
      },
      isAirIQOnly: false, // Initialize as false for TravClan flights
    }));

    transformedAirIQ.forEach((airIQFlight, index) => {
      const airlineName = (airIQFlight.sg[0]?.al?.alN || "")
        .toLowerCase()
        .replace(/\s/g, "");
      const departureTime = airIQFlight.sg[0]?.or?.dT
        ? moment(airIQFlight.sg[0].or.dT).startOf("minute").toISOString()
        : "";
      const duration = Math.round((airIQFlight.dr || 0) / 5) * 5;
      const key = `${airlineName}_${departureTime}_${duration}_${
        airIQFlight.sC || 0
      }`;

      const matchingFlight = uniqueFlights.find((f) => {
        const fAirline = (f.sg[0]?.al?.alN || "")
          .toLowerCase()
          .replace(/\s/g, "");
        const fTime = f.sg[0]?.or?.dT
          ? moment(f.sg[0].or.dT).startOf("minute").toISOString()
          : "";
        const fDuration = Math.round((f.dr || 0) / 5) * 5;
        return (
          fAirline === airlineName &&
          fTime === departureTime &&
          Math.abs(fDuration - duration) <= 5 &&
          f.sC === airIQFlight.sC
        );
      });

      if (matchingFlight) {
        matchingFlight.airIQPrice = airIQFlight.fF;
        matchingFlight.airIQTicketId = airIQFlight.rI;

        matchingFlight.baggage = {
          travclan: {
            cabin: matchingFlight.sg[0]?.cBg,
            checkIn: matchingFlight.sg[0]?.bg,
          },
          airiq: {
            cabin: airIQFlight.sg[0]?.cBg,
            checkIn: airIQFlight.sg[0]?.bg,
          },
        };
      } else {
        uniqueFlights.push({
          ...airIQFlight,
          fF: null, // Set TravClan price to null to indicate no TravClan price
          isAirIQOnly: true, // Add flag to indicate this is an AirIQ-only flight
          baggage: {
            travclan: { cabin: null, checkIn: null },
            airiq: {
              cabin: airIQFlight.sg[0]?.cBg,
              checkIn: airIQFlight.sg[0]?.bg,
            },
          },
        });
      }
    });

    return uniqueFlights.sort((a, b) => {
      const priceA = Math.min(
        Number(a.fF) || 0,
        Number(a.airIQPrice) || Infinity
      );
      const priceB = Math.min(
        Number(b.fF) || 0,
        Number(b.airIQPrice) || Infinity
      );
      return priceA - priceB;
    });
  };

  useEffect(() => {
    try {
      const merged = mergeAndDeduplicateFlights(flightAirIq_Data, flight_Data);
      setFlightData(merged);
    } catch (error) {
      console.error("Error in merging flights:", error);
      setFlightData([]);
    }
  }, [flightAirIq_Data, flight_Data, setFlightData]);

  const scrollToTop = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  const sortedFlights = useMemo(() => {
    const dataToUse =
      filteredFlights?.length > 0 ? filteredFlights : flightdata || [];
    const sorted = [...dataToUse];

    switch (sortOption) {
      case "cheapest":
        sorted.sort((a, b) => (a.fF || 0) - (b.fF || 0));
        break;

      case "earlyDeparture":
        sorted.sort(
          (a, b) =>
            new Date(a.sg?.[0]?.or?.dT || 0) - new Date(b.sg?.[0]?.or?.dT || 0)
        );
        break;

      case "lateDeparture":
        sorted.sort(
          (a, b) =>
            new Date(b.sg?.[0]?.or?.dT || 0) - new Date(a.sg?.[0]?.or?.dT || 0)
        );
        break;

      case "earlyArrival":
        sorted.sort(
          (a, b) =>
            new Date(a.sg?.[a.sg.length - 1]?.ds?.aT || 0) -
            new Date(b.sg?.[b.sg.length - 1]?.ds?.aT || 0)
        );
        break;

      case "lateArrival":
        sorted.sort(
          (a, b) =>
            new Date(b.sg?.[b.sg.length - 1]?.ds?.aT || 0) -
            new Date(a.sg?.[a.sg.length - 1]?.ds?.aT || 0)
        );
        break;

      default:
        break;
    }
    return sorted;
  }, [filteredFlights, flightdata, sortOption]);

  // const paginatedFlights = useMemo(() => {
  //   const dataToUse = filteredFlights?.length > 0 ? filteredFlights : flightdata || [];
  //   const start = (currentPage - 1) * itemsPerPage;
  //   const end = start + itemsPerPage;
  //   return dataToUse.slice(start, end);
  // }, [filteredFlights, flightdata, currentPage, itemsPerPage]);

  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedFlights.slice(start, end);
  }, [sortedFlights, currentPage, itemsPerPage]);

  // const totalPages = useMemo(() => {
  //   const dataToUse = filteredFlights?.length > 0 ? filteredFlights : flightdata || [];
  //   return Math.ceil(dataToUse.length / itemsPerPage);
  // }, [filteredFlights, flightdata, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedFlights.length / itemsPerPage);
  }, [sortedFlights, itemsPerPage]);

  useEffect(() => {
    controls1.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    });
    controls2.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    });

    // After initial anim, connect to scroll values
    const unsubscribeY1 = y1Scroll.onChange((latest) => y1.set(latest));
    const unsubscribeY2 = y2Scroll.onChange((latest) => y2.set(latest));

    return () => {
      unsubscribeY1();
      unsubscribeY2();
    };
  }, []);

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
    // BUSGetCompanyList();
    getSourceBus();
    GetRecentSearch();
    getCityPairBus();
    // ClearFlightData();
  }, []);

  const searchFlightData = async () => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    const headers = new Headers(ACCEPT_HEADER1);
    headers.append("Authorization", token);

    const formattedDate = moment(date1).isValid()
      ? moment(date1).format("YYYY/MM/DD")
      : moment(defaultMonth, "DD-MMM-YYYY").format("YYYY/MM/DD");

    const departureDate =
      selected == 0
        ? formattedDate
        : moment(formattedDate, "YYYY-MM-DD").format("YYYY/MM/DD");

    const payload = {
      origin: from.value,
      destination: to.value,
      departure_date: departureDate,
      adult: travellers?.adult,
      children: travellers?.child,
      infant: travellers?.infant,
    };

    await FlightSearchAiriq(payload);
  };

  // const searchFlightData = async () => {
  //   const token = JSON.parse(localStorage.getItem("is_token_airiq"));
  //   const headers = new Headers(ACCEPT_HEADER1);
  //   headers.append("Authorization", token);

  //   const formattedDate =
  //     moment(date1).format("YYYY-MM-DD") ||
  //     moment(defaultMonth, "DD-MMM-YYYY").format("YYYY/MM/DD");

  //   const formattedDate1 = moment(defaultMonth, "DD-MM-YYYY").format(
  //     "YYYY-MM-DD"
  //   );
  //   const formateddate = moment(date2, "DD-MM-YYYY").format("YYYY-MM-DD");

  //   const departureDate =
  //     selected == 0
  //       ? formattedDate
  //       : moment(formattedDate, "YYYY-MM-DD").format("YYYY/MM/DD");

  //   const payload = {
  //     origin: from.value,
  //     destination: to.value,
  //     departure_date: departureDate,
  //     adult: travellers?.adult,
  //     children: travellers?.child,
  //     infant: travellers?.infant,
  //   };

  //   try {
  //     const response = await fetch(searchcurl, {
  //       method: "POST",
  //       headers: headers,
  //       Authorization: token,
  //       body: JSON.stringify(payload),
  //       redirect: "follow",
  //     });

  //     const data = await response.json();

  //     if (data.status === "success" && data.message === "Data not found") {
  //     } else if (data.status === "success") {
  //       setAirIQSearchData(data.data);
  //     } else {
  //       Notification("error", "Error!", data.message || "Something went wrong");
  //     }
  //   } catch (error) {
  //     console.error("Error while fetching departure city list:", error);
  //     // Notification("error", "Error!", "Failed to fetch data");
  //   }
  // };

  const parseBoardingPoints = (boardingPointsStr) => {
    if (!boardingPointsStr) return [];
    return boardingPointsStr.split("#").flatMap((group) => {
      const [id, name, time, address] = group.split("|");
      return { id, name, time, address };
    });
  };

  const parseDroppingPoints = (droppingPointsStr) => {
    if (!droppingPointsStr) return [];
    return droppingPointsStr.split("#").flatMap((group) => {
      const [id, name, time] = group.split("|");
      return { id, name, time };
    });
  };

  const getSourceBus = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", getSources);
    await formdata.append("verifyCall", verifyCall);

    const data = await GetSources(formdata);
    if (data) {
    }
  };

  const getDestinationBus = async (sourceId) => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", getDestination);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("sourceID", sourceId);

    const data = await GetDestination(formdata);
    if (data) {
    }
  };

  const NewFlightget = async () => {
    const token = localStorage.getItem("accessToken");
    if (!selectedOption.id) {
      Notification("warning", "Warning!", "Please Select Journey Type");
    } else if (!from) {
      Notification("warning", "Warning!", "Origin Airport Cannot Be Empty");
    } else if (!to) {
      Notification(
        "warning",
        "Warning!",
        "Destination Airport Cannot Be Empty"
      );
    } else if (!date1 && !defaultMonth) {
      Notification("warning", "Warning!", "Journey Date Cannot Be Empty");
    } else if (!selectedClass) {
      Notification("warning", "Warning!", "Please Select Cabinclass");
    } else {
      const formdata = new FormData();
      formdata.append("type", "POST");
      formdata.append("url", flightsearch);
      formdata.append("url_token", `Bearer ${token}`);
      formdata.append("adultCount", travellers.adult);
      formdata.append("childCount", travellers.child);
      formdata.append("infantCount", travellers.infant);
      formdata.append("directFlight", isChecked);
      formdata.append("journeyType", selectedOption.id);
      formdata.append("origin", from?.value);
      formdata.append("destination", to?.value);
      // formdata.append("origin", (from || "").toUpperCase());
      // formdata.append("destination", (to || "").toUpperCase());
      formdata.append(
        "preferredDepartureTime",
        date1
          ? moment(date1).format("YYYY-MM-DD[T]00:00:00")
          : moment(defaultMonth, "DD-MMM-YYYY").format("YYYY-MM-DD[T]00:00:00")
      );

      if (selected == 1) {
        formdata.append("preferredReturnDepartureTime", date2);
      }
      formdata.append("flightCabinClass", selectedClass);

      await FlightSearch(formdata);
    }
  };

  const ItineraryCreateNew = async (ids, item) => {
    const token = localStorage.getItem("accessToken");
    const traceid = localStorage.getItem("traceID");

    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", createItinerary);
    formdata.append("url_token", `Bearer ${token}`);
    formdata.append("traceId", traceid);

    ids.forEach((id, index) => {
      formdata.append(`items[${index}][type]`, "FLIGHT");
      formdata.append(`items[${index}][resultIndex]`, id);
    });

    const okres = await CreateItinerary(formdata);
    const check = selectedOption.id == 2 ? true : false;

    // if (okres) {
    if (!okres?.error?.errorCode) {
      const check = selectedOption.id == 2 ? true : false;
    }

    // if (okres) {
    navigate("/TicketBookingDetails", {
      state: {
        item: check ? flightdata : item,
        returnitem: check ? item : "",
        totaltraveller: totalTravellers,
        adulttraveler: travellers.adult,
        childtraveler: travellers.child,
        infanttraveler: travellers.infant,
        selected: selected,
        timeing: okres?.traceIdDetails,
        code: okres?.itineraryCode,
      },
    });
  };

  const FareRuleGet = async (ref) => {
    const traceid = localStorage.getItem("traceID");
    const token = localStorage.getItem("accessToken");
    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", getFare);
    formdata.append("url_token", `Bearer ${token}`);
    formdata.append("traceId", traceid);
    formdata.append("resultIndex", ref);
    await GetFareRules(formdata);
  };

  const getRouteBus = async () => {
    if (!fromBusId) {
      toast.warning("Please Select From City");
      return;
    } else if (!toBusId) {
      toast.warning("Please Select To City");
      return;
    } else if (!date1) {
      toast.warning("Please Select Journey Date");
      return;
    } else {
      const formdata = new FormData();
      await formdata.append("type", "POST");
      await formdata.append("url", getRoutes);
      await formdata.append("verifyCall", verifyCall);
      await formdata.append("fromID", fromBusId);
      await formdata.append("toID", toBusId);
      await formdata.append("JourneyDate", moment(date1).format("DD-MM-YYYY"));

      const data = await GetRoutes(formdata);
      if (data) {
      }
    }
  };

  const getSeatArrangementBus = async (referenceno) => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", seararrangementdetails);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("referenceNumber", referenceno);

    const data = await GetSeatArrangementDetail(formdata);
  };

  const getCityPairBus = async () => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", getcitypair);
    await formdata.append("verifyCall", verifyCall);

    const data = await GetCityPairApi(formdata);

    if (data) {
      // console.log("get city pair data", data);
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const start = moment(startTime, "hh:mm A");
    const end = moment(endTime, "hh:mm A");

    if (end.isBefore(start)) {
      end.add(1, "day"); // Overnight
    }

    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    return `${hours}h ${minutes}m`;
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };
  const visibleData = route_data?.slice(0, visibleCount);

  const openModal = (item) => {
    setIsModalOpen(true);
    setSelectedItem(item);
    FareRuleGet(item?.rI);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const [recentOrigins, setRecentOrigins] = useState([]);
  const [recentDestinations, setRecentDestinations] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("recentAirportsOrigin")) || [];
    setRecentOrigins(saved);
  }, []);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("recentAirportsDestination")) || [];
    setRecentDestinations(saved);

    const saveFromFlight = localStorage.getItem("FlightselectedOrigin");
    if (saveFromFlight) {
      setFrom(JSON.parse(saveFromFlight));
    }
    const saveToFlight = localStorage.getItem("FlightselectedDes");
    if (saveToFlight) {
      setTo(JSON.parse(saveToFlight));
    }

    const saveDateFlight = localStorage.getItem("selectedDateFlight");
    if (saveDateFlight) {
      setSelectedDate(saveDateFlight);
      setDate1(saveDateFlight);
    }
  }, []);

  const handleSelectOrigin = (selected) => {
    if (!selected) {
      setFrom(null);
      localStorage.removeItem("FlightselectedOrigin");
      return;
    }
    setFrom(selected);
    localStorage.setItem("FlightselectedOrigin", JSON.stringify(selected));
    handleFlightFrom(selected);

    const updated = [
      selected,
      ...recentOrigins.filter((s) => s.value !== selected.value),
    ];
    const top5 = updated.slice(0, 5);
    setRecentOrigins(top5);
    localStorage.setItem("recentAirportsOrigin", JSON.stringify(top5));
  };

  const handleSelectDestination = (selected) => {
    if (!selected) {
      setTo(null);
      localStorage.removeItem("FlightselectedDes");
      return;
    }
    handleFlightTo(selected);
    setTo(selected);
    localStorage.setItem("FlightselectedDes", JSON.stringify(selected));

    dateAvailability(selected.value);

    const updated = [
      selected,
      ...recentDestinations.filter((s) => s.value !== selected.value),
    ];
    const top5 = updated.slice(0, 5);
    setRecentDestinations(top5);
    localStorage.setItem("recentAirportsDestination", JSON.stringify(top5));
  };

  const groupedOptionsOrigin = [
    recentOrigins.length > 0 && {
      label: "Recent Searches",
      options: recentOrigins,
    },
    {
      label: "All Airports",
      options: AirportOptions,
    },
  ].filter(Boolean);

  const groupedOptionsDestination = [
    recentDestinations.length > 0 && {
      label: "Recent Searches",
      options: recentDestinations,
    },
    {
      label: "All Airports",
      options: AirportOptions,
    },
  ].filter(Boolean);

  useEffect(() => {
    if (flightdata?.length > 0) {
      const classes = [
        { id: 2, name: "Economy" },
        { id: 4, name: "Business" },
      ];

      // Cabin types
      const allClasses = flightdata.map((item) => {
        const classId = item.sg?.[0]?.cC;
        const className =
          classes.find((cls) => cls.id === classId)?.name || "Unknown Class";
        return className;
      });
      setUniqueClasses([...new Set(allClasses)]);

      // Airlines
      const allFlightNames = flightdata.map(
        (item) => item.sg?.[0]?.al?.alN || "N/A"
      );
      setUniqueFlightNames([...new Set(allFlightNames)]);

      // Stops
      const allStops = flightdata.map((item) => {
        const stops = item?.sg?.length ? item.sg.length - 1 : 0;
        if (stops === 0) return "Non Stop";
        else if (stops === 1) return "1 Stop";
        else if (stops === 2) return "2 Stops";
        else return "2+ Stops";
      });
      setUniqueStops([...new Set(allStops)]);
    }
  }, [flightdata]);

  const applyFilters = () => {
    let filtered = flightdata;
    // Stops
    if (filters.stops.length > 0) {
      filtered = filtered.filter((item) => {
        const stops = item?.sg?.length ? item.sg.length - 1 : 0;
        const stopLabel =
          stops === 0
            ? "Non Stop"
            : stops === 1
            ? "1 Stop"
            : stops === 2
            ? "2 Stops"
            : "2+ Stops";
        return filters.stops.includes(stopLabel);
      });
    }

    // Cabin Type
    if (filters.cabinType) {
      const classes = [
        { id: 2, name: "Economy" },
        { id: 4, name: "Business" },
      ];
      filtered = filtered.filter((item) => {
        const classId = item.sg?.[0]?.cC;
        const className =
          classes.find((cls) => cls.id === classId)?.name || "Unknown Class";
        return className === filters.cabinType;
      });
    }

    // Airlines
    if (filters.airlines.length > 0) {
      filtered = filtered.filter((item) => {
        const airline = item.sg?.[0]?.al?.alN || "N/A";
        return filters.airlines.includes(airline);
      });
    }

    setFilteredFlights(filtered);
    console.log("filteredFlights", filteredFlights);

    setFiltered(true);
    setShow(false);
  };

  const clearFilters = () => {
    setFilters({ stops: [], cabinType: "", airlines: [] });
    setFilteredFlights(flightdata);
    setFiltered(false);
    setCurrentPage(1);
    setShow(false);
  };

  const handleStopChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      stops: prev.stops.includes(value)
        ? prev.stops.filter((s) => s !== value)
        : [...prev.stops, value],
    }));
  };

  const handleAirlineChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      airlines: prev.airlines.includes(value)
        ? prev.airlines.filter((a) => a !== value)
        : [...prev.airlines, value],
    }));
  };

  const handleCabinChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      cabinType: prev.cabinType === value ? "" : value,
    }));
  };

  const buildOccupancies = () => {
    const MAX_ADULTS_PER_ROOM = 3;

    let remainingAdults = adults;
    let remainingChildrenAges = [...childrenAges];

    return Array.from({ length: rooms }).map((_, index) => {
      // Adults per room (max 3)
      const numOfAdults = Math.min(MAX_ADULTS_PER_ROOM, remainingAdults);

      remainingAdults -= numOfAdults;

      // Split children evenly across remaining rooms
      const remainingRooms = rooms - index;
      const childrenForThisRoom = Math.ceil(
        remainingChildrenAges.length / remainingRooms
      );

      const childAges = remainingChildrenAges.splice(0, childrenForThisRoom);

      return {
        numOfAdults,
        childAges,
      };
    });
  };

  const HandleHotelSearch = async () => {
    if (!selectedHotel) {
      toast.warning("Please select a hotel from the dropdown.");
      return;
    }
    if (!dateRange || dateRange.length !== 2) {
      toast.warning("Please select both check-in and check-out dates.");
      return;
    }
    if (dateRange[0].isAfter(dateRange[1])) {
      toast.warning("Check-out date must be after check-in date.");
      return;
    }
    if (children > 0 && (!childrenAges || childrenAges.length === 0)) {
      toast.warning("Children's age is compulsory");
      return;
    }
    clearStaticData();
    storedHotelIdsRef.current.clear();
    const payload = {
      type: "POST",
      url: SearchHotelMainApi,
      url_token: `Bearer ${tokennn}`,
      checkIn: moment(dateRange[0].toDate()).format("YYYY-MM-DD"),
      checkOut: moment(dateRange[1].toDate()).format("YYYY-MM-DD"),
      nationality: "IN",
      occupancies: buildOccupancies(),
      hotelId: String(selectedHotel?.referenceId),
      page: 1,
      pageSize: 100,
      traceId: null,
    };

    try {
      const data = await SearchHotelMain(payload);
      const incomingIds = data?.map((item) => item.id) || [];
      const newIds = incomingIds.filter((id) => {
        if (!storedHotelIdsRef.current.has(id)) {
          storedHotelIdsRef.current.add(id);
          return true;
        }
        return false;
      });
      setSearchHotelIds((prev) => [...prev, ...newIds]);
      if (newIds.length > 0) {
        await Promise.all(newIds.map((hotelId) => StaticContentAPi(hotelId)));
      }
    } catch (error) {
      console.log("Search failed or static content API failed", error);
    }
  };

  const activeFilterCount =
    filters.stops.length +
    filters.airlines.length +
    (filters.cabinType ? 1 : 0);

  return (
    <section
      className={
        (flightdata?.length > 0 ? "containerr_data" : "containerr") +
        "container-fluid"
      }
    >
      <div className={flightdata.length > 0 ? "E9x1-card_none" : "E9x1-card"}>
        <div className="E9width60">
          <div className="W5IJ-mod-limit-width">
            <h2 className="AQWr-mod-margin-bottom-xlarge c0qPo">
              {/* <span>Compare flight deals from 100s of sites</span> */}
              {selectedtab === "buses" ? (
                <span>
                  <span>Welcome to Eagle Travels</span>{" "}
                  <span>A Step Ahead... Always!</span>
                </span>
              ) : (
                <span>Compare flight deals from 100s of sites</span>
              )}
              <span className="c9DqH">.</span>
            </h2>
            <div className="tabs-container">
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={`tab-wrapper ${
                    tab.key === "car" ? "disabled-tab" : ""
                  }`}
                  // className="tab-wrapper"
                  onClick={() => {
                    if (tab.key === "car") return;
                    TabSelection(tab.key);
                    setSelectedtab(tab.key);
                    setFrom("");
                    setTo("");
                    setDate1("");
                    setDate2("");
                    ClearRouteData();
                    ClearFlightData();
                  }}
                >
                  <div
                    className={`tab-icon-box ${
                      selectedtab === tab.key ? "active" : ""
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div className="tab-name">{tab.name}</div>
                </div>
              ))}
            </div>

            {selectedtab === "flights" ? (
              <div className="d-flex align-items-center justify-content-between">
                <div className="J_T2">
                  <div className="J_T2-header">
                    <div
                      className="dropdown-wrapper"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span>{selectedOption.name}</span>
                      <span className="arrow">
                        <FaChevronDown />
                      </span>
                    </div>

                    {isOpen && (
                      <div className="dropdown-options">
                        {options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`dropdown-option ${
                              opt.id === selectedOption.id ? "active" : ""
                            }`}
                            onClick={() => handleSelecttripoption(opt)}
                          >
                            {opt.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="d-flex align-items-center gap-2">
                  <span style={{ whiteSpace: "nowrap" }}>Direct Flight</span>
                  <FormControlLabel
                    className="m-0"
                    control={
                      <Switch
                        checked={isChecked}
                        onChange={handleSwitchChange}
                        color="warning"
                      />
                    }
                    label=""
                  />
                </div> */}
              </div>
            ) : (
              <></>
            )}
            {selectedtab === "stays" ? (
              <>
                <div className="search-box">
                  <div className="search-row">
                    {/* Location Input */}
                    <div className="location-input-wrapper">
                      <input
                        type="text"
                        placeholder="Enter a city, hotel, airport, address or landmark"
                        className="location-input"
                        value={
                          selectedHotel ? selectedHotel.name : hotelSearchtext
                        }
                        onChange={(e) => {
                          setHotelSearchText(e.target.value);
                          setSelectedHotel(null);
                          if (!isHotelDropdownOpen) {
                            setIsHotelDropdownOpen(true);
                          }
                        }}
                        onClick={() =>
                          setIsHotelDropdownOpen(!isHotelDropdownOpen)
                        }
                      />

                      {isHotelDropdownOpen &&
                        hotel_data &&
                        hotel_data.length > 0 && (
                          <div className="hotel-results-dropdown">
                            {hotel_loading ? (
                              <div className="hotel-loader">
                                <div className="spinner"></div>
                                <span>Searching hotels...</span>
                              </div>
                            ) : (
                              <div className="hotel-results-list">
                                {hotel_data.map((hotel) => {
                                  const isSelected =
                                    selectedHotel?.referenceId ===
                                    hotel.referenceId;
                                  return (
                                    <div
                                      key={hotel.referenceId}
                                      className={`hotel-result-item ${
                                        isSelected ? "selected" : ""
                                      }`}
                                      onClick={() => {
                                        setSelectedHotel(hotel);
                                        setIsHotelDropdownOpen(false);
                                      }}
                                    >
                                      <div>
                                        <FaHotel size={25} color="#ff6a00" />
                                      </div>
                                      <div className="hotel-info">
                                        <div className="hotel-nameee">
                                          {hotel.name || "abc"}
                                        </div>
                                        <div className="hotel-location">
                                          {hotel.city},{" "}
                                          {hotel.state || hotel.country}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Date Range Picker */}
                    <div className="date-picker-wrapper">
                      <RangePicker
                        onChange={onDateRangeChange}
                        style={{
                          width: "240px",
                          height: "100%",
                          border: "none",
                          boxShadow: "none",
                        }}
                        format="ddd D/M"
                        placeholder={["Check In", "Check Out"]}
                        disabledDate={(current) => {
                          const today = dayjs().startOf("day");
                          const sixMonthsLater = today
                            .add(6, "month")
                            .endOf("day");
                          return (
                            current &&
                            (current < today || current > sixMonthsLater)
                          );
                        }}
                        value={dateRange}
                        suffixIcon={null}
                        separator="–"
                        bordered={false}
                      />
                    </div>

                    {/* Room & Guests Selector */}
                    <div className="guests-selector-wrapper">
                      <div className="guests-display" onClick={toggleDropdown}>
                        <span className="guests-text">
                          {rooms} room,
                          {adults + children} guest
                          {adults + children !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {isDropdownOpen && (
                        <div className="guests-dropdown">
                          {/* Rooms Counter */}
                          <div className="counter-row">
                            <span className="counter-label">Rooms</span>
                            <div className="counter-controls">
                              <button
                                className="counter-button"
                                onClick={() => handleCounter("rooms", -1)}
                                disabled={rooms <= 1}
                              >
                                −
                              </button>
                              <span className="counter-value">{rooms}</span>
                              <button
                                className="counter-button"
                                onClick={() => handleCounter("rooms", 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Adults Counter */}
                          <div className="counter-row">
                            <span className="counter-label">Adults</span>
                            <div className="counter-controls">
                              <button
                                className="counter-button"
                                onClick={() => handleCounter("adults", -1)}
                                disabled={adults <= 1}
                              >
                                −
                              </button>
                              <span className="counter-value">{adults}</span>
                              <button
                                className="counter-button"
                                onClick={() => handleCounter("adults", 1)}
                                disabled={adults >= rooms * 3}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children Counter */}
                          <div className="counter-row">
                            <span className="counter-label">Children</span>
                            <div className="counter-controls">
                              <button
                                className="counter-button"
                                onClick={() => handleCounter("children", -1)}
                                disabled={children <= 0}
                              >
                                −
                              </button>
                              <span className="counter-value">{children}</span>
                              <button
                                className="counter-button"
                                onClick={() => handleCounter("children", 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children Ages */}
                          {children > 0 && (
                            <div className="children-ages-section">
                              <div className="ages-header">Children's Ages</div>
                              {Array.from({ length: children }).map(
                                (_, index) => (
                                  <div key={index} className="age-input-row">
                                    <span className="age-label">
                                      Child {index + 1}
                                    </span>
                                    <select
                                      className="age-select"
                                      value={childrenAges[index] || ""}
                                      onChange={(e) =>
                                        handleChildAge(index, e.target.value)
                                      }
                                    >
                                      <option value="">Age</option>
                                      {Array.from(
                                        { length: 18 },
                                        (_, i) => i
                                      ).map((age) => (
                                        <option key={age} value={age}>
                                          {age} {age === 1 ? "year" : "years"}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Search Button */}
                    <button
                      className="search-button-stay"
                      onClick={() => {
                        setStayCondition(true);
                        HandleHotelSearch();
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flight-search-bar">
                <div className="from-section">
                  {selectedtab === "buses" ? (
                    <Select
                      value={from}
                      onChange={
                        selectedtab === "buses" ? handleSelectBus : handleSelect
                      }
                      options={selectedtab === "buses" ? source_data : <></>}
                      isLoading={depcitylistload}
                      styles={customStyles}
                      isClearable={true}
                      placeholder="From?"
                      isSearchable={true}
                      getOptionLabel={(data) => {
                        return selectedtab === "buses"
                          ? data.CityName
                          : `${data.city_name || data.CityName} (${
                              data.airport_code
                            })`;
                      }}
                      formatOptionLabel={(data, { context }) => {
                        if (context === "menu") {
                          return selectedtab === "buses" ? (
                            <div>{data.CityName}</div>
                          ) : (
                            <div>
                              <div>{data.city_name || data.CityName}</div>
                              <div style={{ fontSize: "12px" }}>
                                {data.airport_name}{" "}
                                <span style={{ color: "#f45500" }}>
                                  ({data.airport_code})
                                </span>
                              </div>
                            </div>
                          );
                        } else {
                          return selectedtab === "buses" ? (
                            <div className="fw-bold">{data.CityName}</div>
                          ) : (
                            <div>
                              {data.city_name}{" "}
                              <span style={{ color: "#f45500" }}>
                                ({data.airport_code})
                              </span>
                            </div>
                          );
                        }
                      }}
                      components={{
                        ...animatedComponents,
                        DropdownIndicator: () => null,
                      }}
                    />
                  ) : (
                    // <input
                    //   value={String(from || "").toUpperCase()}
                    //   placeholder="Airport Code Only"
                    //   onChange={(e) => setFrom(e.target.value)}
                    //   style={{ height: "100%", width: "100%", border: "none" }}
                    // />
                    <Select
                      options={groupedOptionsOrigin}
                      placeholder="Origin Airport"
                      styles={customStyles}
                      isSearchable
                      isClearable
                      filterOption={(option, inputValue) =>
                        option.label
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                      onChange={handleSelectOrigin}
                    />
                  )}
                </div>

                {selectedtab === "buses" ? (
                  <></>
                ) : (
                  <button
                    disabled={recentswap == 1 ? true : false}
                    className="swap-button"
                    // onClick={swapLocations}
                  >
                    <FaExchangeAlt
                      className={isSwapping ? "spin" : ""}
                      color="#000"
                    />
                  </button>
                )}

                <div className="to-section">
                  {selectedtab === "buses" ? (
                    <Select
                      value={to}
                      onChange={
                        selectedtab === "buses"
                          ? handleSelectBusTo
                          : handleSelect2
                      }
                      options={
                        selectedtab === "buses"
                          ? destination_data
                          : getSectorListTo
                      }
                      isLoading={arrcitylistload}
                      styles={customStyles}
                      placeholder="To?"
                      isClearable={true}
                      isSearchable={true}
                      getOptionLabel={(data) => {
                        if (selectedtab === "buses") {
                          return data.CityName;
                        } else {
                          const city = data.city_name || data.destination;
                          const code =
                            data.airport_code || data.DestinationCode;
                          return `${city} (${code})`;
                        }
                      }}
                      formatOptionLabel={(data, { context }) => {
                        if (context === "menu") {
                          return (
                            <div>
                              {selectedtab === "buses" ? (
                                <div>{data.CityName}</div>
                              ) : (
                                <>
                                  <div>
                                    {data.city_name
                                      ? data.city_name
                                      : data.destination}
                                  </div>
                                  <div style={{ fontSize: "12px" }}>
                                    {data.airport_name}{" "}
                                    <span style={{ color: "#f45500" }}>
                                      (
                                      {data.airport_code
                                        ? data.airport_code
                                        : data.DestinationCode}
                                      )
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        } else {
                          return selectedtab === "buses" ? (
                            <div className="fw-bold">{data.CityName}</div>
                          ) : (
                            <div>
                              {data.city_name
                                ? data.city_name
                                : data.destination}{" "}
                              <span style={{ color: "#f45500" }}>
                                (
                                {data.airport_code
                                  ? data.airport_code
                                  : data.DestinationCode}
                                )
                              </span>
                            </div>
                          );
                        }
                      }}
                      components={{
                        ...animatedComponents,
                        DropdownIndicator: () => null,
                      }}
                    />
                  ) : (
                    // <input
                    //   value={String(to || "").toUpperCase()}
                    //   placeholder="Airport Code Only"
                    //   onChange={(e) => setTo(e.target.value)}
                    //   style={{ height: "100%", width: "100%", border: "none" }}
                    // />

                    <Select
                      options={groupedOptionsDestination}
                      placeholder="Destination Airport"
                      isSearchable
                      isClearable
                      styles={customStyles}
                      filterOption={(option, inputValue) =>
                        option.label
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                      onChange={handleSelectDestination}
                    />
                  )}
                </div>

                <div className="custom-date-picker">
                  <DatePicker
                    onChange={onChange}
                    placeholder={selectedtab === "buses" ? "Date" : "Departure"}
                    format="ddd D/M"
                    disabledDate={(current) => {
                      const today = dayjs().startOf("day");
                      const sixMonthsLater = today.add(6, "month").endOf("day");
                      return (
                        current && (current < today || current > sixMonthsLater)
                      );
                    }}
                    // disabledDate={disableAllExceptApiDates}
                    // value={
                    //   selectedDate || defaultMonth
                    //     ? dayjs(selectedDate || defaultMonth)
                    //     : null
                    // }
                    suffixIcon={null}
                  />
                </div>

                {getCondition === 0 ||
                  (selected === 1 && (
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
                        format="ddd D/M"
                        disabledDate={(current) => {
                          const today = dayjs().startOf("day");
                          const sixMonthsLater = today
                            .add(6, "month")
                            .endOf("day");
                          return (
                            current &&
                            (current < today || current > sixMonthsLater)
                          );
                        }}
                        // disabledDate={disableDates}
                        // value={date2 ? moment(date2, "DD-MM-YYYY") : null}
                        value={
                          selectedDate2 || defaultMonth2
                            ? dayjs(selectedDate2 || defaultMonth2)
                            : null
                        }
                        placeholder="Return"
                        suffixIcon={null}
                        defaultPickerValue={firstEnabledDate}
                      />
                    </div>
                  ))}
                {selectedtab === "buses" ? (
                  <></>
                ) : (
                  <>
                    <div
                      className="traveler-section"
                      onClick={toggleDropdownTraveler}
                    >
                      {totalTravellers} Travellers{" "}
                      {isDropdownOpenTraveler && (
                        <div className="travellers-dropdown2">
                          <div className="fw-bold mb-2 fs-5">Travellers</div>
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
                                style={{
                                  fontSize: "14px",
                                  width: "30px",
                                  border: "none",
                                }}
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
                                style={{
                                  fontSize: "14px",
                                  width: "30px",
                                  border: "none",
                                }}
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
                                onClick={() =>
                                  handleCounterChange("infant", -1)
                                }
                              >
                                -
                              </button>
                              <input
                                type="text"
                                style={{
                                  fontSize: "14px",
                                  width: "30px",
                                  border: "none",
                                }}
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

                          <div
                            className="mt-3"
                            style={{ border: "1px solid #eee" }}
                          ></div>
                          <div className="mt-lg-3 fw-bold text-dark">
                            Cabin Class
                          </div>
                          <div className="d-flex gap-3 flex-wrap mt-2">
                            {classes.map((classOption) => (
                              <div
                                key={classOption.id}
                                className={`classselekt ${
                                  selectedClass === classOption.id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedClass(classOption.id);
                                  seSelectedClassName(classOption.name);
                                }}
                              >
                                {classOption.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <button
                  className="search-button"
                  onClick={() => {
                    if (!login) {
                      Notification("warning", "Please sign in to continue.");
                      return;
                    } else {
                      // if (selectedtab === "buses") {
                      //   getRouteBus();
                      // } else {
                      //   NewFlightget();
                      //   searchFlightData();
                      // }
                      if (selectedtab === "buses") {
                        getRouteBus();
                      } else {
                        NewFlightget();
                        if (selectedOption?.id === 1) {
                          searchFlightData();
                        }
                      }
                    }
                  }}
                >
                  <FaSearch />
                </button>
                <button
                  className="search-buttonRes"
                  onClick={() => {
                    {
                      selectedtab === "buses" ? getRouteBus() : NewFlightget();
                      if (selectedOption?.id === 1) {
                        searchFlightData();
                      }
                    }
                    setSelectedIndex(null);
                  }}
                >
                  Search
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={containerRef} className="E9width40">
          <div className="d-flex gap-4 chalisninicheno">
            <motion.div
              className="d-flex flex-column gap-4 zeel-1"
              initial={{ opacity: 1 }}
              animate={controls1}
              style={{ y: y1 }}
            >
              <img
                src={selectedtab === "buses" ? images.bus1 : images.flight1}
                className="rounded-xl object-cover h-24 md:h-32"
                style={{ width: "220px", height: "220px", borderRadius: 40 }}
              />
              <img
                src={selectedtab === "buses" ? images.bus2 : images.flight2}
                className="rounded-xl object-cover h-40 md:h-48"
                style={{ width: "220px", height: "220px", borderRadius: 40 }}
              />
              <img
                src={selectedtab === "buses" ? images.bus4 : images.flight3}
                className="rounded-xl object-cover h-32 md:h-40"
                style={{ width: "220px", height: "220px", borderRadius: 40 }}
              />
            </motion.div>

            <motion.div
              className="d-flex flex-column gap-4 zeel-2"
              initial={{ opacity: 1 }}
              animate={controls2}
              style={{ y: y2 }}
            >
              <img
                src={selectedtab === "buses" ? images.bus3 : images.flight4}
                className="rounded-xl object-cover h-24 md:h-32"
                style={{ width: "220px", height: "220px", borderRadius: 40 }}
              />
              <img
                src={images.flight5}
                className="rounded-xl object-cover h-40 md:h-48"
                style={{ width: "220px", height: "220px" }}
              />
              <img
                src={images.flight6}
                className="rounded-xl object-cover h-32 md:h-40"
                style={{ width: "220px", height: "220px" }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {flight_Loading === true || flightAiriq_Loading === true ? (
        <div
          style={{
            width: "100%",
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <div className="loader">
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <>
            {selectedOption.id == 2 && return_flight_data.length !== 0 ? (
              <div className="bg-light p-2 mt-3">
                <div className="d-flex container p-0 rounded-pill overflow-hidden shadow">
                  <div
                    className={`flex-fill rounded-pill returnflighttabpill p-2 ${
                      returnflightTab === 0 ? "pillcustomClr" : ""
                    }`}
                    onClick={() => handleReturnFlightTabChange(0)}
                  >
                    {String(from?.value || "").toUpperCase()} ---{" "}
                    {String(to?.value || "").toUpperCase()}
                  </div>
                  <div
                    className={`flex-fill rounded-pill  returnflighttabpill p-2 ${
                      returnflightTab === 1 ? "pillcustomClr " : ""
                    }`}
                    onClick={() => handleReturnFlightTabChange(1)}
                  >
                    {String(to?.value || "").toUpperCase()} ---{" "}
                    {String(from?.value || "").toUpperCase()}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {/* Update Search Part */}

            {flightdata?.length > 0 ? (
              <div className="modify_search_part">
                {selectedtab === "flights" ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="J_T2 J_T2_margintop">
                      <div className="J_T2-header">
                        <div
                          className="dropdown-wrapper"
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          <span>{selectedOption.name}</span>
                          <span className="arrow">
                            <FaChevronDown />
                          </span>
                        </div>

                        {isOpen && (
                          <div className="dropdown-options">
                            {options.map((opt) => (
                              <div
                                key={opt.id}
                                className={`dropdown-option ${
                                  opt.id === selectedOption.id ? "active" : ""
                                }`}
                                onClick={() => handleSelecttripoption(opt)}
                              >
                                {opt.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* <div className="d-flex align-items-center gap-2">
                      <span style={{ whiteSpace: "nowrap" }}>Direct Flight</span>
                      <FormControlLabel
                        className="m-0"
                        control={
                          <Switch
                            checked={isChecked}
                            onChange={handleSwitchChange}
                            color="warning"
                          />
                        }
                        label=""
                      />
                    </div> */}
                  </div>
                ) : (
                  <></>
                )}
                <div className="mobile-only">
                  <div className="trip-summary-card">
                    <div className="summary-row">
                      <div className="route-section">
                        <div className="route-header">
                          <span className="label">FROM</span>
                          <span className="label">TO</span>
                        </div>
                        <div className="route-display">
                          <span className="location">{from?.value}</span>
                          <svg
                            className="arrow-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14m-7-7l7 7-7 7" />
                          </svg>
                          <span className="location">{to?.value}</span>
                        </div>
                      </div>

                      <div className="date-section">
                        <span className="label">DATE</span>
                        <span className="date-info">
                          {selectedDate || defaultMonth
                            ? dayjs(selectedDate || defaultMonth).format(
                                "ddd D/M"
                              )
                            : "-"}
                        </span>
                      </div>

                      <button
                        className="modify-btn"
                        onClick={handleResModifyToggle}
                      >
                        Modify
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`flight-search-bar ${
                    resmodifyToggle ? "open" : "closed"
                  } mb-2`}
                >
                  <div className="J_T2-header_resss">
                    <div
                      className="dropdown-wrapper"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span>{selectedOption.name}</span>
                      <span className="arrow">
                        <FaChevronDown />
                      </span>
                    </div>

                    {isOpen && (
                      <div className="dropdown-options">
                        {options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`dropdown-option ${
                              opt.id === selectedOption.id ? "active" : ""
                            }`}
                            onClick={() => handleSelecttripoption(opt)}
                          >
                            {opt.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="from-section">
                    {selectedtab === "buses" ? (
                      <Select
                        value={from}
                        onChange={
                          selectedtab === "buses"
                            ? handleSelectBus
                            : handleSelect
                        }
                        options={selectedtab === "buses" ? source_data : <></>}
                        isLoading={depcitylistload}
                        styles={customStyles}
                        isClearable={true}
                        placeholder="From?"
                        isSearchable={true}
                        getOptionLabel={(data) => {
                          return selectedtab === "buses"
                            ? data.CityName
                            : `${data.city_name || data.CityName} (${
                                data.airport_code
                              })`;
                        }}
                        formatOptionLabel={(data, { context }) => {
                          if (context === "menu") {
                            return selectedtab === "buses" ? (
                              <div>{data.CityName}</div>
                            ) : (
                              <div>
                                <div>{data.city_name || data.CityName}</div>
                                <div style={{ fontSize: "12px" }}>
                                  {data.airport_name}{" "}
                                  <span style={{ color: "#f45500" }}>
                                    ({data.airport_code})
                                  </span>
                                </div>
                              </div>
                            );
                          } else {
                            return selectedtab === "buses" ? (
                              <div className="fw-bold">{data.CityName}</div>
                            ) : (
                              <div>
                                {data.city_name}{" "}
                                <span style={{ color: "#f45500" }}>
                                  ({data.airport_code})
                                </span>
                              </div>
                            );
                          }
                        }}
                        components={{
                          ...animatedComponents,
                          DropdownIndicator: () => null,
                        }}
                      />
                    ) : (
                      // <input
                      //   value={String(from || "").toUpperCase()}
                      //   placeholder="Airport Code Only"
                      //   onChange={(e) => setFrom(e.target.value)}
                      //   style={{ height: "100%", width: "100%", border: "none" }}
                      // />
                      <Select
                        options={groupedOptionsOrigin}
                        placeholder="Origin Airport"
                        styles={customStyles}
                        value={from}
                        isSearchable
                        isClearable
                        filterOption={(option, inputValue) =>
                          option.label
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        onChange={handleSelectOrigin}
                      />
                    )}
                  </div>

                  {selectedtab === "buses" ? (
                    <></>
                  ) : (
                    <button
                      disabled={recentswap == 1 ? true : false}
                      className="swap-button"
                      // onClick={swapLocations}
                    >
                      <FaExchangeAlt
                        className={isSwapping ? "spin" : ""}
                        color="#000"
                      />
                    </button>
                  )}

                  <div className="to-section">
                    {selectedtab === "buses" ? (
                      <Select
                        value={to}
                        onChange={
                          selectedtab === "buses"
                            ? handleSelectBusTo
                            : handleSelect2
                        }
                        options={
                          selectedtab === "buses"
                            ? destination_data
                            : getSectorListTo
                        }
                        isLoading={arrcitylistload}
                        styles={customStyles}
                        placeholder="To?"
                        isClearable={true}
                        isSearchable={true}
                        getOptionLabel={(data) => {
                          if (selectedtab === "buses") {
                            return data.CityName;
                          } else {
                            const city = data.city_name || data.destination;
                            const code =
                              data.airport_code || data.DestinationCode;
                            return `${city} (${code})`;
                          }
                        }}
                        formatOptionLabel={(data, { context }) => {
                          if (context === "menu") {
                            return (
                              <div>
                                {selectedtab === "buses" ? (
                                  <div>{data.CityName}</div>
                                ) : (
                                  <>
                                    <div>
                                      {data.city_name
                                        ? data.city_name
                                        : data.destination}
                                    </div>
                                    <div style={{ fontSize: "12px" }}>
                                      {data.airport_name}{" "}
                                      <span style={{ color: "#f45500" }}>
                                        (
                                        {data.airport_code
                                          ? data.airport_code
                                          : data.DestinationCode}
                                        )
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          } else {
                            return selectedtab === "buses" ? (
                              <div className="fw-bold">{data.CityName}</div>
                            ) : (
                              <div>
                                {data.city_name
                                  ? data.city_name
                                  : data.destination}{" "}
                                <span style={{ color: "#f45500" }}>
                                  (
                                  {data.airport_code
                                    ? data.airport_code
                                    : data.DestinationCode}
                                  )
                                </span>
                              </div>
                            );
                          }
                        }}
                        components={{
                          ...animatedComponents,
                          DropdownIndicator: () => null,
                        }}
                      />
                    ) : (
                      // <input
                      //   value={String(to || "").toUpperCase()}
                      //   placeholder="Airport Code Only"
                      //   onChange={(e) => setTo(e.target.value)}
                      //   style={{ height: "100%", width: "100%", border: "none" }}
                      // />

                      <Select
                        options={groupedOptionsDestination}
                        placeholder="Destination Airport"
                        isSearchable
                        isClearable
                        styles={customStyles}
                        value={to}
                        filterOption={(option, inputValue) =>
                          option.label
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        onChange={handleSelectDestination}
                      />
                    )}
                  </div>

                  <div className="custom-date-picker">
                    <DatePicker
                      onChange={onChange}
                      placeholder={
                        selectedtab === "buses" ? "Date" : "Departure"
                      }
                      format="ddd D/M"
                      disabledDate={(current) => {
                        const today = dayjs().startOf("day");
                        const sixMonthsLater = today
                          .add(6, "month")
                          .endOf("day");
                        return (
                          current &&
                          (current < today || current > sixMonthsLater)
                        );
                      }}
                      // disabledDate={disableAllExceptApiDates}
                      value={
                        selectedDate || defaultMonth
                          ? dayjs(selectedDate || defaultMonth)
                          : null
                      }
                      suffixIcon={null}
                    />
                  </div>

                  {getCondition === 0 ||
                    (selected === 1 && (
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
                          format="ddd D/M"
                          disabledDate={(current) => {
                            const today = dayjs().startOf("day");
                            const sixMonthsLater = today
                              .add(6, "month")
                              .endOf("day");
                            return (
                              current &&
                              (current < today || current > sixMonthsLater)
                            );
                          }}
                          // disabledDate={disableDates}
                          // value={date2 ? moment(date2, "DD-MM-YYYY") : null}
                          value={
                            selectedDate2 || defaultMonth2
                              ? dayjs(selectedDate2 || defaultMonth2)
                              : null
                          }
                          placeholder="Return"
                          suffixIcon={null}
                          defaultPickerValue={firstEnabledDate}
                        />
                      </div>
                    ))}
                  {selectedtab === "buses" ? (
                    <></>
                  ) : (
                    <>
                      <div
                        className="traveler-section"
                        onClick={toggleDropdownTraveler}
                      >
                        {totalTravellers} Travellers{" "}
                        {isDropdownOpenTraveler && (
                          <div className="travellers-dropdown2">
                            <div className="fw-bold mb-2 fs-5">Travellers</div>
                            <div className="traveller-category">
                              <span>Adult 12+Yrs</span>
                              <div className="counter">
                                <button
                                  className="minus"
                                  onClick={() =>
                                    handleCounterChange("adult", -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  style={{
                                    fontSize: "14px",
                                    width: "30px",
                                    border: "none",
                                  }}
                                  value={travellers.adult}
                                  readOnly
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleCounterChange("adult", 1)
                                  }
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
                                  onClick={() =>
                                    handleCounterChange("child", -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  style={{
                                    fontSize: "14px",
                                    width: "30px",
                                    border: "none",
                                  }}
                                  value={travellers.child}
                                  readOnly
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleCounterChange("child", 1)
                                  }
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
                                  onClick={() =>
                                    handleCounterChange("infant", -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  style={{
                                    fontSize: "14px",
                                    width: "30px",
                                    border: "none",
                                  }}
                                  value={travellers.infant}
                                  readOnly
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleCounterChange("infant", 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div
                              className="mt-3"
                              style={{ border: "1px solid #eee" }}
                            ></div>
                            {/* <div className="mt-3 fw-bold text-dark">
                              Cabin Class
                            </div>
                            <div className="d-flex gap-3 flex-wrap mt-2">
                              {classes.map((classOption) => (
                                <div
                                  key={classOption.id}
                                  className={`classselekt ${selectedClass === classOption.id
                                    ? "selected"
                                    : ""
                                    }`}
                                  onClick={() => { setSelectedClass(classOption.id); seSelectedClassName(classOption.name) }}
                                >
                                  {classOption.name}
                                </div>
                              ))}
                            </div> */}
                          </div>
                        )}
                      </div>
                      <div
                        className="traveler-section"
                        onClick={toggleDropdownCabin}
                      >
                        {selectedClassName}{" "}
                        {isDropdownOpenCabin && (
                          <div className="travellers-dropdown2">
                            <div
                              className="mt-3"
                              style={{ border: "1px solid #eee" }}
                            ></div>
                            <div className="mt-3 fw-bold text-dark">
                              Cabin Class
                            </div>
                            <div className="d-flex gap-3 flex-wrap mt-2">
                              {classes.map((classOption) => (
                                <div
                                  key={classOption.id}
                                  className={`classselekt ${
                                    selectedClass === classOption.id
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedClass(classOption.id);
                                    seSelectedClassName(classOption.name);
                                  }}
                                >
                                  {classOption.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <button
                    className="search-button"
                    onClick={() => {
                      if (!login) {
                        Notification("warning", "Please sign in to continue.");
                        return;
                      } else {
                        // if (selectedtab === "buses") {
                        //   getRouteBus();
                        // } else {
                        //   NewFlightget();
                        //   searchFlightData();
                        // }
                        if (selectedtab === "buses") {
                          getRouteBus();
                        } else {
                          NewFlightget();

                          if (selectedOption?.id === 1) {
                            searchFlightData();
                          }
                        }
                      }
                    }}
                  >
                    <FaSearch />
                  </button>
                  <button
                    className="search-buttonRes"
                    onClick={() => {
                      {
                        selectedtab === "buses"
                          ? getRouteBus()
                          : NewFlightget();
                        if (selectedOption?.id === 1) {
                          searchFlightData();
                        }
                      }
                      setSelectedIndex(null);
                    }}
                  >
                    Search
                  </button>
                </div>
                {/* <div class="eagle-deal-banner">
                  <div class="deal-left">
                    <div class="deal-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div class="deal-text">
                      <div class="deal-badge">Eagle Deal</div>
                      <p class="deal-message">
                        Get the best prices on popular destinations
                      </p>
                    </div>
                  </div>
                  <div class="deal-cta">View Deals</div>
                </div> */}
                <div className="filter_sec">
                  <button
                    className="filter-trigger-btn"
                    onClick={() => setShow(true)}
                  >
                    <MdFilterList color="var(--color-orange)" size={20} />
                    Filters
                    {activeFilterCount > 0 && (
                      <>
                        <span className="badge-custom">
                          {activeFilterCount}
                        </span>
                        <div className="filter_label_con">
                          {filters?.stops?.length > 0 && (
                            <div className="ms-2 d-flex align-items-center gap-3">
                              {filters.stops.map((item, index) => (
                                <div className="filter_label" key={index}>
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                          {filters?.airlines?.length > 0 && (
                            <div className="ms-2 d-flex align-items-center gap-2 flex-wrap">
                              {filters.airlines.map((item, index) => (
                                <div
                                  className="filter_label"
                                  key={index}
                                  title={item}
                                >
                                  {item?.length > 10
                                    ? item.slice(0, 10) + "..."
                                    : item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                  <div
                    className="d-flex align-items-center gap-2 pt-2"
                    style={{ maxWidth: "242px" }}
                  >
                    <label htmlFor="sort" className="sort_font_size">
                      Sort by
                    </label>
                    <select
                      id="sort"
                      className="form-select"
                      style={{ width: "auto", display: "inline-block" }}
                      value={sortOption}
                      onChange={(e) => {
                        setSortOption(e.target.value);
                        setCurrentPage(1); // reset to first page when sorting changes
                      }}
                    >
                      {/* <option value="">Default</option> */}
                      <option value="cheapest">Cheapest Price</option>
                      <option value="earlyDeparture">Early Departure</option>
                      <option value="lateDeparture">Late Departure</option>
                      <option value="earlyArrival">Early Arrival</option>
                      <option value="lateArrival">Late Arrival</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {returnflightTab == 0 && (
              <div ref={listRef}>
                {(() => {
                  // Case 1: If filters applied and filteredFlights exists
                  if (paginatedFlights?.length > 0) {
                    // ✅ Sort so non-stop flights come first, then 1-stop, 2-stop, etc.
                    const flightSorted = [...paginatedFlights].sort((a, b) => {
                      const stopsA = (a?.sg?.length ?? 1) - 1;
                      const stopsB = (b?.sg?.length ?? 1) - 1;
                      return stopsA - stopsB;
                    });
                    return flightSorted.map((item, index) => {
                      const globalIndex =
                        (currentPage - 1) * itemsPerPage + index;
                      const firstSeg = item?.sg?.[0];
                      const lastSeg = item?.sg?.[item?.sg?.length - 1];
                      const departureMoment =
                        firstSeg?.or?.dT && moment(firstSeg.or.dT).isValid()
                          ? moment(firstSeg.or.dT)
                          : null;
                      const arrivalMoment =
                        lastSeg?.ds?.aT && moment(lastSeg.ds.aT).isValid()
                          ? moment(lastSeg.ds.aT)
                          : null;
                      const totalMinutes =
                        departureMoment && arrivalMoment
                          ? arrivalMoment.diff(departureMoment, "minutes")
                          : firstSeg?.dr ?? 0;
                      const totalHours =
                        totalMinutes >= 0 ? Math.floor(totalMinutes / 60) : 0;
                      const totalRemainingMin =
                        totalMinutes >= 0 ? totalMinutes % 60 : 0;
                      const ClassName =
                        classes?.find((cls) => cls.id === item.sg?.[0]?.cC)
                          ?.name || "Unknown Class";
                      const fareIdentifier =
                        item.fareIdentifier?.name || "Standard Fare";
                      const colorCode =
                        item.fareIdentifier?.colorCode || "#3b82f6";
                      const cardStyle = {
                        "--accent-color": colorCode,
                      };

                      return (
                        <>
                          <div className="flightsavailable2" key={globalIndex}>
                            <div className="row gap-3 align-items-center">
                              <div className="col-12 col-lg-8 justify-content-space-between">
                                <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                                  <div className="airlinename col-12 col-lg-3">
                                    <div>
                                      {(() => {
                                        const airline = item?.sg[0]?.al?.alN;

                                        return airline === "IndiGo Airlines" ||
                                          airline === "Indigo" ? (
                                          <img
                                            src={images.IndiGoAirlines_logo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Neos" ? (
                                          <img
                                            src={images.neoslogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "SpiceJet" ||
                                          airline === "Spicejet" ? (
                                          <img
                                            src={images.spicejet}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Air India" ? (
                                          <img
                                            src={images.airindialogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Akasa Air" ? (
                                          <img
                                            src={images.akasalogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Etihad" ? (
                                          <img
                                            src={images.etihadlogo}
                                            style={{
                                              backgroundColor: "#fff",
                                              padding: "5px",
                                              borderRadius: "5px",
                                            }}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Vistara" ? (
                                          <img
                                            src={images.vistaralogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "AirAsia X" ? (
                                          <img
                                            src={images.airasiax}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "AirAsia" ? (
                                          <img
                                            src={images.airasia}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Azul" ? (
                                          <img
                                            src={images.azul}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Air India Express" ? (
                                          <img
                                            src={images.Air_India_Express_logo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Emirates Airlines" ? (
                                          <img
                                            src={images.emirateslogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Oman Air" ? (
                                          <img
                                            src={images.omanairlogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Srilankan Airlines" ? (
                                          <img
                                            src={images.srilankan}
                                            className="airline_logo2"
                                          />
                                        ) : (
                                          <IoAirplaneSharp
                                            size={40}
                                            color="black"
                                          />
                                        );
                                      })()}
                                    </div>

                                    <div className="planecomp2">
                                      {item.sg[0]?.al?.alN || "N/A"}
                                    </div>
                                    <div className="flightnum2">
                                      {/* {item?.sg?.[0]?.al?.fC} {item?.sg?.[0]?.al?.fN || "N/A"} */}
                                    </div>
                                  </div>
                                  <div className="flight-details2 col-12 col-lg-6 justify-content-center">
                                    {/* Departure (first segment) */}
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {departureMoment
                                          ? moment(departureMoment).format(
                                              "hh:mm A"
                                            )
                                          : "N/A"}
                                      </h5>
                                      <h5 className="airportname2">
                                        {item?.sg[0]?.or?.aC || "N/A"}
                                      </h5>
                                      <p className="alldate2">
                                        {departureMoment
                                          ? moment(departureMoment).format(
                                              "DD-MM-YYYY"
                                            )
                                          : "N/A"}
                                      </p>
                                    </div>

                                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                                      <span className="text-dark">From</span>
                                      <div className="from-to text-center">
                                        {/* Total journey duration = last arrival - first departure */}
                                        <h6 className="text-dark">
                                          {totalMinutes >= 0
                                            ? `${totalHours}h ${totalRemainingMin}m`
                                            : "N/A"}
                                        </h6>

                                        <img
                                          src={images.invertedviman}
                                          alt=""
                                          className="imagerouteplane"
                                        />

                                        {/* Show stops dynamically */}
                                        <h6 className="text-dark mt-1">
                                          {item?.sg?.length === 1
                                            ? "Non Stop"
                                            : `${item?.sg.length - 1} Stop${
                                                item?.sg.length - 1 > 1
                                                  ? "s"
                                                  : ""
                                              }`}
                                        </h6>
                                      </div>
                                      <span className="text-dark">To</span>
                                    </div>

                                    {/* Arrival (last segment) */}
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {arrivalMoment
                                          ? moment(arrivalMoment).format(
                                              "hh:mm A"
                                            )
                                          : "N/A"}
                                      </h5>
                                      <h5 className="airportname2">
                                        {item?.sg[item?.sg.length - 1]?.ds
                                          ?.aC || "N/A"}
                                      </h5>
                                      <p className="alldate2">
                                        {arrivalMoment
                                          ? moment(arrivalMoment).format(
                                              "DD-MM-YYYY"
                                            )
                                          : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-center justify-content-lg-between">
                                  <div>
                                    <div className="d-flex gap-1 mx-3 d-none">
                                      <div
                                        className="clickherebtn"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target={`#flightDrawer-${globalIndex}`}
                                        aria-controls="flightDrawer"
                                        onClick={() => FareRuleGet(item?.rI)}
                                      >
                                        Click here
                                      </div>
                                      <div className="">
                                        to know more about flight
                                      </div>
                                    </div>
                                    <div
                                      className="offcanvas offcanvas-start"
                                      tabIndex="-1"
                                      id={`flightDrawer-${globalIndex}`}
                                      aria-labelledby={`flightDrawerLabel-${globalIndex}`}
                                    >
                                      <div className="offcanvas-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="offcanvas"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="offcanvas-body">
                                        <div className="fs-3">
                                          Flight Details
                                        </div>
                                        <div className="fw-bold fs-5 mt-3">
                                          Departure
                                        </div>
                                        {flightProName === "travclan" ? (
                                          <>
                                            <div className="d-flex justify-content-between mt-2">
                                              <Chip
                                                label={
                                                  item?.iR === true
                                                    ? "Refundable"
                                                    : "Non-Refundable"
                                                }
                                                variant="outlined"
                                                sx={{
                                                  color:
                                                    item?.iR === true
                                                      ? "green"
                                                      : "gray",
                                                  backgroundColor:
                                                    item?.iR === true
                                                      ? "#e0f7e9"
                                                      : "inherit",
                                                  borderColor:
                                                    item?.iR === true
                                                      ? "#4caf50"
                                                      : "inherit",
                                                }}
                                              />
                                              <Chip
                                                label={
                                                  ClassName || "Unknown Class"
                                                }
                                                variant="outlined"
                                              />
                                            </div>
                                          </>
                                        ) : (
                                          <div className="mt-2">
                                            <Chip
                                              label={
                                                ClassName || "Unknown Class"
                                              }
                                              variant="outlined"
                                            />
                                          </div>
                                        )}

                                        <div className="container my-3">
                                          <div className="flight-cardok shadow-sm rounded">
                                            {/* Date Header */}
                                            <div className="p-2 date_divok fw-semibold border-bottom">
                                              {departureMoment
                                                ? moment(
                                                    firstSeg?.or?.dT
                                                  ).format("ddd, DD MMM")
                                                : "N/A"}
                                            </div>

                                            {/* Main Content */}
                                            <div className="p-3">
                                              <div className="d-flex justify-content-between align-items-center mb-2">
                                                {/* Origin (first segment origin) */}
                                                <div className="text-center">
                                                  <h4 className="text-success fw-bold m-0">
                                                    {firstSeg?.or?.aC || "N/A"}
                                                  </h4>
                                                  <small className="text-muted">
                                                    {firstSeg?.or?.cN || "N/A"}
                                                  </small>
                                                </div>

                                                {/* Total Duration & Stops (calculated across full journey) */}
                                                <div className="text-center">
                                                  <div className="fw-semibold">
                                                    {totalMinutes >= 0
                                                      ? `${totalHours}h ${totalRemainingMin}m`
                                                      : "N/A"}
                                                  </div>
                                                  <small className="text-muted">
                                                    {item?.sg?.length === 1
                                                      ? "Non Stop"
                                                      : `${
                                                          item?.sg?.length - 1
                                                        } Stop${
                                                          item?.sg?.length - 1 >
                                                          1
                                                            ? "s"
                                                            : ""
                                                        }`}
                                                  </small>
                                                </div>

                                                {/* Destination (last segment destination) */}
                                                <div className="text-center">
                                                  <h4 className="text-success fw-bold m-0">
                                                    {lastSeg?.ds?.aC || "N/A"}
                                                  </h4>
                                                  <small className="text-muted">
                                                    {lastSeg?.ds?.cN || "N/A"}
                                                  </small>
                                                </div>
                                              </div>

                                              {/* Flight No + Check-in */}
                                              <div className="d-flex justify-content-between text-muted small my-3">
                                                <div>
                                                  ✈️{" "}
                                                  {firstSeg?.al?.alC || "N/A"}{" "}
                                                  {firstSeg?.al?.fN || "N/A"}
                                                  {item?.sg?.length > 1 && (
                                                    <span className="ms-2 text-muted">
                                                      +{item.sg.length - 1} more
                                                      leg
                                                      {item.sg.length - 1 > 1
                                                        ? "s"
                                                        : ""}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Timeline */}
                                              <div className="timeline">
                                                {item?.sg?.map((seg, idx) => (
                                                  <div key={idx}>
                                                    <div className="timeline-item">
                                                      <div className="fw-bold">
                                                        {seg?.or?.dT &&
                                                        moment(
                                                          seg.or.dT
                                                        ).isValid()
                                                          ? moment(
                                                              seg.or.dT
                                                            ).format("hh:mm A")
                                                          : "N/A"}
                                                      </div>
                                                      <div>
                                                        {seg?.or?.aC || "N/A"} -{" "}
                                                        {seg?.or?.aN || "N/A"}
                                                      </div>
                                                    </div>

                                                    <div className="timeline-item my-3">
                                                      <div className="text-muted">
                                                        Travel Time{" "}
                                                        {seg?.dr >= 0
                                                          ? `${Math.floor(
                                                              moment
                                                                .duration(
                                                                  seg.dr,
                                                                  "minutes"
                                                                )
                                                                .asHours()
                                                            )}h ${moment
                                                              .duration(
                                                                seg.dr,
                                                                "minutes"
                                                              )
                                                              .minutes()}m`
                                                          : "N/A"}
                                                      </div>
                                                    </div>

                                                    <div className="timeline-item">
                                                      <div className="fw-bold">
                                                        {seg?.ds?.aT &&
                                                        moment(
                                                          seg.ds.aT
                                                        ).isValid()
                                                          ? moment(
                                                              seg.ds.aT
                                                            ).format("hh:mm A")
                                                          : "N/A"}
                                                      </div>
                                                      <div>
                                                        {seg?.ds?.aC || "N/A"} -{" "}
                                                        {seg?.ds?.aN || "N/A"}
                                                        {seg?.ds?.tr
                                                          ? ` - ${seg.ds.tr}`
                                                          : ""}
                                                      </div>
                                                    </div>

                                                    {/* Technical Stop Section */}

                                                    {seg?.sO && (
                                                      <div className="timeline-item my-2">
                                                        <div
                                                          className="alert alert-info p-2"
                                                          style={{
                                                            fontSize: "0.85rem",
                                                          }}
                                                        >
                                                          <div className="d-flex align-items-center gap-2 mb-1">
                                                            <span className="badge bg-info">
                                                              ⚠️ Technical Stop
                                                            </span>
                                                          </div>
                                                          <div className="ms-2">
                                                            <div>
                                                              <strong>
                                                                Stop at:
                                                              </strong>{" "}
                                                              {seg.sP || "N/A"}
                                                            </div>
                                                            <div>
                                                              <strong>
                                                                Arrival:
                                                              </strong>{" "}
                                                              {seg.sPAT &&
                                                              moment(
                                                                seg.sPAT
                                                              ).isValid()
                                                                ? moment(
                                                                    seg.sPAT
                                                                  ).format(
                                                                    "hh:mm A, DD MMM"
                                                                  )
                                                                : "N/A"}
                                                            </div>
                                                            <div>
                                                              <strong>
                                                                Departure:
                                                              </strong>{" "}
                                                              {seg.sPDT &&
                                                              moment(
                                                                seg.sPDT
                                                              ).isValid()
                                                                ? moment(
                                                                    seg.sPDT
                                                                  ).format(
                                                                    "hh:mm A, DD MMM"
                                                                  )
                                                                : "N/A"}
                                                            </div>
                                                            <div>
                                                              <strong>
                                                                Duration:
                                                              </strong>{" "}
                                                              {seg.sD
                                                                ? `${Math.floor(
                                                                    seg.sD / 60
                                                                  )}h ${
                                                                    seg.sD % 60
                                                                  }m`
                                                                : "N/A"}
                                                            </div>
                                                            <small className="text-muted">
                                                              * Aircraft will
                                                              make a technical
                                                              stop. Passengers
                                                              may remain on
                                                              board.
                                                            </small>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {idx <
                                                      item.sg.length - 1 && (
                                                      <div className="timeline-item my-2">
                                                        <span className="badge bg-warning text-dark">
                                                          Layover at{" "}
                                                          {seg?.ds?.aN || "N/A"}{" "}
                                                          <br />(
                                                          {seg?.ds?.aT &&
                                                          moment(
                                                            seg.ds.aT
                                                          ).isValid()
                                                            ? moment(
                                                                seg.ds.aT
                                                              ).format(
                                                                "hh:mm A"
                                                              )
                                                            : "N/A"}{" "}
                                                          →
                                                          {item.sg[idx + 1]?.or
                                                            ?.dT &&
                                                          moment(
                                                            item.sg[idx + 1].or
                                                              .dT
                                                          ).isValid()
                                                            ? moment(
                                                                item.sg[idx + 1]
                                                                  .or.dT
                                                              ).format(
                                                                "hh:mm A"
                                                              )
                                                            : "N/A"}
                                                          )
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Technical Stops Summary Section */}
                                        {flightProName === "travclan" ? (
                                          <>
                                            <div className="fw-bold fs-5 mt-3">
                                              Technical Stops
                                            </div>
                                            <div className="container my-3">
                                              <div className="flight-cardok p-3 shadow-sm rounded">
                                                {item?.sg?.some(
                                                  (seg) => seg.sO
                                                ) ? (
                                                  <div>
                                                    <div
                                                      className="alert alert-warning mb-3"
                                                      role="alert"
                                                    >
                                                      <h6 className="alert-heading mb-2">
                                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                        This flight includes
                                                        technical stops
                                                      </h6>
                                                      <p className="mb-0 small">
                                                        Technical stops are
                                                        brief stops made by
                                                        aircraft for operational
                                                        reasons such as
                                                        refueling or crew
                                                        changes. Passengers
                                                        typically remain on
                                                        board during these
                                                        stops.
                                                      </p>
                                                    </div>

                                                    {item.sg.map(
                                                      (seg, idx) =>
                                                        seg.sO && (
                                                          <div
                                                            key={idx}
                                                            className="border rounded p-2 mb-2 bg-light"
                                                          >
                                                            <div className="row">
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Stop Location
                                                                </small>
                                                                <div className="fw-semibold">
                                                                  {seg.sP ||
                                                                    "N/A"}
                                                                </div>
                                                              </div>
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Stop Duration
                                                                </small>
                                                                <div className="fw-semibold">
                                                                  {seg.sD
                                                                    ? `${Math.floor(
                                                                        seg.sD /
                                                                          60
                                                                      )}h ${
                                                                        seg.sD %
                                                                        60
                                                                      }m`
                                                                    : "N/A"}
                                                                </div>
                                                              </div>
                                                            </div>
                                                            <div className="row mt-2">
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Arrival at
                                                                  Stop
                                                                </small>
                                                                <div>
                                                                  {seg.sPAT &&
                                                                  moment(
                                                                    seg.sPAT
                                                                  ).isValid()
                                                                    ? moment(
                                                                        seg.sPAT
                                                                      ).format(
                                                                        "hh:mm A, DD MMM YYYY"
                                                                      )
                                                                    : "N/A"}
                                                                </div>
                                                              </div>
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Departure from
                                                                  Stop
                                                                </small>
                                                                <div>
                                                                  {seg.sPDT &&
                                                                  moment(
                                                                    seg.sPDT
                                                                  ).isValid()
                                                                    ? moment(
                                                                        seg.sPDT
                                                                      ).format(
                                                                        "hh:mm A, DD MMM YYYY"
                                                                      )
                                                                    : "N/A"}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="text-center py-3">
                                                    <div className="text-success mb-2">
                                                      <i
                                                        className="bi bi-check-circle-fill"
                                                        style={{
                                                          fontSize: "2rem",
                                                        }}
                                                      ></i>
                                                    </div>
                                                    <h6 className="text-muted mb-0">
                                                      No Technical Stops
                                                    </h6>
                                                    <small className="text-muted">
                                                      This flight operates
                                                      without any technical
                                                      stops
                                                    </small>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        <div className="fw-bold fs-5 mt-3">
                                          Fare Details
                                        </div>
                                        <div className="container my-3">
                                          <div className="flight-cardok p-2 shadow-sm rounded">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                              <div>
                                                <BsFillHandbagFill
                                                  color="orangered"
                                                  size={15}
                                                />
                                              </div>
                                              <div
                                                style={{
                                                  lineHeight: 1,
                                                  fontSize: "0.80rem",
                                                }}
                                              >
                                                {flightProName ===
                                                "travclan" ? (
                                                  <>
                                                    {item.baggage?.travclan
                                                      ?.cabin || "N/A"}{" "}
                                                    Cabin Baggage
                                                  </>
                                                ) : flightProName ===
                                                  "airiq" ? (
                                                  <>
                                                    {item.baggage?.airiq
                                                      ?.cabin || "N/A"}{" "}
                                                    Cabin Baggage
                                                  </>
                                                ) : (
                                                  <>
                                                    {item.baggage?.travclan
                                                      ?.cabin || "N/A"}{" "}
                                                    |
                                                    {item.baggage?.airiq
                                                      ?.cabin || "N/A"}
                                                  </>
                                                )}
                                              </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <BsFillLuggageFill
                                                  color="orangered"
                                                  size={15}
                                                />
                                              </div>
                                              <div
                                                style={{
                                                  lineHeight: 1,
                                                  fontSize: "0.75rem",
                                                }}
                                              >
                                                {flightProName ===
                                                "travclan" ? (
                                                  <>
                                                    {item.baggage?.travclan
                                                      ?.checkIn || "N/A"}{" "}
                                                    Check-in Baggage
                                                  </>
                                                ) : flightProName ===
                                                  "airiq" ? (
                                                  <>
                                                    {item.baggage?.airiq
                                                      ?.checkIn || "N/A"}{" "}
                                                    Check-in Baggage
                                                  </>
                                                ) : (
                                                  <>
                                                    TravClan:{" "}
                                                    {item.baggage?.travclan
                                                      ?.checkIn || "N/A"}{" "}
                                                    | AirIQ:{" "}
                                                    {item.baggage?.airiq
                                                      ?.checkIn || "N/A"}
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                            {flightProName === "travclan" ? (
                                              <>
                                                <div className="mt-3">
                                                  <h6 className="fw-bold">
                                                    Fare Rules
                                                  </h6>
                                                  {fare_rules_Loading ? (
                                                    <Box sx={{ width: "100%" }}>
                                                      <Skeleton
                                                        variant="text"
                                                        height={20}
                                                      />
                                                      <Skeleton
                                                        variant="text"
                                                        height={20}
                                                      />
                                                      <Skeleton
                                                        variant="text"
                                                        height={20}
                                                      />
                                                    </Box>
                                                  ) : (
                                                    <div
                                                      style={{
                                                        fontSize: "0.8rem",
                                                        lineHeight: 1.4,
                                                      }}
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          fare_rules[0]
                                                            ?.fareRuleDetail,
                                                      }}
                                                    />
                                                  )}
                                                </div>
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="flight-class-card d-none"
                                    style={cardStyle}
                                  >
                                    <div className="class-info">
                                      <div className="class-icon">
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                        </svg>
                                      </div>
                                      <div className="class-details">
                                        <h3 className="class-name">
                                          {ClassName}
                                        </h3>
                                        <p className="fare-identifier">
                                          {fareIdentifier}
                                        </p>
                                      </div>
                                      <div className="class-badge">
                                        {ClassName?.split(" ")[0] || "CLASS"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-3 mb-3 mb-lg-0">
                                <div
                                  className="d-flex gap-3"
                                  style={{
                                    alignItems: "stretch",
                                    justifyContent: "center",
                                    gap: "0.7rem",
                                  }}
                                >
                                  {(() => {
                                    const getCheapestPrice = () => {
                                      if (item.isAirIQOnly) {
                                        return {
                                          price: item.airIQPrice,
                                          source: "AirIQ",
                                          id: item.airIQTicketId,
                                          fareCode: "airIQ_fare",
                                          isAirIQ: true,
                                        };
                                      } else {
                                        const travclanPrice = item.fF;
                                        const airiqPrice = item.airIQPrice;

                                        if (
                                          airiqPrice &&
                                          airiqPrice < travclanPrice
                                        ) {
                                          return {
                                            price: airiqPrice,
                                            source: "AirIQ",
                                            id: item.airIQTicketId,
                                            fareCode: "airIQ_fare",
                                            isAirIQ: true,
                                          };
                                        } else {
                                          return {
                                            price: travclanPrice,
                                            source: "TravClan",
                                            id: item.rI,
                                            fareCode: item.fareIdentifier?.code,
                                            isAirIQ: false,
                                          };
                                        }
                                      }
                                    };

                                    const cheapestPrice = getCheapestPrice();
                                    const otherPrices = [];

                                    // Add other prices if not AirIQ only
                                    if (!item.isAirIQOnly) {
                                      if (cheapestPrice.source !== "TravClan") {
                                        otherPrices.push({
                                          price: item.fF,
                                          source: "TravClan",
                                          id: item.rI,
                                          fareCode: item.fareIdentifier?.code,
                                          isAirIQ: false,
                                        });
                                      }
                                      if (
                                        item.airIQPrice &&
                                        cheapestPrice.source !== "AirIQ"
                                      ) {
                                        otherPrices.push({
                                          price: item.airIQPrice,
                                          source: "AirIQ",
                                          id: item.airIQTicketId,
                                          fareCode: "airIQ_fare",
                                          isAirIQ: true,
                                        });
                                      }
                                    }

                                    // Calculate max price to show savings
                                    const maxPrice = Math.max(
                                      item.fF || 0,
                                      item.airIQPrice || 0
                                    );
                                    const savings =
                                      maxPrice - cheapestPrice.price;

                                    return (
                                      <>
                                        {/* Best Deal Card - Professional Design */}
                                        <div
                                          style={{
                                            position: "relative",
                                            background: "#fff",
                                            borderRadius: "16px",
                                            boxShadow:
                                              "0 4px 12px rgba(0,0,0,0.08)",
                                            border: "2px solid #ff690f",
                                            flex: "0 0 180px",
                                            overflow: "hidden",
                                            transition: "all 0.3s ease",
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow =
                                              "0 8px 20px rgba(0,0,0,0.12)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow =
                                              "0 4px 12px rgba(0,0,0,0.08)";
                                          }}
                                        >
                                          {/* Best Deal Badge - Fixed Height */}
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "0",
                                              right: "0",
                                              background:
                                                "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                                              color: "#000",
                                              padding: "6px 12px",
                                              borderBottomLeftRadius: "12px",
                                              fontSize: "10px",
                                              fontWeight: "bold",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                              boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.15)",
                                              zIndex: 10,
                                              height: "28px",
                                            }}
                                          >
                                            ⚡ BEST DEAL
                                          </div>

                                          {/* Card Content */}
                                          <div
                                            style={{
                                              paddingTop: "40px",
                                              paddingBottom: "15px",
                                              paddingLeft: "12px",
                                              paddingRight: "12px",
                                              textAlign: "center",
                                              flex: "1",
                                              display: "flex",
                                              flexDirection: "column",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            {/* Price Section - Fixed Height */}
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                              }}
                                            >
                                              {/* Price */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "flex-start",
                                                  justifyContent: "center",
                                                  gap: "4px",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: "black",
                                                    fontSize: "28px",
                                                    marginTop: "4px",
                                                  }}
                                                >
                                                  ₹
                                                </span>
                                                <span
                                                  style={{
                                                    fontSize: "30px",
                                                    fontWeight: "bold",
                                                    color: "#111827",
                                                  }}
                                                >
                                                  {cheapestPrice.price?.toLocaleString(
                                                    "en-IN"
                                                  ) || "N/A"}
                                                </span>
                                              </div>

                                              {/* Savings Display - Fixed Height */}
                                              {savings > 0 && (
                                                <div
                                                  style={{
                                                    fontSize: "12px",
                                                    color: "#10b981",
                                                    marginTop: "4px",
                                                    fontWeight: "600",
                                                    height: "18px",
                                                  }}
                                                >
                                                  Save ₹
                                                  {savings.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </div>
                                              )}
                                              {/* {savings === 0 && (
                                                <div
                                                  style={{
                                                    height: "18px",
                                                    marginTop: "4px",
                                                  }}
                                                ></div>
                                              )} */}
                                            </div>

                                            {/* Button Section */}
                                            <div>
                                              {/* Book Button */}
                                              {login ? (
                                                <div
                                                  style={{
                                                    cursor:
                                                      selectedOption.id === 2 &&
                                                      resultIndex.includes(
                                                        cheapestPrice.id
                                                      )
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    textAlign: "center",
                                                    transition: "all 0.2s ease",
                                                    background:
                                                      selectedOption.id === 2 &&
                                                      resultIndex.includes(
                                                        cheapestPrice.id
                                                      )
                                                        ? "green"
                                                        : "linear-gradient(135deg, #ff690f 0%, #e8381b 100%)",
                                                    color: "#fff",
                                                    border: "none",
                                                    marginBottom: "12px",
                                                  }}
                                                  onClick={() => {
                                                    const updatedItem =
                                                      cheapestPrice.isAirIQ
                                                        ? [
                                                            {
                                                              ...item,
                                                              fareIdentifier: {
                                                                ...item.fareIdentifier,
                                                                code: "airIQ_fare",
                                                              },
                                                              rI: item.airIQTicketId,
                                                              selectedPrice:
                                                                cheapestPrice.price,
                                                              priceSource:
                                                                "AirIQ",
                                                            },
                                                          ]
                                                        : [
                                                            {
                                                              ...item,
                                                              selectedPrice:
                                                                cheapestPrice.price,
                                                              priceSource:
                                                                "TravClan",
                                                            },
                                                          ];

                                                    if (
                                                      selectedOption.id === 1
                                                    ) {
                                                      setIndex(index);
                                                      if (
                                                        cheapestPrice.isAirIQ
                                                      ) {
                                                        localStorage.removeItem(
                                                          "itineraryCode"
                                                        );
                                                        navigate(
                                                          "/TicketBookingDetails",
                                                          {
                                                            state: {
                                                              item: updatedItem,
                                                              totaltraveller:
                                                                totalTravellers,
                                                              adulttraveler:
                                                                travellers.adult,
                                                              childtraveler:
                                                                travellers.child,
                                                              infanttraveler:
                                                                travellers.infant,
                                                              selected:
                                                                selected,
                                                            },
                                                          }
                                                        );
                                                      } else {
                                                        setResultIndex(
                                                          (prev) => [
                                                            ...prev,
                                                            item?.rI,
                                                          ]
                                                        );
                                                        ItineraryCreateNew(
                                                          [
                                                            ...resultIndex,
                                                            item?.rI,
                                                          ],
                                                          updatedItem
                                                        );
                                                      }
                                                    } else if (
                                                      selectedOption.id === 2
                                                    ) {
                                                      if (
                                                        resultIndex.includes(
                                                          cheapestPrice.id
                                                        )
                                                      ) {
                                                      } else {
                                                        setFlightData(
                                                          updatedItem
                                                        );
                                                        setIndex(index);
                                                        setResultIndex([
                                                          cheapestPrice.id,
                                                        ]);
                                                        handleReturnFlightTabChange(
                                                          1
                                                        );
                                                      }
                                                    }
                                                  }}
                                                >
                                                  {itinerary_loading &&
                                                  index === getindex &&
                                                  !cheapestPrice.isAirIQ
                                                    ? "Loading..."
                                                    : selectedOption.id === 2
                                                    ? resultIndex.includes(
                                                        cheapestPrice.id
                                                      )
                                                      ? "Selected"
                                                      : "Select"
                                                    : "Book Now"}
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    alert(
                                                      "Please log in to proceed with booking."
                                                    )
                                                  }
                                                  style={{
                                                    cursor: "pointer",
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    textAlign: "center",
                                                    background:
                                                      "linear-gradient(135deg, #ff690f 0%, #e8381b 100%)",
                                                    color: "#fff",
                                                    border: "none",
                                                    textDecoration: "none",
                                                    display: "block",
                                                    marginBottom: "12px",
                                                  }}
                                                >
                                                  Book Now
                                                </div>
                                              )}
                                              <div
                                                data-bs-toggle="offcanvas"
                                                data-bs-target={`#flightDrawer-${globalIndex}`}
                                                aria-controls="flightDrawer"
                                                onClick={() => {
                                                  FareRuleGet(item?.rI);
                                                  setFlightProName("travclan");
                                                }}
                                                style={{
                                                  color: "#ff690f",
                                                  fontWeight: "600",
                                                  fontSize: "14px",
                                                  textAlign: "center",
                                                  cursor: "pointer",
                                                  marginBottom: "0.2rem",
                                                }}
                                              >
                                                View Flight Details
                                              </div>
                                              {/* <div className="d-flex align-items-baseline gap-1 mt-2 mb-1">
                                                <BsFillHandbagFill
                                                  color="orangered"
                                                  size={14}
                                                />
                                                <div
                                                  style={{
                                                    fontSize: "0.70rem",
                                                  }}
                                                >
                                                  {cheapestPrice.isAirIQ
                                                    ? (item.baggage?.airiq
                                                        ?.cabin || "N/A") +
                                                      " Cabin Baggage"
                                                    : (item.baggage?.travclan
                                                        ?.cabin ||
                                                        item.sg[0]?.cBg ||
                                                        "N/A") +
                                                      " Cabin Baggage"}
                                                </div>
                                              </div> */}
                                              {/* <div className="d-flex align-items-baseline gap-1">
                                                <BsFillLuggageFill
                                                  color="orangered"
                                                  size={14}
                                                />
                                                <div
                                                  style={{
                                                    fontSize: "0.70rem",
                                                  }}
                                                >
                                                  {cheapestPrice.isAirIQ
                                                    ? (item.baggage?.airiq
                                                        ?.checkIn || "N/A") +
                                                      " Check-in Baggage"
                                                    : (item.baggage?.travclan
                                                        ?.checkIn ||
                                                        item.sg[0]?.bg ||
                                                        "N/A") +
                                                      " Check-in Baggage"}
                                                </div>
                                              </div> */}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Other Price Cards - Professional Design */}
                                        {otherPrices.map((priceInfo, idx) => (
                                          <div
                                            key={idx}
                                            style={{
                                              position: "relative",
                                              background: "#fff",
                                              borderRadius: "16px",
                                              boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.06)",
                                              border: "1px solid #e5e7eb",
                                              flex: "0 0 180px",
                                              overflow: "hidden",
                                              transition: "all 0.3s ease",
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(0,0,0,0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.boxShadow =
                                                "0 2px 8px rgba(0,0,0,0.06)";
                                            }}
                                          >
                                            {/* Empty Badge Space - Fixed Height for Alignment */}
                                            <div
                                              style={{ height: "28px" }}
                                            ></div>

                                            {/* Card Content */}
                                            <div
                                              style={{
                                                paddingTop: "16px",
                                                paddingBottom: "18px",
                                                paddingLeft: "12px",
                                                paddingRight: "12px",
                                                textAlign: "center",
                                                flex: "1",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              {/* Price Section - Fixed Height */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  justifyContent: "center",
                                                  marginBottom: "10px",
                                                }}
                                              >
                                                {/* Price */}
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    justifyContent: "center",
                                                    gap: "4px",
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      color: "black",
                                                      fontSize: "28px",
                                                      marginTop: "4px",
                                                    }}
                                                  >
                                                    ₹
                                                  </span>
                                                  <span
                                                    style={{
                                                      fontSize: "30px",
                                                      fontWeight: "bold",
                                                      color: "#111827",
                                                    }}
                                                  >
                                                    {priceInfo.price?.toLocaleString(
                                                      "en-IN"
                                                    ) || "N/A"}
                                                  </span>
                                                </div>

                                                {/* Empty space for alignment - Fixed Height */}
                                                <div
                                                  style={{
                                                    height: "18px",
                                                    // marginTop: "4px",
                                                  }}
                                                ></div>
                                              </div>

                                              {/* Button Section */}
                                              <div>
                                                {/* Book Button */}
                                                {login ? (
                                                  <div
                                                    style={{
                                                      cursor:
                                                        selectedOption.id ===
                                                          2 &&
                                                        resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                          ? "not-allowed"
                                                          : "pointer",
                                                      width: "100%",
                                                      padding: "12px 16px",
                                                      borderRadius: "12px",
                                                      fontWeight: "600",
                                                      fontSize: "14px",
                                                      textAlign: "center",
                                                      transition:
                                                        "all 0.2s ease",
                                                      background:
                                                        selectedOption.id ===
                                                          2 &&
                                                        resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                          ? "#10b981"
                                                          : "#fff",
                                                      color:
                                                        selectedOption.id ===
                                                          2 &&
                                                        resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                          ? "#fff"
                                                          : "#374151",
                                                      border:
                                                        "2px solid #d1d5db",
                                                      marginBottom: "12px",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (
                                                        !(
                                                          selectedOption.id ===
                                                            2 &&
                                                          resultIndex.includes(
                                                            priceInfo.id
                                                          )
                                                        )
                                                      ) {
                                                        e.currentTarget.style.borderColor =
                                                          "#ff690f";
                                                        e.currentTarget.style.color =
                                                          "#ff690f";
                                                      }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      if (
                                                        !(
                                                          selectedOption.id ===
                                                            2 &&
                                                          resultIndex.includes(
                                                            priceInfo.id
                                                          )
                                                        )
                                                      ) {
                                                        e.currentTarget.style.borderColor =
                                                          "#d1d5db";
                                                        e.currentTarget.style.color =
                                                          "#374151";
                                                      }
                                                    }}
                                                    onClick={() => {
                                                      const updatedItem =
                                                        priceInfo.isAirIQ
                                                          ? [
                                                              {
                                                                ...item,
                                                                fareIdentifier:
                                                                  {
                                                                    ...item.fareIdentifier,
                                                                    code: "airIQ_fare",
                                                                  },
                                                                rI: item.airIQTicketId,
                                                                selectedPrice:
                                                                  priceInfo.price,
                                                                priceSource:
                                                                  "AirIQ",
                                                              },
                                                            ]
                                                          : [
                                                              {
                                                                ...item,
                                                                selectedPrice:
                                                                  priceInfo.price,
                                                                priceSource:
                                                                  "TravClan",
                                                              },
                                                            ];

                                                      if (
                                                        selectedOption.id === 1
                                                      ) {
                                                        setIndex(index);
                                                        if (priceInfo.isAirIQ) {
                                                          localStorage.removeItem(
                                                            "itineraryCode"
                                                          );
                                                          navigate(
                                                            "/TicketBookingDetails",
                                                            {
                                                              state: {
                                                                item: updatedItem,
                                                                totaltraveller:
                                                                  totalTravellers,
                                                                adulttraveler:
                                                                  travellers.adult,
                                                                childtraveler:
                                                                  travellers.child,
                                                                infanttraveler:
                                                                  travellers.infant,
                                                                selected:
                                                                  selected,
                                                              },
                                                            }
                                                          );
                                                        } else {
                                                          setResultIndex(
                                                            (prev) => [
                                                              ...prev,
                                                              item?.rI,
                                                            ]
                                                          );
                                                          ItineraryCreateNew(
                                                            [
                                                              ...resultIndex,
                                                              item?.rI,
                                                            ],
                                                            updatedItem
                                                          );
                                                        }
                                                      } else if (
                                                        selectedOption.id === 2
                                                      ) {
                                                        if (
                                                          resultIndex.includes(
                                                            priceInfo.id
                                                          )
                                                        ) {
                                                          console.log(
                                                            `${priceInfo.source} flight ${priceInfo.id} already selected, no action taken`
                                                          );
                                                        } else {
                                                          console.log(
                                                            `Selecting ${priceInfo.source} flight: ${priceInfo.id}, fareIdentifier.code: ${priceInfo.fareCode}`
                                                          );
                                                          setFlightData(
                                                            updatedItem
                                                          );
                                                          setIndex(index);
                                                          setResultIndex([
                                                            priceInfo.id,
                                                          ]);
                                                          handleReturnFlightTabChange(
                                                            1
                                                          );
                                                        }
                                                      }
                                                    }}
                                                  >
                                                    {itinerary_loading &&
                                                    index === getindex &&
                                                    !priceInfo.isAirIQ
                                                      ? "Loading..."
                                                      : selectedOption.id === 2
                                                      ? resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                        ? "Selected"
                                                        : "Select"
                                                      : "Book Now"}
                                                  </div>
                                                ) : (
                                                  <div
                                                    onClick={() =>
                                                      alert(
                                                        "Please log in to proceed with booking."
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                      width: "100%",
                                                      padding: "12px 16px",
                                                      borderRadius: "12px",
                                                      fontWeight: "600",
                                                      fontSize: "14px",
                                                      textAlign: "center",
                                                      background: "#fff",
                                                      color: "#374151",
                                                      border:
                                                        "2px solid #d1d5db",
                                                      textDecoration: "none",
                                                      display: "block",
                                                      marginBottom: "12px",
                                                    }}
                                                  >
                                                    Book Now
                                                  </div>
                                                )}
                                                <div
                                                  data-bs-toggle="offcanvas"
                                                  data-bs-target={`#flightDrawer-${globalIndex}`}
                                                  aria-controls="flightDrawer"
                                                  onClick={() => {
                                                    FareRuleGet(item?.rI);
                                                    setFlightProName("airiq");
                                                  }}
                                                  style={{
                                                    color: "#ff690f",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  View Flight Details
                                                </div>
                                                {/* <div className="d-flex align-items-baseline gap-1 mt-2 mb-1">
                                                  <BsFillHandbagFill
                                                    color="orangered"
                                                    size={14}
                                                  />
                                                  <div
                                                    style={{
                                                      fontSize: "0.70rem",
                                                    }}
                                                  >
                                                    {priceInfo.isAirIQ
                                                      ? (item.baggage?.airiq
                                                          ?.cabin || "N/A") +
                                                        " Cabin Baggage"
                                                      : (item.baggage?.travclan
                                                          ?.cabin ||
                                                          item.sg[0]?.cBg ||
                                                          "N/A") +
                                                        " Cabin Baggge"}
                                                  </div>
                                                </div> */}
                                                {/* <div className="d-flex align-items-baseline gap-1">
                                                  <BsFillLuggageFill
                                                    color="orangered"
                                                    size={14}
                                                  />
                                                  <div
                                                    style={{
                                                      fontSize: "0.70rem",
                                                    }}
                                                  >
                                                    {priceInfo.isAirIQ
                                                      ? (item.baggage?.airiq
                                                          ?.checkIn || "N/A") +
                                                        " Check-in Baggage"
                                                      : (item.baggage?.travclan
                                                          ?.checkIn ||
                                                          item.sg[0]?.bg ||
                                                          "N/A") +
                                                        " Check-in Baggage"}
                                                  </div>
                                                </div> */}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flights_available_mobile">
                            <div className="d-flex justify-content-between">
                              <div className="mobile_row">
                                <div>
                                  {(() => {
                                    const airline = item?.sg[0]?.al?.alN;

                                    return airline === "IndiGo Airlines" ||
                                      airline === "Indigo" ? (
                                      <img
                                        src={images.IndiGoAirlines_logo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Neos" ? (
                                      <img
                                        src={images.neoslogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "SpiceJet" ||
                                      airline === "Spicejet" ? (
                                      <img
                                        src={images.spicejet}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Air India" ? (
                                      <img
                                        src={images.airindialogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Akasa Air" ? (
                                      <img
                                        src={images.akasalogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Etihad" ? (
                                      <img
                                        src={images.etihadlogo}
                                        style={{
                                          backgroundColor: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                        }}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Vistara" ? (
                                      <img
                                        src={images.vistaralogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "AirAsia X" ? (
                                      <img
                                        src={images.airasiax}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "AirAsia" ? (
                                      <img
                                        src={images.airasia}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Azul" ? (
                                      <img
                                        src={images.azul}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Air India Express" ? (
                                      <img
                                        src={images.Air_India_Express_logo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Emirates Airlines" ? (
                                      <img
                                        src={images.emirateslogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Oman Air" ? (
                                      <img
                                        src={images.omanairlogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Srilankan Airlines" ? (
                                      <img
                                        src={images.srilankan}
                                        className="airline_logo2_mob"
                                      />
                                    ) : (
                                      <IoAirplaneSharp
                                        size={40}
                                        color="white"
                                      />
                                    );
                                  })()}
                                </div>
                                <div className="mob_time_cont">
                                  <div className="mob_time_row">
                                    <div className="mob_time text-center">
                                      {departureMoment
                                        ? moment(item?.sg[0]?.or?.dT).format(
                                            "hh:mm A"
                                          )
                                        : "N/A"}
                                      <div>{item?.sg[0]?.or?.aC || "N/A"}</div>
                                      <div className="mob_city_kode">
                                        {item?.sg[0]?.or?.cN || "N/A"}
                                      </div>
                                    </div>

                                    <div className="mob_duration_line">
                                      <div className="mob_duration">
                                        {totalMinutes >= 0
                                          ? `${totalHours}h ${totalRemainingMin}m`
                                          : "N/A"}
                                      </div>
                                      <div className="mob_line"></div>
                                    </div>

                                    <div className="mob_time text-center">
                                      {arrivalMoment
                                        ? moment(
                                            item?.sg[item?.sg.length - 1]?.ds
                                              ?.aT
                                          ).format("hh:mm A")
                                        : "N/A"}
                                      <div>
                                        {item?.sg[item?.sg.length - 1]?.ds
                                          ?.aC || "N/A"}
                                      </div>
                                      <div className="mob_city_kode">
                                        {item?.sg[item?.sg.length - 1]?.ds
                                          ?.cN || "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* <div className="mob_time_row">
                                    <div className="mob_city_kode">
                                      {item?.sg[0]?.or?.cN || "N/A"}
                                    </div>
                                    <div className="mob_city_kode">
                                      {item?.sg[item?.sg.length - 1]?.ds?.cN ||
                                        "N/A"}
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                borderTop: "1px solid #ccc",
                                marginTop: "1rem",
                              }}
                            />

                            <div className="mob_book_btn_main">
                              <div className="d-flex align-items-center justify-content-center justify-content-lg-start w-100 flex-column">
                                {/* <div className="flight-info-container">
                                
                              <div className="flight-info-btn" onClick={() => openModal(item)}>
                                <BsInfoCircle size={18} />
                                <span className="flight-info-text">Flight Info</span>
                              </div>
                            </div> */}
                                {/* <div className="mob_Amount"> */}
                                {/* <div className="mob_rupi_icon">
                              <div><FaIndianRupeeSign size={20} /></div>
                              <div className="mob_amount">{item?.fF || "N/A"}</div>
                              {item?.airIQPrice && (
                                <div className="mob_amount"><FaIndianRupeeSign size={16} /> {item?.airIQPrice}</div>
                              )}
                            </div> */}
                                {login ? (
                                  <div className="d-flex gap-2 w-100 justify-content-between resp_price_sec">
                                    {/* TravClan Book Button */}
                                    <div className="resp_book_inner_flex">
                                      <div className="resp_book_price">
                                        <FaIndianRupeeSign size={18} />{" "}
                                        {item?.fF || "N/A"}
                                      </div>
                                      <div className="resp_book_info_flex">
                                        <Link
                                          to={"/TicketBookingDetails"}
                                          state={{
                                            item: [
                                              {
                                                ...item,
                                                fareIdentifier: {
                                                  ...item.fareIdentifier,
                                                  code: "flight_Data_fare",
                                                },
                                                selectedPrice: item.fF,
                                                priceSource: "TravClan",
                                              },
                                            ],
                                            totaltraveller: totalTravellers,
                                            adulttraveler: travellers.adult,
                                            childtraveler: travellers.child,
                                            infanttraveler: travellers.infant,
                                            ticket_id: item.rI,
                                            selected: selected,
                                            getCondition: getCondition,
                                          }}
                                          className="bookBtn2_mob"
                                          style={{ marginTop: "0px" }}
                                          onClick={() => {
                                            const updatedItem = {
                                              ...item,
                                              fareIdentifier: {
                                                ...item.fareIdentifier,
                                                code: "flight_Data_fare",
                                              },
                                              selectedPrice: item.fF,
                                              priceSource: "TravClan",
                                            };
                                            if (selectedOption.id === 1) {
                                              console.log(
                                                `Navigating to TicketBookingDetails for TravClan flight: ${item.rI}, fareIdentifier.code: flight_Data_fare`
                                              );
                                            } else {
                                              setFlightData(updatedItem);
                                              setIndex(index);
                                              handleReturnFlightTabChange(1);
                                              console.log(
                                                `Selecting TravClan flight: ${item.rI}, fareIdentifier.code: flight_Data_fare`
                                              );
                                              setResultIndex([item?.rI]);
                                            }
                                          }}
                                        >
                                          {selectedOption.id === 2 ? (
                                            resultIndex.includes(item?.rI) ? (
                                              "Selected"
                                            ) : (
                                              "Select TravClan"
                                            )
                                          ) : (
                                            <>
                                              Book
                                              {/* <FaIndianRupeeSign size={14} />{" "}
                                          {item?.fF || "N/A"} */}
                                            </>
                                          )}
                                        </Link>
                                        {/* TravClan Book Button */}
                                        <div
                                          className=""
                                          onClick={() => {
                                            setFlightProName("travclan");
                                            openModal(item);
                                          }}
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: "#ffe8d6",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            border: "1px solid #ffd4b3",
                                          }}
                                        >
                                          <span>
                                            <IoInformationCircleOutline
                                              color="#ff690f"
                                              size={18}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <Link
                                    onClick={() =>
                                      alert(
                                        "Please log in to proceed with booking."
                                      )
                                    }
                                    className="bookBtn2_mob"
                                    style={{ marginTop: "0px" }}
                                  >
                                    Book
                                  </Link>
                                )}
                                {/* </div> */}
                                <div className="d-flex gap-2 w-100 justify-content-between resp_price_sec">
                                  <div className="resp_book_inner_flex resp_book_inner_flex2">
                                    {item?.airIQPrice && (
                                      <div className="resp_book_price">
                                        <FaIndianRupeeSign size={18} />{" "}
                                        {item?.airIQPrice || "N/A"}
                                      </div>
                                    )}

                                    <div className="resp_book_info_flex">
                                      {/* AirIQ Book Button */}
                                      {item?.airIQPrice && (
                                        <Link
                                          to={"/TicketBookingDetails"}
                                          state={{
                                            item: [
                                              {
                                                ...item,
                                                fareIdentifier: {
                                                  ...item.fareIdentifier,
                                                  code: "airIQ_fare",
                                                },
                                                rI: item.airIQTicketId,
                                                selectedPrice: item.airIQPrice,
                                                priceSource: "AirIQ",
                                              },
                                            ],
                                            totaltraveller: totalTravellers,
                                            adulttraveler: travellers.adult,
                                            childtraveler: travellers.child,
                                            infanttraveler: travellers.infant,
                                            ticket_id: item.airIQTicketId,
                                            selected: selected,
                                            getCondition: getCondition,
                                          }}
                                          className="bookBtn2_mob"
                                          style={{ marginTop: "0px" }}
                                          onClick={() => {
                                            const updatedItem = {
                                              ...item,
                                              fareIdentifier: {
                                                ...item.fareIdentifier,
                                                code: "airIQ_fare",
                                              },
                                              rI: item.airIQTicketId,
                                              selectedPrice: item.airIQPrice,
                                              priceSource: "AirIQ",
                                            };
                                            if (selectedOption.id === 1) {
                                              console.log(
                                                `Navigating to TicketBookingDetails for AirIQ flight: ${item.airIQTicketId}, fareIdentifier.code: airIQ_fare`
                                              );
                                            } else {
                                              setFlightData(updatedItem);
                                              setIndex(index);
                                              handleReturnFlightTabChange(1);
                                              console.log(
                                                `Selecting AirIQ flight: ${item.airIQTicketId}, fareIdentifier.code: airIQ_fare`
                                              );
                                              setResultIndex([
                                                item?.airIQTicketId,
                                              ]);
                                            }
                                          }}
                                        >
                                          {selectedOption.id === 2 ? (
                                            resultIndex.includes(
                                              item?.airIQTicketId
                                            ) ? (
                                              "Selected"
                                            ) : (
                                              "Select AirIQ"
                                            )
                                          ) : (
                                            <>Book</>
                                          )}
                                        </Link>
                                      )}

                                      {item?.airIQPrice && (
                                        <div
                                          className=""
                                          onClick={() => {
                                            setFlightProName("airiq");
                                            openModal(item);
                                          }}
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: "#ffe8d6",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            border: "1px solid #ffd4b3",
                                          }}
                                        >
                                          <span>
                                            <IoInformationCircleOutline
                                              color="#ff690f"
                                              size={18}
                                            />
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    });
                  }

                  // Case 2: Filters applied but no results
                  if (filtered === true && filteredFlights?.length === 0) {
                    return (
                      <div className="no-flight-message text-center mt-3">
                        <h5>😕 No flights found</h5>
                        <p>
                          Based on your selected filters, there are currently no
                          flights available.
                        </p>
                      </div>
                    );
                  }

                  // Case 3: No filters applied → show original data
                  if (paginatedFlights?.length > 0) {
                    const flightsSorted = [...paginatedFlights].sort((a, b) => {
                      const stopsA = (a?.sg?.length ?? 1) - 1;
                      const stopsB = (b?.sg?.length ?? 1) - 1;
                      return stopsA - stopsB;
                    });
                    return flightsSorted.map((item, index) => {
                      const globalIndex =
                        (currentPage - 1) * itemsPerPage + index;
                      const firstSeg = item?.sg?.[0];
                      const lastSeg = item?.sg?.[item?.sg?.length - 1];
                      const departureMoment =
                        firstSeg?.or?.dT && moment(firstSeg.or.dT).isValid()
                          ? moment(firstSeg.or.dT)
                          : null;
                      const arrivalMoment =
                        lastSeg?.ds?.aT && moment(lastSeg.ds.aT).isValid()
                          ? moment(lastSeg.ds.aT)
                          : null;
                      const totalMinutes =
                        departureMoment && arrivalMoment
                          ? arrivalMoment.diff(departureMoment, "minutes")
                          : firstSeg?.dr ?? 0;
                      const totalHours =
                        totalMinutes >= 0 ? Math.floor(totalMinutes / 60) : 0;
                      const totalRemainingMin =
                        totalMinutes >= 0 ? totalMinutes % 60 : 0;
                      const className =
                        classes?.find((cls) => cls.id === item.sg?.[0]?.cC)
                          ?.name || "Unknown Class";
                      const fareIdentifier =
                        item.fareIdentifier?.name || "Standard Fare";
                      const colorCode =
                        item.fareIdentifier?.colorCode || "#3b82f6";
                      const cardStyle = {
                        "--accent-color": colorCode,
                      };

                      return (
                        <>
                          <div className="flightsavailable2" key={globalIndex}>
                            <div className="row gap-3 align-items-center">
                              <div className="col-12 col-lg-8 justify-content-space-between">
                                <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                                  <div className="airlinename col-12 col-lg-3">
                                    <div>
                                      {(() => {
                                        const airline = item?.sg[0]?.al?.alN;

                                        return airline === "IndiGo Airlines" ||
                                          airline === "Indigo" ? (
                                          <img
                                            src={images.IndiGoAirlines_logo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Neos" ? (
                                          <img
                                            src={images.neoslogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "SpiceJet" ||
                                          airline === "Spicejet" ? (
                                          <img
                                            src={images.spicejet}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Air India" ? (
                                          <img
                                            src={images.airindialogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Akasa Air" ? (
                                          <img
                                            src={images.akasalogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Etihad" ? (
                                          <img
                                            src={images.etihadlogo}
                                            style={{
                                              backgroundColor: "#fff",
                                              padding: "5px",
                                              borderRadius: "5px",
                                            }}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Vistara" ? (
                                          <img
                                            src={images.vistaralogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "AirAsia X" ? (
                                          <img
                                            src={images.airasiax}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "AirAsia" ? (
                                          <img
                                            src={images.airasia}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Azul" ? (
                                          <img
                                            src={images.azul}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Air India Express" ? (
                                          <img
                                            src={images.Air_India_Express_logo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Emirates Airlines" ? (
                                          <img
                                            src={images.emirateslogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Oman Air" ? (
                                          <img
                                            src={images.omanairlogo}
                                            className="airline_logo2"
                                          />
                                        ) : airline === "Srilankan Airlines" ? (
                                          <img
                                            src={images.srilankan}
                                            className="airline_logo2"
                                          />
                                        ) : (
                                          <IoAirplaneSharp
                                            size={40}
                                            color="black"
                                          />
                                        );
                                      })()}
                                    </div>

                                    <div className="planecomp2">
                                      {item.sg[0]?.al?.alN || "N/A"}
                                    </div>
                                  </div>
                                  <div className="flight-details2 col-12 col-lg-6 justify-content-center">
                                    {/* Departure (first segment) */}
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {departureMoment
                                          ? moment(departureMoment).format(
                                              "hh:mm A"
                                            )
                                          : "N/A"}
                                      </h5>
                                      <h5 className="airportname2">
                                        {item?.sg[0]?.or?.aC || "N/A"}
                                      </h5>
                                      <p className="alldate2">
                                        {departureMoment
                                          ? moment(departureMoment).format(
                                              "DD-MM-YYYY"
                                            )
                                          : "N/A"}
                                      </p>
                                    </div>

                                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                                      <span className="text-dark">From</span>
                                      <div className="from-to text-center">
                                        {/* Total journey duration = last arrival - first departure */}
                                        <h6 className="text-dark">
                                          {totalMinutes >= 0
                                            ? `${totalHours}h ${totalRemainingMin}m`
                                            : "N/A"}
                                        </h6>

                                        <img
                                          src={images.invertedviman}
                                          alt=""
                                          className="imagerouteplane"
                                        />

                                        {/* Show stops dynamically */}
                                        <h6 className="text-dark mt-1">
                                          {item?.sg?.length === 1
                                            ? "Non Stop"
                                            : `${item?.sg.length - 1} Stop${
                                                item?.sg.length - 1 > 1
                                                  ? "s"
                                                  : ""
                                              }`}
                                        </h6>
                                      </div>
                                      <span className="text-dark">To</span>
                                    </div>

                                    {/* Arrival (last segment) */}
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {arrivalMoment
                                          ? moment(arrivalMoment).format(
                                              "hh:mm A"
                                            )
                                          : "N/A"}
                                      </h5>
                                      <h5 className="airportname2">
                                        {item?.sg[item?.sg.length - 1]?.ds
                                          ?.aC || "N/A"}
                                      </h5>
                                      <p className="alldate2">
                                        {arrivalMoment
                                          ? moment(arrivalMoment).format(
                                              "DD-MM-YYYY"
                                            )
                                          : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-center justify-content-lg-between my-3">
                                  <div>
                                    <div className="d-flex gap-1 mx-3 d-none">
                                      <div
                                        className="clickherebtn"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target={`#flightDrawer-${globalIndex}`}
                                        aria-controls="flightDrawer"
                                        onClick={() => FareRuleGet(item?.rI)}
                                      >
                                        Click here
                                      </div>
                                      <div className="">
                                        to know more about flight
                                      </div>
                                    </div>
                                    <div
                                      className="offcanvas offcanvas-start"
                                      tabIndex="-1"
                                      id={`flightDrawer-${globalIndex}`}
                                      aria-labelledby={`flightDrawerLabel-${globalIndex}`}
                                    >
                                      <div className="offcanvas-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="offcanvas"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="offcanvas-body">
                                        <div className="fs-3">
                                          Flight Details
                                        </div>
                                        <div className="fw-bold fs-5 mt-3">
                                          Departure Flight
                                        </div>
                                        {flightProName === "travclan" ? (
                                          <>
                                            <div>
                                              <Chip
                                                label={
                                                  item?.iR === true
                                                    ? "Refundable"
                                                    : "Non-Refundable"
                                                }
                                                variant="outlined"
                                                sx={{
                                                  color:
                                                    item?.iR === true
                                                      ? "green"
                                                      : "gray",
                                                  backgroundColor:
                                                    item?.iR === true
                                                      ? "#e0f7e9"
                                                      : "inherit",
                                                  borderColor:
                                                    item?.iR === true
                                                      ? "#4caf50"
                                                      : "inherit",
                                                }}
                                              />
                                            </div>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        <div className="container my-3">
                                          <div className="flight-cardok shadow-sm rounded">
                                            {/* Date Header */}
                                            <div className="p-2 date_divok fw-semibold border-bottom">
                                              {departureMoment
                                                ? moment(
                                                    firstSeg?.or?.dT
                                                  ).format("ddd, DD MMM")
                                                : "N/A"}
                                            </div>

                                            {/* Main Content */}
                                            <div className="p-3">
                                              <div className="d-flex justify-content-between align-items-center mb-2">
                                                {/* Origin (first segment origin) */}
                                                <div className="text-center">
                                                  <h4 className="text-success fw-bold m-0">
                                                    {firstSeg?.or?.aC || "N/A"}
                                                  </h4>
                                                  <small className="text-muted">
                                                    {firstSeg?.or?.cN || "N/A"}
                                                  </small>
                                                </div>

                                                {/* Total Duration & Stops (calculated across full journey) */}
                                                <div className="text-center">
                                                  <div className="fw-semibold">
                                                    {totalMinutes >= 0
                                                      ? `${totalHours}h ${totalRemainingMin}m`
                                                      : "N/A"}
                                                  </div>
                                                  <small className="text-muted">
                                                    {item?.sg?.length === 1
                                                      ? "Non Stop"
                                                      : `${
                                                          item?.sg?.length - 1
                                                        } Stop${
                                                          item?.sg?.length - 1 >
                                                          1
                                                            ? "s"
                                                            : ""
                                                        }`}
                                                  </small>
                                                </div>

                                                {/* Destination (last segment destination) */}
                                                <div className="text-center">
                                                  <h4 className="text-success fw-bold m-0">
                                                    {lastSeg?.ds?.aC || "N/A"}
                                                  </h4>
                                                  <small className="text-muted">
                                                    {lastSeg?.ds?.cN || "N/A"}
                                                  </small>
                                                </div>
                                              </div>

                                              {/* Flight No + Check-in */}
                                              <div className="d-flex justify-content-between text-muted small my-3">
                                                <div>
                                                  ✈️{" "}
                                                  {firstSeg?.al?.alC || "N/A"}{" "}
                                                  {firstSeg?.al?.fN || "N/A"}
                                                  {item?.sg?.length > 1 && (
                                                    <span className="ms-2 text-muted">
                                                      +{item.sg.length - 1} more
                                                      leg
                                                      {item.sg.length - 1 > 1
                                                        ? "s"
                                                        : ""}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Timeline */}
                                              <div className="timeline">
                                                {item?.sg?.map((seg, idx) => (
                                                  <div key={idx}>
                                                    <div className="timeline-item">
                                                      <div className="fw-bold">
                                                        {seg?.or?.dT &&
                                                        moment(
                                                          seg.or.dT
                                                        ).isValid()
                                                          ? moment(
                                                              seg.or.dT
                                                            ).format("hh:mm A")
                                                          : "N/A"}
                                                      </div>
                                                      <div>
                                                        {seg?.or?.aC || "N/A"} -{" "}
                                                        {seg?.or?.aN || "N/A"}
                                                      </div>
                                                    </div>

                                                    <div className="timeline-item my-3">
                                                      <div className="text-muted">
                                                        Travel Time{" "}
                                                        {seg?.dr >= 0
                                                          ? `${Math.floor(
                                                              moment
                                                                .duration(
                                                                  seg.dr,
                                                                  "minutes"
                                                                )
                                                                .asHours()
                                                            )}h ${moment
                                                              .duration(
                                                                seg.dr,
                                                                "minutes"
                                                              )
                                                              .minutes()}m`
                                                          : "N/A"}
                                                      </div>
                                                    </div>

                                                    <div className="timeline-item">
                                                      <div className="fw-bold">
                                                        {seg?.ds?.aT &&
                                                        moment(
                                                          seg.ds.aT
                                                        ).isValid()
                                                          ? moment(
                                                              seg.ds.aT
                                                            ).format("hh:mm A")
                                                          : "N/A"}
                                                      </div>
                                                      <div>
                                                        {seg?.ds?.aC || "N/A"} -{" "}
                                                        {seg?.ds?.aN || "N/A"}
                                                        {seg?.ds?.tr
                                                          ? ` - ${seg.ds.tr}`
                                                          : ""}
                                                      </div>
                                                    </div>

                                                    {/* Technical Stop Section */}

                                                    {seg?.sO && (
                                                      <div className="timeline-item my-2">
                                                        <div
                                                          className="alert alert-info p-2"
                                                          style={{
                                                            fontSize: "0.85rem",
                                                          }}
                                                        >
                                                          <div className="d-flex align-items-center gap-2 mb-1">
                                                            <span className="badge bg-info">
                                                              ⚠️ Technical Stop
                                                            </span>
                                                          </div>
                                                          <div className="ms-2">
                                                            <div>
                                                              <strong>
                                                                Stop at:
                                                              </strong>{" "}
                                                              {seg.sP || "N/A"}
                                                            </div>
                                                            <div>
                                                              <strong>
                                                                Arrival:
                                                              </strong>{" "}
                                                              {seg.sPAT &&
                                                              moment(
                                                                seg.sPAT
                                                              ).isValid()
                                                                ? moment(
                                                                    seg.sPAT
                                                                  ).format(
                                                                    "hh:mm A, DD MMM"
                                                                  )
                                                                : "N/A"}
                                                            </div>
                                                            <div>
                                                              <strong>
                                                                Departure:
                                                              </strong>{" "}
                                                              {seg.sPDT &&
                                                              moment(
                                                                seg.sPDT
                                                              ).isValid()
                                                                ? moment(
                                                                    seg.sPDT
                                                                  ).format(
                                                                    "hh:mm A, DD MMM"
                                                                  )
                                                                : "N/A"}
                                                            </div>
                                                            <div>
                                                              <strong>
                                                                Duration:
                                                              </strong>{" "}
                                                              {seg.sD
                                                                ? `${Math.floor(
                                                                    seg.sD / 60
                                                                  )}h ${
                                                                    seg.sD % 60
                                                                  }m`
                                                                : "N/A"}
                                                            </div>
                                                            <small className="text-muted">
                                                              * Aircraft will
                                                              make a technical
                                                              stop. Passengers
                                                              may remain on
                                                              board.
                                                            </small>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {idx <
                                                      item.sg.length - 1 && (
                                                      <div className="timeline-item my-2">
                                                        <span className="badge bg-warning text-dark">
                                                          Layover at{" "}
                                                          {seg?.ds?.aN || "N/A"}{" "}
                                                          <br />(
                                                          {seg?.ds?.aT &&
                                                          moment(
                                                            seg.ds.aT
                                                          ).isValid()
                                                            ? moment(
                                                                seg.ds.aT
                                                              ).format(
                                                                "hh:mm A"
                                                              )
                                                            : "N/A"}{" "}
                                                          →
                                                          {item.sg[idx + 1]?.or
                                                            ?.dT &&
                                                          moment(
                                                            item.sg[idx + 1].or
                                                              .dT
                                                          ).isValid()
                                                            ? moment(
                                                                item.sg[idx + 1]
                                                                  .or.dT
                                                              ).format(
                                                                "hh:mm A"
                                                              )
                                                            : "N/A"}
                                                          )
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Technical Stops Summary Section */}
                                        {flightProName === "travclan" ? (
                                          <>
                                            <div className="fw-bold fs-5 mt-3">
                                              Technical Stops
                                            </div>
                                            <div className="container my-3">
                                              <div className="flight-cardok p-3 shadow-sm rounded">
                                                {item?.sg?.some(
                                                  (seg) => seg.sO
                                                ) ? (
                                                  <div>
                                                    <div
                                                      className="alert alert-warning mb-3"
                                                      role="alert"
                                                    >
                                                      <h6 className="alert-heading mb-2">
                                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                        This flight includes
                                                        technical stops
                                                      </h6>
                                                      <p className="mb-0 small">
                                                        Technical stops are
                                                        brief stops made by
                                                        aircraft for operational
                                                        reasons such as
                                                        refueling or crew
                                                        changes. Passengers
                                                        typically remain on
                                                        board during these
                                                        stops.
                                                      </p>
                                                    </div>

                                                    {item.sg.map(
                                                      (seg, idx) =>
                                                        seg.sO && (
                                                          <div
                                                            key={idx}
                                                            className="border rounded p-2 mb-2 bg-light"
                                                          >
                                                            <div className="row">
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Stop Location
                                                                </small>
                                                                <div className="fw-semibold">
                                                                  {seg.sP ||
                                                                    "N/A"}
                                                                </div>
                                                              </div>
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Stop Duration
                                                                </small>
                                                                <div className="fw-semibold">
                                                                  {seg.sD
                                                                    ? `${Math.floor(
                                                                        seg.sD /
                                                                          60
                                                                      )}h ${
                                                                        seg.sD %
                                                                        60
                                                                      }m`
                                                                    : "N/A"}
                                                                </div>
                                                              </div>
                                                            </div>
                                                            <div className="row mt-2">
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Arrival at
                                                                  Stop
                                                                </small>
                                                                <div>
                                                                  {seg.sPAT &&
                                                                  moment(
                                                                    seg.sPAT
                                                                  ).isValid()
                                                                    ? moment(
                                                                        seg.sPAT
                                                                      ).format(
                                                                        "hh:mm A, DD MMM YYYY"
                                                                      )
                                                                    : "N/A"}
                                                                </div>
                                                              </div>
                                                              <div className="col-md-6">
                                                                <small className="text-muted">
                                                                  Departure from
                                                                  Stop
                                                                </small>
                                                                <div>
                                                                  {seg.sPDT &&
                                                                  moment(
                                                                    seg.sPDT
                                                                  ).isValid()
                                                                    ? moment(
                                                                        seg.sPDT
                                                                      ).format(
                                                                        "hh:mm A, DD MMM YYYY"
                                                                      )
                                                                    : "N/A"}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="text-center py-3">
                                                    <div className="text-success mb-2">
                                                      <i
                                                        className="bi bi-check-circle-fill"
                                                        style={{
                                                          fontSize: "2rem",
                                                        }}
                                                      ></i>
                                                    </div>
                                                    <h6 className="text-muted mb-0">
                                                      No Technical Stops
                                                    </h6>
                                                    <small className="text-muted">
                                                      This flight operates
                                                      without any technical
                                                      stops
                                                    </small>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        <div className="fw-bold fs-5 mt-3">
                                          Fare Details
                                        </div>
                                        <div className="container my-3">
                                          <div className="flight-cardok p-2 shadow-sm rounded">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                              <div>
                                                <BsFillHandbagFill
                                                  color="orangered"
                                                  size={15}
                                                />
                                              </div>
                                              <div
                                                style={{
                                                  lineHeight: 1,
                                                  fontSize: "0.80rem",
                                                }}
                                              >
                                                {flightProName ===
                                                "travclan" ? (
                                                  <>
                                                    {item.baggage?.travclan
                                                      ?.cabin || "N/A"}{" "}
                                                    Cabin Baggage
                                                  </>
                                                ) : flightProName ===
                                                  "airiq" ? (
                                                  <>
                                                    {item.baggage?.airiq
                                                      ?.cabin || "N/A"}{" "}
                                                    Cabin Baggage
                                                  </>
                                                ) : (
                                                  <>
                                                    {item.baggage?.travclan
                                                      ?.cabin || "N/A"}{" "}
                                                    |
                                                    {item.baggage?.airiq
                                                      ?.cabin || "N/A"}
                                                  </>
                                                )}
                                              </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <BsFillLuggageFill
                                                  color="orangered"
                                                  size={15}
                                                />
                                              </div>
                                              <div
                                                style={{
                                                  lineHeight: 1,
                                                  fontSize: "0.75rem",
                                                }}
                                              >
                                                {flightProName ===
                                                "travclan" ? (
                                                  <>
                                                    {item.baggage?.travclan
                                                      ?.checkIn || "N/A"}{" "}
                                                    Check-in Baggage
                                                  </>
                                                ) : flightProName ===
                                                  "airiq" ? (
                                                  <>
                                                    {item.baggage?.airiq
                                                      ?.checkIn || "N/A"}{" "}
                                                    Check-in Baggage
                                                  </>
                                                ) : (
                                                  <>
                                                    TravClan:{" "}
                                                    {item.baggage?.travclan
                                                      ?.checkIn || "N/A"}{" "}
                                                    | AirIQ:{" "}
                                                    {item.baggage?.airiq
                                                      ?.checkIn || "N/A"}
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                            {flightProName === "travclan" ? (
                                              <>
                                                <div className="mt-3">
                                                  <h6 className="fw-bold">
                                                    Fare Rules
                                                  </h6>
                                                  {fare_rules_Loading ? (
                                                    <Box sx={{ width: "100%" }}>
                                                      <Skeleton
                                                        variant="text"
                                                        height={20}
                                                      />
                                                      <Skeleton
                                                        variant="text"
                                                        height={20}
                                                      />
                                                      <Skeleton
                                                        variant="text"
                                                        height={20}
                                                      />
                                                    </Box>
                                                  ) : (
                                                    <div
                                                      style={{
                                                        fontSize: "0.8rem",
                                                        lineHeight: 1.4,
                                                      }}
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          fare_rules[0]
                                                            ?.fareRuleDetail,
                                                      }}
                                                    />
                                                  )}
                                                </div>
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="flight-class-card d-none"
                                    style={cardStyle}
                                  >
                                    <div className="class-info">
                                      <div className="class-icon">
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                        </svg>
                                      </div>
                                      <div className="class-details">
                                        <h3 className="class-name">
                                          {className}
                                        </h3>
                                        <p className="fare-identifier">
                                          {fareIdentifier}
                                        </p>
                                      </div>
                                      <div className="class-badge">
                                        {className?.split(" ")[0] || "CLASS"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-3 mb-3 mb-lg-0">
                                <div
                                  className="d-flex gap-3"
                                  style={{
                                    alignItems: "stretch",
                                    justifyContent: "center",
                                    gap: "0.7rem",
                                  }}
                                >
                                  {(() => {
                                    // Determine cheapest price
                                    const getCheapestPrice = () => {
                                      if (item.isAirIQOnly) {
                                        return {
                                          price: item.airIQPrice,
                                          source: "AirIQ",
                                          id: item.airIQTicketId,
                                          fareCode: "airIQ_fare",
                                          isAirIQ: true,
                                        };
                                      } else {
                                        const travclanPrice = item.fF;
                                        const airiqPrice = item.airIQPrice;

                                        if (
                                          airiqPrice &&
                                          airiqPrice < travclanPrice
                                        ) {
                                          return {
                                            price: airiqPrice,
                                            source: "AirIQ",
                                            id: item.airIQTicketId,
                                            fareCode: "airIQ_fare",
                                            isAirIQ: true,
                                          };
                                        } else {
                                          return {
                                            price: travclanPrice,
                                            source: "TravClan",
                                            id: item.rI,
                                            fareCode: item.fareIdentifier?.code,
                                            isAirIQ: false,
                                          };
                                        }
                                      }
                                    };

                                    const cheapestPrice = getCheapestPrice();
                                    const otherPrices = [];

                                    // Add other prices if not AirIQ only
                                    if (!item.isAirIQOnly) {
                                      if (cheapestPrice.source !== "TravClan") {
                                        otherPrices.push({
                                          price: item.fF,
                                          source: "TravClan",
                                          id: item.rI,
                                          fareCode: item.fareIdentifier?.code,
                                          isAirIQ: false,
                                        });
                                      }
                                      if (
                                        item.airIQPrice &&
                                        cheapestPrice.source !== "AirIQ"
                                      ) {
                                        otherPrices.push({
                                          price: item.airIQPrice,
                                          source: "AirIQ",
                                          id: item.airIQTicketId,
                                          fareCode: "airIQ_fare",
                                          isAirIQ: true,
                                        });
                                      }
                                    }

                                    // Calculate max price to show savings
                                    const maxPrice = Math.max(
                                      item.fF || 0,
                                      item.airIQPrice || 0
                                    );
                                    const savings =
                                      maxPrice - cheapestPrice.price;

                                    return (
                                      <>
                                        {/* Best Deal Card - Professional Design */}
                                        <div
                                          style={{
                                            position: "relative",
                                            background: "#fff",
                                            borderRadius: "16px",
                                            boxShadow:
                                              "0 4px 12px rgba(0,0,0,0.08)",
                                            border: "2px solid #ff690f",
                                            flex: "0 0 180px",
                                            overflow: "hidden",
                                            transition: "all 0.3s ease",
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow =
                                              "0 8px 20px rgba(0,0,0,0.12)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow =
                                              "0 4px 12px rgba(0,0,0,0.08)";
                                          }}
                                        >
                                          {/* Best Deal Badge - Fixed Height */}
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "0",
                                              right: "0",
                                              background:
                                                "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                                              color: "#000",
                                              padding: "6px 12px",
                                              borderBottomLeftRadius: "12px",
                                              fontSize: "10px",
                                              fontWeight: "bold",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                              boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.15)",
                                              zIndex: 10,
                                              height: "28px",
                                            }}
                                          >
                                            ⚡ BEST DEAL
                                          </div>

                                          {/* Card Content */}
                                          <div
                                            style={{
                                              paddingTop: "40px",
                                              paddingBottom: "15px",
                                              paddingLeft: "12px",
                                              paddingRight: "12px",
                                              textAlign: "center",
                                              flex: "1",
                                              display: "flex",
                                              flexDirection: "column",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            {/* Price Section - Fixed Height */}
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                              }}
                                            >
                                              {/* Price */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "flex-start",
                                                  justifyContent: "center",
                                                  gap: "4px",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    color: "#6b7280",
                                                    fontSize: "28px",
                                                    marginTop: "4px",
                                                  }}
                                                >
                                                  ₹
                                                </span>
                                                <span
                                                  style={{
                                                    fontSize: "30px",
                                                    fontWeight: "bold",
                                                    color: "#111827",
                                                  }}
                                                >
                                                  {cheapestPrice.price?.toLocaleString(
                                                    "en-IN"
                                                  ) || "N/A"}
                                                </span>
                                              </div>

                                              {/* Savings Display - Fixed Height */}
                                              {savings > 0 && (
                                                <div
                                                  style={{
                                                    fontSize: "12px",
                                                    color: "#10b981",
                                                    marginTop: "4px",
                                                    fontWeight: "600",
                                                    height: "18px",
                                                  }}
                                                >
                                                  Save ₹
                                                  {savings.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </div>
                                              )}
                                              {/* {savings === 0 && (
                                                <div
                                                  style={{
                                                    height: "18px",
                                                    marginTop: "4px",
                                                  }}
                                                ></div>
                                              )} */}

                                              {/* Economy */}
                                              <span
                                                style={{
                                                  fontSize: "14px",
                                                  color: "#6b7280",
                                                  marginTop: "0px",
                                                  marginBottom: "0.5rem",
                                                }}
                                              >
                                                {className}
                                              </span>
                                            </div>

                                            {/* Button Section */}
                                            <div>
                                              {/* Book Button */}
                                              {login ? (
                                                <div
                                                  style={{
                                                    cursor:
                                                      selectedOption.id === 2 &&
                                                      resultIndex.includes(
                                                        cheapestPrice.id
                                                      )
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    textAlign: "center",
                                                    transition: "all 0.2s ease",
                                                    background:
                                                      selectedOption.id === 2 &&
                                                      resultIndex.includes(
                                                        cheapestPrice.id
                                                      )
                                                        ? "green"
                                                        : "linear-gradient(135deg, #ff690f 0%, #e8381b 100%)",
                                                    color: "#fff",
                                                    border: "none",
                                                    marginBottom: "12px",
                                                  }}
                                                  onClick={() => {
                                                    const updatedItem =
                                                      cheapestPrice.isAirIQ
                                                        ? [
                                                            {
                                                              ...item,
                                                              fareIdentifier: {
                                                                ...item.fareIdentifier,
                                                                code: "airIQ_fare",
                                                              },
                                                              rI: item.airIQTicketId,
                                                              selectedPrice:
                                                                cheapestPrice.price,
                                                              priceSource:
                                                                "AirIQ",
                                                            },
                                                          ]
                                                        : [
                                                            {
                                                              ...item,
                                                              selectedPrice:
                                                                cheapestPrice.price,
                                                              priceSource:
                                                                "TravClan",
                                                            },
                                                          ];

                                                    if (
                                                      selectedOption.id === 1
                                                    ) {
                                                      setIndex(index);
                                                      if (
                                                        cheapestPrice.isAirIQ
                                                      ) {
                                                        localStorage.removeItem(
                                                          "itineraryCode"
                                                        );
                                                        navigate(
                                                          "/TicketBookingDetails",
                                                          {
                                                            state: {
                                                              item: updatedItem,
                                                              totaltraveller:
                                                                totalTravellers,
                                                              adulttraveler:
                                                                travellers.adult,
                                                              childtraveler:
                                                                travellers.child,
                                                              infanttraveler:
                                                                travellers.infant,
                                                              selected:
                                                                selected,
                                                            },
                                                          }
                                                        );
                                                      } else {
                                                        setResultIndex(
                                                          (prev) => [
                                                            ...prev,
                                                            item?.rI,
                                                          ]
                                                        );
                                                        ItineraryCreateNew(
                                                          [
                                                            ...resultIndex,
                                                            item?.rI,
                                                          ],
                                                          updatedItem
                                                        );
                                                      }
                                                    } else if (
                                                      selectedOption.id === 2
                                                    ) {
                                                      if (
                                                        resultIndex.includes(
                                                          cheapestPrice.id
                                                        )
                                                      ) {
                                                      } else {
                                                        setFlightData(
                                                          updatedItem
                                                        );
                                                        setIndex(index);
                                                        setResultIndex([
                                                          cheapestPrice.id,
                                                        ]);
                                                        handleReturnFlightTabChange(
                                                          1
                                                        );
                                                      }
                                                    }
                                                  }}
                                                >
                                                  {itinerary_loading &&
                                                  index === getindex &&
                                                  !cheapestPrice.isAirIQ
                                                    ? "Loading..."
                                                    : selectedOption.id === 2
                                                    ? resultIndex.includes(
                                                        cheapestPrice.id
                                                      )
                                                      ? "Selected"
                                                      : "Select"
                                                    : "Book Now"}
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    alert(
                                                      "Please log in to proceed with booking."
                                                    )
                                                  }
                                                  style={{
                                                    cursor: "pointer",
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    textAlign: "center",
                                                    background:
                                                      "linear-gradient(135deg, #ff690f 0%, #e8381b 100%)",
                                                    color: "#fff",
                                                    border: "none",
                                                    textDecoration: "none",
                                                    display: "block",
                                                    marginBottom: "12px",
                                                  }}
                                                >
                                                  Book Now
                                                </div>
                                              )}
                                              <div
                                                data-bs-toggle="offcanvas"
                                                data-bs-target={`#flightDrawer-${globalIndex}`}
                                                aria-controls="flightDrawer"
                                                onClick={() => {
                                                  FareRuleGet(item?.rI);
                                                  setFlightProName("travclan");
                                                }}
                                                style={{
                                                  color: "#ff690f",
                                                  fontWeight: "600",
                                                  fontSize: "14px",
                                                  textAlign: "center",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                View Flight Details
                                              </div>
                                              <div className="d-flex align-items-baseline gap-1 mt-2 mb-1">
                                                <BsFillHandbagFill
                                                  color="orangered"
                                                  size={14}
                                                />
                                                <div
                                                  style={{
                                                    fontSize: "0.70rem",
                                                  }}
                                                >
                                                  {cheapestPrice.isAirIQ
                                                    ? (item.baggage?.airiq
                                                        ?.cabin || "N/A") +
                                                      " Cabin Baggage"
                                                    : (item.baggage?.travclan
                                                        ?.cabin ||
                                                        item.sg[0]?.cBg ||
                                                        "N/A") +
                                                      " Cabin Baggage"}
                                                </div>
                                              </div>
                                              <div className="d-flex align-items-baseline gap-1">
                                                <BsFillLuggageFill
                                                  color="orangered"
                                                  size={14}
                                                />
                                                <div
                                                  style={{
                                                    fontSize: "0.70rem",
                                                  }}
                                                >
                                                  {cheapestPrice.isAirIQ
                                                    ? (item.baggage?.airiq
                                                        ?.checkIn || "N/A") +
                                                      " Check-in Baggage"
                                                    : (item.baggage?.travclan
                                                        ?.checkIn ||
                                                        item.sg[0]?.bg ||
                                                        "N/A") +
                                                      " Check-in Baggage"}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Other Price Cards - Professional Design */}
                                        {otherPrices.map((priceInfo, idx) => (
                                          <div
                                            key={idx}
                                            style={{
                                              position: "relative",
                                              background: "#fff",
                                              borderRadius: "16px",
                                              boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.06)",
                                              border: "1px solid #e5e7eb",
                                              flex: "0 0 180px",
                                              overflow: "hidden",
                                              transition: "all 0.3s ease",
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(0,0,0,0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.boxShadow =
                                                "0 2px 8px rgba(0,0,0,0.06)";
                                            }}
                                          >
                                            {/* Empty Badge Space - Fixed Height for Alignment */}
                                            <div
                                              style={{ height: "28px" }}
                                            ></div>

                                            {/* Card Content */}
                                            <div
                                              style={{
                                                paddingTop: "16px",
                                                paddingBottom: "18px",
                                                paddingLeft: "12px",
                                                paddingRight: "12px",
                                                textAlign: "center",
                                                flex: "1",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              {/* Price Section - Fixed Height */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  justifyContent: "center",
                                                  marginBottom: "10px",
                                                }}
                                              >
                                                {/* Price */}
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    justifyContent: "center",
                                                    gap: "4px",
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      color: "#9ca3af",
                                                      fontSize: "28px",
                                                      marginTop: "4px",
                                                    }}
                                                  >
                                                    ₹
                                                  </span>
                                                  <span
                                                    style={{
                                                      fontSize: "30px",
                                                      fontWeight: "bold",
                                                      color: "#111827",
                                                    }}
                                                  >
                                                    {priceInfo.price?.toLocaleString(
                                                      "en-IN"
                                                    ) || "N/A"}
                                                  </span>
                                                </div>

                                                {/* Empty space for alignment - Fixed Height */}
                                                <div
                                                  style={{
                                                    height: "18px",
                                                    // marginTop: "4px",
                                                  }}
                                                ></div>

                                                {/* Economy */}
                                                <span
                                                  style={{
                                                    fontSize: "14px",
                                                    color: "#9ca3af",
                                                    marginTop: "0px",
                                                  }}
                                                >
                                                  {className}
                                                </span>
                                              </div>

                                              {/* Button Section */}
                                              <div>
                                                {/* Book Button */}
                                                {login ? (
                                                  <div
                                                    style={{
                                                      cursor:
                                                        selectedOption.id ===
                                                          2 &&
                                                        resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                          ? "not-allowed"
                                                          : "pointer",
                                                      width: "100%",
                                                      padding: "12px 16px",
                                                      borderRadius: "12px",
                                                      fontWeight: "600",
                                                      fontSize: "14px",
                                                      textAlign: "center",
                                                      transition:
                                                        "all 0.2s ease",
                                                      background:
                                                        selectedOption.id ===
                                                          2 &&
                                                        resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                          ? "#10b981"
                                                          : "#fff",
                                                      color:
                                                        selectedOption.id ===
                                                          2 &&
                                                        resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                          ? "#fff"
                                                          : "#374151",
                                                      border:
                                                        "2px solid #d1d5db",
                                                      marginBottom: "12px",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (
                                                        !(
                                                          selectedOption.id ===
                                                            2 &&
                                                          resultIndex.includes(
                                                            priceInfo.id
                                                          )
                                                        )
                                                      ) {
                                                        e.currentTarget.style.borderColor =
                                                          "#ff690f";
                                                        e.currentTarget.style.color =
                                                          "#ff690f";
                                                      }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      if (
                                                        !(
                                                          selectedOption.id ===
                                                            2 &&
                                                          resultIndex.includes(
                                                            priceInfo.id
                                                          )
                                                        )
                                                      ) {
                                                        e.currentTarget.style.borderColor =
                                                          "#d1d5db";
                                                        e.currentTarget.style.color =
                                                          "#374151";
                                                      }
                                                    }}
                                                    onClick={() => {
                                                      const updatedItem =
                                                        priceInfo.isAirIQ
                                                          ? [
                                                              {
                                                                ...item,
                                                                fareIdentifier:
                                                                  {
                                                                    ...item.fareIdentifier,
                                                                    code: "airIQ_fare",
                                                                  },
                                                                rI: item.airIQTicketId,
                                                                selectedPrice:
                                                                  priceInfo.price,
                                                                priceSource:
                                                                  "AirIQ",
                                                              },
                                                            ]
                                                          : [
                                                              {
                                                                ...item,
                                                                selectedPrice:
                                                                  priceInfo.price,
                                                                priceSource:
                                                                  "TravClan",
                                                              },
                                                            ];

                                                      if (
                                                        selectedOption.id === 1
                                                      ) {
                                                        setIndex(index);
                                                        if (priceInfo.isAirIQ) {
                                                          localStorage.removeItem(
                                                            "itineraryCode"
                                                          );
                                                          navigate(
                                                            "/TicketBookingDetails",
                                                            {
                                                              state: {
                                                                item: updatedItem,
                                                                totaltraveller:
                                                                  totalTravellers,
                                                                adulttraveler:
                                                                  travellers.adult,
                                                                childtraveler:
                                                                  travellers.child,
                                                                infanttraveler:
                                                                  travellers.infant,
                                                                selected:
                                                                  selected,
                                                              },
                                                            }
                                                          );
                                                          console.log(
                                                            `Navigating to TicketBookingDetails for AirIQ flight: ${item.airIQTicketId}, fareIdentifier.code: airIQ_fare`
                                                          );
                                                        } else {
                                                          console.log(
                                                            `Calling ItineraryCreateNew for TravClan flight: ${item.rI}, fareIdentifier.code: ${item.fareIdentifier?.code}`
                                                          );
                                                          setResultIndex(
                                                            (prev) => [
                                                              ...prev,
                                                              item?.rI,
                                                            ]
                                                          );
                                                          ItineraryCreateNew(
                                                            [
                                                              ...resultIndex,
                                                              item?.rI,
                                                            ],
                                                            updatedItem
                                                          );
                                                        }
                                                      } else if (
                                                        selectedOption.id === 2
                                                      ) {
                                                        if (
                                                          resultIndex.includes(
                                                            priceInfo.id
                                                          )
                                                        ) {
                                                          console.log(
                                                            `${priceInfo.source} flight ${priceInfo.id} already selected, no action taken`
                                                          );
                                                        } else {
                                                          console.log(
                                                            `Selecting ${priceInfo.source} flight: ${priceInfo.id}, fareIdentifier.code: ${priceInfo.fareCode}`
                                                          );
                                                          setFlightData(
                                                            updatedItem
                                                          );
                                                          setIndex(index);
                                                          setResultIndex([
                                                            priceInfo.id,
                                                          ]);
                                                          handleReturnFlightTabChange(
                                                            1
                                                          );
                                                        }
                                                      }
                                                    }}
                                                  >
                                                    {itinerary_loading &&
                                                    index === getindex &&
                                                    !priceInfo.isAirIQ
                                                      ? "Loading..."
                                                      : selectedOption.id === 2
                                                      ? resultIndex.includes(
                                                          priceInfo.id
                                                        )
                                                        ? "Selected"
                                                        : "Select"
                                                      : "Book Now"}
                                                  </div>
                                                ) : (
                                                  <div
                                                    onClick={() =>
                                                      alert(
                                                        "Please log in to proceed with booking."
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                      width: "100%",
                                                      padding: "12px 16px",
                                                      borderRadius: "12px",
                                                      fontWeight: "600",
                                                      fontSize: "14px",
                                                      textAlign: "center",
                                                      background: "#fff",
                                                      color: "#374151",
                                                      border:
                                                        "2px solid #d1d5db",
                                                      textDecoration: "none",
                                                      display: "block",
                                                      marginBottom: "12px",
                                                    }}
                                                  >
                                                    Book Now
                                                  </div>
                                                )}
                                                <div
                                                  data-bs-toggle="offcanvas"
                                                  data-bs-target={`#flightDrawer-${globalIndex}`}
                                                  aria-controls="flightDrawer"
                                                  onClick={() => {
                                                    FareRuleGet(item?.rI);
                                                    setFlightProName("airiq");
                                                  }}
                                                  style={{
                                                    color: "#ff690f",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  View Flight Details
                                                </div>
                                                <div className="d-flex align-items-baseline gap-1 mt-2 mb-1">
                                                  <BsFillHandbagFill
                                                    color="orangered"
                                                    size={14}
                                                  />
                                                  <div
                                                    style={{
                                                      fontSize: "0.70rem",
                                                    }}
                                                  >
                                                    {priceInfo.isAirIQ
                                                      ? (item.baggage?.airiq
                                                          ?.cabin || "N/A") +
                                                        " Cabin Baggage"
                                                      : (item.baggage?.travclan
                                                          ?.cabin ||
                                                          item.sg[0]?.cBg ||
                                                          "N/A") +
                                                        " Cabin Baggge"}
                                                  </div>
                                                </div>
                                                <div className="d-flex align-items-baseline gap-1">
                                                  <BsFillLuggageFill
                                                    color="orangered"
                                                    size={14}
                                                  />
                                                  <div
                                                    style={{
                                                      fontSize: "0.70rem",
                                                    }}
                                                  >
                                                    {priceInfo.isAirIQ
                                                      ? (item.baggage?.airiq
                                                          ?.checkIn || "N/A") +
                                                        " Check-in Baggage"
                                                      : (item.baggage?.travclan
                                                          ?.checkIn ||
                                                          item.sg[0]?.bg ||
                                                          "N/A") +
                                                        " Check-in Baggage"}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flights_available_mobile">
                            <div className="d-flex justify-content-between">
                              <div className="mobile_row">
                                <div>
                                  {(() => {
                                    const airline = item?.sg[0]?.al?.alN;

                                    return airline === "IndiGo Airlines" ||
                                      airline === "Indigo" ? (
                                      <img
                                        src={images.IndiGoAirlines_logo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Neos" ? (
                                      <img
                                        src={images.neoslogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "SpiceJet" ||
                                      airline === "Spicejet" ? (
                                      <img
                                        src={images.spicejet}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Air India" ? (
                                      <img
                                        src={images.airindialogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Akasa Air" ? (
                                      <img
                                        src={images.akasalogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Etihad" ? (
                                      <img
                                        src={images.etihadlogo}
                                        style={{
                                          backgroundColor: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                        }}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Vistara" ? (
                                      <img
                                        src={images.vistaralogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "AirAsia X" ? (
                                      <img
                                        src={images.airasiax}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "AirAsia" ? (
                                      <img
                                        src={images.airasia}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Azul" ? (
                                      <img
                                        src={images.azul}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Air India Express" ? (
                                      <img
                                        src={images.Air_India_Express_logo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Emirates Airlines" ? (
                                      <img
                                        src={images.emirateslogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Oman Air" ? (
                                      <img
                                        src={images.omanairlogo}
                                        className="airline_logo2_mob"
                                      />
                                    ) : airline === "Srilankan Airlines" ? (
                                      <img
                                        src={images.srilankan}
                                        className="airline_logo2_mob"
                                      />
                                    ) : (
                                      <IoAirplaneSharp
                                        size={40}
                                        color="white"
                                      />
                                    );
                                  })()}
                                </div>
                                <div className="mob_time_cont">
                                  <div className="mob_time_row">
                                    <div className="mob_time text-center">
                                      {departureMoment
                                        ? moment(item?.sg[0]?.or?.dT).format(
                                            "hh:mm A"
                                          )
                                        : "N/A"}
                                      <div>{item?.sg[0]?.or?.aC || "N/A"}</div>
                                    </div>
                                    <div style={{ width: "70px" }}>
                                      ----------
                                    </div>
                                    <div className="mob_time text-center">
                                      {arrivalMoment
                                        ? moment(
                                            item?.sg[item?.sg.length - 1]?.ds
                                              ?.aT
                                          ).format("hh:mm A")
                                        : "N/A"}
                                      <div>
                                        {item?.sg[item?.sg.length - 1]?.ds
                                          ?.aC || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mob_time_row justify-content-between">
                                    <div className="mob_city_kode">
                                      {" "}
                                      {item?.sg?.[0]?.or?.dT
                                        ? new Date(
                                            item.sg[0].or.dT
                                          ).toLocaleDateString("en-GB") // shows DD/MM/YYYY
                                        : "N/A"}
                                    </div>
                                    <div className="mob_duration">
                                      {totalMinutes >= 0
                                        ? `${totalHours}h ${totalRemainingMin}m`
                                        : "N/A"}
                                    </div>
                                    <div className="mob_city_kode">
                                      {" "}
                                      {item?.sg?.[item?.sg?.length - 1]?.ds?.aT
                                        ? new Date(
                                            item.sg[item.sg.length - 1].ds.aT
                                          ).toLocaleDateString("en-GB")
                                        : "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                borderTop: "1px solid #ccc",
                                marginTop: "1rem",
                              }}
                            />

                            <div className="mob_book_btn_main">
                              <div className="d-flex align-items-center justify-content-center justify-content-lg-start w-100 flex-column">
                                {/* <div className="flight-info-container">
                              <div className="flight-info-btn" onClick={() => openModal(item)}>
                                <BsInfoCircle size={18} />
                                <span className="flight-info-text">Flight Info</span>
                              </div>
                            </div> */}
                                {/* <div className="mob_Amount"> */}
                                {/* <div className="mob_rupi_icon">
                              <div><FaIndianRupeeSign size={20} /></div>
                              <div className="mob_amount">{item?.fF || "N/A"}</div>
                              {item?.airIQPrice && (
                                <div className="mob_amount"><FaIndianRupeeSign size={16} /> {item?.airIQPrice}</div>
                              )}
                            </div> */}
                                {login ? (
                                  <div className="d-flex gap-2 w-100 justify-content-between">
                                    {/* TravClan Book Button */}
                                    <Link
                                      to={"/TicketBookingDetails"}
                                      state={{
                                        item: [
                                          {
                                            ...item,
                                            fareIdentifier: {
                                              ...item.fareIdentifier,
                                              code: "flight_Data_fare",
                                            },
                                            selectedPrice: item.fF,
                                            priceSource: "TravClan",
                                          },
                                        ],
                                        totaltraveller: totalTravellers,
                                        adulttraveler: travellers.adult,
                                        childtraveler: travellers.child,
                                        infanttraveler: travellers.infant,
                                        ticket_id: item.rI,
                                        selected: selected,
                                        getCondition: getCondition,
                                      }}
                                      className="bookBtn2_mob"
                                      style={{ marginTop: "0px" }}
                                      onClick={() => {
                                        const updatedItem = {
                                          ...item,
                                          fareIdentifier: {
                                            ...item.fareIdentifier,
                                            code: "flight_Data_fare",
                                          },
                                          selectedPrice: item.fF,
                                          priceSource: "TravClan",
                                        };
                                        if (selectedOption.id === 1) {
                                          console.log(
                                            `Navigating to TicketBookingDetails for TravClan flight: ${item.rI}, fareIdentifier.code: flight_Data_fare`
                                          );
                                        } else {
                                          setFlightData(updatedItem);
                                          setIndex(index);
                                          handleReturnFlightTabChange(1);
                                          console.log(
                                            `Selecting TravClan flight: ${item.rI}, fareIdentifier.code: flight_Data_fare`
                                          );
                                          setResultIndex([item?.rI]);
                                        }
                                      }}
                                    >
                                      {selectedOption.id === 2 ? (
                                        resultIndex.includes(item?.rI) ? (
                                          "Selected"
                                        ) : (
                                          "Select TravClan"
                                        )
                                      ) : (
                                        <>
                                          Book <FaIndianRupeeSign size={14} />{" "}
                                          {item?.fF || "N/A"}
                                        </>
                                      )}
                                    </Link>

                                    {/* AirIQ Book Button */}
                                    {item?.airIQPrice && (
                                      <Link
                                        to={"/TicketBookingDetails"}
                                        state={{
                                          item: {
                                            ...item,
                                            fareIdentifier: {
                                              ...item.fareIdentifier,
                                              code: "airIQ_fare",
                                            },
                                            rI: item.airIQTicketId,
                                            selectedPrice: item.airIQPrice,
                                            priceSource: "AirIQ",
                                          },
                                          totaltraveller: totalTravellers,
                                          adulttraveler: travellers.adult,
                                          childtraveler: travellers.child,
                                          infanttraveler: travellers.infant,
                                          ticket_id: item.airIQTicketId,
                                          selected: selected,
                                          getCondition: getCondition,
                                        }}
                                        className="bookBtn2_mob"
                                        style={{ marginTop: "0px" }}
                                        onClick={() => {
                                          const updatedItem = {
                                            ...item,
                                            fareIdentifier: {
                                              ...item.fareIdentifier,
                                              code: "airIQ_fare",
                                            },
                                            rI: item.airIQTicketId,
                                            selectedPrice: item.airIQPrice,
                                            priceSource: "AirIQ",
                                          };
                                          if (selectedOption.id === 1) {
                                            console.log(
                                              `Navigating to TicketBookingDetails for AirIQ flight: ${item.airIQTicketId}, fareIdentifier.code: airIQ_fare`
                                            );
                                          } else {
                                            setFlightData(updatedItem);
                                            setIndex(index);
                                            handleReturnFlightTabChange(1);
                                            console.log(
                                              `Selecting AirIQ flight: ${item.airIQTicketId}, fareIdentifier.code: airIQ_fare`
                                            );
                                            setResultIndex([
                                              item?.airIQTicketId,
                                            ]);
                                          }
                                        }}
                                      >
                                        {selectedOption.id === 2 ? (
                                          resultIndex.includes(
                                            item?.airIQTicketId
                                          ) ? (
                                            "Selected"
                                          ) : (
                                            "Select AirIQ"
                                          )
                                        ) : (
                                          <>
                                            Book <FaIndianRupeeSign size={16} />{" "}
                                            {item?.airIQPrice}
                                          </>
                                        )}
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <Link
                                    onClick={() =>
                                      alert(
                                        "Please log in to proceed with booking."
                                      )
                                    }
                                    className="bookBtn2_mob"
                                    style={{ marginTop: "0px" }}
                                  >
                                    Book
                                  </Link>
                                )}
                                {/* </div> */}
                                <div className="d-flex gap-2 w-100 justify-content-between">
                                  {/* TravClan Book Button */}
                                  <div
                                    className="res_mob_view_detail_btn"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target={`#flightDrawer-${index}`}
                                    aria-controls="flightDrawer"
                                    onClick={() => {
                                      FareRuleGet(item?.rI);
                                      setFlightProName("travclan");
                                      openModal(item);
                                    }}
                                    style={{
                                      color: "#ff690f",
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    View Flight Details
                                  </div>

                                  {/* AirIQ Book Button */}
                                  <div
                                    className="res_mob_view_detail_btn"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target={`#flightDrawer-${index}`}
                                    aria-controls="flightDrawer"
                                    onClick={() => {
                                      FareRuleGet(item?.rI);
                                      setFlightProName("airiq");
                                      openModal(item);
                                    }}
                                    style={{
                                      color: "#ff690f",
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    View Flight Details
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    });
                  }

                  // Case 4: No data at all
                  // Case 4: No data at all — show only after search
                  if (hasSearched) {
                    return (
                      <div className="no-flight-message text-center mt-3">
                        <h5>🛫 No flights found</h5>
                        <p>There are no available flights at this time.</p>
                      </div>
                    );
                  }

                  // 💤 Case 5: Before any search — show nothing or optional placeholder
                  return null;
                })()}

                {/* Offcanvas Filter Panel */}
                <div className={`filter-offcanvas ${show ? "show" : ""}`}>
                  <div className="filter-header">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ margin: 0, fontSize: "1.25rem" }}>
                        <span style={{ marginRight: "0.5rem" }}>🔍</span>
                        Filter Flights
                      </h5>
                      <button
                        className="btn-close"
                        style={{
                          color: "var(--color-white)",
                          background: "transparent",
                        }}
                        onClick={() => setShow(false)}
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div style={{ paddingTop: "1rem" }}>
                    {/* 🛫 Stops Filter */}
                    {uniqueStops?.length > 0 && (
                      <div className="filter-section">
                        <div className="filter-label">Number of Stops</div>
                        {uniqueStops.map((stop, index) => (
                          <div key={index} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`stop-${index}`}
                              checked={filters.stops.includes(stop)}
                              onChange={() => handleStopChange(stop)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`stop-${index}`}
                            >
                              {stop}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 💺 Cabin Type Filter */}
                    {/* {uniqueClasses?.length > 0 && (
                      <div className="filter-section">
                        <div className="filter-label">Cabin Type</div>
                        {uniqueClasses.map((cabin, index) => (
                          <div key={index} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="cabinType"
                              id={`cabin-${index}`}
                              checked={filters.cabinType === cabin}
                              onChange={() => handleCabinChange(cabin)}
                            />
                            <label className="form-check-label" htmlFor={`cabin-${index}`}>
                              {cabin}
                            </label>
                          </div>
                        ))}
                      </div>
                    )} */}

                    {/* ✈️ Airlines Filter */}
                    {uniqueFlightNames?.length > 0 && (
                      <div className="filter-section">
                        <div className="filter-label">Airlines</div>
                        {uniqueFlightNames.map((airline, index) => (
                          <div key={index} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`airline-${index}`}
                              checked={filters.airlines.includes(airline)}
                              onChange={() => handleAirlineChange(airline)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`airline-${index}`}
                            >
                              {airline}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ⚙️ Action Buttons */}
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary-custom"
                        onClick={applyFilters}
                        style={{ marginBottom: "0.75rem" }}
                      >
                        Apply Filters
                      </button>
                      <button
                        className="btn btn-outline-custom"
                        onClick={clearFilters}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Backdrop */}
                {show && (
                  <div
                    className={`backdrop ${show ? "show" : ""}`}
                    onClick={() => setShow(false)}
                  />
                )}

                {/* ---- NEW PAGINATION UI ---- */}
                {totalPages > 1 &&
                  !(filtered === true && filteredFlights?.length === 0) && (
                    <>
                      <div className="d-flex align-items-center mb-2 mt-2 per_page_show">
                        <label htmlFor="entries" className="me-2">
                          Show
                        </label>
                        <select
                          id="entries"
                          className="form-select"
                          style={{ width: "auto", display: "inline-block" }}
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // reset to first page when changing page size
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span className="ms-2">entries</span>
                      </div>

                      <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                        <button
                          className="btn pagination_btn"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Previous
                        </button>

                        <span className="mx-0 fs-14">
                          <strong>{currentPage}</strong> of{" "}
                          <strong>{totalPages}</strong>
                        </span>

                        <button
                          style={{ border: "1px solid #F95C12" }}
                          className="btn pagination_btn"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
              </div>
            )}

            {returnflightTab == 1 && (
              <>
                {return_flight_data.map((item, index) => {
                  const firstSeg = item?.sg?.[0];
                  const lastSeg = item?.sg?.[item?.sg?.length - 1];
                  const departureMoment = firstSeg?.or?.dT
                    ? moment(firstSeg.or.dT)
                    : null;
                  const arrivalMoment = lastSeg?.ds?.aT
                    ? moment(lastSeg.ds.aT)
                    : null;
                  const totalMinutes =
                    departureMoment && arrivalMoment
                      ? arrivalMoment.diff(departureMoment, "minutes")
                      : firstSeg?.dr ?? 0;
                  const totalHours = Math.floor(totalMinutes / 60);
                  const totalRemainingMin = totalMinutes % 60;

                  const className =
                    classes?.find((cls) => cls.id === item.sg?.[0]?.cC)?.name ||
                    "Unknown Class";
                  const fareIdentifier =
                    item.fareIdentifier?.name || "Standard Fare";
                  const colorCode = item.fareIdentifier?.colorCode || "#3b82f6";
                  const cardStyle = {
                    "--accent-color": colorCode,
                  };

                  return (
                    <>
                      <div className="flightsavailable2">
                        <div className="row">
                          <div className="col-12 col-lg-9 justify-content-space-between">
                            <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                              <div className="airlinename col-12 col-lg-3">
                                <div>
                                  {(() => {
                                    const airline = item.sg[0]?.al?.alN;

                                    return airline === "IndiGo Airlines" ||
                                      airline === "Indigo" ? (
                                      <img
                                        src={images.IndiGoAirlines_logo}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Neos" ? (
                                      <img
                                        src={images.neoslogo}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "SpiceJet" ? (
                                      <img
                                        src={images.spicejet}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Air India" ? (
                                      <img
                                        src={images.airindialogo}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Akasa Air" ? (
                                      <img
                                        src={images.akasalogo}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Etihad" ? (
                                      <img
                                        src={images.etihadlogo}
                                        style={{
                                          backgroundColor: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                        }}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Vistara" ? (
                                      <img
                                        src={images.vistaralogo}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "AirAsia X" ? (
                                      <img
                                        src={images.airasiax}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "AirAsia" ? (
                                      <img
                                        src={images.airasia}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Azul" ? (
                                      <img
                                        src={images.azul}
                                        className="airline_logo2"
                                      />
                                    ) : airline === "Air India Express" ? (
                                      <img
                                        src={images.Air_India_Express_logo}
                                        className="airline_logo2"
                                      />
                                    ) : (
                                      <IoAirplaneSharp
                                        size={40}
                                        color="black"
                                      />
                                    );
                                  })()}
                                </div>

                                <div className="planecomp2">
                                  {item.sg[0]?.al?.alN}
                                </div>
                              </div>
                              <div className="flight-details2 col-12 col-lg-6 justify-content-center">
                                {/* Departure (first segment) */}
                                <div className="flight-departure text-center">
                                  <h5 className="flighttime2">
                                    {moment(item?.sg[0]?.or?.dT).format(
                                      "hh:mm A"
                                    )}
                                  </h5>
                                  <h5 className="airportname2">
                                    {item?.sg[0]?.or?.aC}
                                  </h5>
                                  <p className="alldate2">
                                    {moment(item?.sg[0]?.or?.dT).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </p>
                                </div>

                                <div className="d-flex align-items-center gap-2 gap-lg-3">
                                  <span className="text-dark">From</span>
                                  <div className="from-to text-center">
                                    {/* Total journey duration = last arrival - first departure */}
                                    <h6 className="text-dark">
                                      {(() => {
                                        const departure = moment(
                                          item?.sg[0]?.or?.dT
                                        );
                                        const arrival = moment(
                                          item?.sg[item?.sg.length - 1]?.ds?.aT
                                        );
                                        const totalMinutes = arrival.diff(
                                          departure,
                                          "minutes"
                                        );
                                        return `${Math.floor(
                                          totalMinutes / 60
                                        )}h ${totalMinutes % 60}m`;
                                      })()}
                                    </h6>

                                    <img
                                      src={images.invertedviman}
                                      alt=""
                                      className="imagerouteplane"
                                    />

                                    {/* Show stops dynamically */}
                                    <h6 className="text-dark mt-1">
                                      {item?.sg.length === 1
                                        ? "Non Stop"
                                        : `${item?.sg.length - 1} Stop${
                                            item?.sg.length - 1 > 1 ? "s" : ""
                                          }`}
                                    </h6>
                                  </div>
                                  <span className="text-dark">To</span>
                                </div>

                                {/* Arrival (last segment) */}
                                <div className="flight-departure text-center">
                                  <h5 className="flighttime2">
                                    {moment(
                                      item?.sg[item?.sg.length - 1]?.ds?.aT
                                    ).format("hh:mm A")}
                                  </h5>
                                  <h5 className="airportname2">
                                    {item?.sg[item?.sg.length - 1]?.ds?.aC}
                                  </h5>
                                  <p className="alldate2">
                                    {moment(
                                      item?.sg[item?.sg.length - 1]?.ds?.aT
                                    ).format("DD-MM-YYYY")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-start justify-content-lg-between my-3">
                              <div>
                                {/* <div className="d-flex gap-1 mx-3">
                                  <div
                                    className="clickherebtn"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target={`#flightDrawer-${index}`}
                                    aria-controls="flightDrawer"
                                    onClick={() => FareRuleGet(item?.rI)}
                                  >
                                    Click here
                                  </div>
                                  <div className="">
                                    to know more about flight
                                  </div>
                                </div> */}
                                <div
                                  className="offcanvas offcanvas-start"
                                  tabIndex="-1"
                                  id={`flightDrawer-${index}`}
                                  aria-labelledby={`flightDrawerLabel-${index}`}
                                >
                                  <div className="offcanvas-header">
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="offcanvas"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="offcanvas-body">
                                    <div className="fs-3">Flight Details</div>
                                    <div className="fw-bold fs-5 mt-3">
                                      Departure Flight
                                    </div>

                                    <div className="container my-3">
                                      <div className="flight-cardok shadow-sm rounded">
                                        {/* Date Header */}
                                        <div className="p-2 date_divok fw-semibold border-bottom">
                                          {moment(firstSeg?.or?.dT).format(
                                            "ddd, DD MMM"
                                          )}
                                        </div>

                                        {/* Main Content */}
                                        <div className="p-3">
                                          <div className="d-flex justify-content-between align-items-center mb-2">
                                            {/* Origin (first segment origin) */}
                                            <div className="text-center">
                                              <h4 className="text-success fw-bold m-0">
                                                {firstSeg?.or?.aC}
                                              </h4>
                                              <small className="text-muted">
                                                {firstSeg?.or?.cN}
                                              </small>
                                            </div>

                                            {/* Total Duration & Stops (calculated across full journey) */}
                                            <div className="text-center">
                                              <div className="fw-semibold">
                                                {departureMoment &&
                                                arrivalMoment
                                                  ? `${totalHours}h ${totalRemainingMin}m`
                                                  : firstSeg?.dr
                                                  ? `${Math.floor(
                                                      firstSeg.dr / 60
                                                    )}h ${firstSeg.dr % 60}m`
                                                  : ""}
                                              </div>
                                              <small className="text-muted">
                                                {item?.sg?.length === 1
                                                  ? "Non Stop"
                                                  : `${
                                                      item?.sg?.length - 1
                                                    } Stop${
                                                      item?.sg?.length - 1 > 1
                                                        ? "s"
                                                        : ""
                                                    }`}
                                              </small>
                                            </div>

                                            {/* Destination (last segment destination) */}
                                            <div className="text-center">
                                              <h4 className="text-success fw-bold m-0">
                                                {lastSeg?.ds?.aC}
                                              </h4>
                                              <small className="text-muted">
                                                {lastSeg?.ds?.cN}
                                              </small>
                                            </div>
                                          </div>

                                          {/* Flight No + Check-in (you can list multiple legs if needed) */}
                                          <div className="d-flex justify-content-between text-muted small my-3">
                                            <div>
                                              ✈️ {firstSeg?.al?.alC}{" "}
                                              {firstSeg?.al?.fN}
                                              {item?.sg?.length > 1 && (
                                                <span className="ms-2 text-muted">
                                                  +{item.sg.length - 1} more leg
                                                  {item.sg.length - 1 > 1
                                                    ? "s"
                                                    : ""}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Timeline (you already implemented mapping for this) */}
                                          <div className="timeline">
                                            {item?.sg?.map((seg, idx) => (
                                              <div key={idx}>
                                                <div className="timeline-item">
                                                  <div className="fw-bold">
                                                    {moment(seg?.or?.dT).format(
                                                      "hh:mm A"
                                                    )}
                                                  </div>
                                                  <div>
                                                    {seg?.or?.aC} -{" "}
                                                    {seg?.or?.aN}
                                                  </div>
                                                </div>

                                                <div className="timeline-item my-3">
                                                  <div className="text-muted">
                                                    Travel Time{" "}
                                                    {`${Math.floor(
                                                      moment
                                                        .duration(
                                                          seg?.dr,
                                                          "minutes"
                                                        )
                                                        .asHours()
                                                    )}h ${moment
                                                      .duration(
                                                        seg?.dr,
                                                        "minutes"
                                                      )
                                                      .minutes()}m`}
                                                  </div>
                                                </div>

                                                <div className="timeline-item">
                                                  <div className="fw-bold">
                                                    {moment(seg?.ds?.aT).format(
                                                      "hh:mm A"
                                                    )}
                                                  </div>
                                                  <div>
                                                    {seg?.ds?.aC} -{" "}
                                                    {seg?.ds?.aN}
                                                    {seg?.ds?.tr
                                                      ? ` - ${seg.ds.tr}`
                                                      : ""}
                                                  </div>
                                                </div>

                                                {idx < item.sg.length - 1 && (
                                                  <div className="timeline-item my-2 ">
                                                    <span className="badge bg-warning text-dark">
                                                      Layover at {seg?.ds?.aN}{" "}
                                                      <br />(
                                                      {moment(
                                                        seg?.ds?.aT
                                                      ).format("hh:mm A")}{" "}
                                                      →{" "}
                                                      {moment(
                                                        item.sg[idx + 1]?.or?.dT
                                                      ).format("hh:mm A")}
                                                      )
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="fw-bold fs-5 mt-3">
                                      Fare Details
                                    </div>
                                    <div className="container my-3">
                                      <div className="flight-cardok  p-2 shadow-sm rounded">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                          <div>
                                            <BsFillHandbagFill
                                              color="orangered"
                                              size={15}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              lineHeight: 1,
                                              fontSize: "0.80rem",
                                            }}
                                          >
                                            {item?.sg[0]?.cBg} Cabin bag
                                            allowance
                                          </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                          <div>
                                            <BsFillLuggageFill
                                              color="orangered"
                                              size={15}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              lineHeight: 1,
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            {item?.sg[0]?.bg} Check-in bag
                                            allowance
                                          </div>
                                        </div>
                                        {flightProName === "travclan" ? (
                                          <>
                                            <div className="mt-3">
                                              <h6 className="fw-bold">
                                                Fare Rules
                                              </h6>
                                              {fare_rules_Loading ? (
                                                <Box sx={{ width: "100%" }}>
                                                  <Skeleton
                                                    variant="text"
                                                    height={20}
                                                  />
                                                  <Skeleton
                                                    variant="text"
                                                    height={20}
                                                  />
                                                  <Skeleton
                                                    variant="text"
                                                    height={20}
                                                  />
                                                </Box>
                                              ) : (
                                                <div
                                                  style={{
                                                    fontSize: "0.8rem",
                                                    lineHeight: 1.4,
                                                  }}
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      fare_rules[0]
                                                        ?.fareRuleDetail,
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="flight-class-card"
                                style={cardStyle}
                              >
                                <div className="class-info">
                                  <div className="class-icon">
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                    </svg>
                                  </div>

                                  <div className="class-details">
                                    <h3 className="class-name">{className}</h3>
                                    <p className="fare-identifier">
                                      {fareIdentifier}
                                    </p>
                                  </div>

                                  <div className="class-badge">
                                    {className?.split(" ")[0] || "CLASS"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-lg-3 nanolito2 d-flex justify-content-center">
                            <div className="pricediv col-lg-3 mb-3 mb-lg-0">
                              <div className="d-flex align-items-center">
                                <FaRupeeSign size={20} color="#000" />
                                <h4 className="text-dark fw-bold dijit">
                                  {item?.fF}
                                </h4>
                              </div>

                              {login ? (
                                <div
                                  onClick={() => {
                                    setIndex(index);
                                    setResultIndex((prev) => [
                                      ...prev,
                                      item?.rI,
                                    ]);

                                    ItineraryCreateNew(
                                      [...resultIndex, item?.rI],
                                      item
                                    );
                                  }}
                                  className="bookBtn2"
                                >
                                  {itinerary_loading && index === getindex
                                    ? "Loading..."
                                    : selectedOption.id == 2 &&
                                      return_flight_data.length !== 0
                                    ? "Select"
                                    : "Book"}
                                </div>
                              ) : (
                                <Link
                                  onClick={() =>
                                    alert(
                                      "Please log in to proceed with booking."
                                    )
                                  }
                                  className="bookBtn2"
                                >
                                  Book
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flights_available_mobile">
                        <div className="d-flex justify-content-between">
                          <div className="mobile_row">
                            <div>
                              {(() => {
                                const airline = item.sg[0]?.al?.alN;

                                return airline === "IndiGo Airlines" ||
                                  airline === "Indigo" ? (
                                  <img
                                    src={images.IndiGoAirlines_logo}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Neos" ? (
                                  <img
                                    src={images.neoslogo}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "SpiceJet" ? (
                                  <img
                                    src={images.spicejet}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Air India" ? (
                                  <img
                                    src={images.airindialogo}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Akasa Air" ? (
                                  <img
                                    src={images.akasalogo}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Etihad" ? (
                                  <img
                                    src={images.etihadlogo}
                                    style={{
                                      backgroundColor: "#fff",
                                      padding: "5px",
                                      borderRadius: "5px",
                                    }}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Vistara" ? (
                                  <img
                                    src={images.vistaralogo}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "AirAsia X" ? (
                                  <img
                                    src={images.airasiax}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "AirAsia" ? (
                                  <img
                                    src={images.airasia}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Azul" ? (
                                  <img
                                    src={images.azul}
                                    className="airline_logo2_mob"
                                  />
                                ) : airline === "Air India Express" ? (
                                  <img
                                    src={images.Air_India_Express_logo}
                                    className="airline_logo2"
                                  />
                                ) : (
                                  <IoAirplaneSharp size={40} color="white" />
                                );
                              })()}
                            </div>
                            <div className="mob_time_cont">
                              <div className="mob_time_row">
                                <div className="mob_time text-center">
                                  {moment(item?.sg[0]?.or?.dT).format(
                                    "hh:mm A"
                                  )}
                                  <div> {item?.sg[0]?.or?.aC}</div>
                                </div>
                                <div
                                  style={{
                                    width: "50px",
                                  }}
                                >
                                  -------
                                </div>
                                <div className="mob_time text-center">
                                  {moment(
                                    item?.sg[item?.sg.length - 1]?.ds?.aT
                                  ).format("hh:mm A")}
                                  <div>
                                    {item?.sg[item?.sg.length - 1]?.ds?.aC}
                                  </div>
                                </div>
                              </div>
                              <div className="mob_time_row justify-content-between">
                                <div className="mob_city_kode">
                                  {item?.departure_time}
                                </div>
                                <div className="mob_duration">
                                  {(() => {
                                    const departure = moment(
                                      item?.sg[0]?.or?.dT
                                    );
                                    const arrival = moment(
                                      item?.sg[item?.sg.length - 1]?.ds?.aT
                                    );
                                    const totalMinutes = arrival.diff(
                                      departure,
                                      "minutes"
                                    );
                                    return `${Math.floor(totalMinutes / 60)}h ${
                                      totalMinutes % 60
                                    }m`;
                                  })()}
                                </div>
                                <div className="mob_city_kode">
                                  {item?.destination}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mob_Amount">
                            <div className="mob_rupi_icon">
                              <div>
                                <FaIndianRupeeSign size={20} />
                              </div>
                              <div className="mob_amount">{item?.fF}</div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid #ccc",
                            marginTop: "1rem",
                          }}
                        />
                        <div className="mob_book_btn_main">
                          <div className="mob_book_airlineNm">
                            {item?.airline}
                          </div>
                          <div>
                            {login ? (
                              <Link
                                to={"/TicketBookingDetails"}
                                state={{
                                  item: item,
                                  totaltraveller: totalTravellers,
                                  adulttraveler: travellers.adult,
                                  childtraveler: travellers.child,
                                  infanttraveler: travellers.infant,
                                  ticket_id: item?.ticket_id,
                                  selected: selected,
                                  getCondition: getCondition,
                                }}
                                className="bookBtn2_mob"
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
                                className="bookBtn2_mob"
                              >
                                Book
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </>

          {selectedtab === "buses" && (
            <>
              <div className="bus-list">
                {route_loading ? (
                  <>
                    <div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "2rem",
                        }}
                      >
                        <div className="loader">
                          <div className="spinner"></div>
                          <p className="loading-text">Loading...</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {visibleData.length <= 0 ? (
                      <div
                        className="text-center my-3"
                        style={{
                          fontWeight: "bold",
                          color: "red",
                          fontSize: "17px",
                        }}
                      >
                        {/* There are no Buses For this Route */}
                      </div>
                    ) : (
                      <>
                        {visibleData?.map((bus, index) => (
                          <div key={index}>
                            {/* Desktop Bus Card */}
                            <div className="bus-card">
                              <div className="d-flex justify-content-between">
                                <div className="bus-card-left">
                                  <div
                                    className="bus-tag"
                                    style={{ backgroundColor: bus.tagColor }}
                                  >
                                    {bus.tag}
                                    {index + 1}
                                  </div>
                                  <div className="bus-title">Eagle Express</div>
                                  <div className="d-flex flex-row flex-lg-column">
                                    <div className="bus-type">
                                      {bus.BusTypeName}
                                    </div>
                                    <div className="bus-type">
                                      {bus.ArrangementName}
                                    </div>
                                  </div>
                                </div>
                                <div className="bus-card-middle">
                                  <div className="bus-times">
                                    <span className="bus-time">
                                      {bus.CityTime}
                                    </span>
                                    <span className="bus-arrow">—</span>
                                    <span className="bus-time">
                                      {bus.ArrivalTime}
                                    </span>
                                  </div>
                                  <div className="bus-duration">
                                    {calculateDuration(
                                      bus.CityTime,
                                      bus.ArrivalTime
                                    )}{" "}
                                    • {bus.EmptySeats} Seats
                                  </div>
                                </div>
                                <div className="bus-card-right">
                                  <div className="bus-price">
                                    ₹{bus.AcSeatRate}
                                  </div>
                                  <div className="onwards">Onwards</div>
                                </div>
                              </div>
                              <div
                                style={{
                                  border: "1px solid #eee",
                                  marginTop: "1rem",
                                }}
                              />
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="bus-tabs-container">
                                  <div className="bus-tabs">
                                    {[
                                      "Amenities",
                                      "Pickup & Drops",
                                      "Policies",
                                    ].map((tab) => (
                                      <button
                                        key={tab}
                                        className={`tab-btn ${
                                          activeTabIndex === index &&
                                          activeTabName === tab
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={() => toggleTab(index, tab)}
                                      >
                                        {tab} <GoChevronDown />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <Link
                                  onClick={() =>
                                    getSeatArrangementBus(bus.ReferenceNumber)
                                  }
                                  to="/SeatSelcetion"
                                  state={{
                                    bus: bus,
                                    sittingType: bus.BusSeatType,
                                  }}
                                  className="view-seats"
                                >
                                  Select Seat
                                </Link>
                              </div>
                              {activeTabIndex === index && (
                                <div className="tab-content">
                                  {activeTabName === "Policies" && (
                                    <div
                                      className="accordion-body text-dark"
                                      style={{
                                        backgroundColor: "#fff9db",
                                        borderBottomLeftRadius: "0.75rem",
                                        borderBottomRightRadius: "0.75rem",
                                      }}
                                    >
                                      <ul className="mb-0 ps-3">
                                        {cancellation_policy?.map(
                                          (item, index) => {
                                            const from = parseInt(
                                              item.FromMinutes,
                                              10
                                            );
                                            const to = parseInt(
                                              item.ToMinutes,
                                              10
                                            );
                                            const refund = item.RefundPercent;

                                            let text = "";
                                            if (to === 0) {
                                              text = `Cancellations made ${
                                                from / 60
                                              } hours or more before the journey will be eligible for a ${refund}% refund.`;
                                            } else {
                                              text = `Cancellations made ${
                                                from / 60
                                              } to ${
                                                to / 60
                                              } hours before the journey will be eligible for a ${refund}% refund.`;
                                            }
                                            return <li key={index}>{text}</li>;
                                          }
                                        )}
                                        <li>
                                          Partial refunds depend on the
                                          operator’s terms.
                                        </li>
                                        <li>
                                          GST and convenience fees are
                                          non-refundable.
                                        </li>
                                        <li>
                                          For full terms, please refer to our{" "}
                                          <a
                                            href="#"
                                            className="text-decoration-underline text-dark fw-bold"
                                          >
                                            cancellation policy page
                                          </a>
                                          .
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                  {activeTabName === "Amenities" && (
                                    <div>
                                      <h5 className="fw-bold">Amenities</h5>
                                      <div className="d-flex mt-3">
                                        <div className="row w-100 align-items-center justify-content-start row-gap-3">
                                          <div className="col-3 d-flex flex-row align-items-center gap-3">
                                            <FaWifi size={25} /> <div>Wifi</div>
                                          </div>
                                          <div className="col-3 d-flex flex-row align-items-center gap-3">
                                            <IoIosBatteryCharging size={25} />
                                            <div>Charging Port</div>
                                          </div>
                                          <div className="col-3 d-flex flex-row align-items-center gap-3">
                                            <BiBlanket size={25} />{" "}
                                            <div>Blanket</div>
                                          </div>
                                          <div className="col-3 d-flex flex-row align-items-center gap-3">
                                            <FaBottleWater size={25} />
                                            <div>Water Bottle</div>
                                          </div>
                                          <div className="col-3 d-flex flex-row align-items-center gap-3">
                                            <LuLampDesk size={25} />
                                            <div>Reading Lamp</div>
                                          </div>
                                          <div className="col-3 d-flex flex-row align-items-center gap-3">
                                            <FaTv size={25} /> <div>Movie</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {activeTabName === "Pickup & Drops" && (
                                    <div className="pickup-drop">
                                      <div className="pickupdiv">
                                        <h5 className="fw-bolder">
                                          Pickup Points
                                        </h5>
                                        <ul>
                                          {parseBoardingPoints(
                                            bus.BoardingPoints
                                          ).map((point, idx) => (
                                            <li key={idx}>
                                              {point.time} - {point.name}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="dropdiv">
                                        <h5 className="fw-bolder">
                                          Drop Points
                                        </h5>
                                        <ul>
                                          {parseDroppingPoints(
                                            bus.DroppingPoints
                                          ).map((point, idx) => (
                                            <li key={idx}>
                                              {point.time} - {point.name}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Mobile Bus Card */}
                            <div className="mob-bus-card">
                              <div>
                                <div
                                  className="bus-tag"
                                  style={{ backgroundColor: bus.tagColor }}
                                >
                                  {index + 1}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="bus-times">
                                    <span
                                      className="bus-time"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {bus.CityTime}
                                    </span>
                                    <span className="bus-arrow">—</span>
                                    <span className="bus-time">
                                      {bus.ArrivalTime}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="bus-duration">
                                    {calculateDuration(
                                      bus.CityTime,
                                      bus.ArrivalTime
                                    )}{" "}
                                    • {bus.EmptySeats} Seats
                                  </div>
                                  <div>
                                    <div className="bus-price">
                                      ₹{bus.AcSeatRate}
                                    </div>
                                  </div>
                                </div>
                                <div className="bus-title">{bus.title}</div>
                                <div className="bus-type">
                                  {bus.BusTypeName}
                                </div>
                                <div className="bus-type">
                                  {bus.ArrangementName}
                                </div>
                              </div>
                              <div
                                style={{
                                  border: "1px solid #eee",
                                  marginTop: "1rem",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <div className="mob-bus-tabs-container">
                                  <div className="mob-bus-tabs">
                                    {[
                                      "Amenities",
                                      "Pickup & Drops",
                                      "Policies",
                                    ].map((tab) => (
                                      <button
                                        key={tab}
                                        className={`mob-tab-btn ${
                                          activeTabIndex === index &&
                                          activeTabName === tab
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={() => toggleTab(index, tab)}
                                      >
                                        {tab}
                                      </button>
                                    ))}
                                  </div>
                                  <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{ borderColor: "var(--color-orange)" }}
                                  />
                                  <Link
                                    to="/SeatSelcetion"
                                    state={{
                                      bus: bus,
                                      sittingType: bus.BusSeatType,
                                    }}
                                    className="mob-view-seats"
                                    onClick={() =>
                                      getSeatArrangementBus(bus.ReferenceNumber)
                                    }
                                  >
                                    Select Seat
                                  </Link>
                                </div>
                              </div>
                              {activeTabIndex === index && (
                                <div className="tab-content">
                                  {activeTabName === "Policies" && (
                                    <div
                                      className="accordion-body text-dark"
                                      style={{
                                        backgroundColor: "#fff9db",
                                        borderBottomLeftRadius: "0.75rem",
                                        borderBottomRightRadius: "0.75rem",
                                      }}
                                    >
                                      <ul className="mb-0 p-0">
                                        {cancellation_policy?.map(
                                          (item, index) => {
                                            const from = parseInt(
                                              item.FromMinutes,
                                              10
                                            );
                                            const to = parseInt(
                                              item.ToMinutes,
                                              10
                                            );
                                            const refund = item.RefundPercent;

                                            let text = "";
                                            if (to === 0) {
                                              text = `Cancellations made ${
                                                from / 60
                                              } hours or more before the journey will be eligible for a ${refund}% refund.`;
                                            } else {
                                              text = `Cancellations made ${
                                                from / 60
                                              } to ${
                                                to / 60
                                              } hours before the journey will be eligible for a ${refund}% refund.`;
                                            }
                                            return <li key={index}>{text}</li>;
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                  {activeTabName === "Amenities" && (
                                    <div>
                                      <h5 className="fw-bold">Amenities</h5>
                                      <p>
                                        WiFi, Charging Port, Blanket, Water
                                        Bottle
                                      </p>
                                    </div>
                                  )}
                                  {activeTabName === "Pickup & Drops" && (
                                    <div className="mob-pickup-drop">
                                      <div className="mobpickupdiv">
                                        <h5 className="fw-bolder">
                                          Pickup Points
                                        </h5>
                                        <ul style={{ paddingLeft: "0px" }}>
                                          {parseBoardingPoints(
                                            bus.BoardingPoints
                                          ).map((point, idx) => (
                                            <li key={idx}>
                                              {point.time} - {point.name}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{
                                          borderColor: "var(--color-orange)",
                                        }}
                                      />
                                      <div className="mobdropdiv">
                                        <h5 className="fw-bolder">
                                          Drop Points
                                        </h5>
                                        <ul style={{ paddingLeft: "0px" }}>
                                          {parseDroppingPoints(
                                            bus.DroppingPoints
                                          ).map((point, idx) => (
                                            <li key={idx}>
                                              {point.time} - {point.name}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Show More Button */}
                        {visibleCount < route_data?.length && (
                          <div
                            style={{
                              textAlign: "center",
                              marginTop: "1rem",
                              alignSelf: "center",
                            }}
                          >
                            <button
                              onClick={handleShowMore}
                              className="view-seats"
                            >
                              Show More
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          {/* {selectedtab === "flights" && (
            <>
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
                        slidesPerView={4}
                        breakpoints={{
                          320: { slidesPerView: 1 },
                          768: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                          1540: { slidesPerView: 4 },
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
                                    <BiSolidPlaneAlt
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        color: "#fff",
                                      }}
                                    />
                                  </div>
                                  <span>
                                    {item.departure_city?.split(" (")[0]}{" "}
                                    <b>›</b> {item.arrival_city?.split(" (")[0]}
                                  </span>
                                </div>

                                <div className="recent_search_icon_flex">
                                  <div className="date">
                                    {item.departure_date}{" "}
                                    {item?.return_departure_date ? "›" : ""}{" "}
                                    {item.return_departure_date}
                                  </div>
                                </div>

                                <div className="recent_search_icon_flex">
                                  <div className="desc">
                                    {item.total_travelers} Traveler
                                  </div>
                                </div>

                                <div className="recent_search_icon_flex">
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
                                      Was {item.price}
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
                      <div className="mt-4 text-center text-black fw-semibold">
                        {selected == 1
                          ? "Uh Oh! No Recent Searches Found for Return Trips."
                          : "Uh Oh! No Recent Searches Found for One-Way Trips."}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )} */}
        </>
      )}

      {staycondition && selectedtab === "stays" && <HomeHeroHotel />}
      {/* Drawer Modal for Responsive*/}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="flight-modal"
        overlayClassName="flight-modal-overlay"
        contentLabel="Flight Information Modal"
      >
        {selectedItem &&
          (() => {
            const firstSeg = selectedItem?.sg?.[0];
            const lastSeg = selectedItem?.sg?.[selectedItem?.sg?.length - 1];
            const departureMoment = firstSeg?.or?.dT
              ? moment(firstSeg.or.dT)
              : null;
            const arrivalMoment = lastSeg?.ds?.aT
              ? moment(lastSeg.ds.aT)
              : null;
            const totalMinutes =
              departureMoment && arrivalMoment
                ? arrivalMoment.diff(departureMoment, "minutes")
                : firstSeg?.dr ?? 0;
            const totalHours = Math.floor(totalMinutes / 60);
            const totalRemainingMin = totalMinutes % 60;

            return (
              <>
                <div className="modal-header">
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  {/* Flight Details */}
                  <div className="flight-details-title">Flight Details</div>
                  <div className="departure-title">Departure Flight </div>

                  {flightProName === "travclan" ? (
                    <>
                      <div>
                        <Chip
                          label={
                            selectedItem?.iR === true
                              ? "Refundable"
                              : "Non-Refundable"
                          }
                          variant="outlined"
                          sx={{
                            color: selectedItem?.iR === true ? "green" : "gray",
                            backgroundColor:
                              selectedItem?.iR === true ? "#e0f7e9" : "inherit",
                            borderColor:
                              selectedItem?.iR === true ? "#4caf50" : "inherit",
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="flight-card-container">
                    <div className="flight-card">
                      {/* Date Header */}
                      <div className="date-header">
                        {moment(firstSeg?.or?.dT).format("ddd, DD MMM")}
                      </div>

                      {/* Main Content */}
                      <div className="flight-main-content">
                        <div className="flight-summary">
                          {/* Origin */}
                          <div className="location-info">
                            <h4 className="airport-code">{firstSeg?.or?.aC}</h4>
                            <small className="city-name">
                              {firstSeg?.or?.cN}
                            </small>
                          </div>

                          {/* Duration & Stops */}
                          <div className="duration-info">
                            <div className="duration-text">
                              {departureMoment && arrivalMoment
                                ? `${totalHours}h ${totalRemainingMin}m`
                                : firstSeg?.dr
                                ? `${Math.floor(firstSeg.dr / 60)}h ${
                                    firstSeg.dr % 60
                                  }m`
                                : ""}
                            </div>
                            <small className="stops-info">
                              {selectedItem?.sg?.length === 1
                                ? "Non Stop"
                                : `${selectedItem?.sg?.length - 1} Stop${
                                    selectedItem?.sg?.length - 1 > 1 ? "s" : ""
                                  }`}
                            </small>
                          </div>

                          {/* Destination */}
                          <div className="location-info">
                            <h4 className="airport-code">{lastSeg?.ds?.aC}</h4>
                            <small className="city-name">
                              {lastSeg?.ds?.cN}
                            </small>
                          </div>
                        </div>

                        {/* Flight Info */}
                        <div className="flight-info-details">
                          <div>
                            ✈️ {firstSeg?.al?.alC} {firstSeg?.al?.fN}
                            {selectedItem?.sg?.length > 1 && (
                              <span className="additional-legs">
                                +{selectedItem.sg.length - 1} more leg
                                {selectedItem.sg.length - 1 > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="timeline">
                          {selectedItem?.sg?.map((seg, idx) => (
                            <div key={idx}>
                              <div className="timeline-item">
                                <div className="timeline-time">
                                  {moment(seg?.or?.dT).format("hh:mm A")}
                                </div>
                                <div className="timeline-location">
                                  {seg?.or?.aC} - {seg?.or?.aN}
                                </div>
                              </div>

                              <div className="timeline-travel">
                                <div className="travel-time">
                                  Travel Time{" "}
                                  {`${Math.floor(
                                    moment
                                      .duration(seg?.dr, "minutes")
                                      .asHours()
                                  )}h ${moment
                                    .duration(seg?.dr, "minutes")
                                    .minutes()}m`}
                                </div>
                              </div>

                              <div className="timeline-item">
                                <div className="timeline-time">
                                  {moment(seg?.ds?.aT).format("hh:mm A")}
                                </div>
                                <div className="timeline-location">
                                  {seg?.ds?.aC} - {seg?.ds?.aN}
                                  {seg?.ds?.tr ? ` - ${seg.ds.tr}` : ""}
                                </div>
                              </div>

                              {idx < selectedItem.sg.length - 1 && (
                                <div className="layover-info">
                                  <span className="layover-badge">
                                    Layover at {seg?.ds?.aN} <br />(
                                    {moment(seg?.ds?.aT).format("hh:mm A")} →{" "}
                                    {moment(
                                      selectedItem.sg[idx + 1]?.or?.dT
                                    ).format("hh:mm A")}
                                    )
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Stops Summary Section */}
                  {flightProName === "travclan" ? (
                    <>
                      <div className="fw-bold fs-5 mt-3">Technical Stops</div>
                      <div className="container my-3">
                        <div className="flight-cardok p-3 shadow-sm rounded">
                          {selectedItem?.sg?.some((seg) => seg.sO) ? (
                            <div>
                              <div
                                className="alert alert-warning mb-3"
                                role="alert"
                              >
                                <h6 className="alert-heading mb-2">
                                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                  This flight includes technical stops
                                </h6>
                                <p className="mb-0 small">
                                  Technical stops are brief stops made by
                                  aircraft for operational reasons such as
                                  refueling or crew changes. Passengers
                                  typically remain on board during these stops.
                                </p>
                              </div>

                              {selectedItem?.sg.map(
                                (seg, idx) =>
                                  seg.sO && (
                                    <div
                                      key={idx}
                                      className="border rounded p-2 mb-2 bg-light"
                                    >
                                      <div className="row">
                                        <div className="col-md-6">
                                          <small className="text-muted">
                                            Stop Location
                                          </small>
                                          <div className="fw-semibold">
                                            {seg.sP || "N/A"}
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <small className="text-muted">
                                            Stop Duration
                                          </small>
                                          <div className="fw-semibold">
                                            {seg.sD
                                              ? `${Math.floor(seg.sD / 60)}h ${
                                                  seg.sD % 60
                                                }m`
                                              : "N/A"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row mt-2">
                                        <div className="col-md-6">
                                          <small className="text-muted">
                                            Arrival at Stop
                                          </small>
                                          <div>
                                            {seg.sPAT &&
                                            moment(seg.sPAT).isValid()
                                              ? moment(seg.sPAT).format(
                                                  "hh:mm A, DD MMM YYYY"
                                                )
                                              : "N/A"}
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <small className="text-muted">
                                            Departure from Stop
                                          </small>
                                          <div>
                                            {seg.sPDT &&
                                            moment(seg.sPDT).isValid()
                                              ? moment(seg.sPDT).format(
                                                  "hh:mm A, DD MMM YYYY"
                                                )
                                              : "N/A"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <div className="text-success mb-2">
                                <i
                                  className="bi bi-check-circle-fill"
                                  style={{
                                    fontSize: "2rem",
                                  }}
                                ></i>
                              </div>
                              <h6 className="text-muted mb-0">
                                No Technical Stops
                              </h6>
                              <small className="text-muted">
                                This flight operates without any technical stops
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* Fare Details */}
                  <div className="fare-details-title">Fare Details</div>
                  <div className="fare-card-container">
                    <div className="fare-card">
                      {/* Cabin Baggage */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div>
                          <BsFillHandbagFill color="orangered" size={15} />
                        </div>
                        <div style={{ lineHeight: 1, fontSize: "0.80rem" }}>
                          {flightProName === "travclan" ? (
                            <>
                              {selectedItem?.baggage?.travclan?.cabin || "N/A"}{" "}
                              Cabin Baggage
                            </>
                          ) : flightProName === "airiq" ? (
                            <>
                              {selectedItem?.baggage?.airiq?.cabin || "N/A"}{" "}
                              Cabin Baggage
                            </>
                          ) : (
                            <>
                              {selectedItem?.baggage?.travclan?.cabin || "N/A"}{" "}
                              | {selectedItem?.baggage?.airiq?.cabin || "N/A"}{" "}
                              Cabin Baggage
                            </>
                          )}
                        </div>
                      </div>

                      {/* Check-in Baggage */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div>
                          <BsFillLuggageFill color="orangered" size={15} />
                        </div>
                        <div style={{ lineHeight: 1, fontSize: "0.75rem" }}>
                          {flightProName === "travclan" ? (
                            <>
                              {selectedItem?.baggage?.travclan?.checkIn ||
                                "N/A"}{" "}
                              Check-in Baggage
                            </>
                          ) : flightProName === "airiq" ? (
                            <>
                              {selectedItem?.baggage?.airiq?.checkIn || "N/A"}{" "}
                              Check-in Baggage
                            </>
                          ) : (
                            <>
                              TravClan:{" "}
                              {selectedItem?.baggage?.travclan?.checkIn ||
                                "N/A"}{" "}
                              | AirIQ:{" "}
                              {selectedItem?.baggage?.airiq?.checkIn || "N/A"}{" "}
                              Check-in Baggage
                            </>
                          )}
                        </div>
                      </div>

                      {/* Fare Rules - Only show when flightProName is travclan */}
                      {flightProName === "travclan" && (
                        <div className="fare-rules-section">
                          <h6 className="fare-rules-title fw-bold">
                            Fare Rules
                          </h6>
                          {fare_rules_Loading ? (
                            <Box sx={{ width: "100%" }}>
                              <Skeleton variant="text" height={20} />
                              <Skeleton variant="text" height={20} />
                              <Skeleton variant="text" height={20} />
                            </Box>
                          ) : (
                            <div
                              className="fare-rules-content"
                              style={{ fontSize: "0.8rem", lineHeight: 1.4 }}
                              dangerouslySetInnerHTML={{
                                __html: fare_rules[0]?.fareRuleDetail,
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
      </Modal>
    </section>
  );
};

export default HomeHero;
