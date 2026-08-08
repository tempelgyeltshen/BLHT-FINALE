import React, { Fragment } from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '../../../../core/providers/AppProvider';

// Match URLs while avoiding trailing punctuation (e.g. a URL followed by a period
// or closing parenthesis at the end of a sentence).
const URL_REGEX = /(https?:\/\/[^\s]+?)([.,;:!?)]*)(?:\s|$)/g;
const IS_URL = /^https?:\/\//;

/** Split a message into text and URL segments so URLs render as clickable links. */
const renderMessageWithLinks = (message: string): React.ReactNode => {
  const parts = message.split(URL_REGEX);
  return parts.map((part, index) => {
    if (IS_URL.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-amber-300 underline decoration-amber-500/70 underline-offset-2 hover:text-amber-200 hover:decoration-amber-300 font-semibold break-all"
          title={part}
        >
          {part}
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
};

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 max-w-sm">
      <div className="bg-amber-950 text-amber-100 px-5 py-3.5 rounded-xl shadow-2xl border border-amber-600/50 flex items-start gap-3">
        <span className="text-xs font-medium tracking-wide leading-relaxed">{renderMessageWithLinks(toast)}</span>
      </div>
    </div>
  );
};
