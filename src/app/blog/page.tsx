import {RetroCard} from '@/components/ui/retro-card';
import {TagFilter} from '@/components/ui/tag-filter';
import {siteConfig} from '@/config/site';
import {getSortedPostsData, getTagsWithPosts} from '@/lib/blog';
import {generatePageMetadata} from '@/lib/metadata';

export const metadata = await generatePageMetadata({pathname: '/blog'});

export default function BlogPage() {
  const allPostsData = getSortedPostsData();
  const allTags = getTagsWithPosts();

  return (
    <div className="container pt-24 pb-32">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          From the Keyboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          {siteConfig.nav['/blog'].description}
        </p>
        <TagFilter tags={allTags} />
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
