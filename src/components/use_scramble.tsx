import { useEffect, useRef, useState } from "react";
import { useScramble } from "use-scramble";

import styles from "./use_scramble.module.css";

interface TerminalLoaderProps {
  texts: string[];
  loop?: boolean;
  onComplete?: () => void;
}

const STAGES = [
  {
    limit: 24,
    label: "auth handshake",
    detail: "validating operator credentials",
  },
  {
    limit: 54,
    label: "kernel patch",
    detail: "warming runtime and secure modules",
  },
  {
    limit: 82,
    label: "swarm uplink",
    detail: "linking remote nodes and caching assets",
  },
  {
    limit: 100,
    label: "interface launch",
    detail: "rendering the brand shell",
  },
] as const;

const COMPLETE_STAGE = {
  label: "handoff complete",
  detail: "opening destination interface",
} as const;

const getLineTone = (line: string) => {
  if (!line.trim()) {
    return styles.lineMuted;
  }

  if (line.startsWith("$")) {
    return styles.linePrompt;
  }

  if (/ready|stable|registered|active|online|complete|launch/i.test(line)) {
    return styles.lineSuccess;
  }

  if (
    /authorization|monitored|patching|loading|rendering|syncing/i.test(line)
  ) {
    return styles.lineWarning;
  }

  return "";
};

export const TerminalLoader = ({
  texts,
  loop = true,
  onComplete,
}: TerminalLoaderProps) => {
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const completionTriggeredRef = useRef(false);
  const currentText = texts[index] ?? "";
  const progress = isComplete
    ? 100
    : Math.max(6, Math.round(((index + 1) / texts.length) * 100));
  const stage = isComplete
    ? COMPLETE_STAGE
    : (STAGES.find(({ limit }) => progress <= limit) ??
      STAGES[STAGES.length - 1]);

  const clearScheduledAdvance = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleAdvance = (delay: number) => {
    clearScheduledAdvance();
    timeoutRef.current = window.setTimeout(() => {
      if (index >= texts.length - 1) {
        if (loop) {
          setIndex(0);
        } else if (!completionTriggeredRef.current) {
          completionTriggeredRef.current = true;
          setIsComplete(true);
          onComplete?.();
        }

        timeoutRef.current = null;
        return;
      }

      setIndex((currentIndex) => currentIndex + 1);
      timeoutRef.current = null;
    }, delay);
  };

  const { ref } = useScramble({
    text: currentText,
    tick: 2,
    speed: 0.8,
    step: 3,
    onAnimationEnd: () => {
      if (!currentText.trim()) {
        return;
      }

      scheduleAdvance(index >= texts.length - 1 ? 900 : 80);
    },
  });

  useEffect(() => {
    clearScheduledAdvance();
    setIndex(0);
    setIsComplete(false);
    completionTriggeredRef.current = false;
  }, [texts]);

  useEffect(() => {
    if (currentText.trim()) {
      return;
    }

    scheduleAdvance(index >= texts.length - 1 ? 900 : 80);

    return clearScheduledAdvance;
  }, [currentText, index]);

  useEffect(() => clearScheduledAdvance, []);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div className={styles.windowControls}>
          <span className={styles.controlRed} />
          <span className={styles.controlAmber} />
          <span className={styles.controlGreen} />
        </div>

        <div className={styles.headerMeta}>
          <span>cwb://initializing</span>
          <span className={styles.statusBadge}>
            {isComplete ? "ready" : "loading"}
          </span>
        </div>
      </div>

      <div className={styles.progressBlock}>
        <div className={styles.progressMeta}>
          <span>{stage.label}</span>
          <span>{progress}%</span>
        </div>
        <div className={styles.progressTrack}>
          <span
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <pre className={styles.screen} aria-live="polite">
        {texts.slice(0, index).map((line, lineIndex) => (
          <div
            key={`${line}-${lineIndex}`}
            className={[styles.line, getLineTone(line)]
              .filter(Boolean)
              .join(" ")}
          >
            {line || "\u00A0"}
          </div>
        ))}
        <div
          className={[styles.line, styles.activeLine, getLineTone(currentText)]
            .filter(Boolean)
            .join(" ")}
        >
          {currentText.trim() ? (
            <span ref={ref} />
          ) : (
            <span>{currentText || "\u00A0"}</span>
          )}
          <span className={styles.cursor} />
        </div>
      </pre>

      <div className={styles.footer}>
        <span>runtime boot sequence</span>
        <span>{stage.detail}</span>
      </div>
    </div>
  );
};
