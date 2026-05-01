import React, { useEffect, useRef } from "react";

/**
 * Custom flashlight cursor.
 * - Hides default cursor (via body class).
 * - Renders a small dot + a ring that follows with easing.
 * - Updates CSS vars --mx / --my on body so the .flashlight-grid mask follows.
 * - Grows/changes when hovering elements with [data-cursor="hover"].
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });

  useEffect(() => {
    // Don't activate on touch devices
    if (window.matchMedia("(hover: none)").matches) return;
    document.body.classList.add("censure-cursor-active");

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      document.body.style.setProperty("--mx", `${e.clientX}px`);
      document.body.style.setProperty("--my", `${e.clientY}px`);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };

    const onOver = (e) => {
      const t = e.target.closest('[data-cursor="hover"], a, button');
      if (t) {
        dotRef.current?.classList.add("is-hover");
        ringRef.current?.classList.add("is-hover");
      }
    };
    const onOut = (e) => {
      const t = e.target.closest('[data-cursor="hover"], a, button');
      if (t) {
        dotRef.current?.classList.remove("is-hover");
        ringRef.current?.classList.remove("is-hover");
      }
    };

    let raf;
    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.16;
      ring.current.y += (target.current.y - ring.current.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.body.classList.remove("censure-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cen-cursor-ring" />
      <div ref={dotRef} className="cen-cursor" />
      <div className="flashlight-grid" aria-hidden="true" />
    </>
  );
};

/**
 * MagneticLink — wraps content with a magnetic hover effect.
 * Usage: <MagneticLink href="...">Text</MagneticLink>
 */
export const MagneticLink = ({ as = "a", strength = 0.35, className = "", children, ...rest }) => {
  const ref = useRef(null);
  const Cmp = as;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <Cmp
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className={`magnetic ${className}`}
      style={{ transition: "transform 0.5s cubic-bezier(.22,.61,.36,1)" }}
      {...rest}
    >
      {children}
    </Cmp>
  );
};

export default CustomCursor;
