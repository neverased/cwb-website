import Link from "next/link";

import { ContactCallout, SiteShell } from "@/components/site_shell";
import { StructuredData } from "@/components/structured_data";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildJsonLdGraph,
  buildMetadata,
  buildWebPageNode,
  PERSON_ID,
  personGraphNode,
  websiteGraphNode,
} from "@/lib/seo";
import { contactHref } from "@/lib/services";
import { services } from "@/static/siteContent";

import styles from "../subpage.module.css";

const SERVICES_TITLE =
  "Software, AI & Technical Audit Services | Wojciech Bajer";
const SERVICES_DESCRIPTION =
  "Explore software engineering, architecture reviews, technical audits, multimedia, fractional CTO support and AI integrations with Wojciech Bajer.";

export const metadata = buildMetadata({
  title: SERVICES_TITLE,
  description: SERVICES_DESCRIPTION,
  path: "/services/",
  keywords: [
    "multimedia services",
    "software engineering consulting",
    "application architecture consulting",
    "technical audit services",
    "fractional technical leadership",
    "fractional CTO services",
    "AI engineering services",
    "LLM integration consulting",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services/" },
]);

const servicesListJsonLd = {
  "@type": "ItemList",
  "@id": absoluteUrl("/services/#list"),
  itemListElement: services.map(({ id, label, headline }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": absoluteUrl(`/services/#${id}`),
      url: absoluteUrl(`/services/#${id}`),
      name: label,
      description: headline,
      provider: {
        "@id": PERSON_ID,
      },
    },
  })),
};

const servicesPageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  servicesListJsonLd,
  buildWebPageNode({
    type: "CollectionPage",
    name: SERVICES_TITLE,
    description: SERVICES_DESCRIPTION,
    path: "/services/",
    breadcrumbId: absoluteUrl("/services/#breadcrumb"),
    about: [
      {
        "@id": PERSON_ID,
      },
    ],
    mainEntity: {
      "@id": absoluteUrl("/services/#list"),
    },
  }),
]);

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <StructuredData data={servicesPageJsonLd} />
      <section className={styles.lead}>
        <p className="eyebrow">Services / Find your starting point</p>
        <h1 className={styles.title}>
          Complex work.
          <br />
          <span>Clear ways to help.</span>
        </h1>
        <p className={styles.description}>
          Software engineering, architecture reviews, technical audits,
          multimedia and AI integrations. Choose the support your team needs,
          from a focused review to fractional technical leadership.
        </p>
        <nav className={styles.jumpLinks} aria-label="Service sections">
          {services.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
              <span aria-hidden="true">↓</span>
            </a>
          ))}
        </nav>
      </section>
      <div className={styles.serviceList}>
        {services.map((service, index) => (
          <section
            id={service.id}
            key={service.id}
            className={styles.service}
            aria-labelledby={`${service.id}-title`}
          >
            <div className={styles.serviceIdentity}>
              <p className="eyebrow">
                0{index + 1} / {service.status}
              </p>
              <h2 id={`${service.id}-title`}>{service.label}</h2>
              <Link className="text-link" href={contactHref(service.id)}>
                Discuss {service.label.toLowerCase()}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.serviceDetails}>
              <h3>{service.headline}</h3>
              <p>{service.intro}</p>
              <p className={styles.outputLabel}>What you take away</p>
              <ul className={styles.deliverables}>
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <details className={styles.disclosure}>
                <summary>
                  How the work happens <span aria-hidden="true">+</span>
                </summary>
                <dl>
                  {service.stages.map(({ label, value }) => (
                    <div key={label}>
                      <dt>
                        {label === "signal in"
                          ? "Starting point"
                          : label === "signal out"
                            ? "Result"
                            : "The work"}
                      </dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p>{service.fit}</p>
              </details>
            </div>
          </section>
        ))}
      </div>
      <ContactCallout />
    </SiteShell>
  );
}
