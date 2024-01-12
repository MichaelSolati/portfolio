import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export type Props = {
  canonical?: string;
  description: string;
  image?: string;
  site: URL | undefined;
  title: string;
  url: URL;
};

export default function BaseHead({
  canonical,
  description = SITE_DESCRIPTION,
  image = "/placeholder-social.jpg",
  site,
  title = SITE_TITLE,
  url,
}: Props) {
  const canonicalURL = canonical || new URL(url.pathname, site).toString();
  const socialImage = new URL(image, url).toString();
  const socialURL = url.toString();

  return (
    <>
      {/* Global Metadata */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalURL} />
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={socialURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={socialImage} />
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={socialURL} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={socialImage} />
    </>
  );
}
