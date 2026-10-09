"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./profile_lanyard.module.css";
import { useSiteMotion } from "./site_motion";

// The portrait remains visible if the optional WebGL chunk cannot be loaded.
const Lanyard = dynamic(
  () => import("./lanyard/lanyard").catch(() => () => null),
  { ssr: false },
);

export const ProfileLanyard = () => {
  const figureRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { enabled, ready: preferencesReady, reduced } = useSiteMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });
    if (figureRef.current) observer.observe(figureRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);
  const active = inView && enabled && cardEnabled && !failed;
  useEffect(() => {
    if (!active) setReady(false);
  }, [active]);

  return (
    <figure ref={figureRef} className={styles.figure}>
      <div className={styles.heading}>
        <span>Human in the system</span>
        <span className={styles.marker} aria-hidden="true">
          WB
        </span>
      </div>
      <div
        className={styles.stage}
        data-lanyard-state={active && ready ? "interactive" : "static"}
      >
        <svg
          className={styles.signal}
          viewBox="0 0 640 610"
          fill="none"
          aria-hidden="true"
        >
          <path
            className={styles.signalBase}
            d="M12 85H138L215 162H555 M34 525H105L188 442H610 M413 18V90L490 168V515 M3 285H99L156 342H586"
          />
          <path
            className={styles.signalTrace}
            pathLength="1"
            d="M12 85H138L215 162H555"
          />
          <path
            className={styles.signalTrace}
            pathLength="1"
            d="M610 442H188L105 525H34"
          />
          <circle cx="555" cy="162" r="3" />
          <circle cx="34" cy="525" r="3" />
        </svg>
        <div className={styles.fallback} hidden={active && ready}>
          <div className={styles.strap} aria-hidden="true" />
          <div className={styles.clip} aria-hidden="true" />
          <Image
            className={styles.card}
            src="/lanyard/wojciech-bajer.svg"
            alt="Wojciech Bajer, independent technical consultant"
            width={720}
            height={1012}
            loading="eager"
          />
        </div>
        {active && (
          <div className={styles.scene} data-ready={ready}>
            <Lanyard
              frontImage="/lanyard/wojciech-bajer.svg"
              backImage="/lanyard/reverse.svg"
              strapImage="/lanyard/strap.svg"
              cardColor="#111819"
              strapColor="#a3e8be"
              finish="matte"
              metal="silver"
              size={0.7}
              strapLength={0.24}
              strapWidth={0.64}
              damping={0.7}
              breeze={0}
              intro
              onReady={onReady}
              onError={onError}
            />
          </div>
        )}
      </div>
      <figcaption className={styles.caption}>
        <div>
          <p className={styles.hint}>
            {active && ready
              ? "Drag to move · Click to flip"
              : "Your independent technical partner"}
          </p>
          <Link href="/profile/" className={styles.profileLink}>
            More about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {preferencesReady && !failed && (
          <button
            className={styles.motionButton}
            type="button"
            onClick={() => {
              setReady(false);
              setCardEnabled((value) => !value);
            }}
            disabled={!enabled}
            title={
              !enabled
                ? reduced
                  ? "Reduced motion follows your device setting"
                  : "Enable site motion to animate the card"
                : undefined
            }
            aria-label={
              !enabled
                ? "Card animation disabled"
                : cardEnabled
                  ? "Pause card animation"
                  : "Enable card animation"
            }
          >
            {!enabled ? "Static" : cardEnabled ? "Pause" : "Animate"}
          </button>
        )}
      </figcaption>
    </figure>
  );
};
