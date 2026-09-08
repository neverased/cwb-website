import { HomePage } from "@/components/home_page";
import { StructuredData } from "@/components/structured_data";
import {
  buildJsonLdGraph,
  buildMetadata,
  buildWebPageNode,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  PERSON_ID,
  personGraphNode,
  websiteGraphNode,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    "media-heavy products",
    "application audits",
    "technology consulting",
    "multimedia systems",
    "fractional technical leadership",
    "AI engineering",
  ],
});

const homePageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  buildWebPageNode({
    name: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
    about: [
      {
        "@id": PERSON_ID,
      },
      {
        "@type": "Thing",
        name: "Multimedia systems",
      },
      {
        "@type": "Thing",
        name: "Software engineering",
      },
      {
        "@type": "Thing",
        name: "Application architecture",
      },
      {
        "@type": "Thing",
        name: "Technical audits",
      },
      {
        "@type": "Thing",
        name: "Fractional technical leadership",
      },
      {
        "@type": "Thing",
        name: "AI and LLM engineering",
      },
    ],
    mainEntity: {
      "@id": PERSON_ID,
    },
  }),
]);

export default function HomePageRoute() {
  return (
    <>
      <StructuredData data={homePageJsonLd} />
      <HomePage />
    </>
  );
}
