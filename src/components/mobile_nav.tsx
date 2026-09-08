"use client";

import { type ReactNode, useEffect, useRef } from "react";

import styles from "./site_header.module.css";

export const MobileNav = ({ children }: { children: ReactNode }) => {
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        menu.current
      ) {
        menu.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details
      className={styles.mobileMenu}
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current?.open) {
          menu.current.open = false;
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && menu.current)
          menu.current.open = false;
      }}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("a") &&
          menu.current
        )
          menu.current.open = false;
      }}
    >
      <summary ref={trigger}>
        Menu <span aria-hidden="true">+</span>
      </summary>
      <nav aria-label="Mobile">{children}</nav>
    </details>
  );
};
