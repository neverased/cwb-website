import Image from "next/image";
import Link from "next/link";

import styles from "@/app/page.module.css";
import { SelectedWork } from "@/components/selected_work";
import { ServiceExplorer } from "@/components/service_explorer";
import { ContactCallout, SiteShell } from "@/components/site_shell";
import { contactHref } from "@/lib/services";
import { processFlow, services } from "@/static/siteContent";

export const HomePage = () => (
  <SiteShell currentPath="/">
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className="eyebrow">
          Technical clarity. From first question to delivery.
        </p>
        <h1 id="hero-title">
          Clear decisions.
          <br />
          <span>Cleaner delivery.</span>
        </h1>
        <p className={styles.description}>
          I help founders, product teams and agencies make sense of complex
          technical work — and get it done.
        </p>
        <p className={styles.disciplines}>
          Software. Architecture. Multimedia. Applied AI.
        </p>
        <div className={styles.actions}>
          <Link href="/contact/" className="button">
            Send a brief <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/services/" className="text-link">
            Explore services <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.signature}>
          <Image
            src="/wbc_logo_alpha_kolor_neg.png"
            alt="Consulting Wojciech Bajer"
            width={3667}
            height={700}
            sizes="200px"
            priority
          />
          <span>
            Independent advice.
            <br />
            One accountable specialist.
          </span>
        </div>
      </div>
      <ServiceExplorer />
    </section>
    <SelectedWork />
    <section className={styles.services} aria-labelledby="services-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className="eyebrow">01 / How I can help</p>
          <h2 id="services-title" className="section-title">
            Find the right
            <br />
            way forward.
          </h2>
        </div>
        <p className="section-copy">
          A focused review, a hands-on build, or ongoing technical direction.
          Start where your team needs clarity.
        </p>
      </div>
      <div className={styles.serviceList}>
        {services.map((service, index) => (
          <article key={service.id} className={styles.serviceRow}>
            <span className={styles.number}>0{index + 1}</span>
            <h3>
              <Link href={`/services/#${service.id}`}>{service.label}</Link>
            </h3>
            <p>{service.headline}</p>
            <Link
              className={styles.serviceLink}
              href={contactHref(service.id)}
              aria-label={`Discuss ${service.label.toLowerCase()}`}
            >
              <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
    <section className={styles.process} aria-labelledby="process-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className="eyebrow">02 / Working together</p>
          <h2 id="process-title" className="section-title">
            Understand it.
            <br />
            Improve it. Hand it over.
          </h2>
        </div>
        <Link href="/process/" className="text-link">
          How the work happens <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ol className={styles.steps}>
        {processFlow.map(({ step, title, output }) => (
          <li key={step}>
            <span className={styles.number}>{step}</span>
            <h3>{title}</h3>
            <p>{output}.</p>
          </li>
        ))}
      </ol>
    </section>
    <ContactCallout />
  </SiteShell>
);
