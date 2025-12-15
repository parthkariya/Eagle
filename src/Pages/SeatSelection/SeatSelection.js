import React, { useEffect, useRef, useState } from "react";
import "./SeatSelection.css";
import { PiSteeringWheelFill } from "react-icons/pi";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { FaMale, FaFemale } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoPerson } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ACCEPT_HEADER,
  bookseat,
  get_booking,
  getRouteMiddleCitySequence,
  Payment_Api,
  seararrangementdetails,
  verifyCall,
} from "../../Utils/Constant";
import { useBusContext } from "../../Context/bus_context";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import moment from "moment";
import axios from "axios";

const seatTypes = [
  {
    label: "Available",
    seaterClass: "seat-icon availablee",
    sleeperClass: "seat-icon sleeper availablee",
  },
  {
    label: "Available only for male passenger",
    seaterClass: "seat-icon male",
    sleeperClass: "seat-icon sleeper male",
  },
  {
    label: "Already booked",
    seaterClass: "seat-icon booked",
    sleeperClass: "seat-icon sleeper booked",
  },
  {
    label: "Selected by you",
    seaterClass: "seat-icon selectedd",
    sleeperClass: "seat-icon sleeper selectedd",
  },
  {
    label: "Available only for female passenger",
    seaterClass: "seat-icon female",
    sleeperClass: "seat-icon sleeper female",
  },
  {
    label: "Booked by female passenger",
    seaterClass: "seat-icon female-booked",
    sleeperClass: "seat-icon sleeper female-booked",
  },
  {
    label: "Booked by male passenger",
    seaterClass: "seat-icon male-booked",
    sleeperClass: "seat-icon sleeper male-booked",
  },
];

const RedirectToCCAvenue = ({ paymentData }) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (paymentData && formRef.current) {
      formRef.current.submit();
    }
  }, [paymentData]);

  if (!paymentData) return null;

  return (
    <form
      ref={formRef}
      method="post"
      id={paymentData.order_id}
      action={paymentData.payment_url}
    >
      {/* match exactly what CCAvenue expects */}
      <input type="hidden" name="encRequest" value={paymentData.enc_request} />
      <input type="hidden" name="access_code" value={paymentData.access_code} />
    </form>
  );
};

const SeatSelection = () => {
  const [selectedBoarding, setSelectedBoarding] = useState("");
  const [selectedDropping, setSelectedDropping] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userr, setUser] = useState("");
  const [login, SetLogin] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [bookingapi, setBookingApi] = useState([]);
  const [bookingapiload, setBookingApiLoad] = useState(false);

  const navigate = useNavigate();

  const {
    GetSeatArrangementDetail,
    seats_data,
    GetBookSeatApi,
    book_seat_data,
    book_seat_data_loading,
    GetRouteMiddleCitySequence,
    route_middle_city_sequence,
  } = useBusContext();

  const location = useLocation();
  const [bussitting, setbussitting] = useState(
    location.state?.sittingType || ""
  );
  const [getBus, setBus] = useState(location.state?.bus || "");
  const [getBusReferenceNo, setBusReferenceNo] = useState(
    location.state?.bus?.ReferenceNumber || ""
  );

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    SetLogin(islogin);
    var user = localStorage.getItem("is_user");
    setUser(JSON.parse(user));
    GetmiddleCityroute();
    BookingApi();
  }, []);

  const validatePassengerDetails = () => {
    const errors = [];
    const passengers = bussitting === 1 ? selected : selectedSeats;

    passengers.forEach((seat, index) => {
      const passenger = passengerDetails.find(
        (p) => p.seatNumber === (bussitting === 1 ? seat.number : seat.seatNo)
      ) || {
        seatNumber: bussitting === 1 ? seat.number : seat.seatNo,
        name: "",
        age: "",
        gender: seat.userGender || "",
      };

      const passengerErrors = {
        seatNumber: passenger.seatNumber,
        name: "",
        age: "",
        gender: "",
      };

      // Name validation: Must not be empty and contain only letters and spaces
      if (!passenger.name || passenger.name.trim() === "") {
        passengerErrors.name = `Passenger ${index + 1} (Seat ${
          passenger.seatNumber
        }): Name is required`;
      } else if (!/^[a-zA-Z\s]+$/.test(passenger.name)) {
        passengerErrors.name = `Passenger ${index + 1} (Seat ${
          passenger.seatNumber
        }): Name must contain only letters and spaces`;
      }

      // Age validation: Must be a number between 1 and 120
      if (!passenger.age) {
        passengerErrors.age = `Passenger ${index + 1} (Seat ${
          passenger.seatNumber
        }): Age is required`;
      } else if (
        !/^\d+$/.test(passenger.age) ||
        passenger.age < 1 ||
        passenger.age > 120
      ) {
        passengerErrors.age = `Passenger ${index + 1} (Seat ${
          passenger.seatNumber
        }): Age must be a number between 1 and 120`;
      }

      // Gender validation: Must be selected for non-reserved seats
      if (!passenger.gender && seat.userGender !== "female") {
        passengerErrors.gender = `Passenger ${index + 1} (Seat ${
          passenger.seatNumber
        }): Gender is required`;
      }

      // Add to errors array if there are validation issues
      if (
        passengerErrors.name ||
        passengerErrors.age ||
        passengerErrors.gender
      ) {
        errors.push(passengerErrors);
      }
    });

    return errors;
  };

  const OpenPaymentGetway = async (pnr, total) => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    try {
      const response = await axios.post(
        Payment_Api,
        {
          booking_referance_no: pnr,
          amount: total,
          booking_for: 2,
        },
        {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPaymentData(response.data);
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(err.message || "Payment initiation failed. Try again.");
    } finally {
    }
  };

  const handleConfirm = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));

    // Validate phone number
    if (!phone) {
      toast.warning("Please Enter Phone Number");
      return;
    }

    // Validate boarding and dropping points
    if (!selectedBoarding || !selectedDropping) {
      toast.warning("Please select boarding and dropping points");
      return;
    }

    // Validate passenger details
    const errors = validatePassengerDetails();
    if (errors.length > 0) {
      const firstError = errors[0]; // Only show errors for the first invalid passenger
      if (firstError.name) {
        toast.warning(firstError.name);
        return;
      }
      if (firstError.age) {
        toast.warning(firstError.age);
        return;
      }
      if (firstError.gender) {
        toast.warning(firstError.gender);
        return;
      }
    }

    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", bookseat);
    formdata.append("verifyCall", verifyCall); // Compulsory

    // Compulsory parameters from seats_data and state
    if (seats_data.length > 0) {
      const seatData = seats_data[0];
      formdata.append(
        "referenceNumber",
        seatData.ReferenceNumber || getBusReferenceNo
      ); // Compulsory
    }
    formdata.append(
      "passengerName",
      passengerDetails.length > 0
        ? passengerDetails[0].name || "Passenger 1"
        : "Passenger 1"
    ); // Default if no details
    const seatNames =
      bussitting === 1
        ? selected.map((seat) => {
            const passenger = passengerDetails.find(
              (p) => p.seatNumber === seat.number
            );
            const genderCode = passenger?.gender || seat.userGender || "";
            return `${seat.number},${
              genderCode === "male" ? "M" : genderCode === "female" ? "F" : ""
            }`;
          })
        : selectedSeats.map((seat) => {
            const passenger = passengerDetails.find(
              (p) => p.seatNumber === seat.seatNo
            );
            const genderCode = passenger?.gender || seat.userGender || "";
            return `${seat.seatNo},${
              genderCode === "male" ? "M" : genderCode === "female" ? "F" : ""
            }`;
          });
    formdata.append("seatNames", seatNames.join("|")); // Compulsory, in the format "1,M|2,F|3,M"
    formdata.append("email", email ? email : userr?.email); // Compulsory
    formdata.append("phone", phone); // Compulsory

    // Boarding and dropping point IDs
    const boardingPoint = boardingPoints.find(
      (p) => p.name === selectedBoarding
    );
    const droppingPoint = droppingPoints.find(
      (p) => p.name === selectedDropping
    );
    formdata.append("pickUpID", boardingPoint ? boardingPoint.id : ""); // Compulsory
    formdata.append("dropID", droppingPoint ? droppingPoint.id : ""); // Compulsory

    // Pricing and passenger count
    formdata.append("payableAmount", totalPrice); // Compulsory
    formdata.append(
      "totalPassengers",
      bussitting === 1 ? selected.length : selectedSeats.length
    ); // Compulsory

    // Seat details (only seat numbers)
    formdata.append(
      "seatDetails",
      seatNames.map((s) => s.split(",")[0]).join(",")
    ); // Compulsory

    // PaxDetails structure
    const paxDetails =
      bussitting === 1
        ? selected.map((seat, index) => {
            const passenger =
              passengerDetails.find((p) => p.seatNumber === seat.number) || {};
            return {
              seatName: seat.number,
              paxName: passenger.name || `Passenger ${index + 1}`,
              mobileNo: phone,
              paxAge: passenger.age || "25",
              baseFare: seat.price || seats_data[0]?.SeatRate || 0,
            };
          })
        : selectedSeats.map((seat, index) => {
            const passenger =
              passengerDetails.find((p) => p.seatNumber === seat.seatNo) || {};
            return {
              seatName: seat.seatNo,
              paxName: passenger.name || `Passenger ${index + 1}`,
              mobileNo: phone,
              paxAge: passenger.age || "25",
              baseFare: seat.price || seats_data[0]?.SeatRate || 0,
            };
          });

    paxDetails.forEach((pax, index) => {
      formdata.append(`paxDetails[${index}][seatName]`, pax.seatName);
      formdata.append(`paxDetails[${index}][paxName]`, pax.paxName);
      formdata.append(`paxDetails[${index}][mobileNo]`, pax.mobileNo);
      formdata.append(`paxDetails[${index}][paxAge]`, pax.paxAge);
      formdata.append(`paxDetails[${index}][baseFare]`, pax.baseFare);
    });

    const bookingTime =
      moment
        .utc()
        .add(5, "hours")
        .add(30, "minutes")
        .format("YYYY-MM-DD HH:mm") + " IST";

    formdata.append("bookingTime", bookingTime);
    formdata.append(
      "arrival_date",
      getBus?.ApproxArrival
        ? getBus.ApproxArrival.split(" ")[0].split("-").reverse().join("-")
        : ""
    );
    formdata.append(
      "arrival_time",
      (() => {
        const t = getBus?.ArrivalTime;
        if (!t) return "";
        const [time, meridiem] = t.split(" ");
        let [h, m] = time.split(":");
        if (meridiem === "PM" && h !== "12") h = String(+h + 12);
        if (meridiem === "AM" && h === "12") h = "00";
        return `${h.padStart(2, "0")}:${m}`;
      })()
    );
    formdata.append(
      "departure_date",
      getBus?.BookingDate
        ? getBus.BookingDate.split("-").reverse().join("-")
        : ""
    );
    formdata.append("arrival_city", getBus?.ToCityName);
    formdata.append("departure_city", getBus?.FromCityName);
    formdata.append(
      "departure_time",
      (() => {
        const t = getBus?.CityTime;
        if (!t) return "";
        const [time, meridiem] = t.split(" ");
        let [h, m] = time.split(":");
        if (meridiem === "PM" && h !== "12") h = String(+h + 12);
        if (meridiem === "AM" && h === "12") h = "00";
        return `${h.padStart(2, "0")}:${m}`;
      })()
    );

    setLoading(true);
    try {
      const data = await GetBookSeatApi(formdata, token);
      if (data) {
        if (data?.Status) {
          setIsExpanded(false);
          OpenPaymentGetway(data.PNRNO, totalPrice);
        } else {
          toast.error(data.Message || "somthing went worng..!!");
        }
        // setIsExpanded(false);
        // navigate("/dashboard");
        // window.scrollTo(0, 0);
      } else {
        toast.error("No data received from booking API");
      }
    } catch (error) {
      console.error("Error booking seat:", error);
      toast.error("Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const savedReference = localStorage.getItem("busReference");
      const referenceNumber =
        getBus?.ReferenceNumber || savedReference || "default-reference";
      if (referenceNumber) {
        localStorage.setItem("busReference", referenceNumber);
        setLoading(true);
        try {
          await getSeatArrangementBus(referenceNumber);
        } catch (error) {
          console.error("Error fetching seat arrangement:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [getBus]);

  useEffect(() => {
    const newLowerSeats = generateSeatsSleeper("LB");
    const newUpperSeats = generateSeatsSleeper("UB");
    if (JSON.stringify(lowerSeats) !== JSON.stringify(newLowerSeats))
      setLowerSeats(newLowerSeats);
    if (JSON.stringify(upperSeats) !== JSON.stringify(newUpperSeats))
      setUpperSeats(newUpperSeats);
  }, [seats_data]);

  const getSeatArrangementBus = async (referenceno) => {
    const formdata = new FormData();
    await formdata.append("type", "POST");
    await formdata.append("url", seararrangementdetails);
    await formdata.append("verifyCall", verifyCall);
    await formdata.append("referenceNumber", referenceno);

    const data = await GetSeatArrangementDetail(formdata);
    if (data) {
      console.log("bus seat arrangement data", data);
    } else {
    }
  };

  // Parse boarding points dynamically
  const parseBoardingPoints = (boardingPointsStr) => {
    if (!boardingPointsStr) return [];
    return boardingPointsStr.split("#").flatMap((group) => {
      const [id, name, time, address] = group.split("|");
      return { id, name, time, address };
    });
  };

  // Parse dropping points dynamically
  const parseDroppingPoints = (droppingPointsStr) => {
    if (!droppingPointsStr) return [];
    return droppingPointsStr.split("#").flatMap((group) => {
      const [id, name, time] = group.split("|");
      return { id, name, time };
    });
  };

  const [boardingPoints, setBoardingPoints] = useState(
    seats_data.length > 0
      ? parseBoardingPoints(seats_data[0].BoardingPoints)
      : []
  );
  const [droppingPoints, setDroppingPoints] = useState(
    seats_data.length > 0
      ? parseDroppingPoints(seats_data[0].DroppingPoints)
      : []
  );

  useEffect(() => {
    if (seats_data.length > 0) {
      setBoardingPoints(parseBoardingPoints(seats_data[0].BoardingPoints));
      setDroppingPoints(parseDroppingPoints(seats_data[0].DroppingPoints));
    }
  }, [seats_data]);

  const generateSeats = () => {
    if (!seats_data || !Array.isArray(seats_data)) return [];
    const seatsByRow = {};
    seats_data.forEach((seat) => {
      if (!seat.SeatNo.startsWith("T")) {
        if (!seatsByRow[seat.Row]) seatsByRow[seat.Row] = [];
        seatsByRow[seat.Row].push(seat);
      }
    });

    const seats = Object.keys(seatsByRow).map((row) => {
      const sortedSeats = seatsByRow[row].sort((a, b) => a.Column - b.Column);
      const leftPair = sortedSeats.slice(0, 2);
      const rightPair = sortedSeats.slice(2, 4);

      return [
        leftPair.map((seat) => {
          let status = "available";
          let gender = null;

          if (seat.Available === "N") {
            status = "already booked";
            if (seat.IsLadiesSeat === "Y") {
              status = "female-booked";
              gender = "female";
            } else if (seat.BookedByGender === "male") {
              status = "male-booked";
              gender = "male";
            }
          } else if (seat.Available === "Y" && seat.IsLadiesSeat === "Y") {
            status = "available only for female passenger";
          }

          return {
            number: seat.SeatNo,
            price: seat.SeatRate || 705,
            status,
            gender,
          };
        }),
        rightPair.map((seat) => {
          let status = "available";
          let gender = null;

          if (seat.Available === "N") {
            status = "already booked";
            if (seat.IsLadiesSeat === "Y") {
              status = "female-booked";
              gender = "female";
            } else if (seat.BookedByGender === "male") {
              status = "male-booked";
              gender = "male";
            }
          } else if (seat.Available === "Y" && seat.IsLadiesSeat === "Y") {
            status = "available only for female passenger";
          }

          return {
            number: seat.SeatNo,
            price: seat.SeatRate || 705,
            status,
            gender,
          };
        }),
      ];
    });

    return seats;
  };

  const [seats, setSeats] = useState(generateSeats());
  const [selected, setSelected] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newSeats = generateSeats();
    if (JSON.stringify(seats) !== JSON.stringify(newSeats)) {
      setSeats(newSeats);
    }
    // Initialize passenger details when seats are selected
    if ((bussitting === 1 || bussitting === "1") && selected.length > 0) {
      const newPassengerDetails = selected.map((seat) => ({
        seatNumber: seat.number,
        name: "",
        age: "",
        gender: seat.userGender || "",
      }));
      setPassengerDetails(newPassengerDetails);
    } else if (bussitting !== 1 && selectedSeats.length > 0) {
      const newPassengerDetails = selectedSeats.map((seat) => ({
        seatNumber: seat.seatNo,
        name: "",
        age: "",
        gender: seat.userGender || "",
      }));
      setPassengerDetails(newPassengerDetails);
    }
  }, [seats_data, selected, selectedSeats, bussitting]);

  const toggleSeat = (rowIdx, seatIdx) => {
    const seat = seats[rowIdx].flat()[seatIdx];
    const isSelected = selected.find((s) => s.number === seat.number);

    const adjacentSeats = [];
    const allSeatsInRow = seats[rowIdx].flat();
    const currentIndex = allSeatsInRow.findIndex(
      (s) => s.number === seat.number
    );
    if (currentIndex > 0) adjacentSeats.push(allSeatsInRow[currentIndex - 1]);
    if (currentIndex < allSeatsInRow.length - 1)
      adjacentSeats.push(allSeatsInRow[currentIndex + 1]);

    const hasFemaleAdjacent = adjacentSeats.some(
      (s) =>
        s.status === "female-booked" ||
        selected.find(
          (sel) => sel.number === s.number && sel.gender === "female"
        )
    );

    const hasMaleAdjacent = adjacentSeats.some(
      (s) =>
        s.status === "male-booked" ||
        selected.find((sel) => sel.number === s.number && sel.gender === "male")
    );

    let userGender = null;
    let colorClass = "selected";

    if (hasFemaleAdjacent) {
      userGender = "female";
      colorClass = "selected-female";
    } else if (hasMaleAdjacent) {
      userGender = "male";
      colorClass = "selected-male";
    }

    if (hasFemaleAdjacent && hasMaleAdjacent) {
      toast.error("Cannot select seat adjacent to both male and female seats.");
      return;
    }

    if (isSelected) {
      setSelected(selected.filter((s) => s.number !== seat.number));
      setTotalPrice(totalPrice - seat.price);
      setPassengerDetails(
        passengerDetails.filter((p) => p.seatNumber !== seat.number)
      );
    } else {
      setSelected([...selected, { ...seat, userGender, colorClass }]);
      setTotalPrice(totalPrice + seat.price);
    }
  };

  const generateSeatsSleeper = (type) => {
    if (!seats_data || !Array.isArray(seats_data)) return [];

    const filteredSeats = seats_data.filter(
      (seat) => seat.UpLowBerth === type && !seat.SeatNo.startsWith("T")
    );

    const seats = [];
    const price = 0; // Default price from seats_data, adjust as needed

    const seatsByRow = {};
    filteredSeats.forEach((seat) => {
      if (!seatsByRow[seat.Row]) seatsByRow[seat.Row] = [];
      seatsByRow[seat.Row].push(seat);
    });

    Object.keys(seatsByRow).forEach((row) => {
      const rowSeats = seatsByRow[row].sort((a, b) => a.Column - b.Column);
      rowSeats.forEach((seat) => {
        let status = "available";
        let gender = null;

        if (seat.Available === "N") {
          status = "already booked";
          if (seat.IsLadiesSeat === "Y") {
            status = "female-booked";
            gender = "female";
          } else if (seat.BookedByGender === "male") {
            status = "male-booked";
            gender = "male";
          }
        } else if (seat.Available === "Y" && seat.IsLadiesSeat === "Y") {
          status = "available only for female passenger";
        }

        seats.push({
          id: `${type.toLowerCase()}-${seat.SeatNo.toLowerCase()}-${seat.Row}-${
            seat.Column
          }`,
          position: seat.Column === 1 ? "left" : "right",
          price: seat.SeatRate || price,
          status,
          gender,
          seatNo: seat.SeatNo,
        });
      });
    });

    return seats;
  };

  const [lowerSeats, setLowerSeats] = useState(generateSeatsSleeper("LB"));
  const [upperSeats, setUpperSeats] = useState(generateSeatsSleeper("UB"));

  const toggleSeatSleeper = (seatId, allSeats) => {
    const seat = allSeats.find((s) => s.id === seatId);
    const isSelected = selectedSeats.find((s) => s.id === seatId);

    const index = allSeats.findIndex((s) => s.id === seatId);

    const isSeat1 = index % 3 === 0;

    let userGender = null;
    let colorClass = "selected";

    if (!isSeat1) {
      const adjacentSeats = [];
      if (index > 0) adjacentSeats.push(allSeats[index - 1]);
      if (index < allSeats.length - 1) adjacentSeats.push(allSeats[index + 1]);

      const hasFemaleAdjacent = adjacentSeats.some(
        (s) =>
          s.status === "female-booked" ||
          selectedSeats.find(
            (sel) => sel.id === s.id && sel.gender === "female"
          )
      );

      const hasMaleAdjacent = adjacentSeats.some(
        (s) =>
          s.status === "male-booked" ||
          selectedSeats.find((sel) => sel.id === s.id && sel.gender === "male")
      );

      if (hasFemaleAdjacent) {
        userGender = "female";
        colorClass = "selected-female";
      } else if (hasMaleAdjacent) {
        userGender = "male";
        colorClass = "selected-male";
      }

      if (hasFemaleAdjacent && hasMaleAdjacent) {
        toast.error(
          "Cannot select sleeper berth adjacent to both male and female seats."
        );
        return;
      }
    }

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
      setTotalPrice(totalPrice - seat.price);
      setPassengerDetails(
        passengerDetails.filter((p) => p.seatNumber !== seat.seatNo)
      );
    } else {
      setSelectedSeats([...selectedSeats, { ...seat, userGender, colorClass }]);
      setTotalPrice(totalPrice + seat.price);
    }
  };

  const renderSeatsSleeper = (seats) => {
    const rows = [];
    for (let i = 0; i < seats.length; i += 3) {
      const seat1 = seats[i];
      const seat2 = seats[i + 1];
      const seat3 = seats[i + 2];

      rows.push(
        <div className="seat-row" key={i}>
          {seat1 && (
            <div className="seatsleeper-block single">
              <div
                className={`seatsleeper ${seat1.status} ${
                  selectedSeats.find((s) => s.id === seat1.id)?.colorClass || ""
                }`}
                onClick={() =>
                  !["already booked", "female-booked", "male-booked"].includes(
                    seat1.status
                  ) && toggleSeatSleeper(seat1.id, seats)
                }
                style={{
                  cursor: [
                    "already booked",
                    "female-booked",
                    "male-booked",
                  ].includes(seat1.status)
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                <div className="seat-shape"></div>
                <div className="seat-price">₹{seat1.price}</div>
              </div>
            </div>
          )}

          <div className="aisle-space" />

          <div className="seatsleeper-block double">
            {[seat2, seat3].map(
              (seat) =>
                seat && (
                  <div
                    key={seat.id}
                    className={`seatsleeper ${seat.status} ${
                      selectedSeats.find((s) => s.id === seat.id)?.colorClass ||
                      ""
                    }`}
                    onClick={() =>
                      ![
                        "already booked",
                        "female-booked",
                        "male-booked",
                      ].includes(seat.status) &&
                      toggleSeatSleeper(seat.id, seats)
                    }
                    style={{
                      cursor: [
                        "already booked",
                        "female-booked",
                        "male-booked",
                      ].includes(seat.status)
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    <div className="seat-shape"></div>
                    <div className="seat-price">₹{seat.price}</div>
                  </div>
                )
            )}
          </div>
        </div>
      );
    }
    return rows;
  };

  const getSeatImage = (seat) => {
    const selectedSeat = selected.find((s) => s.number === seat.number);

    if (seat.status === "female-booked" || selectedSeat?.gender === "female") {
      return require("../../Assets/whiteseat.png");
    }
    if (seat.status === "male-booked" || selectedSeat?.gender === "male") {
      return require("../../Assets/maleseat.png");
    }
    if (selectedSeat) {
      return require("../../Assets/greenseat.png");
    }
    return require("../../Assets/greenseat.png");
  };

  const GetmiddleCityroute = async () => {
    // const token = JSON.parse(localStorage.getItem("is_token"));
    const formdata = new FormData();
    formdata.append("type", "POST");
    formdata.append("url", getRouteMiddleCitySequence);
    formdata.append("verifyCall", verifyCall);
    formdata.append("companyID", getBus?.CompanyID);
    formdata.append("routeID", getBus?.RouteID);
    formdata.append("routeTimeID", getBus?.RouteTimeID);

    const middledata = await GetRouteMiddleCitySequence(formdata);
    // console.log("middle daata", middledata);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startCountdownTimer = () => {
    setTimeLeft(180); // 3 minutes = 180 seconds
  };
  // useEffect(() => {
  //   if (timeLeft === null) return;

  //   if (timeLeft <= 0) {
  //     setTimeLeft(null);
  //     return;
  //   }

  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [timeLeft]);
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const TravelCard = () => {
    return (
      <div className="card-container">
        <div className="travel-card">
          <div className="travel-header">
            <h4 className="fw-bold">Eagle Travels</h4>
            <div className="mt-1">{getBus?.BusTypeName}</div>
          </div>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.5,
                textAlign: "right",
                minWidth: "60px",
              },
              padding: 0,
              marginTop: "2rem",
            }}
          >
            {route_middle_city_sequence.map((stop, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {stop.CityTime}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot color="grey" />
                  {index !== route_middle_city_sequence.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>

                <TimelineContent>
                  <Typography variant="body1" fontWeight={600}>
                    {stop.CityName}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>

          <div className="seat-details">
            <h5>Seat details</h5>
            {selectedSeats.length > 0 && (
              <>
                <span>Total Seat : {selectedSeats.length}</span>
                {selectedSeats.map((seat, index) => {
                  return (
                    <>
                      <div className="seat-numbers">
                        <div className="seat-badge">
                          Seat No. {seat.seatNo}
                          {/* {selected.map((item) => item.number).join(", ")} */}
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

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

  const [selectedMembers, setSelectedMembers] = useState([]);

  const renderMemberCard = (member) => {
    const memberId = member.id; // ✅ unique from API
    const isSelected = selectedMembers.some(
      (selected) => selected.id === memberId
    );

    const handleMemberSelect = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSelected) {
        // ✅ remove if already selected
        setSelectedMembers((prev) =>
          prev.filter((selected) => selected.id !== memberId)
        );
      } else {
        // ✅ check max selection limit
        if (selectedMembers.length < selectedSeats.length) {
          setSelectedMembers((prev) => [
            ...prev,
            {
              id: memberId,
              ...member,
            },
          ]);
        } else if (selectedMembers.length < selected.length) {
          setSelectedMembers((prev) => [
            ...prev,
            {
              id: memberId,
              ...member,
            },
          ]);
        } else {
          alert(`You can select maximum ${selectedSeats.length} members.`);
        }
      }
    };

    return (
      <div
        key={memberId}
        className={`member-card ${isSelected ? "selected-member" : ""}`}
        onClick={handleMemberSelect}
        style={{
          cursor: "pointer",
          borderColor: isSelected ? "red" : "#e0e0e0",
        }}
      >
        <div className="member-name">
          {member.first_name} {member.last_name}
        </div>

        <div className="member-info-row">
          <span
            className={`gender-badge ${
              member.gender === 1
                ? "gender-male"
                : member.gender === 2
                ? "gender-female"
                : "gender-other"
            }`}
          >
            {member.gender === 1
              ? "Male"
              : member.gender === 2
              ? "Female"
              : "Other"}
          </span>
          <span className="age-badge">Age: {member.age ?? "N/A"}</span>
        </div>
      </div>
    );
  };

  const renderBookingContent = () => {
    if (!bookingapi || bookingapi.length === 0) {
      return <div className="no-data-message">No bookings found</div>;
    }

    const memberCards = [];
    let hasMember = false;

    // ✅ uniqueness track karva mate
    const seen = new Set();

    bookingapi.forEach((booking) => {
      if (booking.child && booking.child.length > 0) {
        hasMember = true;
        booking.child.forEach((member) => {
          const key = `${member.first_name}-${member.last_name}-${member.age}-${member.gender}`;

          if (!seen.has(key)) {
            seen.add(key);
            memberCards.push(renderMemberCard(member));
          }
        });
      }
    });

    if (!hasMember) {
      return (
        <div className="no-data-message">No members found in bookings</div>
      );
    }

    return memberCards;
  };

  useEffect(() => {
    setPassengerDetails((prevDetails) =>
      prevDetails.map((p, index) => {
        const member = selectedMembers[index]; // assign by order
        if (!member) {
          // ❌ no member for this seat → clear it
          return {
            ...p,
            name: "",
            age: "",
            gender: p.userGender || "",
          };
        }

        // ✅ member exists → fill values
        return {
          ...p,
          name: `${member.first_name} ${member.last_name}`,
          age: member.age,
          gender:
            member.gender === 1
              ? "male"
              : member.gender === 2
              ? "female"
              : "other",
        };
      })
    );
  }, [selectedMembers, selectedSeats]);

  return (
    <>
      <div className="mainzk-cont">
        {loading ? (
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
        ) : (
          <>
            {bussitting === 1 || bussitting === "1" ? (
              <div className="bus-container">
                <div className="steering-wheel">
                  <PiSteeringWheelFill size={40} />
                </div>
                <div className="seats">
                  {seats.map((row, rowIdx) => (
                    <div key={rowIdx} className="seat-row">
                      {/* Left pair */}
                      {row[0].map((seat, seatIdx) => {
                        // Find the index of the nearest "female-booked" seat
                        const femaleBookedIndex = row[0].findIndex(
                          (s) => s.status === "female-booked"
                        );

                        // Determine if current seat is available and adjacent to or before a "female-booked" seat
                        const isAdjacentOrBefore =
                          femaleBookedIndex !== -1 &&
                          (seatIdx <= femaleBookedIndex ||
                            seatIdx === femaleBookedIndex + 1) &&
                          seat.status === "available";

                        return (
                          <div key={seatIdx} className="seat-block">
                            <Tooltip
                              className={`seat-image ${seat.status} ${
                                selected.find((s) => s.number === seat.number)
                                  ?.colorClass || ""
                              }`}
                              title={
                                isAdjacentOrBefore ? (
                                  <div
                                    style={{
                                      whiteSpace: "pre-line",
                                      textAlign: "center",
                                    }}
                                  >
                                    Reserved for lady{"\n"}Seat {seat.number}
                                    {"\n"}₹{seat.price}
                                  </div>
                                ) : seat.status === "available" ? (
                                  <div
                                    style={{
                                      whiteSpace: "pre-line",
                                      textAlign: "center",
                                    }}
                                  >
                                    Available{"\n"}Seat {seat.number}
                                    {"\n"}₹{seat.price}
                                  </div>
                                ) : null
                              }
                              onClick={() =>
                                ![
                                  "already booked",
                                  "female-booked",
                                  "male-booked",
                                ].includes(seat.status) &&
                                toggleSeat(rowIdx, seatIdx)
                              }
                              style={{
                                cursor: [
                                  "already booked",
                                  "female-booked",
                                  "male-booked",
                                ].includes(seat.status)
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                              sx={{ whiteSpace: "pre-line" }}
                            >
                              <img src={getSeatImage(seat)} alt="seat" />
                            </Tooltip>
                            <div className="seat-price">₹{seat.price}</div>
                          </div>
                        );
                      })}
                      {/* Aisle */}
                      <div className="aisle" />
                      {/* Right pair */}
                      {row[1].map((seat, seatIdx) => {
                        // Find the index of the nearest "female-booked" seat in row[1]
                        const femaleBookedIndex = row[1].findIndex(
                          (s) => s.status === "female-booked"
                        );

                        // Determine if current seat is available and adjacent to or before a "female-booked" seat
                        const isAdjacentOrBefore =
                          femaleBookedIndex !== -1 &&
                          (seatIdx <= femaleBookedIndex ||
                            seatIdx === femaleBookedIndex + 1) &&
                          seat.status === "available";

                        return (
                          <div key={seatIdx + 2} className="seat-block">
                            <Tooltip
                              className={`seat-image ${seat.status} ${
                                selected.find((s) => s.number === seat.number)
                                  ?.colorClass || ""
                              }`}
                              title={
                                isAdjacentOrBefore ? (
                                  <div
                                    style={{
                                      whiteSpace: "pre-line",
                                      textAlign: "center",
                                    }}
                                  >
                                    reserved for lady{"\n"}seat {seat.number}
                                    {"\n"}₹{seat.price}
                                  </div>
                                ) : seat.status === "available" ? (
                                  <div
                                    style={{
                                      whiteSpace: "pre-line",
                                      textAlign: "center",
                                    }}
                                  >
                                    Available{"\n"}seat {seat.number}
                                    {"\n"}₹{seat.price}
                                  </div>
                                ) : null
                              }
                              onClick={() =>
                                ![
                                  "already booked",
                                  "female-booked",
                                  "male-booked",
                                ].includes(seat.status) &&
                                toggleSeat(rowIdx, seatIdx + 2)
                              }
                              style={{
                                cursor: [
                                  "already booked",
                                  "female-booked",
                                  "male-booked",
                                ].includes(seat.status)
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                              sx={{ whiteSpace: "pre-line" }}
                            >
                              <img src={getSeatImage(seat)} alt="seat" />
                            </Tooltip>
                            <div className="seat-price">₹{seat.price}</div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="layout-container">
                <div className="columnn">
                  <div className="steering-wheel sleeper_flex_front">
                    <div className="column-title">LOWER BERTH</div>
                    <PiSteeringWheelFill size={32} />
                  </div>
                  {renderSeatsSleeper(lowerSeats)}
                </div>
                <div className="columnn">
                  <div className="sleeper_flex_front_UP">
                    <div className="column-title">UPPER BERTH</div>
                  </div>
                  {renderSeatsSleeper(upperSeats)}
                </div>
              </div>
            )}
            <div className="seat-types-container1">
              <h3 className="seat-title">Know your seat types</h3>
              <div className="seat-table">
                <div className="seat-table-header">
                  <div>Seat Types</div>
                  <div>Seater</div>
                  <div>Sleeper</div>
                </div>
                {seatTypes.map((item, index) => (
                  <div className="seat-table-row" key={index}>
                    <div>{item.label}</div>
                    <div>
                      <div className={item.seaterClass}></div>
                    </div>
                    <div>
                      <div className={item.sleeperClass}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pickupdrop-container">
              <div className="addresscards">
                <h5
                  style={{
                    marginBottom: 20,
                    fontWeight: "bolder",
                    paddingLeft: 20,
                  }}
                >
                  Boarding points
                </h5>
                {boardingPoints.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        selectedBoarding === point.name
                          ? "#fff4eb"
                          : "transparent",
                      padding: 10,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <label className="labelnistyle">
                      <div className="labelnistylenochild1">
                        <input
                          type="radio"
                          name="boarding"
                          className="custom-radiozk"
                          value={point.name}
                          checked={selectedBoarding === point.name}
                          onChange={() => setSelectedBoarding(point.name)}
                        />
                      </div>
                      <div className="labelnistylenochild2">
                        <div className="radio-content">
                          <div className="radio-title">
                            {point.time}   {point.name}
                          </div>
                          {point.address && (
                            <div className="radio-subtitle">
                              {point.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="addresscards">
                <h5
                  style={{
                    marginBottom: 20,
                    fontWeight: "bolder",
                    paddingLeft: 20,
                  }}
                >
                  Dropping points
                </h5>
                {droppingPoints.map((drop, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        selectedDropping === drop.name
                          ? "#fff4eb"
                          : "transparent",
                      padding: 10,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <label className="labelnistyle">
                      <div className="labelnistylenochild1">
                        <input
                          type="radio"
                          name="dropping"
                          className="custom-radiozk"
                          value={drop.name}
                          checked={selectedDropping === drop.name}
                          onChange={() => setSelectedDropping(drop.name)}
                          style={{ marginRight: 10 }}
                        />
                      </div>
                      <div className="labelnistylenochild2">
                        <div style={{ fontWeight: "bold", fontSize: 16 }}>
                          {drop.time}  {drop.name}
                        </div>
                        {drop.address && (
                          <div className="radio-subtitle">{drop.address}</div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {(selected.length > 0 || selectedSeats.length > 0) && (
                <div
                  className={`backdrop-overlay ${isExpanded ? "visible" : ""}`}
                  onClick={() => setIsExpanded(false)}
                >
                  <div
                    className={[
                      "bottom-sheet",
                      selected.length > 0 || selectedSeats.length > 0
                        ? "show"
                        : "",
                      isExpanded ? "expanded" : "",
                    ].join(" ")}
                    onClick={(e) => e.stopPropagation()} // prevent backdrop click from closing
                  >
                    {!isExpanded ? (
                      <>
                        <div className="sheet-left">
                          <span>
                            {selected.length || selectedSeats.length} seat
                          </span>
                          <strong>₹{totalPrice}</strong>
                        </div>
                        <button
                          className="sheet-button-Proceed"
                          disabled={!selectedBoarding || !selectedDropping}
                          onClick={() => {
                            if (!selectedBoarding || !selectedDropping) {
                              alert("Select boarding & dropping");
                            } else if (login == null) {
                              toast.error("Please login to proceed");
                            } else {
                              setIsExpanded(true);
                            }
                          }}
                        >
                          Proceed
                        </button>
                      </>
                    ) : (
                      <div className="sheet-expanded">
                        <div className="top-header-bar">
                          <div
                            className="sheet-close-btn"
                            onClick={() => setIsExpanded(false)}
                          >
                            ×
                          </div>
                          <div className="route-text">
                            <strong>{getBus?.FromCityName}</strong>{" "}
                            <span className="arrow">→</span>{" "}
                            <strong>{getBus?.ToCityName}</strong>
                          </div>
                        </div>

                        {/* <div className="d-flex width100taka align-items-center justify-content-end mt-2">
                          {timeLeft !== null && (
                            <span className="d-flex align-items-center gap-2 fw-bold text-danger">
                              <FaStopwatch />
                              {formatTime(timeLeft)}
                            </span>
                          )}
                        </div> */}

                        <div className="width100taka">
                          <div className="width60taka">
                            <div className="sheet-expanded-content">
                              <div className="form-section">
                                <h4>Contact Details</h4>
                                <p>We’ll send your ticket here</p>
                                <TextField
                                  id="outlined-basic"
                                  label="Email"
                                  size="small"
                                  value={email ? email : userr?.email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  variant="outlined"
                                  className="my-email-field"
                                />
                                <TextField
                                  id="outlined-basic"
                                  label="Phone No."
                                  size="small"
                                  inputMode="numeric"
                                  value={phone ? phone : userr?.mobile_no}
                                  onChange={(e) => {
                                    const input = e.target.value;
                                    if (/^\d{0,10}$/.test(input)) {
                                      setPhone(input);
                                    }
                                  }}
                                  variant="outlined"
                                  className="my-email-field"
                                  inputProps={{ maxLength: 10 }}
                                />
                              </div>
                            </div>

                            <div className="sheet-expanded-content">
                              <div className="form-section">
                                <h4>Previously Booked Members</h4>

                                <div className="members-container">
                                  {renderBookingContent()}
                                </div>
                              </div>
                            </div>

                            <div className="sheet-expanded-content">
                              <div className="form-section">
                                <h4>Passenger details</h4>
                                {bussitting === 1 ? (
                                  <>
                                    {selected.map((seat, index) => {
                                      const passenger = passengerDetails.find(
                                        (p) => p.seatNumber === seat.number
                                      ) || {
                                        seatNumber: seat.number,
                                        name: "",
                                        age: "",
                                        gender: seat.userGender || "",
                                      };
                                      return (
                                        <Accordion
                                          style={{ marginTop: 20 }}
                                          key={index}
                                          expanded={expanded === index}
                                          onChange={(_, isOpen) =>
                                            setExpanded(isOpen ? index : false)
                                          }
                                          sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            boxShadow: "0 0 0 rgba(0,0,0,0.1)",
                                            "&:before": { display: "none" },
                                            backgroundColor: "transparent",
                                          }}
                                        >
                                          <AccordionSummary
                                            expandIcon={<FaAngleDown />}
                                            sx={{
                                              py: 1,
                                              px: 2,
                                              "& .MuiAccordionSummary-content":
                                                {
                                                  alignItems: "center",
                                                  gap: 2,
                                                },
                                            }}
                                          >
                                            <Avatar sx={{ bgcolor: "#e0f2f1" }}>
                                              <IoPerson color="#00796b" />
                                            </Avatar>
                                            <Box>
                                              <Typography
                                                variant="subtitle1"
                                                style={{ fontWeight: "bold" }}
                                              >
                                                Passenger {index + 1}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Seat No. {seat?.number}
                                              </Typography>
                                            </Box>
                                          </AccordionSummary>

                                          <AccordionDetails
                                            sx={{ px: 2, pb: 2 }}
                                          >
                                            <Box
                                              display="flex"
                                              flexDirection="column"
                                              gap={1}
                                            >
                                              <TextField
                                                id={`name-${index}`}
                                                label="Name"
                                                variant="outlined"
                                                size="small"
                                                value={passenger.name}
                                                onChange={(e) => {
                                                  const newPassengerDetails =
                                                    passengerDetails.map((p) =>
                                                      p.seatNumber ===
                                                      seat.number
                                                        ? {
                                                            ...p,
                                                            name: e.target
                                                              .value,
                                                          }
                                                        : p
                                                    );
                                                  setPassengerDetails(
                                                    newPassengerDetails
                                                  );
                                                }}
                                                className="my-name-field"
                                              />
                                              <TextField
                                                id={`age-${index}`}
                                                label="Age"
                                                variant="outlined"
                                                size="small"
                                                value={passenger.age}
                                                onChange={(e) => {
                                                  const newPassengerDetails =
                                                    passengerDetails.map((p) =>
                                                      p.seatNumber ===
                                                      seat.number
                                                        ? {
                                                            ...p,
                                                            age: e.target.value,
                                                          }
                                                        : p
                                                    );
                                                  setPassengerDetails(
                                                    newPassengerDetails
                                                  );
                                                }}
                                                className="my-name-field"
                                              />
                                            </Box>
                                            <div className="gender-container">
                                              <label className="gender-label">
                                                Gender
                                              </label>
                                              {seat?.userGender === "female" ? (
                                                <p
                                                  style={{
                                                    color: "black",
                                                    textTransform: "capitalize",
                                                  }}
                                                >
                                                  female (reserved seat )
                                                </p>
                                              ) : (
                                                <div className="gender-toggle">
                                                  <button
                                                    className={`gender-option ${
                                                      passenger.gender ===
                                                      "male"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                    onClick={() => {
                                                      const newPassengerDetails =
                                                        passengerDetails.map(
                                                          (p) =>
                                                            p.seatNumber ===
                                                            seat.number
                                                              ? {
                                                                  ...p,
                                                                  gender:
                                                                    "male",
                                                                }
                                                              : p
                                                        );
                                                      setPassengerDetails(
                                                        newPassengerDetails
                                                      );
                                                    }}
                                                  >
                                                    <div className="gender-icon">
                                                      <FaMale size={20} />{" "}
                                                      <div>Male</div>
                                                    </div>
                                                  </button>
                                                  <Divider
                                                    orientation="vertical"
                                                    flexItem
                                                  />
                                                  <button
                                                    className={`gender-option ${
                                                      passenger.gender ===
                                                      "female"
                                                        ? "activee"
                                                        : ""
                                                    }`}
                                                    onClick={() => {
                                                      const newPassengerDetails =
                                                        passengerDetails.map(
                                                          (p) =>
                                                            p.seatNumber ===
                                                            seat.number
                                                              ? {
                                                                  ...p,
                                                                  gender:
                                                                    "female",
                                                                }
                                                              : p
                                                        );
                                                      setPassengerDetails(
                                                        newPassengerDetails
                                                      );
                                                    }}
                                                  >
                                                    <div className="gender-icon">
                                                      <FaFemale size={20} />{" "}
                                                      <div>Female</div>
                                                    </div>
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </AccordionDetails>
                                        </Accordion>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <>
                                    {selectedSeats.map((seat, index) => {
                                      const passenger = passengerDetails.find(
                                        (p) => p.seatNumber === seat.seatNo
                                      ) || {
                                        seatNumber: seat.seatNo,
                                        name: "",
                                        age: "",
                                        gender: seat.userGender || "",
                                      };
                                      return (
                                        <Accordion
                                          style={{ marginTop: 20 }}
                                          key={index}
                                          expanded={expanded === index}
                                          onChange={(_, isOpen) =>
                                            setExpanded(isOpen ? index : false)
                                          }
                                          sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            boxShadow: "0 0 0 rgba(0,0,0,0.1)",
                                            "&:before": { display: "none" },
                                            backgroundColor: "transparent",
                                          }}
                                        >
                                          <AccordionSummary
                                            expandIcon={<FaAngleDown />}
                                            sx={{
                                              py: 1,
                                              px: 2,
                                              "& .MuiAccordionSummary-content":
                                                {
                                                  alignItems: "center",
                                                  gap: 2,
                                                },
                                            }}
                                          >
                                            <Avatar sx={{ bgcolor: "#e0f2f1" }}>
                                              <IoPerson color="#00796b" />
                                            </Avatar>
                                            <Box>
                                              <Typography
                                                variant="subtitle1"
                                                style={{ fontWeight: "bold" }}
                                              >
                                                Passenger {index + 1}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Seat No. {seat?.seatNo}
                                              </Typography>
                                            </Box>
                                          </AccordionSummary>

                                          <AccordionDetails
                                            sx={{ px: 2, pb: 2 }}
                                          >
                                            <Box
                                              display="flex"
                                              flexDirection="column"
                                              gap={1}
                                            >
                                              <TextField
                                                id={`name-${index}`}
                                                label="Name"
                                                variant="outlined"
                                                size="small"
                                                value={passenger.name}
                                                onChange={(e) => {
                                                  const newPassengerDetails =
                                                    passengerDetails.map((p) =>
                                                      p.seatNumber ===
                                                      seat.seatNo
                                                        ? {
                                                            ...p,
                                                            name: e.target
                                                              .value,
                                                          }
                                                        : p
                                                    );
                                                  setPassengerDetails(
                                                    newPassengerDetails
                                                  );
                                                }}
                                                className="my-name-field"
                                              />
                                              <TextField
                                                id={`age-${index}`}
                                                label="Age"
                                                variant="outlined"
                                                size="small"
                                                value={passenger.age}
                                                onChange={(e) => {
                                                  const newPassengerDetails =
                                                    passengerDetails.map((p) =>
                                                      p.seatNumber ===
                                                      seat.seatNo
                                                        ? {
                                                            ...p,
                                                            age: e.target.value,
                                                          }
                                                        : p
                                                    );
                                                  setPassengerDetails(
                                                    newPassengerDetails
                                                  );
                                                }}
                                                className="my-name-field"
                                              />
                                            </Box>
                                            <div className="gender-container">
                                              <label className="gender-label">
                                                Gender
                                              </label>
                                              {seat?.userGender === "female" ? (
                                                <p
                                                  style={{
                                                    color: "black",
                                                    textTransform: "capitalize",
                                                  }}
                                                >
                                                  female (reserved seat)
                                                </p>
                                              ) : (
                                                <div className="gender-toggle">
                                                  <button
                                                    className={`gender-option ${
                                                      passenger.gender ===
                                                      "male"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                    onClick={() => {
                                                      const newPassengerDetails =
                                                        passengerDetails.map(
                                                          (p) =>
                                                            p.seatNumber ===
                                                            seat.seatNo
                                                              ? {
                                                                  ...p,
                                                                  gender:
                                                                    "male",
                                                                }
                                                              : p
                                                        );
                                                      setPassengerDetails(
                                                        newPassengerDetails
                                                      );
                                                    }}
                                                  >
                                                    <div className="gender-icon">
                                                      <FaMale size={20} />{" "}
                                                      <div>Male</div>
                                                    </div>
                                                  </button>
                                                  <Divider
                                                    orientation="vertical"
                                                    flexItem
                                                  />
                                                  <button
                                                    className={`gender-option ${
                                                      passenger.gender ===
                                                      "female"
                                                        ? "activee"
                                                        : ""
                                                    }`}
                                                    onClick={() => {
                                                      const newPassengerDetails =
                                                        passengerDetails.map(
                                                          (p) =>
                                                            p.seatNumber ===
                                                            seat.seatNo
                                                              ? {
                                                                  ...p,
                                                                  gender:
                                                                    "female",
                                                                }
                                                              : p
                                                        );
                                                      setPassengerDetails(
                                                        newPassengerDetails
                                                      );
                                                    }}
                                                  >
                                                    <div className="gender-icon">
                                                      <FaFemale size={20} />{" "}
                                                      <div>Female</div>
                                                    </div>
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </AccordionDetails>
                                        </Accordion>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                              <button
                                className="sheet-button"
                                onClick={handleConfirm}
                                // onClick={startCountdownTimer}
                                disabled={book_seat_data_loading}
                              >
                                {book_seat_data_loading
                                  ? "Processing..."
                                  : "Confirm Booking"}
                              </button>
                            </div>
                          </div>

                          <div className="width40taka">
                            <TravelCard />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {paymentData && <RedirectToCCAvenue paymentData={paymentData} />}

      <div className="seat-types-container">
        <h3 className="seat-title">Know your seat types</h3>
        <div className="seat-table">
          <div className="seat-table-header">
            <div>Seat Types</div>
            <div>Seater</div>
            <div>Sleeper</div>
          </div>
          {seatTypes.map((item, index) => (
            <div className="seat-table-row" key={index}>
              <div>{item.label}</div>
              <div>
                <div className={item.seaterClass}></div>
              </div>
              <div>
                <div className={item.sleeperClass}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SeatSelection;
