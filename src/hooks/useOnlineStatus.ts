import { useEffect, useState } from "react";
import { onlineManager } from "@tanstack/react-query";

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(onlineManager.isOnline());
    };

    const unsubscribe = onlineManager.subscribe(handleOnlineStatusChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
