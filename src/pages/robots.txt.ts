import type { GetServerSideProps } from "next";
import { brand } from "@/config/brand";

// Served at /robots.txt so the sitemap URL follows NEXT_PUBLIC_APP_URL
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Disallow private/authenticated areas",
    "Disallow: /dashboard",
    "Disallow: /auctions/",
    "Disallow: /api/",
    "",
    `Sitemap: ${brand.siteUrl}/sitemap.xml`,
    "",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(body);
  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}
