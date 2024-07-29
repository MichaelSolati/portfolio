import {environment} from '../environment';

export type Props = {
  canonical?: string;
  description?: string;
  image?: string;
  site?: URL;
  title?: string;
  url: URL;
};

export default function SEOTags({
  canonical,
  description = environment.description,
  image = '/placeholder-social.png',
  site,
  title,
  url,
}: Props) {
  title = title ? `${title} | ${environment.name}` : environment.name;
  const canonicalURL = canonical || new URL(url.pathname, site).toString();
  const socialImage = new URL(image, url).toString();
  const socialURL = url.toString();
  const rssFeed = new URL('rss.xml', site).toString();
  const twitterHandle = environment.social.twitter
    ? `@${environment.social.twitter.replace(/^@/, '')}`
    : false;

  return (
    <>
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
      {twitterHandle ? (
        <meta property="twitter:creator" content={twitterHandle} />
      ) : null}
      {/* RSS Feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        href={rssFeed}
        title={`${environment.blog.title} | ${environment.name}`}
      />
    </>
  );
}
