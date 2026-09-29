/**
 * Static export for GitHub Pages. Pages serves a project site from
 * https://<user>.github.io/<repo>/, so the deploy workflow sets BASE_PATH to
 * "/<repo>". Locally BASE_PATH is unset and the site serves from the root.
 */
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  // Emit folder/index.html so Pages resolves /<repo>/ without a rewrite rule.
  trailingSlash: true,
  // Plain <a href> links (the résumé, the replay link) are not rewritten by
  // Next, so they read the base path from here.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
