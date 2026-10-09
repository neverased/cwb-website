"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type MouseEvent, Suspense } from "react";

import {
  resolveServiceIntent,
  serviceExplorerHref,
  serviceIntents,
  serviceSelectionUrl,
} from "@/lib/service_intents";
import { contactHref, findService, type ServiceId } from "@/lib/services";
import { services } from "@/static/siteContent";

import styles from "./service_explorer.module.css";
import { MotionSpotlight } from "./site_motion";

const ExplorerView = ({
  serviceId,
  interactive = false,
}: {
  serviceId?: string | null;
  interactive?: boolean;
}) => {
  const { service, intent } = resolveServiceIntent(serviceId);
  const specialties = interactive
    ? intent.serviceIds.map((id) => findService(id)!)
    : services;

  const selectService = (
    event: MouseEvent<HTMLAnchorElement>,
    id: ServiceId,
  ) => {
    if (
      !interactive ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    if (service.id === id) return;
    window.history.pushState(
      null,
      "",
      serviceSelectionUrl(window.location.href, id),
    );
  };

  return (
    <div className={styles.explorer}>
      <nav className={styles.choices} aria-label="What can I help you with?">
        {serviceIntents.map((item) => {
          const selected = intent.id === item.id;
          const targetId = selected ? service.id : item.defaultServiceId;

          return (
            <a
              key={item.id}
              className={styles.choice}
              href={serviceExplorerHref(targetId, interactive)}
              aria-current={selected ? "true" : undefined}
              onClick={(event) => selectService(event, targetId)}
            >
              <span className={styles.choiceCopy}>
                <strong>{item.label}</strong>
                <span>{item.summary}</span>
              </span>
              <span className={styles.choiceArrow} aria-hidden="true">
                ↗
              </span>
            </a>
          );
        })}
      </nav>

      <div className={styles.connector} aria-hidden="true">
        <svg viewBox="0 0 90 336" preserveAspectRatio="none" focusable="false">
          <path className={styles.signalBase} d={intent.signalPath} />
          <path
            key={service.id}
            className={interactive ? styles.signalPulse : styles.signalStatic}
            d={intent.signalPath}
            pathLength="1"
          />
        </svg>
      </div>

      <MotionSpotlight className={styles.panel}>
        <div>
          <p className={styles.label}>Choose a specialty</p>
          <nav className={styles.specialties} aria-label="Choose a specialty">
            {specialties.map((item) => (
              <a
                key={item.id}
                href={serviceExplorerHref(item.id, interactive)}
                aria-current={service.id === item.id ? "true" : undefined}
                onClick={(event) => selectService(event, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div aria-live="polite" aria-atomic="true" className={styles.output}>
          <div
            key={service.id}
            className={interactive ? styles.animatedContent : styles.content}
          >
            <h3>{service.headline}</h3>
            <p className={styles.description}>{service.intro}</p>
            <div className={styles.deliverables}>
              <p className={styles.label}>What you get</p>
              <ul>
                {service.deliverables.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">↳</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Link className={styles.action} href={contactHref(service.id)}>
          <span>Let’s discuss {service.label.toLowerCase()}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </MotionSpotlight>
    </div>
  );
};

const InteractiveExplorer = () => {
  const searchParams = useSearchParams();
  return <ExplorerView serviceId={searchParams.get("service")} interactive />;
};

export const ServiceExplorer = () => (
  <div id="service-explorer" className={styles.anchor}>
    <Suspense fallback={<ExplorerView />}>
      <InteractiveExplorer />
    </Suspense>
  </div>
);
