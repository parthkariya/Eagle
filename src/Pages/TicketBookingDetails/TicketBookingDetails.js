import React, { useEffect, useState } from "react";
import "./TicketBookingDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import axios from "axios";
import Notification from "../../Utils/Notification";
import ReactModal from "react-modal";
import { IoAirplaneSharp } from "react-icons/io5";
import {
  ACCEPT_HEADER,
  Booking,
  booking,
  get_booking,
} from "../../Utils/Constant";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const PrevMembers = [
  {
    category: "Adult",
    members: [
      { id: 1, fname: "John", lname: "Doe", gender: "male" },
      { id: 2, fname: "Jane", lname: "Doe", gender: "female" },
    ],
  },
  {
    category: "Child",
    members: [
      { id: 3, fname: "Alice", lname: "Doe", gender: "male" },
      { id: 4, fname: "Bob", lname: "Doe", gender: "male" },
    ],
  },
  {
    category: "Infant",
    members: [
      {
        id: 5,
        fname: "Baby",
        lname: "Doe",
        dob: "2024-01-15",
        gender: "female",
      },
      {
        id: 6,
        fname: "Baby",
        lname: "Smith",
        dob: "2024-03-22",
        gender: "male",
      },
    ],
  },
];

const TicketBookingDetails = () => {
  const location = useLocation();
  const [item, setItem] = useState(location.state?.item || null);

  console.log("Itemmm", item);

  const [ttltraveller, setttltraveller] = useState(
    location.state?.totaltraveller || 1
  );

  const [adulttraveler, setadulttraveler] = useState(
    location.state?.adulttraveler
  );
  const [childtraveler, setchildtraveler] = useState(
    location.state?.childtraveler
  );
  const [infanttraveler, setinfanttraveler] = useState(
    location.state?.infanttraveler
  );
  const [bookingtokenid, setbookingtokenid] = useState(
    location.state?.bookingtokenid
  );
  const [ticketid, setticketid] = useState(location.state?.ticket_id);
  const [selected, setselected] = useState(location.state?.selected);
  const [getCondition, setCondition] = useState(location.state?.getCondition);
  const [userRole, setUserRole] = useState("");
  const [bookingapi, setBookingApi] = useState([]);
  const [bookingapiload, setBookingApiLoad] = useState(false);
  const [childmemberAdult, setChildMemberAdult] = useState([]);
  const [childmemberChild, setChildMemberChild] = useState([]);
  const [childmemberInfant, setChildMemberInfant] = useState([]);

  const animatedComponents = makeAnimated();
  const [age, setAge] = useState(null);
  const [login, SetLogin] = useState("");
  const [getBookingData, setBookingData] = useState();
  const [getBookingData2, setBookingData2] = useState();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [bookingID, setBookingID] = useState("");
  const [referanceId, setReferenceId] = useState("");

  const calculateDuration = (departure, arrival) => {
    const depTime = moment(departure, "HH:mm");
    const arrTime = moment(arrival, "HH:mm");
    const duration = moment.duration(arrTime.diff(depTime));
    return `${Math.floor(duration.asHours())}h ${duration.minutes()}m`;
  };

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    SetLogin(islogin);

    var role = localStorage.getItem("is_role");
    setUserRole(JSON.parse(role));
    BookingApi();
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload(false);
  }

  const BookingApi = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    setBookingApiLoad(true);
    try {
      const res = await axios.get(get_booking, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get Booking Api", res.data);

      if (res.data.success === 1) {
        setBookingApi(res.data.data);
        setBookingApiLoad(false);
      } else if (res.data.status === "Token is Expired") {
        logout();
        setBookingApiLoad(false);
        console.log("Get BOoking Api", res.data.message);
      } else {
        setBookingApiLoad(false);
      }
    } catch (error) {
      console.log("Error", error);
      setBookingApiLoad(false);
    }
  };

  const API_KEY =
    "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

  const isLocalhost = window.location.hostname === "localhost";
  const proxy = isLocalhost ? "https://cors-anywhere.herokuapp.com/" : "";

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disabledDate2 = (current) => {
    const today = dayjs();
    const twoYearsAgo = today.subtract(2, "year");
    return (
      current &&
      (current.isBefore(twoYearsAgo, "day") || current.isAfter(today, "day"))
    );
  };

  let navigate = useNavigate();

  const getTravelerFields = (getCondition) => {
    if (getCondition === 1) {
      return {
        fname: "",
        lname: "",
        email: "",
        number: "",
        gender: null,
        dob: null,
        age: "",
        passport_expire_date: null,
        passport_no: "",
      };
    } else {
      return {
        fname: "",
        lname: "",
        gender: null,
      };
    }
  };

  const getChildFields = (getCondition) => {
    if (getCondition === 1) {
      return {
        fname: "",
        lname: "",
        email: "",
        number: "",
        gender: null,
        dob: null,
        age: "",
        passport_expire_date: null,
        passport_no: "",
      };
    } else {
      return {
        fname: "",
        lname: "",
        gender: null,
        dob: null,
      };
    }
  };
  const getInfantFields = (getCondition) => {
    if (getCondition === 1) {
      return {
        fname: "",
        lname: "",
        email: "",
        number: "",
        gender: null,
        dob: null,
        age: "",
        passport_expire_date: null,
        passport_no: "",
      };
    } else {
      return {
        fname: "",
        lname: "",
        gender: null,
        dob: null,
      };
    }
  };

  const [travelers, setTravelers] = useState(
    Array.from({ length: adulttraveler }, () => getTravelerFields(getCondition))
  );
  const [childtravelers, setChildTravelers] = useState(
    Array.from({ length: childtraveler }, () => getChildFields(getCondition))
  );
  const [infanttravelers, setInfantTravelers] = useState(
    Array.from({ length: infanttraveler }, () => getInfantFields(getCondition))
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberSelect = (member, memberId, cat) => {
    const genderObject =
      member.gender === 1
        ? genderOptions.find((option) => option.value === "male")
        : member.gender === 2
        ? genderOptions.find((option) => option.value === "female")
        : genderOptions.find((option) => option.value === "other");

    const calculateAge = (dob) => {
      if (!dob) return "";
      return dayjs().diff(dayjs(dob), "years");
    };

    const getTravelerFields = (member) => {
      if (getCondition === 1) {
        return {
          fname: member.first_name,
          lname: member.last_name,
          gender: genderObject,
          email: member.email || "",
          number: member.phone_no || "",
          dob: member?.dob || null,
          age: calculateAge(member.dob),
          passport_no: member.passport_no || "",
          passport_expire_date: member.passport_expiry_date || "",
        };
      } else {
        return {
          fname: member.first_name,
          lname: member.last_name,
          gender: genderObject,
        };
      }
    };

    const getEmptyFields = () => {
      if (getCondition === 1) {
        return {
          fname: "",
          lname: "",
          gender: null,
          email: "",
          number: "",
          dob: null,
          age: "",
          passport_no: "",
          passport_expire_date: "",
        };
      } else {
        return {
          fname: "",
          lname: "",
          gender: null,
        };
      }
    };

    const updateTravelers = (prevTravelers, extraData = {}) => {
      const updatedTravelers = [...prevTravelers];

      // If only one slot exists, always replace the existing member and prevent deselection
      if (updatedTravelers.length === 1) {
        return [{ ...getTravelerFields(member), ...extraData }];
      }

      // Check if the member is already selected
      const existingIndex = updatedTravelers.findIndex(
        (t) => t.fname === member.first_name && t.lname === member.last_name
      );

      if (existingIndex !== -1) {
        // Allow deselection only if there are multiple slots
        if (updatedTravelers.length > 1) {
          updatedTravelers[existingIndex] = getEmptyFields();
        }
      } else {
        // Find the first empty slot and replace it
        const emptyIndex = updatedTravelers.findIndex((t) => t.fname === "");
        if (emptyIndex !== -1) {
          updatedTravelers[emptyIndex] = {
            ...getTravelerFields(member),
            ...extraData,
          };
        }
      }

      return updatedTravelers;
    };

    if (cat === "Adult") {
      setTravelers((prevTravelers) => updateTravelers(prevTravelers));
    } else if (cat === "Child") {
      setChildTravelers((prevTravelers) => updateTravelers(prevTravelers));
    } else if (cat === "Infant") {
      setInfantTravelers((prevTravelers) => {
        const formattedDate = dayjs(member.dob).format("YYYY-MM-DD");
        return updateTravelers(prevTravelers, { dob: formattedDate });
      });
    }

    // Update selected members list correctly
    setSelectedMembers((prevSelected) => {
      // Prevent deselection if only one slot exists
      if (prevSelected.includes(memberId)) {
        return prevSelected.filter((id) => id !== memberId); // Remove if already selected
      }

      return [...prevSelected, memberId]; // Allow multiple selections
    });
  };

  const handleInputChangeAdult = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };
  const handleInputChangeChild = (index, field, value) => {
    const updatedTravelers = [...childtravelers];
    updatedTravelers[index][field] = value;
    setChildTravelers(updatedTravelers);
  };
  const handleInputChangeInfant = (index, field, value) => {
    const updatedTravelers = [...infanttravelers];
    updatedTravelers[index][field] = value;
    setInfantTravelers(updatedTravelers);
  };

  const [check, setCheck] = useState(false);
  const currentDate = new Date();
  let hasInvalidInfant = false;

  // Iterate through travelers
  travelers.forEach((traveler) => {
    const dob = new Date(traveler.dob);
    const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25); // Calculate age in years

    // Check if this traveler is considered an infant (age should be between 0 and 2)
    if (traveler.age < 0 || traveler.age > 2) {
      if (traveler.age < 0 || traveler.age > 2) {
        hasInvalidInfant = true;
      }
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    // Check if the user is logged in
    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return; // Stop execution
    }

    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];

      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Adult Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Adult Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Adult Traveler ${i + 1}.`);
        return;
      }
      if (getCondition == 1) {
        if (!traveler.number || traveler.number.length !== 10) {
          alert(
            `Please enter a valid 10-digit phone number for Adult Traveler ${
              i + 1
            }.`
          );
          return;
        }
      }
    }

    for (let j = 0; j < childtravelers.length; j++) {
      const childtraveler = childtravelers[j];

      if (!childtraveler.fname.trim()) {
        alert(`Please enter the First Name for Child Traveler ${j + 1}.`);
        return;
      }
      if (!childtraveler.lname.trim()) {
        alert(`Please enter the Last Name for Child Traveler ${j + 1}.`);
        return;
      }
      if (!childtraveler.gender) {
        alert(`Please select the Gender for Child Traveler ${j + 1}.`);
        return;
      }
      if (getCondition == 1) {
        if (!childtraveler.number || childtraveler.number.length !== 10) {
          alert(
            `Please enter a valid 10-digit phone number for Child Traveler ${
              j + 1
            }.`
          );
          return;
        }
      }
    }
    for (let k = 0; k < infanttravelers.length; k++) {
      const infatraveler = infanttravelers[k];

      console.log("infant traveler date", infatraveler.dob);

      if (!infatraveler.fname.trim()) {
        alert(`Please enter the First Name for Infant Traveler ${k + 1}.`);
        return;
      }
      if (!infatraveler.lname.trim()) {
        alert(`Please enter the Last Name for Infant Traveler ${k + 1}.`);
        return;
      }
      if (!infatraveler.gender) {
        alert(`Please select the Gender for Infant Traveler ${k + 1}.`);
        return;
      }
      if (!infatraveler.dob) {
        alert(`Please enter the Date of Birth for Infant Traveler ${k + 1}.`);
        return;
      }

      if (getCondition == 1) {
        if (!infatraveler.number || infatraveler.number.length !== 10) {
          alert(
            `Please enter a valid 10-digit phone number for Child Traveler ${
              k + 1
            }.`
          );
          return;
        }
      }
    }
    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    const currentDate = new Date();
    let hasValidAdult = false;
    let hasValidChild = false;
    let hasValidInfant = false;

    infanttravelers.forEach((traveler) => {
      const dob = new Date(traveler.dob);
      const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25); // Calculate age in years

      // if (age >= 12) hasValidAdult = true;
      // if (age >= 2 && age < 12) hasValidChild = true;
      if (age >= 0 && age < 2) hasValidInfant = true;
    });

    // if (adulttraveler > 0 && !hasValidAdult) {
    //   alert("At least one traveler must be 12 years or older if an adult traveler is selected.");
    //   return;
    // }

    // Uncomment this section if you want to enforce child age validation as well
    // if (childtraveler > 0 && !hasValidChild) {
    //   alert("At least one traveler must be between 2 and 12 years old if a child traveler is selected.");
    //   return;
    // }

    if (infanttraveler > 0 && !hasValidInfant) {
      alert(
        "At least one traveler must be between 0 and 2 years old if an infant traveler is selected."
      );
      return;
    }
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip; // Returns the public IP
    } catch (error) {
      console.error("Error fetching public IP:", error);
      return null; // Handle errors by returning null or a default value
    }
  };

  const handleDateChange = (index, date) => {
    if (date) {
      const birthYear = date.year();
      const currentYear = dayjs().year();
      const travelerAge = currentYear - birthYear;
      const updatedTravelers = [...infanttravelers];
      updatedTravelers[index].dob = date.format("YYYY-MM-DD");
      updatedTravelers[index].age = travelerAge;
      setInfantTravelers(updatedTravelers);
    }
  };
  const handleDateChange2 = (index, date) => {
    if (date) {
      const updatedTravelers = [...travelers];
      updatedTravelers[index].passport_expire_date = date.format("YYYY-MM-DD");
      setTravelers(updatedTravelers);
    }
  };

  const handleDateChangeAdult = (index, date) => {
    console.log("HANDLE DATE", index, date);
    console.log("ANother ", dayjs(date).format("YYYY-MM-DD"));
    if (date) {
      const birthYear = date.year();
      const currentYear = dayjs().year();
      const travelerAge = currentYear - birthYear;
      const updatedTravelers = [...travelers];
      updatedTravelers[index].dob = dayjs(date).format("YYYY-MM-DD");
      updatedTravelers[index].age = travelerAge;
      setTravelers(updatedTravelers);
    }
  };
  const handleDateChangeChild = (index, date) => {
    console.log("HANDLE DATE", date);
    if (date) {
      const birthYear = date.year();
      const currentYear = dayjs().year();
      const travelerAge = currentYear - birthYear;
      const updatedTravelers = [...childtravelers];
      updatedTravelers[index].dob = date.format("YYYY-MM-DD");
      updatedTravelers[index].age = travelerAge;
      setChildTravelers(updatedTravelers);
    }
  };
  const handleDateChangeInfant = (index, date) => {
    console.log("HANDLE DATE", date);
    if (date) {
      const birthYear = date.year();
      const currentYear = dayjs().year();
      const travelerAge = currentYear - birthYear;
      const updatedTravelers = [...infanttravelers];
      updatedTravelers[index].dob = date.format("YYYY-MM-DD");
      updatedTravelers[index].age = travelerAge;
      setInfantTravelers(updatedTravelers);
    }
  };

  const togglecheck = () => {
    setCheck(!check);
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const handleInputChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const handleInputChange2 = (index, field, value) => {
    const updatedTravelers = [...childtravelers];
    updatedTravelers[index][field] = value;
    setChildTravelers(updatedTravelers);
  };

  const handleInputChange3 = (index, field, value) => {
    const updatedTravelers = [...infanttravelers];
    updatedTravelers[index][field] = value;
    setInfantTravelers(updatedTravelers);
  };

  const handleGenderChange = (index, selectedOption) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index].gender = selectedOption;
    setTravelers(updatedTravelers);
  };
  const handleGenderChange2 = (index, selectedOption) => {
    const updatedTravelers = [...childtravelers];
    updatedTravelers[index].gender = selectedOption;
    setChildTravelers(updatedTravelers);
  };
  const handleGenderChange3 = (index, selectedOption) => {
    const updatedTravelers = [...infanttravelers];
    updatedTravelers[index].gender = selectedOption;
    setInfantTravelers(updatedTravelers);
  };

  const handleSubmit = async () => {
    const token = JSON.parse(localStorage.getItem("is_token_airiq"));

    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return;
    }

    // Validation for travelers
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];

      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Adult Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Adult Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Adult Traveler ${i + 1}.`);
        return;
      }
    }

    for (let j = 0; j < childtravelers.length; j++) {
      const childtraveler = childtravelers[j];

      if (!childtraveler.fname.trim()) {
        alert(`Please enter the First Name for Child Traveler ${j + 1}.`);
        return;
      }
      if (!childtraveler.lname.trim()) {
        alert(`Please enter the Last Name for Child Traveler ${j + 1}.`);
        return;
      }
      if (!childtraveler.gender) {
        alert(`Please select the Gender for Child Traveler ${j + 1}.`);
        return;
      }
    }
    for (let k = 0; k < infanttravelers.length; k++) {
      const infatraveler = infanttravelers[k];

      if (!infatraveler.fname.trim()) {
        alert(`Please enter the First Name for Infant Traveler ${k + 1}.`);
        return;
      }
      if (!infatraveler.lname.trim()) {
        alert(`Please enter the Last Name for Infant Traveler ${k + 1}.`);
        return;
      }
      if (!infatraveler.gender) {
        alert(`Please select the Gender for Infant Traveler ${k + 1}.`);
        return;
      }
      if (!infatraveler.dob) {
        alert(`Please Enter The Date Of Birth for Infant Traveler ${k + 1}.`);
        return;
      }
    }
    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    const currentDate = new Date();
    let hasValidAdult = false;
    let hasValidChild = false;
    let hasValidInfant = false;

    infanttravelers.forEach((traveler) => {
      const dob = new Date(traveler.dob);
      const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25); // Calculate age in years

      // if (age >= 12) hasValidAdult = true;
      // if (age >= 2 && age < 12) hasValidChild = true;
      if (age >= 0 && age < 2) hasValidInfant = true;
    });

    // if (adulttraveler > 0 && !hasValidAdult) {
    //   alert("At least one traveler must be 12 years or older if an adult traveler is selected.");
    //   return;
    // }

    // Uncomment this section if you want to enforce child age validation as well
    // if (childtraveler > 0 && !hasValidChild) {
    //   alert("At least one traveler must be between 2 and 12 years old if a child traveler is selected.");
    //   return;
    // }

    if (infanttraveler > 0 && hasInvalidInfant) {
      alert("All infant travelers must have an age between 0 and 2 years.");
      return;
    }
    // Constructing traveler details as an array
    const adult_info = travelers.map((traveler) => ({
      title:
        traveler.gender.value === "male"
          ? "Mr."
          : traveler.gender.value === "female"
          ? "Miss"
          : "",
      first_name: traveler.fname,
      // middle_name: "",
      last_name: traveler.lname,
      // age: traveler.age,
      // dob: traveler.dob,
      // passport_no: traveler.passport_no,
      // passport_expire_date: traveler.passport_expire_date,
    }));
    const child_info = childtravelers.map((traveler) => ({
      title:
        traveler.gender.value === "male"
          ? "Mstr."
          : traveler.gender.value === "female"
          ? "Miss"
          : "",
      first_name: traveler.fname,
      // middle_name: "",
      last_name: traveler.lname,
      // age: traveler.age,
      // dob: traveler.dob,
      // passport_no: traveler.passport_no,
      // passport_expire_date: traveler.passport_expire_date,
    }));
    const infant_info = infanttravelers.map((traveler, index) => ({
      title:
        traveler.gender.value === "male"
          ? "Mstr."
          : traveler.gender.value === "female"
          ? "Miss"
          : "",
      first_name: traveler.fname,
      // middle_name: "",
      last_name: traveler.lname,
      // age: traveler.age,
      dob: traveler.dob.replace(/-/g, "/"), // Replaces all hyphens with slashes
      travel_with: (index % adult_info.length) + 1, // passport_no: traveler.passport_no,
      // passport_expire_date: traveler.passport_expire_date,
    }));

    // Constructing JSON payload
    const payload = {
      ticket_id: ticketid,
      total_pax: ttltraveller,
      adult: adulttraveler,
      child: childtraveler,
      infant: infanttraveler,
      adult_info,
      child_info,
      infant_info,
    };

    console.log("Payload:", payload);
    setLoading(true);
    let apiUrl = "";
    //   this whole func. is for getCondition == 0
    if (userRole == "2") {
      apiUrl = proxy + "https://omairiq.azurewebsites.net/book";
    } else if (userRole == "3") {
      apiUrl = proxy + "https://omairiq.azurewebsites.net/supplierbook";
    } else {
      console.error("Invalid selection value");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "api-key": API_KEY,
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status === "success") {
        console.log("API response:", data);
        localStorage.setItem("booking_id", data.booking_id);
        setBookingID(data.booking_id);
        setBookingData(data);
        setLoading(false);
        Notification("success", "Success", data.message);
        // openModal();
        closeModal();
        HandleSubmitOurAPi(data.booking_id);
        navigate("/");
      } else if (data.status === "failed") {
        console.error("API call failed:", response.status, response.status);
        alert(data.message);
        setLoading(false);
      } else setLoading(false);
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
      alert("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmitCheapFix = async () => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = "183.83.43.117";

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    // Check if the user is logged in
    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return; // Stop execution
    }

    // Validation for travelers
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Traveler ${i + 1}.`);
        return;
      }
      if (
        !traveler.passport_expire_date &&
        item?.international_flight_staus == 1
      ) {
        alert(
          `Please select the expiry date of passport for Traveler ${i + 1}.`
        );
        return;
      }
      if (
        !traveler.passport_no.trim() &&
        item?.international_flight_staus == 1
      ) {
        alert(`Please enter the passport number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.email.trim()) {
        alert(`Please enter the Email for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.number.trim()) {
        alert(`Please enter the Phone Number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.dob) {
        alert(`Please enter the Date of Birth for Traveler ${i + 1}.`);
        return;
      }
    }

    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Age Validation
    // const currentDate = new Date();
    // let hasValidAdult = false;
    // let hasValidChild = false;
    // let hasValidInfant = false;

    // travelers.forEach((traveler) => {
    //   const dob = new Date(traveler.dob);
    //   const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25); // Calculate age in years

    //   if (age > 12) hasValidAdult = true;
    //   if (age >= 2 && age <= 12) hasValidChild = true;
    //   if (age >= 0 && age < 2) hasValidInfant = true;
    // });

    // if (adulttraveler > 0 && !hasValidAdult) {
    //   alert(
    //     "At least one traveler must be 12 years or older if an adult traveler is selected."
    //   );
    //   return;
    // }

    // if (childtraveler > 0 && !hasValidChild) {
    //   alert(
    //     "At least one traveler must be between 2 and 12 years old if a child traveler is selected."
    //   );
    //   return;
    // }

    // if (infanttraveler > 0 && !hasValidInfant) {
    //   alert(
    //     "At least one traveler must be between 0 and 2 years old if an infant traveler is selected."
    //   );
    //   return;
    // }

    // Constructing traveler details as an array
    const flight_traveller_details = [
      ...(travelers || []),
      ...(childtravelers || []),
      ...(infanttravelers || []),
    ].map((traveler) => ({
      gender:
        traveler.gender.value === "male"
          ? "Mr"
          : traveler.gender.value === "female"
          ? "Miss"
          : "",

      first_name: traveler.fname,
      middle_name: "",
      last_name: traveler.lname,
      age: traveler.age,
      dob: traveler.dob,
      passport_no: traveler.passport_no,
      passport_expire_date: traveler.passport_expire_date,
    }));

    // Constructing JSON payload
    const payload = {
      id: item.id,
      onward_date: item?.onward_date,
      return_date:
        item?.trip_type == 0 ? "" : item?.return_flight_data?.return_dep_date,
      adult: adulttraveler,
      children: childtraveler,
      infant: infanttraveler,
      dep_city_code: item?.dep_city_code,
      arr_city_code: item?.arr_city_code,
      total_book_seats: ttltraveller,
      contact_name: travelers[0].fname,
      contact_email: travelers[0].email,
      contact_number: travelers[0].number,
      flight_traveller_details,
      booking_token_id: bookingtokenid,
      total_amount: item?.total_payable_price,
      partner_user_id: "0",
      static: item?.static,
      end_user_ip: publicIP,
      token: token,
    };

    console.log("Cheapfix No Payload", payload);
    setLoading(true);
    const url = "https://devapi.fareboutique.com/v1/fbapi/book";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // const data = await response.json();
        console.log("API response:", data);
        setBookingData(data);
        setLoading(false);
        setBookingID(data.data.reference_id);
        // Notification("success", "Success", "Ticket has been booked successfully");
        // openModal();
        closeModal();
        HandleSubmitOurAPi(data.data.reference_id);
      } else if (response.errorCode == 2001) {
        console.error("API call failed:", response.status, response.statusText);
        alert(
          "Failed to submit the form Please check all the Details and try again"
        );
        Notification("error", "Error!", data.errorMessage);
        setLoading(false);
        closeModal();
      } else {
        setLoading(false);
        closeModal();
        Notification("error", "Error!", data.errorMessage);
      }
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
      alert("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const HandleSubmitOurAPi = async (refId) => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    const publicIP = "183.83.43.117"; // This seems hardcoded; fetch dynamically if needed

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return;
    }

    if (!Array.isArray(travelers) || travelers.length === 0) {
      alert("Please add at least one traveler.");
      return;
    }

    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Traveler ${i + 1}.`);
        return;
      }

      if (getCondition == 1) {
        if (
          !traveler.passport_no.trim() &&
          item?.international_flight_status == 1
        ) {
          alert(`Please enter the passport number for Traveler ${i + 1}.`);
          return;
        }
        if (!traveler.email.trim()) {
          alert(`Please enter the Email for Traveler ${i + 1}.`);
          return;
        }
        if (!traveler.number.trim()) {
          alert(`Please enter the Phone Number for Traveler ${i + 1}.`);
          return;
        }
        if (
          !traveler.passport_expire_date &&
          item?.international_flight_staus == 1
        ) {
          alert(
            `Please select the expiry date of passport for Traveler ${i + 1}.`
          );
          return;
        }
        if (!traveler.dob) {
          alert(`Please enter the Date of Birth for Traveler ${i + 1}.`);
          return;
        }
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Traveler ${i + 1}.`);
        return;
      }
    }

    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Age Validation
    // const currentDate = new Date();
    // let hasValidAdult = false,
    //   hasValidChild = false,
    //   hasValidInfant = false;

    // travelers.forEach((traveler) => {
    //   const dob = new Date(traveler.dob);
    //   const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25);

    //   if (age > 12) hasValidAdult = true;
    //   if (age >= 2 && age <= 12) hasValidChild = true;
    //   if (age >= 0 && age < 2) hasValidInfant = true;
    // });

    // if (adulttraveler > 0 && !hasValidAdult) {
    //   alert(
    //     "At least one traveler must be 12 years or older if an adult traveler is selected."
    //   );
    //   return;
    // }

    // if (childtraveler > 0 && !hasValidChild) {
    //   alert(
    //     "At least one traveler must be between 2 and 12 years old if a child traveler is selected."
    //   );
    //   return;
    // }

    // if (infanttraveler > 0 && !hasValidInfant) {
    //   alert(
    //     "At least one traveler must be between 0 and 2 years old if an infant traveler is selected."
    //   );
    //   return;
    // }

    const formdata = new FormData();
    formdata.append(
      "airline_name",
      getCondition === 0 ? item?.airline : item?.airline_name
    );
    formdata.append(
      "airline_code",
      getCondition === 0 ? item?.flight_number : item?.flight_number
    );
    formdata.append(
      "departure_date",
      getCondition === 0 ? item?.departure_date : item?.onward_date
    );
    formdata.append(
      "arrival_date",
      getCondition === 0 ? item?.arival_date : item?.arr_date
    );
    formdata.append(
      "departure_time",
      getCondition === 0 ? item?.departure_time : item?.dep_time
    );
    formdata.append(
      "arrival_time",
      getCondition === 0 ? item?.arival_time : item?.arr_time
    );
    formdata.append("booking_id", refId);
    formdata.append("get_con", getCondition);
    formdata.append(
      "departure_terminal_no",
      getCondition === 0 ? "" : item?.dep_terminal_no
    );
    formdata.append(
      "arrival_terminal_no",
      getCondition === 0 ? "" : item?.arr_terminal_no
    );
    formdata.append(
      "departure_airport_name",
      getCondition === 0 ? "" : item?.dep_airport_name
    );
    formdata.append(
      "arrival_airport_name",
      getCondition === 0 ? "" : item?.arr_airport_name
    );
    formdata.append(
      "departure_city",
      getCondition === 0 ? item?.origin : item?.dep_city_name
    );
    formdata.append(
      "arrival_city",
      getCondition === 0 ? item?.destination : item?.arr_city_name
    );
    formdata.append(
      "stop",
      getCondition === 0
        ? item?.flight_route === "Non - Stop"
          ? 0
          : item?.flight_route
        : item?.no_of_stop
    );
    if (getCondition === 1) {
      if (item?.stop_data.length > 0) {
        for (let j = 0; j < item?.stop_data.length; j++) {
          formdata.append(`stop_city[${j}]`, item?.stop_data[j].city_name);
          formdata.append(
            `stop_arrival[${j}]`,
            item?.stop_data[j].arrival_time
          );
          formdata.append(
            `stop_layover_duration[${j}]`,
            item?.stop_data[j].stop_duration
          );
          formdata.append(
            `stop_departure[${j}]`,
            item?.stop_data[j].departure_time
          );
        }
      }
    } else {
    }
    if (getCondition == 1) {
      formdata.append("is_return", item?.trip_type == 0 ? 0 : 1);
    } else {
      formdata.append("is_return", 0);
    }

    if (item?.trip_type == 1) {
      formdata.append(
        "return_airline_name",
        getCondition == 0 ? "" : item?.airline_name
      );
      formdata.append(
        "return_airline_code",
        getCondition == 0 ? "" : item?.return_flight_number
      );
      formdata.append(
        "return_departure_date",
        getCondition == 0 ? "" : item?.return_flight_data?.return_dep_date
      );
      formdata.append(
        "return_arrival_date",
        getCondition == 0 ? "" : item?.return_flight_data?.return_arr_date
      );
      formdata.append(
        "return_departure_time",
        getCondition == 0 ? "" : item?.return_flight_data?.return_dep_time
      );
      formdata.append(
        "return_arrival_time",
        getCondition == 0 ? "" : item?.return_flight_data?.return_arr_time
      );
      formdata.append(
        "return_departure_city",
        getCondition == 0 ? "" : item?.return_flight_data?.return_dep_city_name
      );
      formdata.append(
        "return_arrival_city",
        getCondition == 0 ? "" : item?.return_flight_data?.return_arr_city_name
      );
      formdata.append(
        "return_stop",
        getCondition == 0 ? "" : item?.return_no_of_stop
      );
      if (item?.return_stop_data.length > 0) {
        for (let k = 0; k < item?.return_stop_data.length; k++) {
          formdata.append(
            `return_stop_city[${k}]`,
            getCondition == 0 ? "" : item?.return_stop_data[k].city_name
          );
          formdata.append(
            `return_stop_arrival[${k}]`,
            getCondition == 0 ? "" : item?.return_stop_data[k].arrival_time
          );
          formdata.append(
            `return_stop_layover_duration[${k}]`,
            getCondition == 0 ? "" : item?.return_stop_data[k].stop_duration
          );
          formdata.append(
            `return_stop_departure[${k}]`,
            getCondition == 0 ? "" : item?.return_stop_data[k].departure_time
          );
        }
      }
    }
    if (getCondition == 0) {
      formdata.append("is_refundable", 0);
    } else {
      formdata.append(
        "is_refundable",
        item?.FareClasses[0].Class_Desc == "Non Refundable (LIVE Booking)"
          ? 0
          : 1
      );
    }
    formdata.append(
      "available_seats",
      getCondition == 0 ? 0 : item?.available_seats
    );
    formdata.append(
      "total_baggage",
      getCondition == 0 ? "" : item?.check_in_baggage_adult
    );
    formdata.append(
      "check_in_adult",
      getCondition == 0 ? "" : item?.check_in_baggage_adult
    );
    formdata.append(
      "check_in_children",
      getCondition == 0 ? "" : item?.check_in_baggage_children
    );
    formdata.append(
      "check_in_infant",
      getCondition == 0 ? "" : item?.check_in_baggage_infant
    );
    formdata.append(
      "cabin_adult",
      getCondition == 0 ? "" : item?.cabin_baggage_adult
    );
    formdata.append(
      "cabin_children",
      getCondition == 0 ? "" : item?.cabin_baggage_children
    );
    formdata.append(
      "cabin_infant",
      getCondition == 0 ? "" : item?.cabin_baggage_infant
    );
    formdata.append("adult_travelers", adulttraveler);
    formdata.append("child_travelers", childtraveler);
    formdata.append("infant_travelers", infanttraveler);
    formdata.append("total_travelers", ttltraveller);
    formdata.append(
      "total_amount",
      getCondition == 0
        ? item?.price * ((adulttraveler || 0) + (childtraveler || 0)) +
            item?.infant_price * (infanttraveler || 0)
        : item?.total_payable_price
    );
    formdata.append(
      "base_fare",
      getCondition == 0
        ? item?.price * ((adulttraveler || 0) + (childtraveler || 0)) +
            item?.infant_price * (infanttraveler || 0)
        : item?.total_payable_price
    );
    formdata.append(
      "discount",
      getCondition == 0 ? "" : item?.price_breakup?.discount
    );
    formdata.append(
      "taxes_and_others",
      getCondition == 0 ? "" : item?.price_breakup?.fee_taxes
    );
    formdata.append(
      "service_fees",
      getCondition == 0 ? "" : item?.price_breakup?.service_charge
    );
    formdata.append(
      "is_international",
      getCondition == 0
        ? 0
        : item?.international_flight_staus == 0
        ? "0"
        : item?.international_flight_staus == 1
        ? "1"
        : ""
    );

    // Loop over Adult travelers
    for (let i = 0; i < travelers.length; i++) {
      let traveler = travelers[i];
      formdata.append(`travelers_id[${i}]`, 0); // 0 for Adults
      formdata.append(`first_name[${i}]`, traveler.fname);
      formdata.append(`last_name[${i}]`, traveler.lname);
      formdata.append(
        `gender[${i}]`,
        traveler.gender?.value === "male"
          ? 1
          : traveler.gender?.value === "female"
          ? 2
          : traveler.gender?.value === "other"
          ? 3
          : ""
      );

      formdata.append(`dob[${i}]`, getCondition == 0 ? "" : traveler.dob);
      formdata.append(`age[${i}]`, getCondition == 0 ? "" : traveler.age);
      formdata.append(`email[${i}]`, getCondition == 0 ? "" : traveler.email);
      formdata.append(
        `phone_no[${i}]`,
        getCondition == 0 ? "" : traveler.number
      );
      if (getCondition == 1) {
        if (item?.international_flight_staus == 1) {
          formdata.append(
            `passport_expiry_date[${i}]`,
            getCondition == 0 ? "" : traveler.passport_expire_date
          );
          formdata.append(`passport_no[${i}]`, traveler.passport_no);
        }
      } else {
      }
    }

    // Loop over Child travelers
    let offset = travelers.length; // Ensure unique index
    for (let i = 0; i < childtravelers.length; i++) {
      let traveler = childtravelers[i];
      formdata.append(`travelers_id[${offset + i}]`, 1); // 1 for Children
      formdata.append(`first_name[${offset + i}]`, traveler.fname);
      formdata.append(`last_name[${offset + i}]`, traveler.lname);
      formdata.append(
        `gender[${offset + i}]`,
        traveler.gender?.value === "male"
          ? 1
          : traveler.gender?.value === "female"
          ? 2
          : traveler.gender?.value === "other"
          ? 3
          : ""
      );
      formdata.append(
        `dob[${offset + i}]`,
        getCondition == 0 ? "" : traveler.dob
      );
      formdata.append(
        `age[${offset + i}]`,
        getCondition == 0 ? "" : traveler.age
      );
      formdata.append(
        `email[${offset + i}]`,
        getCondition == 0 ? "" : traveler.email
      );
      formdata.append(
        `phone_no[${offset + i}]`,
        getCondition == 0 ? "" : traveler.number
      );

      if (getCondition == 1) {
        if (item?.international_flight_staus == 1) {
          formdata.append(
            `passport_expiry_date[${offset + i}]`,
            traveler.passport_expire_date
          );
          formdata.append(`passport_no[${offset + i}]`, traveler.passport_no);
        }
      } else {
      }
    }

    // Loop over Infant travelers
    offset += childtravelers.length; // Ensure unique index
    for (let i = 0; i < infanttravelers.length; i++) {
      let traveler = infanttravelers[i];
      formdata.append(`travelers_id[${offset + i}]`, 2); // 2 for Infants
      formdata.append(`first_name[${offset + i}]`, traveler.fname);
      formdata.append(`last_name[${offset + i}]`, traveler.lname);
      formdata.append(
        `gender[${offset + i}]`,
        traveler.gender?.value === "male"
          ? 1
          : traveler.gender?.value === "female"
          ? 2
          : traveler.gender?.value === "other"
          ? 3
          : ""
      );
      formdata.append(
        `dob[${offset + i}]`,
        getCondition == 0 ? "" : traveler.dob
      );
      formdata.append(
        `age[${offset + i}]`,
        getCondition == 0 ? "" : traveler.age
      );
      formdata.append(
        `email[${offset + i}]`,
        getCondition == 0 ? "" : traveler.email
      );
      formdata.append(
        `phone_no[${offset + i}]`,
        getCondition == 0 ? "" : traveler.number
      );

      if (getCondition == 1) {
        if (item?.international_flight_staus == 1) {
          formdata.append(
            `passport_expiry_date[${offset + i}]`,
            traveler.passport_expire_date
          );
          formdata.append(`passport_no[${offset + i}]`, traveler.passport_no);
        }
      } else {
      }
    }

    console.table(Object.fromEntries(formdata.entries()));

    setLoading2(true);
    try {
      const response = await fetch(Booking, {
        method: "POST",
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
        body: formdata,
      });

      if (response.ok) {
        const data = await response.json();
        setBookingData2(data);
        setLoading2(false);
        Notification(
          "success",
          "Success",
          "Ticket has been booked successfully"
        );
        // openModal();
        closeModal();
        localStorage.setItem("getConditionnn", getCondition);
        navigate("/");
        setTravelers(
          Array.from({ length: adulttraveler }, () => ({
            fname: "",
            lname: "",
            email: "",
            number: "",
            gender: null,
            dob: null,
            age: "",
            passport_expire_date: null,
            passport_no: "",
          }))
        );
        setCheck(false);
      } else {
        alert("Failed to submit the form. Please try again later.");
        setLoading2(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
      setLoading2(false);
    }
  };

  const TravelerCard = ({ member, category, index }) => (
    <div
      className={`d-flex flex-column flex-md-row mb-3 gap-md-4 justify-content-start accordion_select_div ${
        selectedMembers.includes(member.id) ? "selected" : ""
      }`}
      onClick={() => handleMemberSelect(member, member.id, category, index)}
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex">
        {/* <div className="d-none d-md-block">{member?.id}</div> */}
        <div className="d-none d-md-block">{index + 1}</div>
      </div>

      <div className="gap-3 flex-wrap">
        <div>
          <strong style={{ color: "#ff4500" }}> Name: </strong>
          {member.first_name} {member.last_name}
        </div>
        <div>
          <strong style={{ color: "#ff4500" }}> Gender: </strong>
          {member.gender === 1
            ? "Male"
            : member.gender === 2
            ? "Female"
            : "Other"}
        </div>
        {member?.dob === null ? (
          <></>
        ) : (
          <>
            <div>
              <strong style={{ color: "#ff4500" }}> DOB: </strong>
              {member.dob}
            </div>
          </>
        )}

        {member?.email === null ? (
          <></>
        ) : (
          <>
            <div>
              <strong style={{ color: "#ff4500" }}> Email: </strong>
              {member.email}
            </div>
          </>
        )}

        {member?.phone_no === null ? (
          <></>
        ) : (
          <>
            <div>
              <strong style={{ color: "#ff4500" }}> Phone: </strong>
              {member.phone_no}
            </div>
          </>
        )}

        {member.passport_no && (
          <div>
            <strong style={{ color: "#ff4500" }}> Passport No: </strong>
            {member.passport_no}
          </div>
        )}
        {member.passport_expiry_date && (
          <div>
            <strong style={{ color: "#ff4500" }}>
              {" "}
              Passport Expiry Date:{" "}
            </strong>
            {member.passexpiredate}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Booking</title>
      </Helmet>

      {loading === true ? (
        <>
          <div
            style={{
              width: "100%",
              height: "80vh",
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
          <PathHero name={"Flight Booking"} />

          <div className="container-fluid details-contt py-4">
            <div className="bg-cont">
              <div className="row justify-content-center">
                <div className="col-12 col-lg-7 order-2 order-lg-1">
                  <div className="row my-3">
                    <h2 className="fw-bold fs-4 fs-lg-3 text-dark">
                      Previously Booked Members
                    </h2>
                  </div>
                  <Tabs className="tab-main">
                    {bookingapiload ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="loader">
                          <div className="spinner"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Filter and store traveler categories in state */}
                        {(() => {
                          const infants = [];
                          const children = [];
                          const adults = [];

                          bookingapi.forEach((cat) => {
                            cat.child.forEach((c) => {
                              if (c.travelers_id === 2) {
                                infants.push(c);
                              } else if (c.travelers_id === 1) {
                                children.push(c);
                              } else if (c.travelers_id === 0) {
                                adults.push(c);
                              }
                            });
                          });

                          return (
                            <>
                              {/* Fixed Tabs */}
                              <div className="fixed-tablist">
                                <TabList>
                                  <Tab
                                    onClick={() => {
                                      setChildMemberInfant([]);
                                      setChildMemberChild([]);
                                      setChildMemberAdult(adults);
                                    }}
                                  >
                                    Adult ({adults.length})
                                  </Tab>
                                  <Tab
                                    onClick={() => {
                                      setChildMemberInfant([]);
                                      setChildMemberAdult([]);
                                      setChildMemberChild(children);
                                    }}
                                  >
                                    Child ({children.length})
                                  </Tab>

                                  <Tab
                                    onClick={() => {
                                      setChildMemberChild([]);
                                      setChildMemberAdult([]);
                                      setChildMemberInfant(infants);
                                    }}
                                  >
                                    Infant ({infants.length})
                                  </Tab>
                                </TabList>
                              </div>
                              {/* Tab Panels */}
                              <TabPanel>
                                {adults.length > 0 ? (
                                  adults.map((member, index) => (
                                    <TravelerCard
                                      key={member.id}
                                      member={member}
                                      category="Adult"
                                      index={index}
                                    />
                                  ))
                                ) : (
                                  <p>No adults available</p>
                                )}
                              </TabPanel>
                              <TabPanel>
                                {children.length > 0 ? (
                                  children.map((member, index) => (
                                    <TravelerCard
                                      key={member.id}
                                      member={member}
                                      category="Child"
                                      index={index}
                                    />
                                  ))
                                ) : (
                                  <p>No children available</p>
                                )}
                              </TabPanel>
                              <TabPanel>
                                {infants.length > 0 ? (
                                  infants.map((member, index) => (
                                    <TravelerCard
                                      key={member.id}
                                      member={member}
                                      category="Infant"
                                      index={index}
                                    />
                                  ))
                                ) : (
                                  <p>No infants available</p>
                                )}
                              </TabPanel>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </Tabs>
                  <div className="row mt-3">
                    <div className="col-12">
                      <h2 className="fw-bold fs-4 fs-lg-3 text-dark">
                        Enter Your Details
                      </h2>
                      <p className="text-dark">
                        Enter required information for each traveler and be sure
                        that it exactly matches the government-issued ID
                        presented at the airport.
                      </p>
                    </div>
                  </div>
                  <div className="row mt-4 gap-2 align-items-center">
                    <div className="col-12 col-lg-5 d-flex gap-2 align-items-center">
                      <h5 className="fw-bold fs-5 fs-lg-4 text-dark">
                        Total Traveler(s) :
                      </h5>
                      <h5 className="fw-semibold text-white">{ttltraveller}</h5>
                    </div>
                  </div>

                  {travelers.map((traveler, index) => {
                    const isInfant = index >= adulttraveler + childtraveler;
                    return (
                      <div
                        key={index}
                        className="traveler-details mt-4"
                        style={{
                          borderBottom:
                            travelers.length > 1 ? "1px solid #fff" : "",
                          paddingBottom: travelers.length > 1 ? "1rem" : "",
                        }}
                      >
                        <div className="row align-items-center gap-2 mt-3 mb-3">
                          <div className="col-md-5">
                            <h5 className="fs-5 fw-bold text-dark">
                              Adult Traveler {index + 1}
                            </h5>
                          </div>
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">Gender</h4>
                            <Select
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              isMulti={false}
                              options={genderOptions}
                              value={traveler.gender}
                              onChange={(selectedOption) =>
                                handleGenderChange(index, selectedOption)
                              }
                              styles={{
                                container: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#fff",
                                  borderRadius: "10px",
                                }),
                                control: (provided) => ({
                                  ...provided,
                                  backgroundColor: "transparent",
                                  boxShadow: "none",
                                  borderRadius: "10px",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#fff",
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? "#ff4500"
                                    : "transparent",
                                  color: state.isFocused ? "#fff" : "#000",
                                }),
                              }}
                            />
                          </div>
                        </div>

                        <div className="row gap-2">
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">First Name</h4>
                            <input
                              type="text"
                              value={traveler.fname}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "fname",
                                  e.target.value
                                )
                              }
                              className="w-100 p-2 inpttticket"
                            />
                          </div>
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">Last Name</h4>
                            <input
                              type="text"
                              value={traveler.lname}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "lname",
                                  e.target.value
                                )
                              }
                              className="w-100 p-2 inpttticket"
                            />
                          </div>

                          {getCondition === 1 && (
                            <>
                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">
                                  Date Of Birth
                                </h4>
                                <DatePicker
                                  onChange={(date) =>
                                    handleDateChangeAdult(index, date)
                                  }
                                  format="YYYY-MM-DD"
                                  className="w-100 booking_details_datepicker_padding"
                                  // disabledDate={disabledDate2}
                                  value={
                                    travelers[index]?.dob
                                      ? dayjs(travelers[index]?.dob)
                                      : null
                                  }
                                  style={{ padding: "0.6rem !important" }}
                                />
                              </div>

                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">Age</h4>
                                <input
                                  style={{
                                    backgroundColor: "var(--color-white)",
                                  }}
                                  type="text"
                                  value={traveler?.age}
                                  className="w-100 p-2 text-dark"
                                  readOnly
                                />
                              </div>

                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">Email</h4>
                                <input
                                  type="email"
                                  value={traveler.email}
                                  onChange={(e) =>
                                    handleInputChangeAdult(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="w-100 p-2 inpttticket"
                                />
                              </div>
                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">
                                  Phone Number
                                </h4>
                                <input
                                  type="text"
                                  value={traveler.number}
                                  maxLength={10}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    ); // Keep only numbers
                                    handleInputChangeAdult(
                                      index,
                                      "number",
                                      value
                                    );
                                  }}
                                  className="w-100 p-2 inpttticket"
                                />
                              </div>

                              {item?.international_flight_staus == 1 ? (
                                <>
                                  <div className="col-12 col-md-5">
                                    <h4 className="fs-5 text-muted">
                                      Passport Expiry Date
                                    </h4>

                                    <DatePicker
                                      onChange={(date) =>
                                        handleDateChange2(index, date)
                                      }
                                      format="YYYY-MM-DD"
                                      className="w-100 booking_details_datepicker_padding"
                                      disabledDate={disabledDate}
                                    />
                                  </div>

                                  <div className="col-12 col-md-5">
                                    <h4 className="fs-5 text-muted">
                                      Passport No
                                    </h4>
                                    <input
                                      style={{
                                        backgroundColor: "var(--color-white)",
                                      }}
                                      type="text"
                                      value={traveler.passport_no}
                                      className="w-100 p-2"
                                      onChange={(e) =>
                                        handleInputChangeAdult(
                                          index,
                                          "passport_no",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          )}

                          {/* Show Date of Birth field only if the traveler is an infant */}
                          {/* {isInfant && (
                          <div className="col-12 col-md-5">
                            <h4 className="fw-bold fs-5 text-white">Date Of Birth</h4>
                            <DatePicker
                              onChange={(date) => handleDateChange(index, date)}
                              format="YYYY-MM-DD"
                              className="w-100 booking_details_datepicker_padding"
                              disabledDate={disabledDate2}
                              style={{ padding: "0.6rem !important" }}
                            />
                          </div>
                        )} */}
                        </div>
                      </div>
                    );
                  })}

                  {childtravelers.map((traveler, index) => {
                    // Check if the current traveler is an infant
                    const isInfant = index >= adulttraveler + childtraveler;

                    return (
                      <div
                        key={index}
                        className="traveler-details mt-4"
                        style={{
                          borderBottom:
                            travelers.length > 1 ? "1px solid #fff" : "",
                          paddingBottom: travelers.length > 1 ? "1rem" : "",
                        }}
                      >
                        <div className="row align-items-center gap-2 mt-3 mb-3">
                          <div className="col-md-5">
                            <h5 className="fw-bold fs-5 text-dark">
                              Child Traveler {index + 1}
                            </h5>
                          </div>
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">Gender</h4>
                            <Select
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              isMulti={false}
                              options={genderOptions}
                              value={traveler.gender}
                              onChange={(selectedOption) =>
                                handleGenderChange2(index, selectedOption)
                              }
                              styles={{
                                container: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#fff",
                                  borderRadius: "10px",
                                }),
                                control: (provided) => ({
                                  ...provided,
                                  backgroundColor: "transparent",
                                  boxShadow: "none",
                                  borderRadius: "10px",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#fff",
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? "#ff4500"
                                    : "transparent",
                                  color: state.isFocused ? "#fff" : "#000",
                                }),
                              }}
                            />
                          </div>
                        </div>

                        <div className="row gap-2">
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">First Name</h4>
                            <input
                              type="text"
                              value={traveler.fname}
                              onChange={(e) =>
                                handleInputChange2(
                                  index,
                                  "fname",
                                  e.target.value
                                )
                              }
                              className="w-100 p-2 inpttticket"
                            />
                          </div>

                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">Last Name</h4>
                            <input
                              type="text"
                              value={traveler.lname}
                              onChange={(e) =>
                                handleInputChange2(
                                  index,
                                  "lname",
                                  e.target.value
                                )
                              }
                              className="w-100 p-2 inpttticket"
                            />
                          </div>

                          {getCondition === 1 ? (
                            <>
                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">
                                  Date Of Birth
                                </h4>
                                <DatePicker
                                  onChange={(date) =>
                                    handleDateChangeChild(index, date)
                                  }
                                  format="YYYY-MM-DD"
                                  className="w-100 booking_details_datepicker_padding"
                                  // disabledDate={disabledDate2}
                                  value={
                                    childtravelers[index]?.dob
                                      ? dayjs(childtravelers[index]?.dob)
                                      : null
                                  }
                                  style={{ padding: "0.6rem !important" }}
                                />
                              </div>

                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">Age</h4>
                                <input
                                  style={{
                                    backgroundColor: "var(--color-white)",
                                  }}
                                  type="text"
                                  value={traveler?.age}
                                  className="w-100 p-2"
                                  readOnly
                                />
                              </div>

                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">Email</h4>
                                <input
                                  type="email"
                                  value={traveler.email}
                                  onChange={(e) =>
                                    handleInputChangeChild(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="w-100 p-2 inpttticket"
                                />
                              </div>
                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">
                                  Phone Number
                                </h4>
                                <input
                                  type="text"
                                  value={traveler.number}
                                  maxLength={10}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    handleInputChangeChild(
                                      index,
                                      "number",
                                      value
                                    );
                                  }}
                                  className="w-100 p-2 inpttticket"
                                />
                              </div>

                              {item?.international_flight_staus == 1 ? (
                                <>
                                  <div className="col-12 col-md-5">
                                    <h4 className="fs-5 text-muted">
                                      Passport Expiry Date
                                    </h4>

                                    <DatePicker
                                      onChange={(date) =>
                                        handleDateChange2(index, date)
                                      }
                                      format="YYYY-MM-DD"
                                      className="w-100 booking_details_datepicker_padding"
                                      disabledDate={disabledDate}
                                    />
                                  </div>

                                  <div className="col-12 col-md-5">
                                    <h4 className="fs-5 text-muted">
                                      Passport No
                                    </h4>
                                    <input
                                      style={{
                                        backgroundColor:
                                          "var(--color-background)",
                                      }}
                                      type="text"
                                      value={traveler.passport_no}
                                      className="w-100 p-2"
                                      onChange={(e) =>
                                        handleInputChangeChild(
                                          index,
                                          "passport_no",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}

                          {/* Show Date of Birth field only if the traveler is an infant */}
                          {/* {isInfant && (
                          <div className="col-12 col-md-5">
                            <h4 className="fw-bold fs-5 text-white">Date Of Birth</h4>
                            <DatePicker
                              onChange={(date) => handleDateChange2(index, date)}
                              format="YYYY-MM-DD"
                              className="w-100 booking_details_datepicker_padding"
                              disabledDate={disabledDate2}
                              style={{ padding: "0.6rem !important" }}
                            />
                          </div>
                        )} */}
                        </div>
                      </div>
                    );
                  })}

                  {infanttravelers.map((traveler, index) => {
                    const isInfant = index >= adulttraveler + childtraveler;

                    return (
                      <div
                        key={index}
                        className="traveler-details mt-4"
                        style={{
                          borderBottom:
                            travelers.length > 1 ? "1px solid #fff" : "",
                          paddingBottom: travelers.length > 1 ? "1rem" : "",
                        }}
                      >
                        <div className="row align-items-center gap-2 mt-3 mb-3">
                          <div className="col-md-5">
                            <h5 className="fs-5 fw-bold text-dark">
                              Infant Traveler {index + 1}
                            </h5>
                          </div>
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">Gender</h4>
                            <Select
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              isMulti={false}
                              options={genderOptions}
                              value={traveler.gender}
                              onChange={(selectedOption) =>
                                handleGenderChange3(index, selectedOption)
                              }
                              styles={{
                                container: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#fff",
                                  borderRadius: "10px",
                                }),
                                control: (provided) => ({
                                  ...provided,
                                  backgroundColor: "transparent",
                                  boxShadow: "none",
                                  borderRadius: "10px",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#fff",
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? "#ff4500"
                                    : "transparent",
                                  color: state.isFocused ? "#fff" : "#000",
                                }),
                              }}
                            />
                          </div>
                        </div>

                        <div className="row gap-2">
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">First Name</h4>
                            <input
                              type="text"
                              value={traveler.fname}
                              onChange={(e) =>
                                handleInputChange3(
                                  index,
                                  "fname",
                                  e.target.value
                                )
                              }
                              className="w-100 p-2 inpttticket"
                            />
                          </div>
                          <div className="col-12 col-md-5">
                            <h4 className="fs-5 text-muted">Last Name</h4>
                            <input
                              type="text"
                              value={traveler.lname}
                              onChange={(e) =>
                                handleInputChange3(
                                  index,
                                  "lname",
                                  e.target.value
                                )
                              }
                              className="w-100 p-2 inpttticket"
                            />
                          </div>

                          {/* {isInfant && ( */}
                          {getCondition === 0 && (
                            <div className="col-12 col-md-5">
                              <h4 className="fs-5 text-muted">Date Of Birth</h4>
                              <DatePicker
                                onChange={(date) =>
                                  handleDateChange(index, date)
                                }
                                format="YYYY-MM-DD"
                                className="w-100 booking_details_datepicker_padding"
                                disabledDate={disabledDate2}
                                value={
                                  infanttravelers[index]?.dob
                                    ? dayjs(infanttravelers[index]?.dob)
                                    : null
                                }
                                style={{ padding: "0.6rem !important" }}
                              />
                            </div>
                          )}

                          {getCondition === 1 ? (
                            <>
                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">
                                  Date Of Birth
                                </h4>
                                <DatePicker
                                  onChange={(date) =>
                                    handleDateChangeInfant(index, date)
                                  }
                                  format="YYYY-MM-DD"
                                  className="w-100 booking_details_datepicker_padding"
                                  disabledDate={disabledDate2}
                                  value={
                                    infanttravelers[index]?.dob
                                      ? dayjs(infanttravelers[index]?.dob)
                                      : null
                                  }
                                  style={{ padding: "0.6rem !important" }}
                                />
                              </div>

                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">Age</h4>
                                <input
                                  style={{
                                    backgroundColor: "var(--color-white)",
                                  }}
                                  type="text"
                                  value={traveler?.age}
                                  className="w-100 p-2"
                                  readOnly
                                />
                              </div>

                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">Email</h4>
                                <input
                                  type="email"
                                  value={traveler.email}
                                  onChange={(e) =>
                                    handleInputChangeInfant(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="w-100 p-2 inpttticket"
                                />
                              </div>
                              <div className="col-12 col-md-5">
                                <h4 className="fs-5 text-muted">
                                  Phone Number
                                </h4>
                                <input
                                  type="text"
                                  value={traveler.number}
                                  maxLength={10}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    ); // Keep only numbers
                                    handleInputChangeInfant(
                                      index,
                                      "number",
                                      value
                                    );
                                  }}
                                  className="w-100 p-2 inpttticket"
                                />
                              </div>

                              {item?.international_flight_staus == 1 ? (
                                <>
                                  <div className="col-12 col-md-5">
                                    <h4 className="fw-bold fs-5 text-white">
                                      Passport Expiry Date
                                    </h4>

                                    <DatePicker
                                      onChange={(date) =>
                                        handleDateChange2(index, date)
                                      }
                                      format="YYYY-MM-DD"
                                      className="w-100 booking_details_datepicker_padding"
                                      disabledDate={disabledDate}
                                    />
                                  </div>

                                  <div className="col-12 col-md-5">
                                    <h4 className="fs-5 text-muted">
                                      Passport No
                                    </h4>
                                    <input
                                      style={{
                                        backgroundColor:
                                          "var(--color-background)",
                                      }}
                                      type="text"
                                      value={traveler.passport_no}
                                      className="w-100 p-2"
                                      onChange={(e) =>
                                        handleInputChangeInfant(
                                          index,
                                          "passport_no",
                                          e.target.value
                                        )
                                      }
                                      // readOnly
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <> </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="row justify-content-center my-3 my-lg-5">
                    <div className="col-12 d-flex align-items-center justify-content-center gap-2">
                      <label className="custom-checkbox d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          checked={check}
                          onChange={togglecheck}
                          className="d-none"
                        />
                        <span className="checkmark"></span>
                        <span className="fw-bold text-muted">
                          I agree with the{" "}
                          <a
                            href="#"
                            className="fw-bold text-muted text-decoration-none"
                          >
                            Terms & Conditions
                          </a>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="row px-3 px-lg-0 align-items-center justify-content-center">
                    <div
                      className="col-2 btnn text-center sbmitbtn"
                      onClick={() => {
                        openModal();
                      }}
                    >
                      SUBMIT
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5 order-1 order-lg-2">
                  <div className="row">
                    <div className="col-12 pricee-tag">
                      <h2 className="fs-4 fs-lg-2">Your Booking Details</h2>
                    </div>
                  </div>
                  <div
                    className="row border border-top-none"
                    style={{ border: "1px solid #ff4500" }}
                  >
                    <div className="booking_details_airline_name_heading">
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
                            <IoAirplaneSharp size={40} color="white" />
                          );
                        })()}
                      </div>
                      <div
                        className="text-dark"
                        style={{ fontWeight: "600", fontSize: "18px" }}
                      >
                        {getCondition == 0 ? (
                          <>{item?.airline}</>
                        ) : (
                          <>{item?.airline_name}</>
                        )}
                      </div>
                    </div>
                    <div className="col-12 py-3 flight-box">
                      <div className="flight-departure text-center">
                        <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                          {getCondition == 0 ? (
                            <>{item?.departure_time}</>
                          ) : (
                            <>{item?.dep_time}</>
                          )}
                        </h5>
                        <h5 className="text-dark fs-6 fs-lg-5">
                          {getCondition == 0 ? (
                            <>{item?.origin}</>
                          ) : (
                            <>{item?.dep_city_code}</>
                          )}
                        </h5>
                        <div className="fw-bold fs-lg-5 text-dark align-self-center">
                          {moment(item?.departure_date).format("DD-MM-YYYY")}
                        </div>
                      </div>
                      <div className="d-inline-flex column-gap-0 column-gap-lg-3 align-items-center">
                        <span className="d-inline-block text-dark">From</span>
                        <div className="text-center">
                          <p className="text-dark durationtxt">
                            {/* {item?.duration &&
                            `${item.duration.split(":")[0]}h ${item.duration.split(":")[1]
                            }min`} */}
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
                                  `${item.duration.split(":")[0]}h ${
                                    item.duration.split(":")[1]
                                  }min`}
                              </>
                            )}
                          </p>
                          <img
                            src={images.invertedviman}
                            alt=""
                            className="resp_booking_details_flight_img"
                          />
                          {getCondition == 0 ? (
                            <>
                              <p className="text-dark">{item?.flight_route}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-dark">
                                {item?.no_of_stop} stop
                              </p>
                            </>
                          )}
                        </div>
                        <span className="d-inline-block text-dark">To</span>
                      </div>
                      <div className="flight-departure text-center">
                        <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                          {getCondition == 0 ? (
                            <>{item?.arival_time}</>
                          ) : (
                            <>{item?.arr_time}</>
                          )}
                        </h5>
                        <h5 className="text-dark fs-6 fs-lg-5">
                          {getCondition == 0 ? (
                            <>{item?.destination}</>
                          ) : (
                            <>{item?.arr_city_code}</>
                          )}
                        </h5>
                        <div className="fw-bold fs-lg-5 text-dark align-self-center">
                          {getCondition == 0 ? (
                            <>
                              {moment(item?.arival_date).format("DD-MM-YYYY")}
                            </>
                          ) : (
                            <>{moment(item?.arr_date).format("DD-MM-YYYY")}</>
                          )}
                        </div>
                      </div>
                    </div>

                    {item?.return_flight_data ? (
                      <>
                        <div className="flight-box">
                          <div className="col-10 align-self-center bottomlito"></div>
                        </div>
                        <div className="col-12 py-3 flight-box mt-3">
                          <div className="flight-departure text-center">
                            <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                              {item?.return_flight_data?.return_dep_time}
                            </h5>
                            <h5 className="text-dark fs-6 fs-lg-5">
                              {item?.return_flight_data?.return_dep_city_code}
                            </h5>
                            <div className="fw-bold fs-lg-5 text-dark align-self-center">
                              {moment(
                                item?.return_flight_data?.return_dep_date
                              ).format("DD-MM-YYYY")}
                            </div>
                          </div>
                          <div className="d-inline-flex column-gap-0 column-gap-lg-3 align-items-center">
                            <span className="d-inline-block text-dark">
                              From
                            </span>
                            <div className="text-center">
                              <p className="text-dark durationtxt">
                                {item?.duration &&
                                  `${item.duration.split(":")[0]}h ${
                                    item.duration.split(":")[1]
                                  }min`}
                              </p>
                              <img
                                src={images.invertedviman}
                                alt=""
                                className="resp_booking_details_flight_img"
                              />
                              <p className="text-dark">
                                {item?.no_of_stop} stop
                              </p>
                            </div>
                            <span className="d-inline-block text-dark">To</span>
                          </div>
                          <div className="flight-departure text-center">
                            <h5 className="text-dark fs-6 fs-lg-5 fw-bold">
                              {item?.return_flight_data?.return_arr_time}
                            </h5>
                            <h5 className="text-dark fs-6 fs-lg-5">
                              {item?.return_flight_data?.return_arr_city_code}
                            </h5>
                            <div className="fw-bold fs-lg-5 text-dark align-self-center">
                              {moment(
                                item?.return_flight_data?.return_arr_date
                              ).format("DD-MM-YYYY")}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="row mt-4">
                    <div className="col-12 pricee-tag">
                      <h2 className="fs-4 fs-lg-2">
                        Price Summary (
                        {getCondition == 0 ? (
                          <>
                            <span>&#8377;</span> {item?.price}
                          </>
                        ) : (
                          <>{item?.per_adult_child_price}</>
                        )}
                        )
                      </h2>
                    </div>
                    <div className="border">
                      {/* <div className="row mt-3 w-100 ">
                        <div className="col-6 text-start text-white">
                          Base Fare
                        </div>
                        <div className="col-6 text-end text-white">
                          {getCondition == 0 ? (
                            <>
                              <span>&#8377;</span> {item?.price}
                            </>
                          ) : (
                            <>{item?.total_payable_price}</>
                          )}
                        </div>
                      </div> */}
                      <div className="row mt-3 w-100 ">
                        <div className="col-6 text-start text-dark">
                          Adult ({adulttraveler})
                        </div>
                        <div className="col-6 text-end text-dark">
                          {getCondition == 0 ? (
                            <>
                              <span>&#8377;</span> {item?.price * adulttraveler}
                            </>
                          ) : (
                            <>
                              {" "}
                              <span>&#8377;</span>{" "}
                              {item?.per_adult_child_price * adulttraveler}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="row mt-3 w-100 ">
                        <div className="col-6 text-start text-dark">
                          Child ({childtraveler})
                        </div>
                        <div className="col-6 text-end text-dark">
                          {getCondition == 0 ? (
                            <>
                              <span>&#8377;</span> {item?.price * childtraveler}
                            </>
                          ) : (
                            <>
                              {" "}
                              <span>&#8377;</span>{" "}
                              {item?.per_adult_child_price * childtraveler}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3 w-100 ">
                        <div className="col-6 text-start text-dark">
                          Infant ({infanttraveler})
                        </div>
                        <div className="col-6 text-end text-dark">
                          {getCondition == 0 ? (
                            <>
                              <span>&#8377;</span>{" "}
                              {item?.infant_price * infanttraveler}
                            </>
                          ) : (
                            <>
                              {" "}
                              <span>&#8377;</span>{" "}
                              {item?.per_infant_price * infanttraveler}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="row my-3 w-100 ">
                        <div className="col-6 text-start text-dark">
                          Discount
                        </div>
                        <div className="col-6 text-end text-dark">
                          <span>&#8377;</span> 0.00
                        </div>
                      </div>
                      <div className="row my-3 w-100 ">
                        <div className="col-6 text-start text-dark">
                          Taxes & Others
                        </div>
                        <div className="col-6 text-end text-dark">
                          <span>&#8377;</span> 0.00
                        </div>
                      </div>
                      <div className="row mb-3 w-100 ">
                        <div className="col-6 text-start text-dark">
                          Service Fees
                        </div>
                        <div className="col-6 text-end text-dark">
                          <span>&#8377;</span> 0.00
                        </div>
                      </div>
                      <div className="bottomlito"></div>
                      <div className="row mb-3 w-100 ">
                        <div className="col-6 text-start fs-4 fw-bolder text-success">
                          Total
                        </div>
                        <div className="col-6 text-end text-success fw-bolder fs-4">
                          {getCondition == 0 ? (
                            <>
                              <span>&#8377;</span>{" "}
                              {item?.price *
                                ((adulttraveler || 0) + (childtraveler || 0)) +
                                item?.infant_price * (infanttraveler || 0)}
                            </>
                          ) : (
                            <>
                              <span>&#8377;</span> {item?.total_payable_price}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Booking Modal"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "80vw",
                padding: "0",
                border: "none",
                borderRadius: "10px",
                position: "relative",
                overflowY: "auto",
                height: "620px",
              },
              overlay: {
                zIndex: 10000,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <div className="Confirm_Main">
              <div
                className="w-100 d-flex align-items-center text-center justify-content-center p-3"
                style={{
                  background:
                    "linear-gradient(135deg, #ff690f 0%, #e8381b 100%)",
                }}
              >
                <h3 className="fw-bold" style={{ color: "#fff" }}>
                  Confirm Booking
                </h3>
              </div>
            </div>

            <div className="p-3 w-100">
              <h4 className="my-2 fw-semibold ">Airline Details</h4>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Airline</th>
                      <th>Departure</th>
                      <th></th>
                      <th>Arrival</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {(() => {
                          const airline =
                            getCondition === 1
                              ? item.airline_name
                              : item.airline;

                          return airline === "IndiGo Airlines" ||
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
                          ) : (
                            <IoAirplaneSharp size={40} color="white" />
                          );
                        })()}
                        <br />
                        {getCondition == 0
                          ? item?.airline
                          : item?.airline_name}{" "}
                        <br />
                        {item?.flight_number}
                      </td>
                      <td>
                        {getCondition == 1 ? item.dep_city_name : item?.origin}
                        <br />
                        {getCondition == 1
                          ? moment(item?.dep_date).format("DD-MM-YYYY")
                          : moment(item?.departure_date).format(
                              "DD-MM-YYYY"
                            )}{" "}
                        <br />
                        {getCondition == 1
                          ? item.dep_time
                          : item.departure_time}
                      </td>
                      <td>
                        {getCondition == 0
                          ? calculateDuration(
                              item?.departure_time,
                              item?.arival_time
                            )
                          : calculateDuration(item?.dep_time, item?.arr_time)}

                        <br />
                        {getCondition == 0 ? item.flight_route : ""}
                        {/* {item?.flight_route} */}
                      </td>
                      <td>
                        {getCondition == 1
                          ? item.arr_city_name
                          : item.destination}
                        <br />
                        {getCondition == 1
                          ? moment(item?.arr_date).format("DD-MM-YYYY")
                          : moment(item?.arival_date).format("DD-MM-YYYY")}{" "}
                        <br />
                        {getCondition == 1 ? item.arr_time : item.arival_time}
                      </td>
                      {/* <td>{`\u20B9 ${
                        item?.price *
                          ((adulttraveler || 0) + (childtraveler || 0)) +
                        item?.infant_price * (infanttraveler || 0)
                      }`}</td> */}
                      <td>
                        {getCondition == 1
                          ? `₹ ${item?.total_payable_price}`
                          : `₹ ${
                              item?.price *
                                ((adulttraveler || 0) + (childtraveler || 0)) +
                              item?.infant_price * (infanttraveler || 0)
                            }`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {item?.return_flight_data ? (
              <>
                <div className="p-3 w-100">
                  <h4 className="my-2 fw-semibold ">Return Details</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Airline</th>
                          <th>Departure</th>
                          <th></th>
                          <th>Arrival</th>
                          {/* <th>Amount</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {(() => {
                              const airline =
                                getCondition === 1
                                  ? item.airline_name
                                  : item.airline;

                              return airline === "IndiGo Airlines" ||
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
                              ) : (
                                <IoAirplaneSharp size={40} color="white" />
                              );
                            })()}
                            <br /> {item?.airline} <br />
                            {item?.return_flight_data?.return_flight_number}
                          </td>
                          <td>
                            {item?.return_flight_data?.return_dep_city_name}
                            <br />
                            {moment(
                              item?.return_flight_data?.return_dep_date
                            ).format("DD-MM-YYYY")}
                            <br />
                            {item?.return_flight_data?.return_dep_time}
                          </td>
                          <td>
                            {`${item?.return_flight_data?.return_trip_duration}h`}

                            <br />
                            {`${item?.return_no_of_stop} Stop`}
                          </td>
                          <td>
                            {item?.return_flight_data?.return_arr_city_name}{" "}
                            <br />
                            {moment(
                              item?.return_flight_data?.return_arr_date
                            ).format("DD-MM-YYYY")}{" "}
                            <br />
                            {item?.return_flight_data?.return_arr_time}
                          </td>
                          {/* <td>{`\u20B9 ${item?.total_payable_price}`}</td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="p-3">
              <h4 className="fw-semibold">Traveler Details</h4>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Gender</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...travelers, ...childtravelers, ...infanttravelers]?.map(
                      (traveler, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{traveler.gender?.label}</td>
                          <td>{traveler.fname}</td>
                          <td>{traveler.lname}</td>
                        </tr>
                      )
                    )}
                    {/* <tr>
            <td>1</td>
            <td>mrs</td>
            <td>Gustave</td>
            <td>Bode</td>
          </tr> */}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-2 p-3">
              <Link
                // to="/dashboard"
                //   state={{
                //     item: item,
                //     referanceId: getBookingData?.data?.reference_id,

                //   }}
                className="clsbtn"
                // style={{ backgroundColor: "#ddb46b" }}
                onClick={closeModal}
              >
                Close
              </Link>
              <Link
                to=""
                className="confirmbtn"
                onClick={() => {
                  if (getCondition != 0) {
                    handleSubmitCheapFix();
                  } else {
                    handleSubmit();
                  }
                }}
              >
                Confirm
              </Link>
            </div>
          </ReactModal>
        </>
      )}
    </>
  );
};

export default TicketBookingDetails;
