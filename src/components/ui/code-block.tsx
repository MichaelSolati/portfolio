'use client';

import hljs from 'highlight.js';
import parse, {Element, HTMLReactParserOptions} from 'html-react-parser';
import React, {useEffect, useRef, useState} from 'react';

function CodeBlockTemplate({
  codeHtml,
  language,
}: {
  codeHtml: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [codeHtml, language]);

  const handleCopy = async () => {
    const temp = document.createElement('div');
    temp.innerHTML = codeHtml;
    const text = temp.textContent || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <button
        className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-80 hover:opacity-100 transition"
        onClick={handleCopy}
        type="button"
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre>
        <code
          ref={codeRef}
          className={language ? `language-${language}` : ''}
          dangerouslySetInnerHTML={{__html: codeHtml}}
        />
      </pre>
    </div>
  );
}

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (
      domNode instanceof Element &&
      domNode.name === 'pre' &&
      domNode.children.length === 1 &&
      domNode.children[0] instanceof Element &&
      domNode.children[0].name === 'code'
    ) {
      const codeElement = domNode.children[0];
      // Get the raw HTML inside the <code> block
      let codeHtml = '';
      if (codeElement.children && codeElement.children.length > 0) {
        codeHtml = codeElement.children
          .map(child => {
            if (typeof child === 'string') return child;
            if (typeof child === 'object' && child && 'data' in child)
              return (child as unknown as {data: string}).data;
            if (
              typeof child === 'object' &&
              child &&
              'name' in child &&
              child.name
            ) {
              // If the child is an element, re-serialize it (only on client side)
              if (typeof window !== 'undefined') {
                const temp = document.createElement(child.name);
                if (child.attribs) {
                  Object.entries(child.attribs).forEach(([k, v]) =>
                    temp.setAttribute(k, v),
                  );
                }
                temp.innerHTML =
                  child.children
                    ?.map(c =>
                      typeof c === 'string'
                        ? c
                        : c && 'data' in c
                          ? c.data
                          : '',
                    )
                    .join('') || '';
                return temp.outerHTML;
              }
              // Fallback for server-side rendering
              return (
                child.children
                  ?.map(c =>
                    typeof c === 'string'
                      ? c
                      : c && 'data' in c
                        ? (c as unknown as {data: string}).data
                        : '',
                  )
                  .join('') || ''
              );
            }
            return '';
          })
          .join('');
      }
      const language =
        codeElement.attribs.className?.replace('language-', '') || undefined;
      return <CodeBlockTemplate codeHtml={codeHtml} language={language} />;
    }
  },
};

export default function CodeBlock({html}: {html: string}) {
  return (
    <div className="prose prose-lg dark:prose-invert mx-auto max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:underline">
      {parse(html, options)}
    </div>
  );
}
