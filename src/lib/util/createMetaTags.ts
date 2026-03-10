import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

// TODO JSDoc
interface Params {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
}

// TODO improve type safety

/**
 * Create meta tags.
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
          // TODO dynamic OG/static improve
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
