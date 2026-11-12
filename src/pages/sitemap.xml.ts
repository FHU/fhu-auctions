import type { GetServerSideProps } from "next";
import { brand } from "@/config/brand";

// Served at /sitemap.xml so URLs follow NEXT_PUBLIC_APP_URL
const PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/login", changefreq: "monthly", priority: "0.8" },
  { path: "/register", changefreq: "monthly", priority: "0.8" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = PAGES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${brand.siteUrl}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(body);
  return { props: {} };
};

export default function SitemapXml() {
  return null;
}
