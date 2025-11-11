import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CodeBlock from '@/components/ui/code-block';

/**
 * Renders the markdown content of a blog post.
 */
export default function BlogContent({content}: {content: string}) {
  return (
    <div className="prose prose-lg dark:prose-invert mx-auto max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({...props}) => {
            const child = React.Children.toArray(props.children)[0];
            if (React.isValidElement(child) && child.type === 'code') {
              const {className, children: code} = child.props;
              const match = /language-(\w+)/.exec(className || '');
              return (
                <CodeBlock
                  language={match ? match[1] : undefined}
                  code={String(code).replace(/\n$/, '')}
                />
              );
            }
            return <pre {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
