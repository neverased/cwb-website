"use client";

import { useEffect, useRef } from "react";

import { processArtifacts, processFlow } from "@/static/siteContent";

import styles from "./process_timeline.module.css";
import { useSiteMotion } from "./site_motion";

const stageArtifacts = [
  processArtifacts[1],
  processArtifacts[0],
  processArtifacts[2],
  processArtifacts[3],
] as const;

export function ProcessTimeline({ detailed = false }: { detailed?: boolean }) {
  const timelineRef = useRef<HTMLOListElement>(null);
  const { enabled, ready } = useSiteMotion();

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !ready) return;

    const stages = Array.from(
      timeline.querySelectorAll<HTMLElement>("[data-process-step]"),
    );

    if (!enabled || !("IntersectionObserver" in window)) {
      timeline.dataset.motion = "static";
      stages.forEach((stage) => {
        stage.dataset.entered = "true";
      });
      return;
    }

    timeline.dataset.motion = "ready";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.entered = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    stages.forEach((stage) => {
      if (stage.dataset.entered !== "true") observer.observe(stage);
    });

    return () => observer.disconnect();
  }, [enabled, ready]);

  const Heading = detailed ? "h2" : "h3";

  return (
    <ol
      ref={timelineRef}
      id={detailed ? "steps" : undefined}
      className={`${styles.timeline} ${detailed ? styles.detailed : ""}`}
      role="list"
    >
      {processFlow.map(({ step, title, summary, input, output }, index) => {
        const artifact = stageArtifacts[index];

        return (
          <li key={step} className={styles.stage} data-process-step={step}>
            <div className={styles.marker} aria-hidden="true">
              <span className={styles.dot} />
              <span className={styles.number}>{step}</span>
            </div>
            <div className={styles.content}>
              <Heading>{title}</Heading>
              <p className={styles.summary}>{summary}</p>
              {detailed && (
                <dl className={styles.details}>
                  <div>
                    <dt>We start with</dt>
                    <dd>{input}</dd>
                  </div>
                  <div>
                    <dt>You leave with</dt>
                    <dd>{output}</dd>
                  </div>
                </dl>
              )}
              <div className={styles.artifact}>
                <p className={styles.artifactLabel}>Working artifact</p>
                <p className={styles.artifactName}>{artifact.label}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
