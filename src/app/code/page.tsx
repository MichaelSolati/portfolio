import {GitFork, Star} from 'lucide-react';

import {RetroCard} from '@/components/ui/retro-card';
import {siteConfig} from '@/config/site';
import {getGitHubRepos, type GitHubRepo} from '@/lib/github';
import {generatePageMetadata} from '@/lib/metadata';

export const metadata = await generatePageMetadata({pathname: '/code'});

export default async function CodePage() {
  const repos = await getGitHubRepos();

  return (
    <div className="container pt-24 pb-32">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          My Code
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {siteConfig.nav['/code'].description}
        </p>
      </header>

      {repos.length > 0 ? (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo: GitHubRepo) => (
            <RetroCard
              key={repo.id}
              href={repo.html_url}
              title={repo.name}
              description={repo.description || 'No description available.'}
              footer={
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks_count.toLocaleString()}</span>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Could not fetch code from GitHub.
          </p>
        </div>
      )}
    </div>
  );
}
