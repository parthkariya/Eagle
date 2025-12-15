import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./Context/auth_context";
import { BusProvider } from "./Context/bus_context";
import { FlightProvider } from "./Context/flight_context";
import { HotelProvider } from "./Context/Hotel_context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <HotelProvider>
      <FlightProvider>
        <BusProvider>
          <App />
        </BusProvider>
      </FlightProvider>
    </HotelProvider>
  </AuthProvider>
  // </React.StrictMode>
);
