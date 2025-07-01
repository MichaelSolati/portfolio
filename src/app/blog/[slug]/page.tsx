import {format} from 'date-fns';
import {Calendar, Link as LinkIcon} from 'lucide-react';
import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {getPostData, getSortedPostsData} from '@/lib/blog';
import {generateBlogPostMetadata} from '@/lib/metadata';

import BlogContent from './content';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map(post => ({
    slug: post.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>;
}): Promise<Metadata> {
  const {slug} = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    return {};
  }

  return generateBlogPostMetadata(postData, slug);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const postData = await getPostData(slug);

  return (
    <article className="container max-w-4xl pt-24 pb-32">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {postData.title}
        </h1>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={new Date(postData.pubDate).toISOString()}>
              {format(new Date(postData.pubDate), 'MMMM d, yyyy')}
            </time>
          </div>
          {postData.canonical && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              <Link
                href={postData.canonical}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Original Post
              </Link>
            </div>
          )}
        </div>
      </header>

      <Image
        src={postData.hero}
        alt={postData.title}
        width={1200}
        height={600}
        className="rounded-lg mb-8 aspect-video object-cover"
        priority
        data-ai-hint="tech abstract"
      />

      <BlogContent html={postData.contentHtml} />
    </article>
  );
}
