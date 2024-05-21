import EleventyFetch from '@11ty/eleventy-fetch';

import {environment} from '../environment';
import type {Props as CardProps} from '../components/Card';

export default async function Code(): Promise<CardProps[]> {
  const elements: CardProps[] = [];

  if (environment.code) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let repos: any[] = await EleventyFetch(
      `https://api.github.com/users/${environment.code.githubID}/repos?sort=count&per_page=200`,
      {
        duration: '6h',
        type: 'json',
      }
    ).catch(() => {
      throw new Error(
        `Error fetching JSON for GitHub Repos for user: ${environment.code.githubID}`
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
      elements.push({
        description: repo.description,
        title: repo.name,
        url: repo.html_url,
      });
    }
  }

  return elements;
}
