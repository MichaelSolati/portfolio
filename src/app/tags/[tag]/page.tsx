import {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {RetroCard} from '@/components/ui/retro-card';
import {TagFilter} from '@/components/ui/tag-filter';
import {
  getAllTags,
  getPostsByTag,
  getTagData,
  getTagsWithPosts,
  Tag,
} from '@/lib/blog';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags
    .filter(tag => getPostsByTag(tag).length > 0)
    .map(tag => ({
      tag: tag,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{tag: string}>;
}): Promise<Metadata> {
  const {tag} = await params;
  const description = getTagData(tag as Tag);

  return {
    title: `Posts tagged with #${tag}`,
    description: description || `Blog posts tagged with ${tag}`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{tag: string}>;
}) {
  const {tag} = await params;
  const posts = getPostsByTag(tag as Tag);
  const allTags = getTagsWithPosts();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container pt-24 pb-32">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          #{tag}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          {getTagData(tag as Tag)}
        </p>
        <TagFilter tags={allTags} currentTag={tag} />
      </header>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(({id, title, hero}) => (
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
