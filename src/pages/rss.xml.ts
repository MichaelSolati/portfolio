import rss from '@astrojs/rss';
import type {APIContext} from 'astro';
import {getCollection} from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import {environment} from '../environment';

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 24);

  return rss({
    title: environment.name,
    description: environment.description,
    site: context.site as URL,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: posts.map(post => ({
      ...post.data,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
      link: `/blog/${post.slug}/`,
      customData: post.data.hero
        ? `
        <media:content url="${post.data.hero}" medium="image" />
      `
        : '',
    })),
  });
}
