const CacheAsset = require('@11ty/eleventy-cache-assets');
const about = require('./about.json');

module.exports = async () => {
  const code = [];

  if (about.github) {
    let repos = await CacheAsset(
      `https://api.github.com/users/${about.github}/repos?sort=count&per_page=200`,
      {
        duration: '6h',
        type: 'json',
      }
    ).catch(() => {
      throw new Error(
        `Error fetching JSON for GitHub Repos for user: ${about.github}`
      );
    });

    repos = repos
      .filter(r => !r.archived)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 24);

    for (const repo of repos) {
      code.push({
        title: repo.name,
        description: repo.description,
        url: repo.html_url,
        date: repo.updated_at,
      });
    }
  }

  return code;
};
