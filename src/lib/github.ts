import {unstable_cache} from 'next/cache';

import {siteConfig} from '@/config/site';

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  homepage: string | null;
  updated_at: Date;
}

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const username = siteConfig.handles.github;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=200`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const repos = await response.json();

    return (repos as GitHubRepo[])
      .map(repo => ({
        id: repo.id,
        html_url: repo.html_url,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        homepage: repo.homepage,
        updated_at: new Date(repo.updated_at),
      }))
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          b.updated_at.getTime() - a.updated_at.getTime(),
      )
      .slice(0, 12);
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

export const getGitHubRepos = unstable_cache(
  fetchGitHubRepos,
  ['github-repos'],
  {
    revalidate: 86400, // 24 hours
    tags: ['github-repos'],
  },
);
