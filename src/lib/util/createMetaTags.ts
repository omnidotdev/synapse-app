import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

/**
 * Optional overrides for meta tag generation. Any field left unset falls back to
 * the app defaults (`app.name`, `app.description`, `app.url`) or the default
 * Open Graph image at `${baseUrl}/og.png`.
 */
interface Params {
  /** Page title, rendered as `${title} | ${app.name}` */
  title?: string;
  /** Page description for meta, Twitter, and Open Graph */
  description?: string;
  /** Absolute URL to a 1200x630 social image */
  image?: string;
  /** Comma-separated keywords */
  keywords?: string;
  /** Canonical page URL */
  url?: string;
}

/**
 * Build the meta tag array for a route head.
 */
const createMetaTags = ({
  title: _title,
  description: _description,
  url: _url,
  image,
  keywords,
}: Params = {}) => {
  const baseUrl = BASE_URL || app.url;

  const DEFAULT_KEYWORDS =
    "AI router, LLM gateway, inference routing, MCP, STT, TTS, API management, multi-provider, Synapse, Omni";

  const title = _title ? `${_title} | ${app.name}` : app.name,
    description = _description ?? app.description,
    url = _url ?? baseUrl,
    resolvedKeywords = keywords ?? DEFAULT_KEYWORDS;

  const tags = [
    { title },
    {
      name: "description",
      content: description,
    },
    { name: "keywords", content: resolvedKeywords },
    { name: "twitter:title", content: title },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:creator", content: "@omnidotdev" },
    { name: "twitter:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    {
      property: "og:description",
      content: description,
    },
    { property: "og:url", content: url },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]
      : [
          // default social image, served statically from public/og.png
          { name: "twitter:image", content: `${baseUrl}/og.png` },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: `${baseUrl}/og.png` },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]),
  ];

  return tags;
};

export default createMetaTags;
