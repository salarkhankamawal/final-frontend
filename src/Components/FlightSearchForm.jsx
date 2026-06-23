import { useState } from "react";
import PassengerCounter from "./PassengerCounter";
import { CABINS, AIRLINES } from "../data/data";

function FlightSearchForm({
  tripType,
  setTripType,
  from,
  setFrom,
  to,
  setTo,
  departure,
  setDeparture,
  returnDate,
  setReturnDate,
  adults,
  setAdults,
  children,
  setChildren,
  infants,
  setInfants,
  cabin,
  setCabin,
  airline,
  setAirline,
}) {
  const [passengerOpen, setPassengerOpen] = useState(false);

  const totalPassengers = adults + children + infants;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Trip Type */}
      <div className="flex gap-2 mb-6">
        {["roundtrip", "oneway", "multicity"].map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={`px-4 py-2 rounded-full ${
              tripType === t
                ? "bg-sky-500 text-white"
                : "bg-slate-100"
            }`}
          >
            {t === "roundtrip"
              ? "Round Trip"
              : t === "oneway"
              ? "One Way"
              : "Multi City"}
          </button>
        ))}
      </div>

      {/* From & To */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-xl p-3"
        />
      </div>

      {/* Dates */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input
          type="date"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="border rounded-xl p-3"
        />

        {tripType === "roundtrip" && (
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="border rounded-xl p-3"
          />
        )}
      </div>

      {/* Passenger */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <button
            onClick={() => setPassengerOpen(!passengerOpen)}
            className="w-full border rounded-xl p-3 text-left"
          >
            {totalPassengers} Passenger
            {totalPassengers > 1 ? "s" : ""}
          </button>

          {passengerOpen && (
            <div className="absolute top-full mt-2 bg-white border rounded-2xl p-4 w-full shadow-lg z-50">
              <PassengerCounter
                label="Adults"
                sublabel="12+ years"
                value={adults}
                onChange={setAdults}
              />

              <PassengerCounter
                label="Children"
                sublabel="2-11 years"
                value={children}
                onChange={setChildren}
              />

              <PassengerCounter
                label="Infants"
                sublabel="Under 2 years"
                value={infants}
                onChange={setInfants}
              />

              <button
                onClick={() => setPassengerOpen(false)}
                className="mt-4 w-full bg-sky-500 text-white py-2 rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Cabin */}
        <select
          value={cabin}
          onChange={(e) => setCabin(e.target.value)}
          className="border rounded-xl p-3"
        >
          {CABINS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Airline */}
        <select
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
          className="border rounded-xl p-3"
        >
          {AIRLINES.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button className="w-full py-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-2xl font-bold">
        Search Flights
      </button>
    </div>
  );
}

export default FlightSearchForm;