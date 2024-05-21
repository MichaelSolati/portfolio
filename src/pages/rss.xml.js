import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { environment } from '../environment';

export async function GET(context) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
	return rss({
		title: environment.name,
		description: environment.description,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}
