import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: true,
};

const payloadConfig = withPayload(nextConfig);
const payloadHeaders = payloadConfig.headers;

export default {
  ...payloadConfig,
  async headers() {
    const rules = await payloadHeaders();
    return rules.flatMap((rule) => {
      if (rule.source !== "/:path*") return [rule];
      // Payload's automatic admin theme uses Critical-CH, which can make a
      // browser retry its first request. The public site has a fixed dark theme.
      const isThemeHeader = ({ key, value }) =>
        ["accept-ch", "critical-ch", "vary"].includes(key.toLowerCase()) &&
        value === "Sec-CH-Prefers-Color-Scheme";
      const themeHeaders = rule.headers.filter(isThemeHeader);
      if (!themeHeaders.length) return [rule];
      return [
        {
          ...rule,
          headers: rule.headers.filter((header) => !isThemeHeader(header)),
        },
        { source: "/admin/:path*", headers: themeHeaders },
      ].filter(({ headers }) => headers.length);
    });
  },
};
