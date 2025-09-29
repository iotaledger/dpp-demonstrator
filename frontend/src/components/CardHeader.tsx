'use client';

import Link from 'next/link';
import React from 'react';

interface CardHeaderProps {
  title?: string;
  showLink?: boolean;
  linkText?: string;
  linkUrl?: string;
  backText?: string;
  backUrl?: string;
  canGoBack?: boolean;
  variation?: 'outline' | 'primary';
}

const BUTTON_PRIMARY_STYLE = "!leading-[12px] !h-auto !px-3 !py-1 !rounded-full border hover:bg-blue-50 transition-colors bg-blue-200 text-blue-800 border-blue-300 focus-visible:ring-ring";
const BUTTON_OUTLINE_STYLE = "!leading-[12px] !h-auto !px-3 !py-1 !rounded-full border hover:bg-gray-200 transition-colors bg-gray-100 text-gray-600 border-gray-300";

const CardHeader: React.FC<CardHeaderProps> = ({
  title = "Welcome",
  showLink = true,
  linkText = "Button",
  linkUrl = '/introduction/1',
  backText = 'Back to the Start',
  backUrl = '/introduction/1',
  canGoBack = false,
  variation = 'outline',
}) => {

  const getButtonStyle = () => {
    if (variation === 'primary') {
      return BUTTON_PRIMARY_STYLE;
    }
    return BUTTON_OUTLINE_STYLE;
  };

  return (
    <div className="flex-shrink-0 bg-slate-100 px-6 py-3 border-b border-gray-200 text-xs text-gray-500">
      <div className="flex items-center justify-between gap-2 w-full leading-1">
        {!canGoBack && (
          <h4>{title}</h4>
        )}
        {canGoBack && (
          <Link
            href={backUrl}
            prefetch={true}
            className={`inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 ${BUTTON_OUTLINE_STYLE}`}
          >
            {backText}
          </Link>
        )}
        {showLink && (
          <Link
            href={linkUrl}
            prefetch={true}
            className={`inline-flex text-center items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-[10px] ${getButtonStyle()}`}
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
