import { useState } from "react";

export default function ImageSwapOnHold({
  firstImage,
  secondImage,
  alt = "Imagen interactiva",
  className = "",
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <img
        src={pressed ? secondImage : firstImage}
        alt={alt}
        className="h-full w-full object-cover transition duration-300"
      />
    </div>
  );
}