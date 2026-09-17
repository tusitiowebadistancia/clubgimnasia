import { useEffect, useRef, useState } from "react";

const videos = [
  {
    src: "/videos/banner-3.mp4.mov",
    text: "Bowling, pool y buenos momentos en Necochea.",
    duration: 5000,
  },
  {
    src: "/videos/olasurf.mov",
    text: "Una noche distinta empieza acá.",
    duration: 7000,
  },
  {
    src: "/videos/banner-1.mp4.mov",
    text: "Reservá, vení y disfrutá.",
    duration: 5000,
  },
];

export default function MobileVideoBanner() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const timeoutRef = useRef(null);

  const activeDuration = videos[activeVideo].duration;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index !== activeVideo) {
        video.pause();
        video.currentTime = 0;
        return;
      }

      if (isVisible) {
        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.warn(`No se pudo reproducir el video ${index + 1}`);
          });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });

    if (!isVisible) return;

    timeoutRef.current = window.setTimeout(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, activeDuration);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [activeVideo, activeDuration, isVisible]);

  const handleSelectVideo = (index) => {
    setActiveVideo(index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative block h-[100svh] overflow-hidden bg-black text-white md:hidden"
    >
      {videos.map((video, index) => (
        <video
          key={video.src}
          ref={(element) => {
            videoRefs.current[index] = element;
          }}
          src={video.src}
          muted
          playsInline
          preload="auto"
          onError={() => {
            console.error(`Error cargando video ${index + 1}: ${video.src}`);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            activeVideo === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/20" />

      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-10">
        <p className="mb-6 max-w-[280px] text-sm font-medium leading-relaxed text-white/90">
          {videos[activeVideo].text}
        </p>

        <div className="flex items-center gap-3">
          {videos.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectVideo(index)}
              className="relative flex h-5 w-5 items-center justify-center"
              aria-label={`Video ${index + 1}`}
            >
              {activeVideo === index && isVisible && (
                <svg
                  key={`${activeVideo}-${activeDuration}-${Date.now()}`}
                  className="absolute inset-0 h-5 w-5 -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="3"
                  />

                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray="94"
                    strokeDashoffset="94"
                    style={{
                      animation: `circleProgress ${activeDuration}ms linear forwards`,
                    }}
                  />
                </svg>
              )}

              <span
                className={`h-2 w-2 rounded-full transition ${
                  activeVideo === index ? "bg-white" : "bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}