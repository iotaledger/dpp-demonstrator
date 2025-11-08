'use client';

import React from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import { useNightlyWallet } from '@/providers/appProvider';
import { CARD_HEADER } from '@/contents/common';

interface CardHeaderProps {
  title?: string;
  showLink?: boolean;
  linkText?: string;
  linkUrl?: string;
  backText?: string;
  backUrl?: string;
  /**
   * Execute a side effect when `onBack` is triggered. This is a good opportunity to clean state.
   */
  onBack?: React.MouseEventHandler;
  canGoBack?: boolean;
  variation?: 'outline' | 'primary';
}

const BUTTON_PRIMARY_STYLE =
  '!leading-[12px] !h-auto !px-3 !py-1 !rounded-full border hover:bg-blue-50 transition-colors bg-blue-200 text-blue-800 border-blue-300 focus-visible:ring-ring';
const BUTTON_OUTLINE_STYLE =
  '!leading-[12px] !h-auto !px-3 !py-1 !rounded-full border hover:bg-gray-200 transition-colors bg-gray-100 text-gray-600 border-gray-300';

const CardHeader: React.FC<CardHeaderProps> = ({
  title = CARD_HEADER.content.titleDefault,
  showLink = true,
  linkText = CARD_HEADER.content.linkTextDefault,
  linkUrl = '/introduction/1',
  backText = CARD_HEADER.content.backTextDefault,
  backUrl = '/introduction/1',
  canGoBack = false,
  variation = 'outline',
  onBack,
}) => {
  const { inNightlyWallet } = useNightlyWallet();

  const getButtonStyle = () => {
    if (variation === 'primary') {
      return BUTTON_PRIMARY_STYLE;
    }
    return BUTTON_OUTLINE_STYLE;
  };

  return (
    <div
      className={clsx([
        'flex-shrink-0 border-b border-gray-200 bg-slate-100 px-6 py-3 text-xs text-gray-500',
        inNightlyWallet && 'hidden',
      ])}
    >
      <div className='flex w-full items-center justify-between gap-2 leading-1'>
        {!canGoBack && <h4>{title}</h4>}
        {canGoBack && (
          <Link
            href={backUrl}
            onClick={onBack}
            prefetch={true}
            className={`hover:bg-accent hover:text-accent-foreground inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full rounded-md px-3 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50 ${BUTTON_OUTLINE_STYLE}`}
          >
            {backText}
          </Link>
        )}
        {showLink && (
          <Link
            href={linkUrl}
            prefetch={true}
            className={`hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center rounded-full rounded-md px-3 text-center text-[10px] transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50 ${getButtonStyle()}`}
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
