"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface TypingAnimationProps {
  content: string;
  onComplete?: () => void;
  className?: string;
}

export function TypingAnimation({ content, onComplete, className }: TypingAnimationProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 25); // Slightly slower for better readability

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [content, currentIndex, onComplete]);

  return (
    <div className={className}>
      <div className="relative inline">
        <ReactMarkdown
          className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2"
          components={{
            p: (props) => <p className="mb-2 last:mb-0" {...props} />,
            ul: (props) => <ul className="list-disc pl-4 mb-2" {...props} />,
            ol: (props) => <ol className="list-decimal pl-4 mb-2" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            h1: (props) => <h1 className="text-lg font-bold mb-2" {...props} />,
            h2: (props) => <h2 className="text-base font-bold mb-2" {...props} />,
            h3: (props) => <h3 className="text-sm font-bold mb-1" {...props} />,
            strong: (props) => <strong className="font-bold" {...props} />,
            em: (props) => <em className="italic" {...props} />,
            code: (props) => <code {...props} />
          }}
        >
          {displayedContent}
        </ReactMarkdown>
        {currentIndex < content.length && (
          <span className="absolute -right-[1ch] top-0 text-gray-400"></span>
        )}
      </div>
    </div>
  );
}
