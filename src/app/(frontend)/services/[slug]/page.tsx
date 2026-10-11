import Link from "next/link";
import { notFound } from "next/navigation";

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
import {
  findServicePage,
  servicePages,
  servicePath,
} from "@/lib/service_pages";
import { contactHref, findService } from "@/lib/services";

import styles from "../../subpage.module.css";

export const dynamicParams = false;

type Args = { params: Promise<{ slug: string }> };

export const generateStaticParams = () =>
  servicePages.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Args) {
  const { slug } = await params;
  const page = findServicePage(slug);
  if (!page) notFound();
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: servicePath(page.id),
    imagePath: "/services/opengraph-image",
  });
}

export default async function ServicePage({ params }: Args) {
  const { slug } = await params;
  const page = findServicePage(slug);
  if (!page) notFound();
  const service = findService(page.id)!;
  const path = servicePath(page.id);
  const serviceId = absoluteUrl(`${path}#service`);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services/" },
    { name: page.heading, path },
  ]);

  return (
    <SiteShell currentPath="/services">
      <StructuredData
        data={buildJsonLdGraph([
          websiteGraphNode,
          personGraphNode,
          breadcrumb,
          {
            "@type": "Service",
            "@id": serviceId,
            url: absoluteUrl(path),
            name: page.heading,
            description: page.description,
            serviceType: page.heading,
            provider: { "@id": PERSON_ID },
          },
          buildWebPageNode({
            name: page.title,
            description: page.description,
            path,
            imagePath: "/services/opengraph-image",
            breadcrumbId: breadcrumb["@id"],
            about: [{ "@id": PERSON_ID }],
            mainEntity: { "@id": serviceId },
          }),
        ])}
      />
      <section className={styles.lead}>
        <nav className="eyebrow" aria-label="Breadcrumb">
          <Link href="/services/">Services</Link> / {service.label}
        </nav>
        <h1 className={styles.title}>{page.heading}</h1>
        <p className={styles.description}>{page.introduction}</p>
        <nav className={styles.jumpLinks} aria-label="Service next steps">
          <Link href={contactHref(page.id)}>
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
          <a href="#scope">
            Explore the scope <span aria-hidden="true">↓</span>
          </a>
        </nav>
      </section>
      <section className={styles.service} aria-labelledby="fit-title">
        <div className={styles.serviceIdentity}>
          <p className="eyebrow">01 / The starting point</p>
          <h2 id="fit-title">When this helps</h2>
        </div>
        <div className={styles.serviceDetails}>
          <p>{page.fit}</p>
        </div>
      </section>
      <section
        id="scope"
        className={styles.service}
        aria-labelledby="scope-title"
      >
        <div className={styles.serviceIdentity}>
          <p className="eyebrow">02 / The work</p>
          <h2 id="scope-title">What the work covers</h2>
          <Link className="text-link" href="/process/">
            How the consulting process works <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.serviceDetails}>
          {page.scope.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className={styles.outputLabel}>Possible deliverables</p>
          <ul className={styles.deliverables}>
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className={styles.service} aria-labelledby="preparation-title">
        <div className={styles.serviceIdentity}>
          <p className="eyebrow">03 / Before we start</p>
          <h2 id="preparation-title">Bring your context</h2>
          <Link className="text-link" href="/profile/">
            About Wojciech Bajer <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.serviceDetails}>
          <p>{page.preparation}</p>
        </div>
      </section>
      <section className={styles.service} aria-labelledby="questions-title">
        <div className={styles.serviceIdentity}>
          <p className="eyebrow">04 / Useful questions</p>
          <h2 id="questions-title">Before choosing a route</h2>
        </div>
        <div className={styles.serviceDetails}>
          {page.questions.map(({ question, answer }) => (
            <details key={question} className={styles.disclosure}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className={styles.expertise} aria-labelledby="related-title">
        <p className="eyebrow">Connected work</p>
        <h2 id="related-title" className="section-title">
          Related services
        </h2>
        <nav className={styles.expertiseLinks} aria-label="Related services">
          {page.relatedServiceIds.map((id) => (
            <Link key={id} href={servicePath(id)}>
              {servicePages.find((item) => item.id === id)!.heading}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/services/">
            All consulting services <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </section>
      <ContactCallout />
    </SiteShell>
  );
}
