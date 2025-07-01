import type {Metadata} from 'next';

import {siteConfig} from '@/config/site';

import {generateOGImage} from './generate-og-image';

const twitterHandle = siteConfig.handles.twitter;

export async function generatePageMetadata(arg: {
  pathname: string;
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
}): Promise<Metadata> {
  const navItem = siteConfig.nav[arg.pathname as keyof typeof siteConfig.nav];
  const title = arg.title || navItem?.title || siteConfig.name;
  const description =
    arg.description || navItem?.description || siteConfig.description;

  let image = arg.image;
  if (!image) {
    image = await generateOGImage({title, pathname: arg.pathname});
  }

  // Ensure image URL is properly formatted
  const imageUrl = image.startsWith('http')
    ? image
    : new URL(image, siteConfig.url).toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: arg.pathname === '/' ? siteConfig.name : title,
      template: `%s | ${siteConfig.name}`,
    },
    description,

    openGraph: {
      title,
      description,
      url: new URL(arg.pathname, siteConfig.url),
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          alt: description,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: twitterHandle ? `@${twitterHandle}` : undefined,
    },

    alternates: {
      canonical: arg.canonical || arg.pathname,
      types: {
        'application/rss+xml': [
          {url: 'rss.xml', title: `${siteConfig.name}'s Blog RSS Feed`},
        ],
      },
    },

    icons: {
      icon: '/favicon.ico',
    },
  };
}

export async function generateBlogPostMetadata(
  postData: {
    title: string;
    description: string;
    hero: string;
    pubDate: Date;
    canonical?: string;
  },
  slug: string,
): Promise<Metadata> {
  const postUrl = new URL(`/blog/${slug}`, siteConfig.url).toString();

  const baseMetadata = await generatePageMetadata({
    pathname: `/blog/${slug}`,
    title: postData.title,
    description: postData.description,
    canonical: postData.canonical || postUrl,
    image: postData.hero,
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime:
        postData.pubDate instanceof Date
          ? postData.pubDate.toISOString()
          : new Date(postData.pubDate).toISOString(),
      authors: [siteConfig.name],
    },
  };
}
