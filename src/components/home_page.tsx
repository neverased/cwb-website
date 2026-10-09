import Link from "next/link";

import styles from "@/app/(frontend)/page.module.css";
import { ProcessTimeline } from "@/components/process_timeline";
import { ProfileLanyard } from "@/components/profile_lanyard";
import { SelectedWork } from "@/components/selected_work";
import { ServiceExplorer } from "@/components/service_explorer";
import { MotionReveal } from "@/components/site_motion";
import { ContactCallout, SiteShell } from "@/components/site_shell";

export const HomePage = () => (
  <SiteShell currentPath="/">
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <MotionReveal>
          <p className="eyebrow">Independent technical consultant</p>
        </MotionReveal>
        <h1 id="hero-title">
          <span className={styles.titleLine}>
            <MotionReveal as="span" delay={70}>
              Clear decisions.
            </MotionReveal>
          </span>
          <span className={`${styles.titleLine} ${styles.accent}`}>
            <MotionReveal as="span" delay={140}>
              Cleaner delivery.
            </MotionReveal>
          </span>
        </h1>
        <MotionReveal delay={180}>
          <p className={styles.description}>
            I’m Wojciech Bajer. I help founders, product teams and agencies
            connect architecture, software and multimedia with hands-on
            technical delivery.
          </p>
          <p className={styles.disciplines}>
            Software. Architecture. Multimedia. Applied AI.
          </p>
        </MotionReveal>
        <MotionReveal delay={240} className={styles.actions}>
          <Link href="/contact/" className="button">
            Talk about your project <span aria-hidden="true">↗</span>
          </Link>
          <a href="#service-explorer" className="text-link">
            Explore expertise <span aria-hidden="true">→</span>
          </a>
        </MotionReveal>
        <MotionReveal delay={300} className={styles.signature}>
          <span aria-hidden="true">+</span>
          <p>
            Independent advice.
            <br />
            One accountable specialist.
          </p>
        </MotionReveal>
      </div>
      <ProfileLanyard />
    </section>
    <SelectedWork />
    <section className={styles.services} aria-labelledby="services-title">
      <MotionReveal className={styles.sectionHeading}>
        <div>
          <p className="eyebrow">A better starting point</p>
          <h2 id="services-title" className="section-title">
            What needs to
            <br />
            <span>move forward?</span>
          </h2>
        </div>
        <p className="section-copy">
          Start with the challenge.
          <br />
          We’ll connect the right expertise.
        </p>
      </MotionReveal>
      <ServiceExplorer />
    </section>
    <section className={styles.process} aria-labelledby="process-title">
      <MotionReveal className={styles.sectionHeading}>
        <div>
          <p className="eyebrow">From context to a working system</p>
          <h2 id="process-title" className="section-title">
            Understand it.
            <br />
            Improve it. Hand it over.
          </h2>
        </div>
        <Link href="/process/" className="text-link">
          How the work happens <span aria-hidden="true">→</span>
        </Link>
      </MotionReveal>
      <ProcessTimeline />
    </section>
    <ContactCallout />
  </SiteShell>
);
