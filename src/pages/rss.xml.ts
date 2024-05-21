import rss from '@astrojs/rss';
import type {APIContext} from 'astro';
import {getCollection} from 'astro:content';
import {environment} from '../environment';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: environment.name,
    description: environment.description,
    site: context.site as URL,
    items: posts.map(post => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}
