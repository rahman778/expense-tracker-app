import React, { useEffect, useRef } from "react";
import { toast, Zoom } from "react-toastify";
import useOnlineStatus from "../../hooks/useOnlineStatus";

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const prevOnlineRef = useRef(isOnline); // Track the previous online status

  useEffect(() => {
    if (isOnline && !prevOnlineRef.current) {
      // Show the online toast
      toast.info("You are back online! syncing data", {
        position: "bottom-right",
        transition: Zoom,
        hideProgressBar: true,
      });
    }

    if (!isOnline) {
      // Show the offline toast
      toast.warn("You are currently offline. Please check your connection.", {
        position: "bottom-right",
        transition: Zoom,
        hideProgressBar: true,
      });
    }

    // Update the previous online status
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  return null;
};

export default OfflineIndicator;
