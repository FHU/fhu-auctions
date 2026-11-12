import Head from "next/head";
import { brand } from "@/config/brand";

// Site-wide SEO constants (values come from src/config/brand.ts)
export const SITE_URL = brand.siteUrl;
export const SITE_NAME = brand.appName;
export const SITE_AUTHOR = brand.orgName;
export const SITE_AUTHOR_URL = brand.orgUrl;

export const SITE_KEYWORDS = [
  "FHU",
  "Freed-Hardeman University",
  "FHU auctions",
  "charity auction",
  "silent auction",
  "online auction",
  "fundraiser",
  "Henderson TN",
].join(", ");

export const SITE_DESCRIPTION = brand.description;
export const SITE_DESCRIPTION_SHORT = brand.description;

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  noindex?: boolean;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  ogImageAlt?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: object;
}

export function SEO({
  title,
  description = SITE_DESCRIPTION_SHORT,
  keywords = SITE_KEYWORDS,
  canonical,
  noindex = false,
  ogType = "website",
  ogImage = `${SITE_URL}/pictures/og-image.png`,
  ogImageAlt = SITE_NAME,
  article,
  structuredData,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | ${brand.orgName}`;

  const canonicalUrl = canonical || SITE_URL;

  const organization = {
    "@type": "CollegeOrUniversity",
    name: brand.orgName,
    url: brand.orgUrl,
    address: brand.postalAddress,
  };

  // Default structured data: this website, published by the university
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION_SHORT,
    publisher: organization,
  };

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    ...organization,
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_AUTHOR} />
      <meta name="creator" content={SITE_AUTHOR} />
      <meta name="publisher" content={SITE_AUTHOR} />

      {/* Robots */}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta
        name="googlebot"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <meta
        name="bingbot"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Language & Locale */}
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-US" />

      {/* Revisit & Cache */}
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific OG tags */}
      {article && (
        <>
          {article.publishedTime && (
            <meta
              property="article:published_time"
              content={article.publishedTime}
            />
          )}
          {article.modifiedTime && (
            <meta
              property="article:modified_time"
              content={article.modifiedTime}
            />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Apple & Mobile */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />

      {/* Theme Color */}
      <meta name="theme-color" content="#702e3e" />
      <meta name="msapplication-TileColor" content="#702e3e" />
      <meta name="msapplication-navbutton-color" content="#702e3e" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
    </Head>
  );
}

// Page-specific SEO presets
export const pageSEO = {
  home: {
    title: undefined, // Uses default full title
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
  },
  login: {
    title: "Sign In",
    description:
      "Sign in to FHU Auctions to place bids and manage Freed-Hardeman University charity auctions.",
    keywords:
      "auction login, sign in auction platform, charity auction access, fundraiser login, auction account",
    noindex: true,
  },
  register: {
    title: "Create Free Account",
    description:
      "Create an FHU Auctions account to bid in Freed-Hardeman University charity auctions.",
    keywords:
      "create auction account, free auction signup, charity auction registration, fundraiser account, auction platform signup",
    noindex: true,
  },
  dashboard: {
    title: "Dashboard",
    description:
      "Manage your auctions, view active bids, and track your fundraising progress. Your central hub for all auction activities.",
    noindex: true,
  },
  createAuction: {
    title: "Create New Auction",
    description:
      "Create a new auction for your charity, fundraiser, or organization. Set up private or public auctions with custom settings.",
    noindex: true,
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "FHU Auctions Privacy Policy - how we collect, use, and protect your information.",
    keywords:
      "auction privacy policy, data protection, auction platform privacy",
    noindex: true,
  },
  terms: {
    title: "Terms of Service",
    description:
      "FHU Auctions Terms of Service - the terms for using Freed-Hardeman University's charity auction site.",
    keywords:
      "auction terms of service, auction platform terms, usage agreement",
    noindex: true,
  },
};

export default SEO;
