"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { contactHref, findService, type Service } from "@/lib/services";
import { services } from "@/static/siteContent";

import styles from "./service_explorer.module.css";

const defaultService = services[3];

const ExplorerView = ({
  service,
  interactive = false,
}: {
  service: Service;
  interactive?: boolean;
}) => (
  <aside className={styles.console} aria-label="Explore consulting services">
    <div className={styles.titlebar}>
      <span className={styles.prompt} aria-hidden="true">
        &gt;_
      </span>
      <span>service explorer</span>
      <span className={styles.filetype}>.consulting</span>
    </div>
    <div className={styles.body}>
      <p className={styles.instruction}>What can I help you with?</p>
      <nav className={styles.options} aria-label="Choose a service">
        {services.map((item, index) => (
          <a
            key={item.id}
            href={
              interactive
                ? `/?service=${item.id}#service-explorer`
                : `/services/#${item.id}`
            }
            aria-current={service.id === item.id ? "true" : undefined}
            onClick={
              interactive
                ? (event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.button !== 0
                    )
                      return;
                    event.preventDefault();
                    const url = new URL(window.location.href);
                    url.searchParams.set("service", item.id);
                    window.history.replaceState(null, "", url);
                  }
                : undefined
            }
          >
            <span className={styles.index} aria-hidden="true">
              0{index + 1}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className={styles.result}>
        <p className={styles.path}>
          <span aria-hidden="true">~/</span>services/{service.id}
        </p>
        <h2>{service.headline}</h2>
        <p className={styles.outputLabel}>What you get</p>
        <ul>
          {service.deliverables.slice(0, 3).map((item) => (
            <li key={item}>
              <span aria-hidden="true">↳</span>
              {item}
            </li>
          ))}
        </ul>
        <Link className={styles.action} href={contactHref(service.id)}>
          Let’s discuss {service.label.toLowerCase()}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
    <div className={styles.statusbar}>
      <span>
        <span aria-hidden="true">●</span> Independent advice · Hands-on work
      </span>
      <span aria-hidden="true">UTF-8</span>
    </div>
  </aside>
);

const InteractiveExplorer = () => {
  const searchParams = useSearchParams();
  const service = findService(searchParams.get("service")) ?? defaultService;
  return <ExplorerView service={service} interactive />;
};

export const ServiceExplorer = () => (
  <div id="service-explorer" className={styles.anchor}>
    <Suspense fallback={<ExplorerView service={defaultService} />}>
      <InteractiveExplorer />
    </Suspense>
  </div>
);
