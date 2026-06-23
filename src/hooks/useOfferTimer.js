import { useEffect, useState } from "react";
import { OFFER_VALIDITY_MS } from "../utils/constants";

export function useOfferTimer(startedAt) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, OFFER_VALIDITY_MS - (Date.now() - startedAt))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, OFFER_VALIDITY_MS - (Date.now() - startedAt)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const expired = remaining <= 0;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return {
    expired,
    remaining,
    label: `${minutes}:${seconds.toString().padStart(2, "0")}`,
  };
}
