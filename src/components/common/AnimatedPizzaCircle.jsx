import { useEffect, useRef, useState } from "react";

const pizzas = ["/images/Pizza1.jpg", "/images/Pizza2.jpg", "/images/Pizza3.jpg", "/images/Pizza4.jpg"];

export default function AnimatedPizzaCircle({ variant }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", handlePreference);
    return () => preference.removeEventListener("change", handlePreference);
  }, []);

  useEffect(() => {
    if (!visible || !pageVisible || reducedMotion) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % pizzas.length), 4200);
    return () => window.clearInterval(timer);
  }, [pageVisible, reducedMotion, visible]);

  const index = reducedMotion ? 0 : activeIndex;

  return (
    <div ref={sectionRef} className="pizza-circle-anchor" aria-hidden="true">
      <div key={index} className={`pizza-circle pizza-circle--${variant} pizza-circle-position-${index}`}>
        <img src={pizzas[index]} alt="" />
      </div>
    </div>
  );
}
