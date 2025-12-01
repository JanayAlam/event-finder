"use client";

import * as React from "react";

// Keep this breakpoint in sync with your Tailwind `md` breakpoint (default 768px)
const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(MOBILE_QUERY);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    // Set initial value
    handleChange(mql);

    // Listen for changes
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener(
        "change",
        handleChange as (e: MediaQueryListEvent) => void
      );
      return () =>
        mql.removeEventListener(
          "change",
          handleChange as (e: MediaQueryListEvent) => void
        );
    } else {
      // Safari / older browsers: fall back to deprecated MediaQueryList API
      const legacyMql = mql as unknown as {
        addListener: (
          listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
        ) => void;
        removeListener: (
          listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
        ) => void;
      };

      legacyMql.addListener(handleChange as (e: MediaQueryListEvent) => void);
      return () =>
        legacyMql.removeListener(
          handleChange as (e: MediaQueryListEvent) => void
        );
    }
  }, []);

  return isMobile;
}
