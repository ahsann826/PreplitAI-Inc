import { Helmet } from "react-helmet-async";

export type SEOHeadProps = {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  image?: string;
  url?: string;
  robots?: string; // e.g., "index,follow" or "noindex,nofollow"
  canonical?: string;
  schemaMarkup?: Record<string, any> | Record<string, any>[];
  twitterCard?: "summary" | "summary_large_image";
};

const SITE_NAME = "PreplitAI";
const DEFAULT_URL = (typeof window !== "undefined" && window?.location?.origin) || (import.meta as any)?.env?.VITE_SITE_URL || "https://yourdomain.com";
const DEFAULT_IMAGE = `${DEFAULT_URL}/og-image.png`;

export function SEOHead({
  title = "AI-Powered Video Lecture Generator",
  description = "Turn notes into engaging AI video lectures with realistic avatars, TTS, and automatic slides.",
  keywords = [
    "AI video lecture generator",
    "notes to video converter",
    "automated lecture creator",
    "text to video lecture",
    "AI educational content creator"
  ],
  image = DEFAULT_IMAGE,
  url,
  robots = "index,follow",
  canonical,
  schemaMarkup,
  twitterCard = "summary_large_image",
}: SEOHeadProps) {
  const resolvedUrl = url || (typeof window !== "undefined" ? window.location.href : DEFAULT_URL);
  const titleTag = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const descriptionTag = description.length > 160 ? `${description.slice(0, 157)}...` : description;
  const keywordsStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;
  const schemas = Array.isArray(schemaMarkup) ? schemaMarkup : schemaMarkup ? [schemaMarkup] : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{titleTag} | {SITE_NAME}</title>
      <meta name="description" content={descriptionTag} />
      {keywordsStr && <meta name="keywords" content={keywordsStr} />}
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={`${titleTag} | ${SITE_NAME}`} />
      <meta property="og:description" content={descriptionTag} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={`${titleTag} | ${SITE_NAME}`} />
      <meta name="twitter:description" content={descriptionTag} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}