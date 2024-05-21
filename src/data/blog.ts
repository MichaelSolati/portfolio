import {getCollection} from 'astro:content';
import type {Props as CardProps} from '../components/Card';

export default async function Blog(): Promise<CardProps[]> {
  return (await getCollection('blog'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map(p => ({
      button: 'Read',
      description: p.data.description,
      hero: p.data.hero,
      title: p.data.title,
      url: `/blog/${p.slug}`,
    }));
}
