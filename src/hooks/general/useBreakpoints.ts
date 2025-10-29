import { useEffect, useState } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};

const getBreakpoint = (width: number) => {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints["xl"]) return "xl";
  if (width >= breakpoints["lg"]) return "lg";
  if (width >= breakpoints["md"]) return "md";
  if (width >= breakpoints["sm"]) return "sm";
  return "xs";
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() =>
    getBreakpoint(window.innerWidth)
  );

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setBreakpoint(getBreakpoint(newWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const upSm = width >= breakpoints.sm;
  const upMd = width >= breakpoints.md;
  const upLg = width >= breakpoints.lg;
  const upXl = width >= breakpoints.xl;
  const up2xl = width >= breakpoints["2xl"];

  return { breakpoint, upSm, upMd, upLg, upXl, up2xl };
};

export default useBreakpoint;
