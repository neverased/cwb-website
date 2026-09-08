import Link from "next/link";

import { CredibilityPanel } from "@/components/credibility_panel";
import { SelectedWork } from "@/components/selected_work";
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
  PROFILE_PATH,
  websiteGraphNode,
} from "@/lib/seo";
import { services } from "@/static/siteContent";

import styles from "../subpage.module.css";

const PROFILE_TITLE = "Profile | Wojciech Bajer";
const PROFILE_DESCRIPTION =
  "Profile of Wojciech Bajer, covering multimedia systems, software engineering, application architecture, audits, selected collaborations, and direct consulting routes.";

export const metadata = buildMetadata({
  title: PROFILE_TITLE,
  description: PROFILE_DESCRIPTION,
  path: PROFILE_PATH,
  keywords: [
    "Wojciech Bajer profile",
    "about Wojciech Bajer",
    "technical consultant",
    "software and multimedia consultant",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Profile", path: PROFILE_PATH },
]);

const profilePageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  buildWebPageNode({
    type: "ProfilePage",
    name: PROFILE_TITLE,
    description: PROFILE_DESCRIPTION,
    path: PROFILE_PATH,
    breadcrumbId: absoluteUrl(`${PROFILE_PATH}#breadcrumb`),
    about: [
      {
        "@id": PERSON_ID,
      },
    ],
    mainEntity: {
      "@id": PERSON_ID,
    },
  }),
]);

export default function ProfilePage() {
  return (
    <SiteShell currentPath="/profile">
      <StructuredData data={profilePageJsonLd} />
      <section className={styles.profileLead}>
        <div>
          <p className="eyebrow">About / Wojciech Bajer</p>
          <h1 className={styles.title}>
            A thinking partner.
            <br />
            <span>A hands-on specialist.</span>
          </h1>
          <p className={styles.description}>
            I work where multimedia, software and technical decisions meet. I
            help teams understand what is happening, decide what matters, and
            follow through.
          </p>
        </div>
        <aside className={styles.profileFacts} aria-label="Profile at a glance">
          <p className="eyebrow">~/profile</p>
          <dl>
            <div>
              <dt>Based in</dt>
              <dd>Poland</dd>
            </div>
            <div>
              <dt>Working with</dt>
              <dd>Teams worldwide</dd>
            </div>
            <div>
              <dt>Engagements</dt>
              <dd>Consulting, audits, delivery</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>Independent advice + hands-on work</dd>
            </div>
          </dl>
        </aside>
      </section>
      <SelectedWork />
      <section className={styles.aboutSection}>
        <div>
          <p className="eyebrow">How I work</p>
          <h2 className="section-title">
            Close to the problem.
            <br />
            Accountable for the work.
          </h2>
        </div>
        <div className={styles.prose}>
          <p>
            Some engagements start with a technical review. Others need
            implementation, production supervision, or someone to own the next
            architectural decision.
          </p>
          <p>
            I stay close to the details: the system, the people doing the work,
            and the constraints they have to live with. The result should be a
            practical improvement and a handoff the team can keep using.
          </p>
          <Link className="text-link" href="/process/">
            Explore the process <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section className={styles.expertise}>
        <p className="eyebrow">Connected disciplines</p>
        <h2 className="section-title">{services.length} ways to contribute.</h2>
        <div className={styles.expertiseLinks}>
          {services.map(({ id, label }) => (
            <Link href={`/services/#${id}`} key={id}>
              {label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <CredibilityPanel />
      <ContactCallout />
    </SiteShell>
  );
}
