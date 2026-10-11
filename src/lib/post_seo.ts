import type { Post } from "@/payload-types";

import { absoluteUrl, openGraphImagePath } from "./seo";

export const getPostSocialImage = (
  post: Pick<Post, "title" | "slug" | "coverImage">,
) => {
  const cover = typeof post.coverImage === "object" ? post.coverImage : null;

  if (cover?.url) {
    return {
      url: absoluteUrl(cover.url),
      alt: cover.alt || post.title,
      ...(cover.width ? { width: cover.width } : {}),
      ...(cover.height ? { height: cover.height } : {}),
    };
  }

  return {
    url: absoluteUrl(openGraphImagePath(`/notes/${post.slug}/`)),
    alt: post.title,
    width: 1200,
    height: 630,
  };
};

export const getPostImageSchema = (
  post: Pick<Post, "title" | "slug" | "coverImage">,
) => {
  const { url, alt, width, height } = getPostSocialImage(post);

  return {
    "@type": "ImageObject",
    url,
    caption: alt,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
};
