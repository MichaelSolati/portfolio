import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as {
        title: string;
        description: string;
        hero: string;
        canonical?: string;
      }),
      pubDate: new Date(matterResult.data.pubDate),
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

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

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
  };
}
