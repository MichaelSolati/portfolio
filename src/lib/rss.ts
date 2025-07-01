import {siteConfig} from '@/config/site';

import {getSortedPostsData} from './blog';

export function generateRssFeed(): string {
  const posts = getSortedPostsData();

  const rssItems = posts
    .map(post => {
      const postUrl = new URL(`/blog/${post.id}`, siteConfig.url).toString();
      const imageUrl = post.hero.startsWith('http')
        ? post.hero
        : new URL(post.hero, siteConfig.url).toString();

      return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${postUrl}</link>
        <guid>${postUrl}</guid>
        <pubDate>${post.pubDate.toUTCString()}</pubDate>
        <description><![CDATA[${post.description}]]></description>
        <enclosure url="${imageUrl}" type="image/webp" />
        <author>${siteConfig.name}</author>
      </item>
    `;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}'s Blog</title>
    <link>${siteConfig.url}/blog</link>
    <description>${siteConfig.nav['/blog'].description}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;
}
