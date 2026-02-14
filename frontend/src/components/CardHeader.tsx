/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';

import { CARD_HEADER } from '@/contents/common';
import { useNightlyWallet } from '@/providers/appProvider';
import { DPP_DEMONSTRATOR_GITHUB_URL } from '@/utils/constants';

import GithubIcon from './icons/GithubIcon';

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

  // Do not render the header if showing from inside NightlyWallet.
  if (inNightlyWallet) {
    console.warn('Rendering from inside NightlyWallet');
    return;
  }

  const getButtonStyle = () => {
    if (variation === 'primary') {
      return BUTTON_PRIMARY_STYLE;
    }
    return BUTTON_OUTLINE_STYLE;
  };

  return (
    <div
      className={
        'flex-shrink-0 border-b border-gray-200 bg-slate-100 px-6 py-3 align-baseline text-xs text-gray-500'
      }
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
        <div className='flex items-center gap-2'>
          {showLink && (
            <Link
              href={linkUrl}
              prefetch={true}
              className={`hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center rounded-full rounded-md px-3 text-center text-[10px] transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50 ${getButtonStyle()}`}
            >
              {linkText}
            </Link>
          )}
          <Link
            href={DPP_DEMONSTRATOR_GITHUB_URL}
            target='_blank'
            prefetch={false}
            className={`hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center rounded-full rounded-md px-3 text-center text-[10px] transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50 ${BUTTON_OUTLINE_STYLE}`}
          >
            <span className='flex justify-between gap-1 align-baseline'>
              <span className='mt-[-0.5px] max-sm:mr-[-0.1em] min-sm:absolute'>
                <GithubIcon />
              </span>
              <span className='ml-5 max-sm:hidden'>{CARD_HEADER.content.repositoryLink}</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
