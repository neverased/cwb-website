"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./profile_lanyard.module.css";

// The portrait remains visible if the optional WebGL chunk cannot be loaded.
const Lanyard = dynamic(
  () => import("./lanyard/lanyard").catch(() => () => null),
  { ssr: false },
);

export const ProfileLanyard = () => {
  const figureRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [motion, setMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReady(false);
      setMotion(!preference.matches);
    };
    updateMotion();
    preference.addEventListener("change", updateMotion);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });
    if (figureRef.current) observer.observe(figureRef.current);

    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updateMotion);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);
  const active = inView && motion && !failed;

  return (
    <figure ref={figureRef} className={styles.figure}>
      <div className={styles.heading}>
        <span>Behind the work</span>
        <span className={styles.marker} aria-hidden="true">
          WB
        </span>
      </div>
      <div
        className={styles.stage}
        data-lanyard-state={active && ready ? "interactive" : "static"}
      >
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
        {mounted && !failed && (
          <button
            className={styles.motionButton}
            type="button"
            onClick={() => {
              setReady(false);
              setMotion((value) => !value);
            }}
            aria-label={
              motion ? "Pause card animation" : "Enable card animation"
            }
          >
            {motion ? "Pause" : "Animate"}
          </button>
        )}
      </figcaption>
    </figure>
  );
};
