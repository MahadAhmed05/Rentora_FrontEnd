import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function usePageLoader() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading;
}
