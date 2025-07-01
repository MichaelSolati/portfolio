import {RetroCard} from '@/components/ui/retro-card';
import {siteConfig} from '@/config/site';
import {getSortedPostsData} from '@/lib/blog';
import {generatePageMetadata} from '@/lib/metadata';

export const metadata = await generatePageMetadata({pathname: '/blog'});

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container pt-24 pb-32">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          From the Keyboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {siteConfig.nav['/blog'].description}
        </p>
      </header>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {allPostsData.map(({id, title, hero}) => (
          <RetroCard
            key={id}
            href={`/blog/${id}`}
            imageUrl={hero}
            imageAlt={title}
            title={title}
            imageHint="tech abstract"
          />
        ))}
      </div>
    </div>
  );
}
