'use client';

import {useState} from 'react';

export default function CopyButton({code}: {code: string}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-80 hover:opacity-100 transition"
      onClick={handleCopy}
      type="button"
      aria-label="Copy code"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
