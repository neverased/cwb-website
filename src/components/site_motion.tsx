"use client";

import {
  createContext,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "cwb-motion-paused";
const MotionContext = createContext({
  enabled: false,
  ready: false,
  reduced: true,
  paused: false,
  toggle: () => {},
});

export const useSiteMotion = () => useContext(MotionContext);

// Public pages keep their server-rendered content. Motion is an enhancement
// that starts only after both browser and visitor preferences are known.
export const SiteMotion = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    try {
      setPaused(sessionStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      // Motion still works when browser storage is unavailable.
    }
    setReady(true);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const toggle = useCallback(() => {
    setPaused((previous) => {
      const next = !previous;
      try {
        sessionStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // A pause does not depend on persisting the preference.
      }
      return next;
    });
  }, []);
  const enabled = ready && !reduced && !paused;
  const value = useMemo(
    () => ({ enabled, ready, reduced, paused, toggle }),
    [enabled, ready, reduced, paused, toggle],
  );

  return (
    <MotionContext value={value}>
      <div
        className={className}
        data-site-motion={enabled ? "enabled" : "paused"}
      >
        {children}
      </div>
    </MotionContext>
  );
};

export const MotionToggle = () => {
  const { enabled, ready, reduced, toggle } = useSiteMotion();
  return (
    <button
      className="motion-toggle"
      type="button"
      hidden={!ready}
      disabled={reduced}
      aria-label={
        reduced ? "Motion limited by your device setting" : "Pause motion"
      }
      aria-pressed={!enabled}
      title={
        reduced
          ? "Reduced motion follows your device setting"
          : enabled
            ? "Pause animations"
            : "Resume animations"
      }
      onClick={toggle}
    >
      <svg
        viewBox="0 0 20 20"
        width="18"
        height="18"
        fill="none"
        aria-hidden="true"
      >
        {enabled ? (
          <path d="M7 5v10M13 5v10" stroke="currentColor" strokeWidth="1.5" />
        ) : (
          <path d="m7 4 8 6-8 6V4Z" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
      <span>Motion</span>
    </button>
  );
};

export const MotionReveal = ({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "span";
  delay?: number;
}) => {
  const { enabled } = useSiteMotion();
  const element = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const node = element.current;
    if (!node || !enabled || played.current || !node.animate) return;
    let animation: Animation | undefined;
    const reveal = () => {
      played.current = true;
      animation = node.animate(
        [
          { opacity: 0.25, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      );
    };
    if (!("IntersectionObserver" in window)) {
      reveal();
      return () => animation?.cancel();
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          reveal();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [enabled, delay]);

  return (
    <Tag ref={element} className={className}>
      {children}
    </Tag>
  );
};

export const MotionSpotlight = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const { enabled } = useSiteMotion();
  const element = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    if (!enabled) {
      element.current?.style.removeProperty("--spotlight-x");
      element.current?.style.removeProperty("--spotlight-y");
    }
    return () => cancelAnimationFrame(frame.current);
  }, [enabled]);

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !enabled ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;

    const node = event.currentTarget;
    const { left, top } = node.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      node.style.setProperty("--spotlight-x", `${x}px`);
      node.style.setProperty("--spotlight-y", `${y}px`);
    });
  };

  return (
    <div ref={element} className={className} onPointerMove={track}>
      {children}
    </div>
  );
};
