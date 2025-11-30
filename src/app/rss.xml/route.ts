import fs from 'fs';
import {marked} from 'marked';
import mime from 'mime-types';
import {NextResponse} from 'next/server';
import path from 'path';

import {siteConfig} from '@/config/site';
import {getPostData, getSortedPostsData} from '@/lib/blog';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getSortedPostsData();

  const rssItems = (
    await Promise.all(
      posts.map(async (post, index) => {
        const isRecent = index < 8;
        let contentHtml = '';

        if (isRecent) {
          const postData = await getPostData(post.id);
          const rawHtml = await marked(postData.content || '');
          contentHtml = rawHtml.replace(/&(?![a-zA-Z0-9#]+;)/g, '&amp;');
        }

        const postUrl = new URL(`/blog/${post.id}`, siteConfig.url).toString();
        const imageUrl = post.hero.startsWith('http')
          ? post.hero
          : new URL(post.hero, siteConfig.url).toString();

        let imageLength = 0;
        let imageType = 'image/webp';
        if (!post.hero.startsWith('http')) {
          try {
            const filePath = path.join(process.cwd(), 'public', post.hero);
            const stats = fs.statSync(filePath);
            imageLength = stats.size;

            const lookup = mime.lookup(filePath);
            if (lookup) {
              imageType = lookup;
            }
          } catch {
            // Ignore missing files
          }
        }

        return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${postUrl}</link>
        <guid>${postUrl}</guid>
        <pubDate>${post.pubDate.toUTCString()}</pubDate>
        ${post.description ? `<description><![CDATA[${post.description}]]></description>` : ''}
        <enclosure url="${imageUrl}" type="${imageType}" length="${imageLength}" />
        ${isRecent ? `<atom:content type="html"><![CDATA[${contentHtml}]]></atom:content>` : ''}
        <atom:link href="${postUrl}" rel="alternate" type="text/html" />
        <atom:author>
          <atom:name>${siteConfig.name}</atom:name>
        </atom:author>
      </item>
    `;
      }),
    )
  ).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
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

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
