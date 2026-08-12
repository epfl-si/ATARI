import type { NextConfig } from "next";
import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
};

export default withNextIntl(nextConfig);
