import hljs from 'highlight.js';
import React from 'react';

import CopyButton from './copy-button';

/**
 * A component to render a syntax-highlighted code block.
 */
export default function CodeBlock({
  language,
  code,
}: {
  language: string | undefined;
  code: string;
}) {
  const highlightedCode = language
    ? hljs.highlight(code, {language}).value
    : hljs.highlightAuto(code).value;

  return (
    <div className="relative group">
      <CopyButton code={code} />
      <pre>
        <code
          className={`hljs ${language ? `language-${language}` : ''}`}
          dangerouslySetInnerHTML={{__html: highlightedCode}}
        />
      </pre>
    </div>
  );
}
