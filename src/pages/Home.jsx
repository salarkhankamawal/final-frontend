import { useState } from "react";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import DestinationsSection from "../Components/DestinationsSection";
import { DESTINATIONS } from "../data/data";

function Home() {
  const [tripType, setTripType] = useState("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const [airline, setAirline] = useState("Any Airline");
  const [showAll, setShowAll] = useState(false);

  const visibleDests = showAll
    ? DESTINATIONS
    : DESTINATIONS.slice(0, 4);

  return (
    <div className="transition-colors duration-300">
      <HeroSection
        tripType={tripType}
        setTripType={setTripType}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        departure={departure}
        setDeparture={setDeparture}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        adults={adults}
        setAdults={setAdults}
        children={children}
        setChildren={setChildren}
        infants={infants}
        setInfants={setInfants}
        cabin={cabin}
        setCabin={setCabin}
        airline={airline}
        setAirline={setAirline}
      />

      <DestinationsSection
        visibleDests={visibleDests}
        setTo={setTo}
        showAll={showAll}
        setShowAll={setShowAll}
      />
    </div>
  );
}

export default Home;