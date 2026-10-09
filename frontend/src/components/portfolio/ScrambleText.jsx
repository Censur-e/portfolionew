import React, { useState, useRef, useEffect } from "react";

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

export const ScrambleText = ({ text, className = "", as = "span", triggerOnHover = true }) => {
  const [displayText, setDisplayText] = useState(text);
  const animating = useRef(false);
  const frameRef = useRef(null);
  const textRef = useRef(text);
  textRef.current = text;

  const scramble = () => {
    if (animating.current) return;
    animating.current = true;
    const original = textRef.current;
    const len = original.length;
    const start = performance.now();
    const duration = 380; // ms

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * len);

      let scrambled = "";
      for (let i = 0; i < len; i++) {
        const char = original[i];
        if (char === " " || char === "-" || char === "'" || char === ".") {
          scrambled += char;
        } else if (i < revealedCount) {
          scrambled += original[i];
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(original);
        animating.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    setDisplayText(text);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text]);

  const Component = as;

  return (
    <Component
      className={className}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </Component>
  );
};

export default ScrambleText;
