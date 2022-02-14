const CacheAsset = require('@11ty/eleventy-cache-assets');

const about = require('./about.json');
const webp = require('../../tools/webp');

module.exports = async () => {
  const articles = [];

  if (about.devto) {
    let posts = await CacheAsset(
      `https://dev.to/api/articles?username=${about.devto}`,
      {
        duration: '6h',
        type: 'json',
      }
    ).catch(() => {
      throw new Error(
        `Error fetching JSON for dev.to Articles for user: ${about.devto}`
      );
    });

    posts = posts
      .filter(() => posts.type_of !== 'article')
      .sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      )
      .slice(0, 24);

    for (const post of posts) {
      const src = post.cover_image || post.social_image;
      const srcData = await webp(src, 'devto');
      articles.push({
        title: post.title,
        description: post.description,
        url: post.url,
        date: post.published_at,
        ...srcData,
      });
    }
  }

  return articles;
};
