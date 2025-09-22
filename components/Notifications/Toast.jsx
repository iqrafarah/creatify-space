import React, { useEffect, useState } from "react";

export default function Notification({ id, message, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      key={id}
      className={`notification ${
        isVisible ? "slideIn" : "slideOut"
      } font-medium`}
      aria-live="polite"
    >
      <p>{message}</p>
    </div>
  );
}