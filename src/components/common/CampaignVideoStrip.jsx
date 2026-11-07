import { useEffect, useRef, useState } from "react";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
let advertisingRequest;

function getAdvertising() {
  advertisingRequest ??= fetch(`${apiBase}/public/advertising`).then((response) => response.ok ? response.json() : { campaign: "NONE", videos: [] }).catch(() => ({ campaign: "NONE", videos: [] })).finally(() => { advertisingRequest = undefined; });
  return advertisingRequest;
}

export default function CampaignVideoStrip({ placement }) {
  const [videos, setVideos] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRefs = useRef(new Map());
  const [visible, setVisible] = useState(new Set());

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    getAdvertising().then((data) => setVideos(data.videos.filter((video) => video.placement === placement)));
    return () => media.removeEventListener("change", update);
  }, [placement]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => setVisible((current) => {
      const next = new Set(current);
      entries.forEach((entry) => entry.isIntersecting ? next.add(entry.target.dataset.videoId) : next.delete(entry.target.dataset.videoId));
      return next;
    }), { threshold: 0.2 });
    videoRefs.current.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    videoRefs.current.forEach((video, id) => {
      if (reducedMotion || !visible.has(id)) video.pause();
      else video.play().catch(() => undefined);
    });
  }, [reducedMotion, visible]);

  if (!videos.length) return null;
  return <section aria-label="Contenido promocional" className="bg-[#071018] px-4 py-7 sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl space-y-5">{videos.map((video) => <div key={video.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl shadow-black/30"><video ref={(element) => { if (element) videoRefs.current.set(video.id, element); else videoRefs.current.delete(video.id); }} data-video-id={video.id} muted loop playsInline controls={reducedMotion} preload="metadata" poster={video.posterUrl ?? undefined} className="aspect-[3/1] w-full object-cover md:aspect-[4/1] lg:aspect-[8/1]"><source media="(max-width: 767px)" src={video.mobileUrl} type="video/mp4" /><source src={video.desktopUrl} type="video/mp4" /></video></div>)}</div></section>;
}
