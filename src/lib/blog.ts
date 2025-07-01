import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';

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

  const processedContent = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // GitHub Flavored Markdown support
    .use(remarkRehype, {allowDangerousHtml: true}) // Convert to rehype and allow HTML
    .use(rehypeRaw, {
      passThrough: [
        'figure',
        'img',
        'figcaption',
        'div',
        'br',
        'iframe',
        'blockquote',
        'script',
      ],
    }) // Parse HTML in markdown
    .use(rehypeHighlight) // Syntax highlighting
    .use(rehypeStringify) // Convert to string
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as {
      title: string;
      description: string;
      hero: string;
      canonical?: string;
    }),
    pubDate: new Date(matterResult.data.pubDate),
  };
}
