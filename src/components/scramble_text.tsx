"use client";

import {
  ComponentPropsWithoutRef,
  ElementType,
  useEffect,
  useState,
} from "react";
import { useScramble } from "use-scramble";

type ScrambleTextProps<T extends ElementType> = {
  as?: T;
  text: string;
  className?: string;
  delay?: number;
  tick?: number;
  speed?: number;
  step?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const readReducedMotionPreference = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const ScrambleText = <T extends ElementType = "span">({
  as,
  text,
  className,
  delay = 0,
  tick = 1,
  speed = 0.6,
  step = 2,
  ...rest
}: ScrambleTextProps<T>) => {
  const [reduceMotion, setReduceMotion] = useState(readReducedMotionPreference);
  const [isActive, setIsActive] = useState(delay === 0);
  const Tag = (as ?? "span") as ElementType;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduceMotion(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (delay === 0) {
      setIsActive(true);
      return;
    }

    setIsActive(false);

    const timer = window.setTimeout(() => {
      setIsActive(true);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delay, text]);

  const { ref } = useScramble({
    text: isActive && !reduceMotion ? text : "",
    tick,
    speed,
    step,
  });

  if (reduceMotion) {
    return (
      <Tag className={className} {...rest}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={text} {...rest}>
      <span ref={ref}>{text}</span>
    </Tag>
  );
};
