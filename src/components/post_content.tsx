import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import type { Post } from "@/payload-types";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc?.value;
      return typeof doc === "object" &&
        doc &&
        "slug" in doc &&
        typeof doc.slug === "string"
        ? `/notes/${doc.slug}/`
        : "/notes/";
    },
  }),
});

export function PostContent({ content }: { content: Post["content"] }) {
  return <RichText data={content} converters={converters} />;
}
