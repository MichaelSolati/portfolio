import fetch from 'node-fetch';

import { writeDataTs } from './utils'

export const generateGitHub = async (accounts) => {
  if (accounts.github) {
    console.log('Fetching GitHub repos.');
    await fetch(`https://api.github.com/users/${accounts.github}/repos?sort=count&per_page=200`)
      .then(res => res.json())
      .then(repos => {
        if (Array.isArray(repos)) {
          repos = repos
            .filter(r => !r.archived)
            .sort((a, b) => (
              b.stargazers_count - a.stargazers_count ||
              (new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            ))
            .slice(0, 24)
            .map((repo) => ({
              title: repo.name,
              description: repo.description,
              url: repo.html_url,
              date: repo.updated_at,
            }));

          writeDataTs('github', repos);
          console.log('Saved GitHub repos.');
        }
      })
      .catch(() => console.log('Could not save GitHub repos.'));
  } else {
    writeDataTs('github', []);
  }
}
