import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteChangeTracker() {
  const location = useLocation();
  useEffect(() => {
    const GA_ID = (import.meta as any).env?.VITE_GA_ID as string | undefined;
    if (!GA_ID) return;
    const g = (window as any).gtag as undefined | ((...args: any[]) => void);
    if (typeof g === 'function') {
      g('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);
  return null;
}