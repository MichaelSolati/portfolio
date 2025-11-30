import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import tagsData from '@/app/blog/tags.json';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export type Tag = keyof typeof tagsData;

export interface PostData {
  id: string;
  title: string;
  description: string;
  hero: string;
  canonical?: string;
  pubDate: Date;
  tags: Tag[];
  content?: string;
}

export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const tags = ((matterResult.data.tags as string) || '')
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => Object.keys(tagsData).includes(tag)) as Tag[];

    return {
      id,
      ...(matterResult.data as {
        title: string;
        description: string;
        hero: string;
        canonical?: string;
      }),
      pubDate: new Date(matterResult.data.pubDate),
      tags,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.pubDate < b.pubDate) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const tags = ((matterResult.data.tags as string) || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => Object.keys(tagsData).includes(tag)) as Tag[];

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as {
      title: string;
      description: string;
      hero: string;
      canonical?: string;
    }),
    pubDate: new Date(matterResult.data.pubDate),
    tags,
  };
}

export function getPostsByTag(tag: Tag): PostData[] {
  const allPosts = getSortedPostsData();
  return allPosts.filter(post => post.tags.includes(tag));
}

export function getAllTags(): Tag[] {
  return Object.keys(tagsData) as Tag[];
}

export function getTagsWithPosts(): Tag[] {
  const allTags = getAllTags();
  return allTags
    .filter(tag => getPostsByTag(tag).length > 0)
    .sort((a, b) => a.localeCompare(b));
}

export function getTagData(tag: Tag): string | null {
  return tagsData[tag];
}
