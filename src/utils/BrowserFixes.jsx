import { useEffect } from "react";

export default function BrowserFixes() {
  useEffect(() => {
    const prevent = (e) => {
      if (e.target?.tagName === "IMG") {
        e.preventDefault();
      }
    };

    const setRealViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setRealViewportHeight();

    window.addEventListener("resize", setRealViewportHeight);
    window.addEventListener("orientationchange", setRealViewportHeight);

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);

    return () => {
      window.removeEventListener("resize", setRealViewportHeight);
      window.removeEventListener("orientationchange", setRealViewportHeight);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
    };
  }, []);

  return null;
}