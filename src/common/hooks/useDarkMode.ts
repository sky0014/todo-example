import { useEffect, useMemo, useState } from "react";

const DARK_MODE_SCHEME = "(prefers-color-scheme: dark)";

export function getIsDarkMode() {
  return window.matchMedia(DARK_MODE_SCHEME).matches;
}

export function useDarkMode() {
  const initValue = useMemo(getIsDarkMode, []);
  const [isDarkMode, setDarkMode] = useState(initValue);

  useEffect(() => {
    const query = window.matchMedia(DARK_MODE_SCHEME);

    const listener = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };
    query.addEventListener("change", listener);

    return () => {
      query.removeEventListener("change", listener);
    };
  }, []);

  return isDarkMode;
}
