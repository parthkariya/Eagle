import React, { useState, useRef, useEffect } from "react";
import "./Homehero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import {
  FaPlaneDeparture,
  FaBed,
  FaCar,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import { BsBusFront } from "react-icons/bs";
import { IoAirplaneSharp } from "react-icons/io5";
import { BiSolidPlaneAlt } from "react-icons/bi";
import {
  FaChevronDown,
  FaExchangeAlt,
  FaSearch,
  FaRupeeSign,
  FaSort,
} from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  ACCEPT_HEADER,
  ACCEPT_HEADER1,
  availabilitycurl,
  get_recent_search,
  recent_search,
  searchcurl,
  sectorscurl,
  supplieravailabilitycurl,
  suppliersearchcurl,
} from "../../Utils/Constant";
import axios from "axios";
import Notification from "../../Utils/Notification";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const tabs = [
  { name: "Flights", icon: <FaPlaneDeparture size={25} />, key: "flights" },
  { name: "Stays", icon: <FaBed size={25} />, key: "stays" },
  { name: "Car Rental", icon: <FaCar size={25} />, key: "car" },
  {
    name: "Buses",
    icon: <BsBusFront size={25} />,
    key: "buses",
  },
];
const options = ["Return", "One-way", "Multi-city"];

const classes = ["Economy", "Business", "First"];

const onewdatetest = [
  { onward_date: "2025-05-03" },
  { onward_date: "2025-05-03" },
  { onward_date: "2025-05-04" },
  { onward_date: "2025-05-05" },
];

const Availdatetest = ["2025-05-04", "2025-05-04", "2025-05-05", "2025-05-06"];

const HomeHero = () => {
  const animatedComponents = makeAnimated();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedtab, setSelectedtab] = useState("flights");
  const [isOpen, setIsOpen] = useState(false);
  const [mergedData, setMergedData] = useState([]);
  const [filteredFromdata, setFilteredFromData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("One-way");
  const [selected, setSelected] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isDropdownOpenTraveler, setIsDropdownOpenTravellers] = useState(false);
  const [travellers, setTravellers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });

  const handleSelecttripoption = (opt) => {
    if (opt === "One-way") {
      setSelected(0);
      setSelectedValue("");
      setSelectedValue2("");
      setDate1(null);
      setDate2(null);
      setFrom("");
      setTo("");
      setSelectedDate(null);
      setSelectedDate2(null);
      setDefaultMonth(null);
      setDefaultMonth2(null);
      DepatureCityList(0);
      setSearchFlightList([]);
    } else if (opt === "Return") {
      setSelected(1);
      setSelectedValue("");
      setSelectedValue2("");
      setDate1(null);
      setDate2(null);
      setFrom("");
      setTo("");
      setSelectedDate(null);
      setSelectedDate2(null);
      setDefaultMonth(null);
      setDefaultMonth2(null);
      DepatureCityList(1);
      setSearchFlightList([]);
    } else {
    }

    if (opt === "Multi-city") {
      console.log("Multi-city option is disabled");
      return;
    }
    setSelectedOption(opt);
    setIsOpen(false);
  };

  // console.log("SELECTED", selected);

  // const swapLocations = () => {
  //   setIsSwapping(true);
  //   const temp = from;
  //   setFrom(to);
  //   setTo(temp);

  //   console.log("from",temp);
  //   console.log("to",to);    

  //   // Reset animation class after animation completes
  //   setTimeout(() => setIsSwapping(false), 500); // Match with CSS duration
  // };

 

  const swapLocations = () => {
  const newFrom = to;
  const newTo = from;

  setFrom(newFrom);
  setTo(newTo);

  ArrivalCityList(newFrom.city_code); // use swapped `from` value

  // Use new values directly instead of waiting for state update
  getOnwardDate(newFrom.city_code, newTo.city_code);
  dateAvailability(newFrom.city_code, newTo.city_code);
};



  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
      zIndex: 9999, // Ensure menu appears above other elements
      position: "absolute", // Make sure menu is positioned absolutely
      width: "100%", // Match the width of the select
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "300px", // Limit height and enable scrolling
      overflowY: "auto", // Enable vertical scrolling
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
  };

  const customStyles2 = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f7f7f7",
      border: "none",
      boxShadow: "none",
      padding: "5px 10px",
      cursor: "pointer",
      borderRadius: "10px",
      border: "1px solid #ddd",
      width: "175px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    dropdownIndicator: () => null,
    indicatorSeparator: () => null,
  };

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
  const [getSeachCondition2, setSearchCondition2] = useState(false);

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

  // console.log("SELECTED",selected);
  // console.log("getSeachCondition2", getSeachCondition2);

  // AIR IQ API State Start
  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";
  // const isLocalhost = window.location.hostname === "localhost";
  // const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";
  const proxy = "https://cors-anywhere.herokuapp.com/";

  const [getSectorListNew, setSectorListNew] = useState([]);
  const [getAvailableDate, setAvailableDate] = useState([]);
  const [getSearchFlightListData, setSearchFlightListData] = useState([]);
  const [getSearchFlightListDataCheap, setSearchFlightListDataCheap] = useState(
    []
  );
  const [getSearchFlightListDatamsg, setSearchFlightListDatamsg] = useState();
  const [getSectorListFrom, setSectorListFrom] = useState([]);
  const [getSectorListTo, setSectorListTo] = useState([]);
  const [getSectorListTo2, setSectorListTo2] = useState([]);
  const [filteredTodata, setFilteredToData] = useState([]);
  const [getCondition, setCondition] = useState();
  const [mergedDepartureList, setMergedDepartureList] = useState([]);
  const [recentSearchCondition, setRecentSearchCondition] = useState(false);
  const [depcitylistload, setdepcitylistload] = useState(false);
  const [arrcitylistload, setarrcitylistload] = useState(false);
  const [hasSwappedOnce, setHasSwappedOnce] = useState(false);


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

  const optionss = [
    { value: "cheapest-price", label: "Cheapest Price" },
    { value: "early-departure", label: "Early Departure" },
    { value: "late-departure", label: "Late Departure" },
    { value: "early-arrival", label: "Early Arrival" },
    { value: "late-arrival", label: "Late Arrival" },
  ];

  // console.log("getSectorListTo2", getSectorListTo2);
  // console.log("getSearchFlightListDataCheap", getSearchFlightListDataCheap);
  // console.log("mergedData", mergedData);
  // console.log("getSearchFlightListData", getSearchFlightListData);
  // console.log("from",from);

  const [traveller, setTraveller] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  // Determine which price field to use based on getCondition
  const sortKey = getCondition ? "price" : "per_adult_child_price";

  // Make a copy of each array and sort it by the chosen key in ascending order
  const sortedFlights = [...getSearchFlightListData].sort(
    (a, b) => a[sortKey] - b[sortKey]
  );

  const sortedCheapFlights = [...getSearchFlightListDataCheap].sort(
    (a, b) => a[sortKey] - b[sortKey]
  );
  
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

  const [getfiltercondation, setfiltercondation] = useState(false);
  const [getfilerdata, setfilterData] = useState([]);
  const [getfilerdata2, setfilterData2] = useState([]);
  const [recentswap, setrecentswap] = useState(0);

  // console.log("recentswap",recentswap);
  



  // const handleChanges = (item) => {
  //   console.log('sorted', sortedFlights);


  //   if (item.value === "early-departure") {
  //     setfiltercondation(true);
  //     const sortedByDeparture = sortedFlights.sort((a, b) => {
  //       const timeA = new Date(`${a.departure_date} ${a.departure_time}`);
  //       const timeB = new Date(`${b.departure_date} ${b.departure_time}`);
  //       return timeA - timeB;
  //     });
  //     setfilterData(sortedByDeparture);
  //   }else if(item.value === 'late-departure'){
  //     setfiltercondation(true);
  //     const sortedByDeparture = sortedFlights.sort((a, b) => {
  //       const timeA = new Date(`${a.departure_date} ${a.departure_time}`);
  //       const timeB = new Date(`${b.departure_date} ${b.departure_time}`);
  //       return timeB - timeA;
  //     });
  //     setfilterData(sortedByDeparture);
  //   }else if(item.value === 'early-arrival'){
  //     setfiltercondation(true);
  //     const sortedByDeparture = sortedFlights.sort((a, b) => {
  //       const timeA = new Date(`${a.arival_date} ${a.arival_time}`);
  //       const timeB = new Date(`${b.arival_date} ${b.arival_time}`);
  //       return timeA - timeB;
  //     });
  //     setfilterData(sortedByDeparture);
  //   }else if(item.value === 'late-arrival'){
  //     setfiltercondation(true);
  //     const sortedByDeparture = sortedFlights.sort((a, b) => {
  //       const timeA = new Date(`${a.arival_date} ${a.arival_time}`);
  //       const timeB = new Date(`${b.arival_date} ${b.arival_time}`);
  //       return timeB - timeA;
  //     });
  //     setfilterData(sortedByDeparture);
  //   }else {
  //     setfiltercondation(false);
  //   }
  // };

  // console.log("getSectorListTo", getSectorListTo);

  const handleChanges = (item) => {
    console.log("sorted", sortedFlights);

    const sortFlights = (data, type, isSecondArray = false) => {
      const depDateKey = isSecondArray ? "onward_date" : "departure_date";
      const depTimeKey = isSecondArray ? "dep_time" : "departure_time";
      const arrDateKey = isSecondArray ? "arr_date" : "arival_date";
      const arrTimeKey = isSecondArray ? "arr_time" : "arival_time";

      return [...data].sort((a, b) => {
        let timeA, timeB;

        if (type === "early-departure" || type === "late-departure") {
          timeA = new Date(`${a[depDateKey]} ${a[depTimeKey]}`);
          timeB = new Date(`${b[depDateKey]} ${b[depTimeKey]}`);
        } else if (type === "early-arrival" || type === "late-arrival") {
          timeA = new Date(`${a[arrDateKey]} ${a[arrTimeKey]}`);
          timeB = new Date(`${b[arrDateKey]} ${b[arrTimeKey]}`);
        }

        return type.startsWith("early") ? timeA - timeB : timeB - timeA;
      });
    };

    if (
      item.value === "early-departure" ||
      item.value === "late-departure" ||
      item.value === "early-arrival" ||
      item.value === "late-arrival"
    ) {
      setfiltercondation(true);

      // First array sorting
      const sortedMain = sortFlights(sortedFlights, item.value, false);
      setfilterData(sortedMain);

      // Optional: If you have a second array to sort (e.g., sortedCheapFlights)
      const sortedCheap = sortFlights(sortedCheapFlights, item.value, true);
      setfilterData2(sortedCheap); // Assuming you store it in another state
    } else {
      setfiltercondation(false);
    }
  };


  // const handleSelect = async (item) => {
  //   if (!item) {
  //     setFrom(null);
  //     return;
  //   } else {
  //     // if (item.source === "getSectorListNew") {
  //     //   setCondition(0);
  //     const selectedCity = item.city_name;
  //     const airportCode = item.airport_code;

  //     console.log("selectedCity", selectedCity);

  //     setDepCityCode(airportCode ? airportCode : item.city_code);
  //     setSelectedValue(`${selectedCity} (${airportCode})`);
  //     setIsDropdownOpen(false);
  //     setSelectedValue2("");
  //     setTo("");
  //     setSearchTerm("");
  //     setSearchTerm2("");
  //     setSelectedDate(null);
  //     setDate1("");
  //     setSearchFlightListData([]);
  //     setSearchFlightListDataCheap([]);
  //     setDefaultMonth("");
  //     setSelectedIndex(null);

  //     console.log("getSectorListNew", getSectorListNew);

  //     // const filteredSectors = getSectorListNew
  //     //   .filter((sector) => sector.Sector.startsWith(selectedCity + " //"))
  //     //   .map((sector) => ({
  //     //     destination: sector.Sector.split(" // ")[1].trim(),
  //     //     DestinationCode: sector.Destination,
  //     //   }))
  //     //   .sort((a, b) => a.destination.localeCompare(b.destination));

  //     // setSectorListTo(filteredSectors);
  //     // console.log("filteredSectors", filteredSectors);

  //     const filteredSectors = getSectorListNew
  //       .filter((sector) => {
  //         const [originCity] = sector.Sector.split(" // ");
  //         return originCity.trim() === selectedCity;
  //       })
  //       .map((sector) => ({
  //         destination: sector.Sector.split(" // ")[1].trim(),
  //         DestinationCode: sector.Destination,
  //       }))
  //       .sort((a, b) => a.destination.localeCompare(b.destination));

  //     console.log("Filtered Sectors", filteredSectors);
  //     setSectorListTo(filteredSectors);

  //     // } else if (item.source === "getDepatureCityList") {
  //     console.log("123", item);
  //     setCondition(1);
  //     setSelectedValue(`${item.city_name} (${item.airport_code})`);
  //     // setSearchTerm("");
  //     // ArrivalCityList(item.city_code);
  //     const data = await ArrivalCityList(item.airport_code);
  //     console.log("data-->", data);

  //     SectorList(item.city_code);
  //     // setDepCityCode(item.city_code);
  //     // setIsDropdownOpen(false);
  //     // setDefaultMonth("");
  //     setDefaultMonth2("");
  //     // setSelectedDate(null);
  //     setSelectedDate2(null);
  //     setSelectedValue2("");
  //     // setSearchFlightListData([]);
  //     // setSearchFlightListDataCheap([]);
  //     // setSelectedIndex(null);
  //     // }

  //     // Normalize `sortedCities` to match structure of `filteredSectors`
  //     const mappedSortedCities = data.map((city) => ({
  //       destination: city.city_name,
  //       DestinationCode: city.city_code,
  //     }));

  //     // Combine both arrays
  //     const combinedList = [...filteredSectors, ...mappedSortedCities];

  //     const groupedTo = groupBy2(combinedList, "destination");

  //     console.log("groupedTo", groupedTo);

  //     var arr2 = [];
  //     arr2.push(groupedTo);

  //     const formattedGroupedCitiesTo = Object.entries(groupedTo).map(
  //       ([cityName, cityArray]) => {
  //         const item = cityArray[0]; // just take the first item per city
  //         return {
  //           value: item.DestinationCode,
  //           label:
  //             `${item.destination} ${item.DestinationCode} ${item.airport_name}`.trim(),
  //           ...item,
  //         };
  //       }
  //     );

  //     console.log("formattedGroupedCitiesTo", formattedGroupedCitiesTo);

  //     setSectorListTo(formattedGroupedCitiesTo);

  //     // // Remove duplicates based on destination name
  //     // const uniqueCombinedList = combinedList.filter(
  //     //   (item, index, self) =>
  //     //     index === self.findIndex((i) => i.destination === item.destination)
  //     // );

  //     // Set to state
  //     // setSectorListTo(uniqueCombinedList);

  //     // console.log("combinedList",combinedList);

  //     // finally set 'from' value for react-select
  //     setFrom(item);
  //   }
  // };

  //   const handleSelect = async (item) => {
  //   if (!item) {
  //     setFrom(null);
  //     return;
  //   } else {
  //     // if (item.source === "getSectorListNew") {
  //     //   setCondition(0);
  //     const selectedCity = item.city_name;
  //     const airportCode = item.airport_code;

  //     console.log("selectedCity", selectedCity);

  //     setDepCityCode(airportCode ? airportCode : item.city_code);
  //     setSelectedValue(`${selectedCity} (${airportCode})`);
  //     setIsDropdownOpen(false);
  //     setSelectedValue2("");
  //     setTo("");
  //     setSearchTerm("");
  //     setSearchTerm2("");
  //     setSelectedDate(null);
  //     setDate1("");
  //     setSearchFlightListData([]);
  //     setSearchFlightListDataCheap([]);
  //     setDefaultMonth("");
  //     setSelectedIndex(null);

  //     console.log("getSectorListNew", getSectorListNew);

  //     // const filteredSectors = getSectorListNew
  //     //   .filter((sector) => sector.Sector.startsWith(selectedCity + " //"))
  //     //   .map((sector) => ({
  //     //     destination: sector.Sector.split(" // ")[1].trim(),
  //     //     DestinationCode: sector.Destination,
  //     //   }))
  //     //   .sort((a, b) => a.destination.localeCompare(b.destination));

  //     // setSectorListTo(filteredSectors);
  //     // console.log("filteredSectors", filteredSectors);

  //     const filteredSectors = getSectorListNew
  //       .filter((sector) => {
  //         const [originCity] = sector.Sector.split(" // ");
  //         return originCity.trim() === selectedCity;
  //       })
  //       .map((sector) => ({
  //         city_name: sector.Sector.split(" // ")[1].trim(),
  //         city_code: sector.Destination,
  //         airport_code:airportCode,
  //         airport_name:"",
  //       }))
  //       .sort((a, b) => a.city_name.localeCompare(b.city_name));

  //     console.log("Filtered Sectors", filteredSectors);
  //     setSectorListTo(filteredSectors);

  //     // } else if (item.source === "getDepatureCityList") {
  //     console.log("123", item);
  //     setCondition(1);
  //     setSelectedValue(`${item.city_name} (${item.airport_code})`);
  //     // setSearchTerm("");
  //     // ArrivalCityList(item.city_code);
  //     const data = await ArrivalCityList(item.airport_code);
  //     console.log("data-->", data);

  //     SectorList(item.city_code);
  //     // setDepCityCode(item.city_code);
  //     // setIsDropdownOpen(false);
  //     // setDefaultMonth("");
  //     setDefaultMonth2("");
  //     // setSelectedDate(null);
  //     setSelectedDate2(null);
  //     setSelectedValue2("");
  //     // setSearchFlightListData([]);
  //     // setSearchFlightListDataCheap([]);
  //     // setSelectedIndex(null);
  //     // }

  //     // Normalize `sortedCities` to match structure of `filteredSectors`
  //     const mappedSortedCities = data.map((city) => ({
  //       city_name: city.city_name,
  //       city_code: city.city_code,
  //       airport_code:airportCode,
  //       airport_name:"",
  //     }));

  //     // Combine both arrays
  //     const combinedList = [...filteredSectors, ...mappedSortedCities];

  //     const groupedTo = groupBy2(combinedList, "city_name");

  //     console.log("groupedTo", groupedTo);

  //     var arr2 = [];
  //     arr2.push(groupedTo);

  //     const formattedGroupedCitiesTo = Object.entries(groupedTo).map(
  //       ([cityName, cityArray]) => {
  //         const item = cityArray[0]; // just take the first item per city
  //         return {
  //           value: item.city_code,
  //           label:
  //             `${item.destination} ${item.city_code} ${item.airport_name}`.trim(),
  //           ...item,
  //         };
  //       }
  //     );

  //     console.log("formattedGroupedCitiesTo", formattedGroupedCitiesTo);

  //     setSectorListTo(formattedGroupedCitiesTo);

  //     // // Remove duplicates based on destination name
  //     // const uniqueCombinedList = combinedList.filter(
  //     //   (item, index, self) =>
  //     //     index === self.findIndex((i) => i.destination === item.destination)
  //     // );

  //     // Set to state
  //     // setSectorListTo(uniqueCombinedList);

  //     // console.log("combinedList",combinedList);

  //     // finally set 'from' value for react-select
  //     setFrom(item);
  //   }
  // };

  const handleSelect = async (item, skipToReset = false) => {
    console.log('parth-1', JSON.stringify(item, null , 2));
    
    if (!item) {
      setFrom(null);
      return;
    }

    // if (from?.city_code === item.city_code) return;

    const selectedCity = item.city_name;
    const airportCode = item.airport_code ?? item.city_code;
    // const airportCode = from ? from.city_code : (item.airport_code ?? item.city_code);
    setDepCityCode(item.airport_code ?? item.city_code);
    setSelectedValue(`${selectedCity} (${airportCode})`);
    setIsDropdownOpen(false);

    // if (!skipToReset) {
      
      setSelectedValue2("");   // only reset "To" if not skipping
      setTo(null);
      setSearchTerm2("");
      setSelectedDate(null);
      setDate1("");
      setSearchFlightListData([]);
      setSearchFlightListDataCheap([]);
      setDefaultMonth("");
      setSelectedIndex(null);
    // }

    const filteredSectors = getSectorListNew
      .filter((sector) => {
        const [originCity] = sector.Sector.split(" // ");
        return originCity.trim() === selectedCity;
      })
      .map((sector) => ({
        city_name: sector.Sector.split(" // ")[1].trim(),
        city_code: sector.Destination,
        airport_code: sector.Destination,
        airport_name: "",
      }))
      .sort((a, b) => a.city_name.localeCompare(b.city_name));

    setSectorListTo(filteredSectors);
    setCondition(1);

    

    const arrivalData = await ArrivalCityList(airportCode);
    SectorList(item.city_code);
    setDefaultMonth2("");
    setSelectedDate2(null);
    // if (!skipToReset) {
      setSelectedValue2("");  // again, only clear this if not skipping
    // }

    

    const mappedSortedCities = arrivalData?.map((city) => ({
      city_name: city.city_name,
      city_code: city.city_code,
      airport_code: city.city_code,
      airport_name: "",
    }));

   let combinedList = selected === 1
  ? [...mappedSortedCities]
  : [...filteredSectors, ...mappedSortedCities];

    // const combinedList = [...filteredSectors, ...mappedSortedCities];
    console.log("combinedList",combinedList);
    
    
    const groupedTo = groupBy2(combinedList, "city_name");

    const formattedGroupedCitiesTo = Object.entries(groupedTo).map(
      ([cityName, cityArray]) => {
        const item = cityArray[0];
        return {
          value: item.city_code,
          label: `${item.city_name} ${item.city_code} ${item.airport_name}`.trim(),
          ...item,
        };
      }
    );
    setFrom(item);
    setSectorListTo(formattedGroupedCitiesTo);
  };



  const groupBy2 = (array, key) => {
    return array.reduce((result, currentItem) => {
      const groupKey = currentItem[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentItem);
      return result;
    }, {});
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

  // const handleSelect2 = (item) => {
  //   if (!item) {
  //     setTo(null);
  //     return;
  //   } else {
  //     setDate1("");
  //     setSelectedDate(null);
  //     setDefaultMonth(null);

  //     // if (getCondition === 0) {
  //     // setSelectedValue2(`${item.destination} (${item.DestinationCode})`);
  //     setSelectedValue2(item.city_name);
  //     setSearchTerm2("");
  //     setArrCityCode(item.city_code);
  //     setIsDropdownOpen2(false);
  //     getOnwardDate(item.city_code);
  //     if (userRole === "2") {
  //       dateAvailability(item.city_code);
  //     } else if (userRole === "3") {
  //       dateAvailabilitySupplier(item.city_code);
  //     }
  //     // } else if (getCondition === 1) {
  //     // setSelectedValue2(`${item.city_name} (${item.airport_code})`);
  //     setSearchTerm2("");
  //     ArrivalCityList(getDepCityCode);
  //     setArrCityCode(item.city_code);

  //     setIsDropdownOpen2(false);
  //     // }

  //     setTo(item); // set the selected option in state      
  //   }
  // };


  const handleSelect2 = (item) => {
     console.log('parth-2', JSON.stringify(item, null , 2));
     setrecentswap(0);
    if (!item) {
      setTo(null);
      return;
    }

    // Avoid unnecessary resets if selecting the same city
    if (to?.city_code === item.city_code) return;

    setTo(item); // Set early

    setDate1("");
    setSelectedDate(null);
    setDefaultMonth(null);
    setSelectedValue2(item.city_name);
    setSearchTerm2("");
    setArrCityCode(item.city_code);
    setIsDropdownOpen2(false);

    getOnwardDate(from?.city_code || getDepCityCode, item.city_code);

    if (userRole === "2") {
      // dateAvailability(item.city_code);
      dateAvailability(from?.city_code || getDepCityCode, item.city_code);

    } else if (userRole === "3") {
      dateAvailabilitySupplier(item.city_code);
    }

    // ArrivalCityList(getDepCityCode); // to refresh options possibly
    ArrivalCityList(from?.city_code || getDepCityCode); // use updated 'from' directly if available

  };


  const onChange = (date, dateString) => {
    console.log("dateString", dateString);
    console.log("date", date);

    const momentDate = moment(dateString, "ddd D/M");
    const formattedDate = momentDate.format("YYYY-MM-DD");
    // const formattedDate = moment(date).format("YYYY-MM-DD");

    console.log("formattedDateString", formattedDate);

    setDate1(formattedDate); // Store formatted date in state
    setSelectedDate(date);

    if (selected == 1) {
      getReturnDate(formattedDate, 1, getArrCityCode); // Pass formatted date
    }
    setIsDatePickerOpen(false);
  };

  const onChange2 = (date, dateString) => {
    const formattedDate = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
    setDate2(formattedDate);
    setSelectedDate2(date);
  };

  const disablePastDates = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0); // Disable dates before today
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

      // console.log("futureDates",futureDates);
      


      const defaultmonth = futureDates[0];

      setDefaultMonth(defaultmonth);
      setAvailableMonths(months);
      console.log("defaultmonth set:", defaultmonth.format("YYYY-MM-DD"));
    } else {
      // No dates available — reset state immediately
      setDefaultMonth(null);
      setAvailableMonths([]);
      console.log("No available dates — defaultMonth cleared");
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
    // const formattedDate = current.format("YYYY-MM-DD");
    // const onwardDates = (onewdatetest || []).map(item => item?.onward_date);

    // const formattedAvailableDates = (Availdatetest || []).map(item => item
    // );

    // const allDates = [...onwardDates, ...formattedAvailableDates];

    // console.log('allDates-->', allDates);

    return !allDates.includes(formattedDate);
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

  useEffect(() => {
    fetchData();
  }, [selected]);

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

      // console.log("departureData123", departureData);

      mergeData(departureData, sectorData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch Departure City List
  const DepatureCityList = async (selected) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();
    setdepcitylistload(true);

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
      // console.log("12336sssada", items);

      const data = await response.json();

      if (data.replyCode === "success") {
        setdepcitylistload(false);
        // console.log("Raw Departure Data:", data.data);
        return data.data.map((item) => ({
          ...item,
          source: "getDepatureCityList", // Identify the source
        }));
      } else {
        setdepcitylistload(false);
        return [];
      }
    } catch (error) {
      setdepcitylistload(false);
      console.error("Error fetching departure city list:", error);
      return [];
    }
  };

  const GetSectorsIQ = async () => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    setdepcitylistload(true);
    try {
      const response = await axios.get(sectorscurl,
        // proxy + "https://omairiq.azurewebsites.net/sectors",
        {
          headers: {
            "api-key": API_KEY,
            Authorization: token,
            Accept: ACCEPT_HEADER,
          },
        }
      );

      if (response.data.status === "success") {
        setdepcitylistload(false);
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
        setdepcitylistload(false);
        return [];
      }
    } catch (error) {
      setdepcitylistload(false);
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

    if (selected == 1) {
      const merged = [...departureData]; // Combine both arrays

      // Sort the merged data alphabetically by city_name
      merged.sort((a, b) => {
        if (a.city_name < b.city_name) return -1;
        if (a.city_name > b.city_name) return 1;
        return 0;
      });

      const grouped = groupBy(merged, "city_name");

      // console.log("grouped",grouped);

      var arr = [];
      arr.push(grouped);

      const formattedGroupedCities = Object.entries(grouped).map(
        ([cityName, cityArray]) => {
          const item = cityArray[0]; // just take the first item per city
          return {
            value: item.city_code,
            label:
              `${item.city_name} ${item.airport_code} ${item.airport_name}`.trim(),
            ...item,
          };
        }
      );

      console.log(
        "formattedGroupedCities",
        JSON.stringify(formattedGroupedCities, null, 2)
      );
      setMergedData(formattedGroupedCities);
      console.log("formattedGroupedCities123", formattedGroupedCities);
    } else {
      const merged = [...departureData, ...sectorData]; // Combine both arrays

      // Sort the merged data alphabetically by city_name
      merged.sort((a, b) => {
        if (a.city_name < b.city_name) return -1;
        if (a.city_name > b.city_name) return 1;
        return 0;
      });

      const grouped = groupBy(merged, "city_name");

      // console.log("grouped",grouped);

      var arr = [];
      arr.push(grouped);

      const formattedGroupedCities = Object.entries(grouped).map(
        ([cityName, cityArray]) => {
          const item = cityArray[0]; // just take the first item per city
          return {
            value: item.airport_code,
            label:
              `${item.city_name} ${item.airport_code} ${item.airport_name}`.trim(),
            ...item,
          };
        }
      );

      console.log(
        "formattedGroupedCities",
        JSON.stringify(formattedGroupedCities, null, 2)
      );
      setMergedData(formattedGroupedCities);
    }
  };

  const groupBy = (array, key) => {
    return array.reduce((result, currentItem) => {
      const groupKey = currentItem[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentItem);
      return result;
    }, {});
  };

  const ArrivalCityList = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();
    setarrcitylistload(true);
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
        setarrcitylistload(false);
        console.log("Response from API:", data);
        const sortedCities = data.data.sort((a, b) => {
          if (a.city_name < b.city_name) return -1;
          if (a.city_name > b.city_name) return 1;
          return 0;
        });

        setSectorListTo2(sortedCities);

        return sortedCities;
        // Notification("success", "Success!", data.message);
      } else {
        setarrcitylistload(false);
        // Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      setarrcitylistload(false);
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
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

  const getOnwardDate = async (dep_city_code,citycode) => {
   
    

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
    setSearchFlightListDataCheap([]);
    // setSearchFlightListData([]);
    const originCode = recentItem ? recentItem.departure_city_code : from?.city_code;
    const destinationCode = recentItem ? recentItem.arrival_city_code : to?.city_code;
    const formattedDate = moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD");
    console.log("formattedDate", date1);

    // const formattedDate1 = moment(defaultMonth, "DD-MM-YYYY").format(
    //   "YYYY-MM-DD"
    // );
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
          // dep_city_code: recentItem
          //   ? recentItem.departure_city_code
          //   : getDepCityCode,
          dep_city_code: originCode,
          // arr_city_code: recentItem
          //   ? recentItem.arrival_city_code
          //   : getArrCityCode,
          arr_city_code: destinationCode,
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

            const prices = data?.data
              ?.map((item) =>
                getCondition === 0 ? item?.price : item?.per_adult_child_price
              )
              .filter((price) => price !== undefined && price !== null);

            const minPrice = Math.min(...prices);
            setLowestPrice(minPrice);
            setSearchFlightListDataCheap(data.data);

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
            // setSearchFlightListData([]);
          }
        } catch (error) {
          setSearchFlightListLoading(false);
          console.error("Error while fetching departure city list:", error);
          // Notification("error", "Error!", "Failed to fetch data");
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

        // console.log("defaultMonth._i__",defaultMonth._i);
        

        const payload = {
          trip_type: selected,
          end_user_ip: "183.83.43.117",
          token: token,
          // dep_city_code: recentItem
          //   ? recentItem.departure_city_code
          //   : getDepCityCode,
          dep_city_code: originCode,
          // arr_city_code: recentItem
          //   ? recentItem.arrival_city_code
          //   : getArrCityCode,
          arr_city_code: destinationCode,
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

            const prices = data?.data
              ?.map((item) =>
                getCondition === 0 ? item?.price : item?.per_adult_child_price
              )
              .filter((price) => price !== undefined && price !== null);

            const minPrice = Math.min(...prices);
            setLowestPrice(minPrice);

            setSearchFlightListDataCheap(data.data);
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
            // setSearchFlightListData([]);
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
          // Notification("error", "Error!", "Failed to fetch data");
        }
      }
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
    console.log("Clicked item:", item);
    if(recentswap == 0){
      setrecentswap(1);
    }else{}
    

    // Step 1: Create From Option manually
    const fromOption = {
      value: item?.departure_city_code || item?.city_code,
      label: item?.departure_city,
      airport_name: item?.departure_airport_name,
      airport_code: item?.departure_city_code,
      city_name: item?.departure_city,
    };
    console.log("fromOption", fromOption);

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
    console.log("toOption", toOption);
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

    // if (item?.get_condition == 0) {
    searchFlightData(true, item);
    // } else if (item?.get_condition == 1) {
    searchFlight(true, item);
    // }
  };

  const dateAvailability = async (originCode,destinationcode) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    const headers = new Headers(ACCEPT_HEADER1);
  headers.append("Authorization",token);

    console.log("getDepCityCode",originCode);
    

    const payload = {
      // origin: getDepCityCode,
      origin: originCode,
      destination: destinationcode,
    };

    try {
      const response = await fetch(availabilitycurl,
       
        {
          method: "POST",
          headers: headers,
          Authorization: token,
          body: JSON.stringify(payload),
          redirect: "follow"
        }
      );

      const data = await response.json();

      if (data.status === "success") {
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
        console.log("defaultmonth", defaultmonth);

        // Notification("success", "Success!", data.message);
      } else {
        // Notification("error", "Error!", data.message || "Something went wrong");
        setAvailableDate([]);
        setSelectedDate("");
        setDefaultMonth("");
        console.log("elseeee");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
    }
  };

  const dateAvailabilitySupplier = async (destinationcode) => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    const headers = new Headers(ACCEPT_HEADER1);
    headers.append("Authorization",token);

    const payload = {
      origin: getDepCityCode,
      destination: destinationcode,
    };

    try {
      const response = await fetch(supplieravailabilitycurl,
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
          redirect: "follow"
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

        // const months = [
        //   ...new Set(
        //     formattedDates.map((item) => moment(item).format("YYYY-MM"))
        //   ),
        // ];

        // const defaultmonth = moment(formattedDates[0], "YYYY-MM-DD"); // Ensure correct format
        // setDefaultMonth(defaultmonth);
        // setAvailableMonths(months);

        // console.log("defaultmonth._i", defaultmonth);

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
    // console.log("1111111111111");
  const originCode = recentItem
  ? recentItem.departure_city_code
  : !from?.airport_code
  ? from?.city_code
  : from?.airport_code;

    const destinationCode = recentItem ? recentItem.arrival_city_code : to?.city_code;
    console.log("originCode",originCode);
    
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));
    const headers = new Headers(ACCEPT_HEADER1);
    headers.append("Authorization",token);

    setSearchCondition2(false);

    const formattedDate =
      date1 || moment(defaultMonth, "DD-MMM-YYYY").format("YYYY/MM/DD");

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

      console.log("formattedDate", formattedDate);
      console.log("date1", date1);
      console.log("DEPARTURE DATE", departureDate);
      // console.log("Seleceted", selected);

      const payload = {
        // origin: recentItem ? recentItem.departure_city_code : getDepCityCode,
        origin: originCode,
        // destination: recentItem ? recentItem.arrival_city_code : getArrCityCode,
        destination: destinationCode,
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

      console.log("getCondition11111111111111", getCondition);

      let apiUrl = "";

      if (userRole === "2") {
        // apiUrl = proxy + "https://omairiq.azurewebsites.net/search";
        apiUrl = searchcurl;
      } else if (userRole === "3") {
        // apiUrl = proxy + "https://omairiq.azurewebsites.net/suppliersearch";
        apiUrl = suppliersearchcurl;
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
            headers: headers,
            Authorization: token,
            body: JSON.stringify(payload),
            redirect: "follow"
            },
           

        );

        // Parse the JSON response
        const data = await response.json();

        // if (data.status === "success") {
        //   console.log("Response Search Data from API airiq:", data.data);
        //   const prices = data?.data
        //     ?.map((item) =>
        //        item?.price
        //     )
        //     .filter((price) => price !== undefined && price !== null);

        //   const minPrice = Math.min(...prices);

        //   setSearchFlightListData(data.data);
        //   setbookingtokenid(data.booking_token_id);
        //   setSearchFlightListDatamsg(data.message);
        //   setSearchFlightListLoading(false);
        //   if (!isRecentClick) {
        //     RecentSearch2(
        //       selectedValue,
        //       selectedValue2,
        //       travellers?.adult,
        //       travellers?.child,
        //       travellers?.infant,
        //       totalTravellers,
        //       departureDate ? departureDate : selectedIndex.departure_date,
        //       getDepCityCode
        //         ? getDepCityCode
        //         : selectedIndex.departure_city_code,
        //       getArrCityCode ? getArrCityCode : selectedIndex.arrival_city_code,
        //       getCondition,
        //       minPrice
        //     );
        //   }
        // } else if (data.status === "success" && data.message === "Data not found") {
        // setSearchCondition2(true);
        // }
        // else {
        //   setSearchFlightListLoading(false);
        //   Notification(
        //     "error",
        //     "Error!",
        //     data.message || "Something went wrong"
        //   );
        // }

        if (data.status === "success" && data.message === "Data not found") {
          setSearchCondition2(true);
          setSearchFlightListData([]); // optional: clear existing data
          setSearchFlightListDatamsg(data.message);
          setSearchFlightListLoading(false);
        } else if (data.status === "success") {
          // Handle real data case
          const prices = data?.data
            ?.map((item) => item?.price)
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
              getDepCityCode || selectedIndex.departure_city_code,
              getArrCityCode || selectedIndex.arrival_city_code,
              getCondition,
              minPrice
            );
          }
        } else {
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
        // Notification("error", "Error!", "Failed to fetch data");
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

  // const formattedCities = mergedData.map((item) => (

  //   {

  //   value: item.city_code,
  //   label: `${item.city_name} ${item.airport_code} ${item.airport_name}`.trim(),
  //   ...item,
  // }));

  //   const uniqueCities = formattedCities.filter(
  //   (city, index, self) =>
  //     index === self.findIndex((c) => c.city_name === city.city_name)
  // );

  // console.log("formattedCities",uniqueCities);

  const formattedCitiesTo = getSectorListTo.map((item) => {
    if (getCondition === 0) {
      return {
        value: item.DestinationCode,
        label: `${item.destination} (${item.DestinationCode})`,
        ...item, // retain full object for later
      };
    } else {
      return {
        value: item.city_code,
        label: `${item.city_name} ${item.airport_code} ${item.airport_name}`,
        ...item, // retain full object for later
      };
    }
  });

  return (
    // <>
    //  <section className="containerr container">
    //   <div className="vector-image d-block d-md-none d-xxl-block">
    //     <svg xmlns viewBox="0 0 1414 319" fill="none">
    //       <path
    //         className="path"
    //         d="M-0.5 215C62.4302 220.095 287 228 373 143.5C444.974 72.7818 368.5 -3.73136 320.5 1.99997C269.5 8.08952 231.721 43.5 253.5 119C275.279 194.5 367 248.212 541.5 207.325C675.76 175.867 795.5 82.7122 913 76.7122C967.429 73.9328 1072.05 88.6813 1085 207.325C1100 344.712 882 340.212 922.5 207.325C964.415 69.7967 1354 151.5 1479 183.5"
    //         stroke="#ECECF2"
    //         stroke-width="4"
    //         stroke-linecap="round"
    //         stroke-dasharray="round"
    //       ></path>
    //       <path
    //         className="dashed"
    //         d="M-0.5 215C62.4302 220.095 287 228 373 143.5C444.974 72.7818 368.5 -3.73136 320.5 1.99997C269.5 8.08952 231.721 43.5 253.5 119C275.279 194.5 367 248.212 541.5 207.325C675.76 175.867 795.5 82.7122 913 76.7122C967.429 73.9328 1072.05 88.6813 1085 207.325C1100 344.712 882 340.212 922.5 207.325C964.415 69.7967 1354 151.5 1479 183.5"
    //         stroke="#212627"
    //         stroke-width="4"
    //         stroke-linecap="round"
    //         stroke-dasharray="22 22"
    //       ></path>
    //     </svg>
    //   </div>
    //   <div className="row gap-4 gap-lg-0 align-items-center justify-content-center">
    //     <div className="col-12 col-lg-5 leftside">
    //       <div className="content-block">
    //         <h1 className="heroleftsidetext">
    //           <span>Book</span> Your Dream <span>Flights</span> Now!
    //         </h1>
    //         <p className="mt-3 col-lg-10">
    //           Book your dream flights now and turn your travel aspirations into
    //           reality! Whether you're planning a relaxing getaway, an
    //           adventurous trip, or a visit to loved ones, we have the perfect
    //           options tailored just for you.
    //         </p>

    //         <button
    //           className="herobookbtn"
    //           onClick={() => handleScroll("#bookingcont")}
    //         >
    //           BOOK NOW
    //         </button>
    //       </div>
    //     </div>
    //     <div className="col-12 col-md-7 imgsec">
    //       <img src={images.Plane} className="planeimg" alt="Aeroplane image" />
    //     </div>
    //   </div>
    // </section>
    // </>

    <section className="containerr container-fluid">
      <div className="E9x1-card">
        <div className="E9width60">
          <div className="W5IJ-mod-limit-width">
            <h2 className="AQWr-mod-margin-bottom-xlarge c0qPo">
              {/* <span>Compare flight deals from 100s of sites</span> */}
              <span>Compare flight deals from 100s of sites</span>
              <span className="c9DqH">.</span>
            </h2>
            <div className="tabs-container">
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className="tab-wrapper"
                  onClick={() => setSelectedtab(tab.key)}
                >
                  <div
                    className={`tab-icon-box ${selectedtab === tab.key ? "active" : ""
                      }`}
                  >
                    {tab.icon}
                  </div>
                  <div className="tab-name">{tab.name}</div>
                </div>
              ))}
            </div>
            <div className="J_T2">
              <div className="J_T2-header">
                <div
                  className="dropdown-wrapper"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>{selectedOption}</span>
                  <span className="arrow">
                    <FaChevronDown />
                  </span>{" "}
                </div>
                {isOpen && (
                  <div className="dropdown-options">
                    {options.map((opt) => (
                      <div
                        key={opt}
                        className={`dropdown-option ${opt === selectedOption ? "active" : ""
                          } ${opt === "Multi-city" ? "disabled" : ""}`}
                        onClick={() => handleSelecttripoption(opt)}
                        style={
                          opt === "Multi-city"
                            ? { cursor: "not-allowed", opacity: 0.5 }
                            : {}
                        }
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flight-search-bar">
              <div className="from-section">
                <Select
                  value={from}
                  onChange={handleSelect}
                  options={mergedData}
                  isLoading={depcitylistload}
                  styles={customStyles}
                  isClearable={true}
                  placeholder="From?"
                  formatOptionLabel={(data, { context }) => {
                    if (context === "menu") {
                      // Dropdown open hoy tyare
                      return (
                        <div>
                          <div>{data.city_name}</div>
                          <div style={{ fontSize: "12px" }}>
                            {data.airport_name}{" "}
                            <span style={{ color: "#f45500" }}>
                              ({data.airport_code})
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      // Input field ma (select thaya pachi)
                      return (
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
              </div>

              <button disabled={recentswap == 1 ? true : false} className="swap-button" onClick={swapLocations}>
                <FaExchangeAlt
                  className={isSwapping ? "spin" : ""}
                  color="#000"
                />
              </button>

              <div className="to-section">
                <Select
                  value={to}
                  onChange={handleSelect2}
                  options={getSectorListTo}
                  isLoading={arrcitylistload}
                  styles={customStyles}
                  placeholder="To?"
                  isClearable={true}
                  formatOptionLabel={(data, { context }) => {
                    if (context === "menu") {
                      // Dropdown open hoy tyare
                      return (
                        <div>
                          <div>
                            {data.city_name ? data.city_name : data.destination}
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
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          {data.city_name ? data.city_name : data.destination}{" "}
                          {""}
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
              </div>

              <div className="custom-date-picker">
                <DatePicker
                  onChange={onChange}
                  placeholder="Departure"
                  format="ddd D/M"
                  disabledDate={disableAllExceptApiDates}
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
                    className={`${selected === 0 && getCondition === 1
                      ? "disabledatepicker"
                      : "custom-date-picker"
                      }`}
                  >
                    <DatePicker
                      disabled={selected == 0 ? true : false}
                      style={{ opacity: selected == 0 ? 0.6 : 1 }}
                      onChange={onChange2}
                      format="ddd D/M"
                      disabledDate={disableDates}
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
                          onClick={() => handleCounterChange("infant", -1)}
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
                    <div className="mt-3 fw-bold text-dark">Cabin Class</div>
                    <div className="d-flex gap-3 flex-wrap mt-2">
                      {classes.map((classOption) => (
                        <div
                          key={classOption}
                          className={`classselekt ${selectedClass === classOption ? "selected" : ""
                            }`}
                          onClick={() => setSelectedClass(classOption)}
                        >
                          {classOption}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="search-button"
                onClick={() => {
                  // setRecentSearchCondition(true);
                  // if (getCondition == 0) {
                  searchFlightData();
                  // setSelectedIndex(null);
                  // } else if (getCondition == 1) {
                  searchFlight();
                  setSelectedIndex(null);
                  // }
                }}
              >
                <FaSearch />
              </button>
              <button
                className="search-buttonRes"
                onClick={() => {
                  // setRecentSearchCondition(true);

                  // if (getCondition == 0) {
                  searchFlightData();
                  setSelectedIndex(null);
                  // } else if (getCondition == 1) {
                  // searchFlight();
                  // setSelectedIndex(null);
                  // }
                }}
              >
                Search
              </button>
            </div>
            {/* <div className="AQWr-mod-margin-top-small voEJ-cmp2-direct-wrapper"></div> */}
            {/* <div className="AQWr-mod-margin-top-small voEJ-cmp2-direct-wrapper"></div> */}
            {/* <div className="AQWr-mod-margin-top-small voEJ-cmp2-direct-wrapper"></div> */}
          </div>
        </div>
        <div className="E9width40">
          <div className="d-flex gap-4 chalisninicheno">
            <div className="d-flex flex-column gap-4 zeel-1">
              <img
                src={images.flight1}
                className="rounded-xl object-cover h-24 md:h-32"
                style={{ width: "220px", height: "220px" }}
              />
              <img
                src={images.flight2}
                className="rounded-xl object-cover h-40 md:h-48"
                style={{ width: "220px", height: "220px" }}
              />
              <img
                src={images.flight3}
                className="rounded-xl object-cover h-32 md:h-40"
                style={{ width: "220px", height: "220px" }}
              />
            </div>

            <div className="d-flex flex-column gap-4 zeel-2">
              <img
                src={images.flight4}
                className="rounded-xl object-cover h-24 md:h-32"
                style={{ width: "220px", height: "220px" }}
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
            </div>
          </div>
        </div>
      </div>

      {getSearchFlightListLoading === true ? (
        <div>
          <div
            style={{
              width: "100%",
              // height: "80vh",
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
      ) : (
        <>
          {getSeachCondition === true && getSeachCondition2 === true ? (
            <>
              <p className="no_flight_search_line2">No Flights Available.</p>
            </>
          ) : (
            <>
              {/* {getSearchFlightListData?.length > 0  || getSearchFlightListDataCheap > 0 ?  (
              
                <>
                  <div className="flightcounter2">
                    <h5 className="hero_ticket_book_resp_font_size2">
                      We have{" "}
                      <span>{getSearchFlightListData?.length ? getSearchFlightListData?.length : getSearchFlightListDataCheap?.length} Flight</span> from{" "}
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
              )} */}

              {(getSearchFlightListData?.length > 0 ||
                getSearchFlightListDataCheap?.length > 0) && (
                  <>
                    <div
                      className="flightcounter2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 className="hero_ticket_book_resp_font_size2">
                        We have{" "}
                        <span>
                          {getSearchFlightListData?.length
                            ? getSearchFlightListData.length
                            : getSearchFlightListDataCheap.length}{" "}
                          Flight
                        </span>{" "}
                        from{" "}
                        <span>
                          {getSearchFlightListDataCheap[0]?.dep_city_code
                            ? getSearchFlightListDataCheap[0].dep_city_code
                            : getSearchFlightListData[0]?.origin}
                        </span>{" "}
                        to{" "}
                        <span>
                          {getSearchFlightListDataCheap[0]?.arr_city_code
                            ? getSearchFlightListDataCheap[0].arr_city_code
                            : getSearchFlightListData[0]?.destination}
                        </span>{" "}
                        {totalTravellers} Traveller
                      </h5>
                      <Select
                        options={optionss}
                        onChange={handleChanges}
                        placeholder={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <FaSort /> Flight Sort
                          </div>
                        }
                        styles={customStyles2}
                        isSearchable={false}
                      />
                    </div>
                  </>
                )}

              {/* {getSeachCondition === true ? (
                <>
                  <p className="no_flight_search_line">No Flights Available.</p>
                </>
              ) : ( */}
              <>
                {getfiltercondation ? (

                  <>
                    {[...getfilerdata].map((item, index) => {
                      const calculateDuration = (departure, arrival) => {
                        const depTime = moment(departure, "HH:mm");
                        const arrTime = moment(arrival, "HH:mm");
                        const duration = moment.duration(arrTime.diff(depTime));
                        return `${Math.floor(
                          duration.asHours()
                        )}h ${duration.minutes()}m`;
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
                                        const airline = item.airline;

                                        {
                                          /* getCondition === 1
                                            ? item.airline_name
                                            : item.airline; */
                                        }

                                        return airline === "IndiGo Airlines" ||
                                          airline === "IndiGo" ? (
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
                                      {/* {getCondition == 0 ? (
                                        <>{item?.airline}</>
                                      ) : (
                                        <>{item?.airline_name}</>
                                      )} */}

                                      {item?.airline}
                                    </div>
                                  </div>
                                  <div className="flight-details2 col-12 col-lg-6 justify-content-center">
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.departure_time}</>
                                        ) : (
                                          <>{item?.dep_time}</>
                                        )} */}
                                        {item?.departure_time}
                                      </h5>
                                      <h5 className="airportname2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.origin}</>
                                        ) : (
                                          <>{item?.dep_city_name}</>
                                        )} */}
                                        {item?.origin}
                                      </h5>

                                      <p className="alldate2">
                                        {/* {getCondition == 0 ? (
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
                                        )} */}
                                        {moment(item?.departure_date).format(
                                          "DD-MM-YYYY"
                                        )}{" "}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                                      <span className="text-dark">From</span>
                                      <div className="from-to text-center">
                                        <h6 className="text-dark">
                                          {/* {getCondition == 0 ? (
                                            <>
                                              {calculateDuration(
                                                item?.departure_time,
                                                item?.arival_time
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {item?.duration &&
                                                `${item.duration.split(":")[0]
                                                }h ${item.duration.split(":")[1]
                                                }min`}
                                            </>
                                          )} */}
                                          {calculateDuration(
                                            item?.departure_time,
                                            item?.arival_time
                                          )}
                                        </h6>
                                        <img
                                          src={images.invertedviman}
                                          alt=""
                                          className="imagerouteplane"
                                        />
                                        <h6 className="text-dark">
                                          {/* {getCondition == 0 ? (
                                            <>{item?.flight_route}</>
                                          ) : (
                                            <>{item?.no_of_stop} stop</>
                                          )} */}
                                          {item?.flight_route}
                                        </h6>
                                      </div>
                                      <span className="text-dark">To</span>
                                    </div>
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.arival_time}</>
                                        ) : (
                                          <>{item?.arr_time}</>
                                        )} */}
                                        {item?.arival_time}
                                      </h5>
                                      <h5 className="airportname2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.destination}</>
                                        ) : (
                                          <>{item?.arr_city_name}</>
                                        )} */}
                                        {item?.destination}
                                      </h5>
                                      <p className="alldate2">
                                        {/* {getCondition == 0 ? (
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
                                        )} */}
                                        {moment(item?.arival_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </p>
                                    </div>
                                  </div>
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
                                            ) : airline ===
                                              "Air India Express" ? (
                                              <img
                                                src={
                                                  images.Air_India_Express_logo
                                                }
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

                                        <div className="planecomp2">
                                          {getCondition == 0 ? (
                                            <>{item?.airline}</>
                                          ) : (
                                            <>{item?.airline_name}</>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flight-details col-12 col-lg-6 justify-content-center">
                                        <div className="flight-departure text-center">
                                          <h5 className="flighttime2">
                                            {
                                              item?.return_flight_data
                                                ?.return_dep_time
                                            }
                                          </h5>
                                          <h5 className="airportname2">
                                            {
                                              item?.return_flight_data
                                                ?.return_dep_city_name
                                            }
                                          </h5>
                                          <p className="alldate2">
                                            {moment(
                                              item?.return_flight_data
                                                ?.return_dep_date
                                            ).format("DD-MM-YYYY")}
                                          </p>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                                          <span className="text-dark">
                                            From
                                          </span>
                                          <div className="from-to text-center">
                                            <h6 className="text-dark">
                                              {`${item?.return_flight_data?.return_trip_duration}h`}
                                            </h6>
                                            <img
                                              src={images.invertedviman}
                                              alt=""
                                              className="imagerouteplane"
                                            />
                                            <h6 className="text-dark">
                                              {item?.return_no_of_stop} Stop
                                            </h6>
                                          </div>
                                          <span className="text-dark">To</span>
                                        </div>
                                        <div className="flight-departure text-center">
                                          <h5 className="flighttime2">
                                            {
                                              item?.return_flight_data
                                                ?.return_arr_time
                                            }
                                          </h5>
                                          <h5 className="airportname2">
                                            {
                                              item?.return_flight_data
                                                ?.return_arr_city_name
                                            }
                                          </h5>
                                          <p className="alldate2">
                                            {moment(
                                              item?.return_flight_data
                                                ?.return_arr_date
                                            ).format("DD-MM-YYYY")}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div className="col-12 col-lg-3 nanolito2 d-flex justify-content-center">
                                <div className="pricediv col-lg-3 mb-3 mb-lg-0">
                                  <div className="d-flex align-items-center">
                                    <FaRupeeSign size={20} color="#000" />
                                    <h4 className="text-dark fw-bold dijit">
                                      {/* {getCondition == 0 ? (
                                        <>{item?.price}</>
                                      ) : (
                                        <>{item?.per_adult_child_price}</>
                                      )} */}

                                      {item?.price}
                                    </h4>
                                  </div>

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
                                        getCondition: item?.airline ? 0 : 1,
                                      }}
                                      className="bookBtn2"
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
                                    const airline =
                                      getCondition === 1
                                        ? item.airline_name
                                        : item.airline;

                                    return airline === "IndiGo Airlines" ||
                                      airline === "IndiGo" ? (
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
                                      <IoAirplaneSharp
                                        size={40}
                                        color="white"
                                      />
                                    );
                                  })()}
                                </div>
                                <div className="mob_time_cont">
                                  <div className="mob_time_row">
                                    <div className="mob_time">
                                      {getCondition == 0 ? (
                                        <>{item?.departure_time}</>
                                      ) : (
                                        <>{item?.dep_time}</>
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        width: "50px",
                                      }}
                                    >
                                      -------
                                    </div>
                                    <div className="mob_time">
                                      {getCondition == 0 ? (
                                        <>{item?.arival_time}</>
                                      ) : (
                                        <>{item?.arr_time}</>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mob_time_row justify-content-between">
                                    <div className="mob_city_kode">
                                      {getCondition == 0 ? (
                                        <>{item?.departure_time}</>
                                      ) : (
                                        <>{item?.dep_airport_code}</>
                                      )}
                                    </div>
                                    <div className="mob_duration">
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
                                            `${item.duration.split(":")[0]}h ${item.duration.split(":")[1]
                                            }m`}
                                        </>
                                      )}
                                    </div>
                                    <div className="mob_city_kode">
                                      {getCondition == 0 ? (
                                        <>{item?.destination}</>
                                      ) : (
                                        <>{item?.arr_city_code}</>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mob_Amount">
                                <div className="mob_rupi_icon">
                                  <div>
                                    <FaIndianRupeeSign size={20} />
                                  </div>
                                  <div className="mob_amount">
                                    {getCondition == 0 ? (
                                      <>{item?.price}</>
                                    ) : (
                                      <>{item?.per_adult_child_price}</>
                                    )}
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
                              <div className="mob_book_airlineNm">
                                {getCondition == 0 ? (
                                  <>{item?.airline}</>
                                ) : (
                                  <>{item?.airline_name}</>
                                )}
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
                                      bookingtokenid: bookingtokenid,
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

                ) : (
                  <>
                    {[...sortedFlights].map((item, index) => {
                      const calculateDuration = (departure, arrival) => {
                        const depTime = moment(departure, "HH:mm");
                        const arrTime = moment(arrival, "HH:mm");
                        const duration = moment.duration(arrTime.diff(depTime));
                        return `${Math.floor(
                          duration.asHours()
                        )}h ${duration.minutes()}m`;
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
                                        const airline = item.airline;

                                        {
                                          /* getCondition === 1
                                            ? item.airline_name
                                            : item.airline; */
                                        }
                                        {
                                          console.log(
                                            "airline name",
                                            item.airline
                                          );
                                        }
                                        return airline === "IndiGo Airlines" ||
                                          airline === "IndiGo" ? (
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
                                      {/* {getCondition == 0 ? (
                                        <>{item?.airline}</>
                                      ) : (
                                        <>{item?.airline_name}</>
                                      )} */}

                                      {item?.airline}
                                    </div>
                                  </div>
                                  <div className="flight-details2 col-12 col-lg-6 justify-content-center">
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.departure_time}</>
                                        ) : (
                                          <>{item?.dep_time}</>
                                        )} */}
                                        {item?.departure_time}
                                      </h5>
                                      <h5 className="airportname2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.origin}</>
                                        ) : (
                                          <>{item?.dep_city_name}</>
                                        )} */}
                                        {item?.origin}
                                      </h5>

                                      <p className="alldate2">
                                        {/* {getCondition == 0 ? (
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
                                        )} */}
                                        {moment(item?.departure_date).format(
                                          "DD-MM-YYYY"
                                        )}{" "}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                                      <span className="text-dark">From</span>
                                      <div className="from-to text-center">
                                        <h6 className="text-dark">
                                          {/* {getCondition == 0 ? (
                                            <>
                                              {calculateDuration(
                                                item?.departure_time,
                                                item?.arival_time
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {item?.duration &&
                                                `${item.duration.split(":")[0]
                                                }h ${item.duration.split(":")[1]
                                                }min`}
                                            </>
                                          )} */}
                                          {calculateDuration(
                                            item?.departure_time,
                                            item?.arival_time
                                          )}
                                        </h6>
                                        <img
                                          src={images.invertedviman}
                                          alt=""
                                          className="imagerouteplane"
                                        />
                                        <h6 className="text-dark">
                                          {/* {getCondition == 0 ? (
                                            <>{item?.flight_route}</>
                                          ) : (
                                            <>{item?.no_of_stop} stop</>
                                          )} */}
                                          {item?.flight_route}
                                        </h6>
                                      </div>
                                      <span className="text-dark">To</span>
                                    </div>
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.arival_time}</>
                                        ) : (
                                          <>{item?.arr_time}</>
                                        )} */}
                                        {item?.arival_time}
                                      </h5>
                                      <h5 className="airportname2">
                                        {/* {getCondition == 0 ? (
                                          <>{item?.destination}</>
                                        ) : (
                                          <>{item?.arr_city_name}</>
                                        )} */}
                                        {item?.destination}
                                      </h5>
                                      <p className="alldate2">
                                        {/* {getCondition == 0 ? (
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
                                        )} */}
                                        {moment(item?.arival_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </p>
                                    </div>
                                  </div>
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
                                            ) :  airline === "AirAsia" ? (
                                              <img
                                                src={images.airasia}
                                                className="airline_logo"
                                              />
                                            ) : airline ===
                                              "Air India Express" ? (
                                              <img
                                                src={
                                                  images.Air_India_Express_logo
                                                }
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

                                        <div className="planecomp2">
                                          {getCondition == 0 ? (
                                            <>{item?.airline}</>
                                          ) : (
                                            <>{item?.airline_name}</>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flight-details col-12 col-lg-6 justify-content-center">
                                        <div className="flight-departure text-center">
                                          <h5 className="flighttime2">
                                            {
                                              item?.return_flight_data
                                                ?.return_dep_time
                                            }
                                          </h5>
                                          <h5 className="airportname2">
                                            {
                                              item?.return_flight_data
                                                ?.return_dep_city_name
                                            }
                                          </h5>
                                          <p className="alldate2">
                                            {moment(
                                              item?.return_flight_data
                                                ?.return_dep_date
                                            ).format("DD-MM-YYYY")}
                                          </p>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                                          <span className="text-dark">
                                            From
                                          </span>
                                          <div className="from-to text-center">
                                            <h6 className="text-dark">
                                              {`${item?.return_flight_data?.return_trip_duration}h`}
                                            </h6>
                                            <img
                                              src={images.invertedviman}
                                              alt=""
                                              className="imagerouteplane"
                                            />
                                            <h6 className="text-dark">
                                              {item?.return_no_of_stop} Stop
                                            </h6>
                                          </div>
                                          <span className="text-dark">To</span>
                                        </div>
                                        <div className="flight-departure text-center">
                                          <h5 className="flighttime2">
                                            {
                                              item?.return_flight_data
                                                ?.return_arr_time
                                            }
                                          </h5>
                                          <h5 className="airportname2">
                                            {
                                              item?.return_flight_data
                                                ?.return_arr_city_name
                                            }
                                          </h5>
                                          <p className="alldate2">
                                            {moment(
                                              item?.return_flight_data
                                                ?.return_arr_date
                                            ).format("DD-MM-YYYY")}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div className="col-12 col-lg-3 nanolito2 d-flex justify-content-center">
                                <div className="pricediv col-lg-3 mb-3 mb-lg-0">
                                  <div className="d-flex align-items-center">
                                    <FaRupeeSign size={20} color="#000" />
                                    <h4 className="text-dark fw-bold dijit">
                                      {/* {getCondition == 0 ? (
                                        <>{item?.price}</>
                                      ) : (
                                        <>{item?.per_adult_child_price}</>
                                      )} */}

                                      {item?.price}
                                    </h4>
                                  </div>

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
                                        getCondition: item?.airline ? 0 : 1,
                                      }}
                                      className="bookBtn2"
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
                                    const airline =
                                      getCondition === 1
                                        ? item.airline_name
                                        : item.airline;

                                    return airline === "IndiGo Airlines" ||
                                      airline === "IndiGo" ? (
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
                                      <IoAirplaneSharp
                                        size={40}
                                        color="white"
                                      />
                                    );
                                  })()}
                                </div>
                                <div className="mob_time_cont">
                                  <div className="mob_time_row">
                                    <div className="mob_time">
                                      {getCondition == 0 ? (
                                        <>{item?.departure_time}</>
                                      ) : (
                                        <>{item?.dep_time}</>
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        width: "50px",
                                      }}
                                    >
                                      -------
                                    </div>
                                    <div className="mob_time">
                                      {getCondition == 0 ? (
                                        <>{item?.arival_time}</>
                                      ) : (
                                        <>{item?.arr_time}</>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mob_time_row justify-content-between">
                                    <div className="mob_city_kode">
                                      {getCondition == 0 ? (
                                        <>{item?.departure_time}</>
                                      ) : (
                                        <>{item?.dep_airport_code}</>
                                      )}
                                    </div>
                                    <div className="mob_duration">
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
                                            `${item.duration.split(":")[0]}h ${item.duration.split(":")[1]
                                            }m`}
                                        </>
                                      )}
                                    </div>
                                    <div className="mob_city_kode">
                                      {getCondition == 0 ? (
                                        <>{item?.destination}</>
                                      ) : (
                                        <>{item?.arr_city_code}</>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mob_Amount">
                                <div className="mob_rupi_icon">
                                  <div>
                                    <FaIndianRupeeSign size={20} />
                                  </div>
                                  <div className="mob_amount">
                                    {getCondition == 0 ? (
                                      <>{item?.price}</>
                                    ) : (
                                      <>{item?.per_adult_child_price}</>
                                    )}
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
                              <div className="mob_book_airlineNm">
                                {getCondition == 0 ? (
                                  <>{item?.airline}</>
                                ) : (
                                  <>{item?.airline_name}</>
                                )}
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
                                      bookingtokenid: bookingtokenid,
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

                <>
                  {[...sortedCheapFlights].map((item, index) => {
                    const calculateDuration = (departure, arrival) => {
                      const depTime = moment(departure, "HH:mm");
                      const arrTime = moment(arrival, "HH:mm");
                      const duration = moment.duration(arrTime.diff(depTime));
                      return `${Math.floor(
                        duration.asHours()
                      )}h ${duration.minutes()}m`;
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
                                      const airline =
                                        getCondition === 1
                                          ? item.airline_name
                                          : item.airline;

                                      return airline === "IndiGo Airlines" ||
                                        airline === "IndiGo" ? (
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
                                          color="white"
                                        />
                                      );
                                    })()}
                                  </div>

                                  <div className="planecomp2">
                                    {getCondition == 0 ? (
                                      <>{item?.airline}</>
                                    ) : (
                                      <>{item?.airline_name}</>
                                    )}
                                  </div>
                                </div>
                                <div className="flight-details2 col-12 col-lg-6 justify-content-center">
                                  <div className="flight-departure text-center">
                                    <h5 className="flighttime2">
                                      {getCondition == 0 ? (
                                        <>{item?.departure_time}</>
                                      ) : (
                                        <>{item?.dep_time}</>
                                      )}
                                    </h5>
                                    <h5 className="airportname2">
                                      {getCondition == 0 ? (
                                        <>{item?.origin}</>
                                      ) : (
                                        <>{item?.dep_city_name}</>
                                      )}
                                    </h5>

                                    <p className="alldate2">
                                      {getCondition == 0 ? (
                                        <>
                                          {moment(item?.departure_date).format(
                                            "DD-MM-YYYY"
                                          )}{" "}
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
                                    <span className="text-dark">From</span>
                                    <div className="from-to text-center">
                                      <h6 className="text-dark">
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
                                              `${item.duration.split(":")[0]
                                              }h ${item.duration.split(":")[1]
                                              }min`}
                                          </>
                                        )}
                                      </h6>
                                      <img
                                        src={images.invertedviman}
                                        alt=""
                                        className="imagerouteplane"
                                      />
                                      <h6 className="text-dark">
                                        {getCondition == 0 ? (
                                          <>{item?.flight_route}</>
                                        ) : (
                                          <>{item?.no_of_stop} stop</>
                                        )}
                                      </h6>
                                    </div>
                                    <span className="text-dark">To</span>
                                  </div>
                                  <div className="flight-departure text-center">
                                    <h5 className="flighttime2">
                                      {getCondition == 0 ? (
                                        <>{item?.arival_time}</>
                                      ) : (
                                        <>{item?.arr_time}</>
                                      )}
                                    </h5>
                                    <h5 className="airportname2">
                                      {getCondition == 0 ? (
                                        <>{item?.destination}</>
                                      ) : (
                                        <>{item?.arr_city_name}</>
                                      )}
                                    </h5>
                                    <p className="alldate2">
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
                                          ) : airline ===
                                            "Air India Express" ? (
                                            <img
                                              src={
                                                images.Air_India_Express_logo
                                              }
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

                                      <div className="planecomp2">
                                        {getCondition == 0 ? (
                                          <>{item?.airline}</>
                                        ) : (
                                          <>{item?.airline_name}</>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flight-details col-12 col-lg-6 justify-content-center">
                                      <div className="flight-departure text-center">
                                        <h5 className="flighttime2">
                                          {
                                            item?.return_flight_data
                                              ?.return_dep_time
                                          }
                                        </h5>
                                        <h5 className="airportname2">
                                          {
                                            item?.return_flight_data
                                              ?.return_dep_city_name
                                          }
                                        </h5>
                                        <p className="alldate2">
                                          {moment(
                                            item?.return_flight_data
                                              ?.return_dep_date
                                          ).format("DD-MM-YYYY")}
                                        </p>
                                      </div>
                                      <div className="d-flex align-items-center gap-2 gap-lg-3">
                                        <span className="text-dark">From</span>
                                        <div className="from-to text-center">
                                          <h6 className="text-dark">
                                            {`${item?.return_flight_data?.return_trip_duration}h`}
                                          </h6>
                                          <img
                                            src={images.invertedviman}
                                            alt=""
                                            className="imagerouteplane"
                                          />
                                          <h6 className="text-dark">
                                            {item?.return_no_of_stop} Stop
                                          </h6>
                                        </div>
                                        <span className="text-dark">To</span>
                                      </div>
                                      <div className="flight-departure text-center">
                                        <h5 className="flighttime2">
                                          {
                                            item?.return_flight_data
                                              ?.return_arr_time
                                          }
                                        </h5>
                                        <h5 className="airportname2">
                                          {
                                            item?.return_flight_data
                                              ?.return_arr_city_name
                                          }
                                        </h5>
                                        <p className="alldate2">
                                          {moment(
                                            item?.return_flight_data
                                              ?.return_arr_date
                                          ).format("DD-MM-YYYY")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="col-12 col-lg-3 nanolito2 d-flex justify-content-center">
                              <div className="pricediv col-lg-3 mb-3 mb-lg-0">
                                <div className="d-flex align-items-center">
                                  <FaRupeeSign size={20} color="#000" />
                                  <h4 className="text-dark fw-bold dijit">
                                    {getCondition == 0 ? (
                                      <>{item?.price}</>
                                    ) : (
                                      <>{item?.per_adult_child_price}</>
                                    )}
                                  </h4>
                                </div>

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
                                    className="bookBtn2"
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
                                  const airline =
                                    getCondition === 1
                                      ? item.airline_name
                                      : item.airline;

                                  return airline === "IndiGo Airlines" ||
                                    airline === "IndiGo" ? (
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
                                      className="airline_logo2_mob"
                                    />
                                  ) : (
                                    <IoAirplaneSharp size={40} color="white" />
                                  );
                                })()}
                              </div>
                              <div className="mob_time_cont">
                                <div className="mob_time_row">
                                  <div className="mob_time">
                                    {getCondition == 0 ? (
                                      <>{item?.departure_time}</>
                                    ) : (
                                      <>{item?.dep_time}</>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      width: "50px",
                                    }}
                                  >
                                    -------
                                  </div>
                                  <div className="mob_time">
                                    {getCondition == 0 ? (
                                      <>{item?.arival_time}</>
                                    ) : (
                                      <>{item?.arr_time}</>
                                    )}
                                  </div>
                                </div>
                                <div className="mob_time_row justify-content-between">
                                  <div className="mob_city_kode">
                                    {getCondition == 0 ? (
                                      <>{item?.departure_time}</>
                                    ) : (
                                      <>{item?.dep_airport_code}</>
                                    )}
                                  </div>
                                  <div className="mob_duration">
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
                                          `${item.duration.split(":")[0]}h ${item.duration.split(":")[1]
                                          }m`}
                                      </>
                                    )}
                                  </div>
                                  <div className="mob_city_kode">
                                    {getCondition == 0 ? (
                                      <>{item?.destination}</>
                                    ) : (
                                      <>{item?.arr_city_code}</>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mob_Amount">
                              <div className="mob_rupi_icon">
                                <div>
                                  <FaIndianRupeeSign size={20} />
                                </div>
                                <div className="mob_amount">
                                  {getCondition == 0 ? (
                                    <>{item?.price}</>
                                  ) : (
                                    <>{item?.per_adult_child_price}</>
                                  )}
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
                            <div className="mob_book_airlineNm">
                              {getCondition == 0 ? (
                                <>{item?.airline}</>
                              ) : (
                                <>{item?.airline_name}</>
                              )}
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
                                    bookingtokenid: bookingtokenid,
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
              </>

              {/* )} */}
            </>
          )}

          {login == "true" ? (
            <>
              <div className="recent-searches-wrapper">
                <h2 className="recent_search_head">Recent Searches</h2>
                {RecentSelection.length > 0 &&
                  RecentSelection.filter((item) =>
                    selected == 1 ? item?.is_return == 1 : item?.is_return == 0
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
                                {item.departure_city?.split(" (")[0]} <b>›</b>{" "}
                                {item.arrival_city?.split(" (")[0]}
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
                                {item.is_return == 0 ? "One Way" : "Round Trip"}
                              </div>
                            </div>

                            <div className="recent_search_icon_flex recent_search_icon_flex_last">
                              <img
                                className="recent_search_icons"
                                src={images.rupees}
                                alt=""
                              />
                              <div className="price"></div>
                              <b style={{ fontSize: "24px" }}>{item.price}</b>
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
      )}
    </section>
  );
};

export default HomeHero;
