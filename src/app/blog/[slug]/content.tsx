'use client';
import CodeBlock from '@/components/ui/code-block';

export default function BlogContent({html}: {html: string}) {
  return <CodeBlock html={html} />;
}
