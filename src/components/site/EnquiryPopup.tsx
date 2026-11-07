import { useEffect } from "react";
import { useEnquiry } from "./EnquiryProvider";

// First-visit prompt that auto-opens the global enquiry popup.
export function EnquiryPopup() {
  const { open } = useEnquiry();
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { if (sessionStorage.getItem("voyara_enquiry_seen")) return; } catch {}
    const t = setTimeout(() => {
      open({
        title: "Plan your dream trip",
        subtitle: "Get a hand-crafted itinerary + best price within 24 hours.",
      });
      try { sessionStorage.setItem("voyara_enquiry_seen", "1"); } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [open]);
  return null;
}
