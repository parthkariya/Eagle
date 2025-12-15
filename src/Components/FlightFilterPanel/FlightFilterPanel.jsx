import React, { useMemo } from "react";
import "./FlightFilterPanel.css"; // optional styling file

const FlightFilterPanel = ({ filters, setFilters, flightdata }) => {
  // ✅ Extract unique airline names dynamically
  const airlines = useMemo(() => {
    const names = new Set();
    (flightdata || []).forEach((f) => {
      const name = f.sg?.[0]?.al?.alN;
      if (name) names.add(name);
    });
    return Array.from(names).sort();
  }, [flightdata]);

  // ✅ Cabin types (you already have class names)
  const cabinTypes = ["Economy", "Business", "Premium Economy", "First", "Premium Business"];

  // ✅ Stops options
  const stopsOptions = [
    { label: "Non-stop", value: 0 },
    { label: "1 Stop", value: 1 },
    { label: "2+ Stops", value: 2 },
  ];

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const selected = new Set(prev[category]);
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
      return { ...prev, [category]: Array.from(selected) };
    });
  };

  const clearAll = () => {
    setFilters({
      stops: [],
      cabinTypes: [],
      airlines: [],
    });
  };

  return (
    <div className="flight-filter-panel shadow-sm p-3 rounded-3 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">Filters</h5>
        <button
          onClick={clearAll}
          className="btn btn-sm btn-outline-secondary"
        >
          Clear
        </button>
      </div>

      {/* ✈️ Stops */}
      <div className="filter-section mb-3">
        <h6 className="fw-semibold">Stops</h6>
        {stopsOptions.map((opt) => (
          <div key={opt.value} className="form-check">
            <input
              type="checkbox"
              id={`stop-${opt.value}`}
              className="form-check-input"
              checked={filters.stops.includes(opt.value)}
              onChange={() => handleCheckboxChange("stops", opt.value)}
            />
            <label htmlFor={`stop-${opt.value}`} className="form-check-label">
              {opt.label}
            </label>
          </div>
        ))}
      </div>

      {/* 🪑 Cabin Type */}
      <div className="filter-section mb-3">
        <h6 className="fw-semibold">Cabin Type</h6>
        {cabinTypes.map((type) => (
          <div key={type} className="form-check">
            <input
              type="checkbox"
              id={`cabin-${type}`}
              className="form-check-input"
              checked={filters.cabinTypes.includes(type)}
              onChange={() => handleCheckboxChange("cabinTypes", type)}
            />
            <label htmlFor={`cabin-${type}`} className="form-check-label">
              {type}
            </label>
          </div>
        ))}
      </div>

      {/* 🏢 Airlines */}
      <div className="filter-section mb-3">
        <h6 className="fw-semibold">Airlines</h6>
        <div className="airline-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {airlines.map((airline) => (
            <div key={airline} className="form-check">
              <input
                type="checkbox"
                id={`airline-${airline}`}
                className="form-check-input"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleCheckboxChange("airlines", airline)}
              />
              <label htmlFor={`airline-${airline}`} className="form-check-label">
                {airline}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightFilterPanel;