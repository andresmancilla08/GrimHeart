import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // ponytail: disabled in dev to avoid caching noise while developing.
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(withNextIntl(nextConfig));
