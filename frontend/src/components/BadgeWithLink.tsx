'use client';

import React from 'react';

import { useCheckLinkage } from '@/hooks/useCheckLinkage';

interface BadgeWithLinkProps {
  badgeText?: string | null;
  linkText?: string;
  linkHref?: string;
  linkTarget?: '_blank' | '_self';
  showVerification?: boolean;
  verificationIcon?: 'check' | 'none';
  verificationDid?: string;
  spacing?: string;
  opacity?: number;
  delay?: number;
}

const BadgeWithLink: React.FC<BadgeWithLinkProps> = ({
  badgeText,
  linkText,
  linkHref = '#',
  linkTarget = '_blank',
  showVerification = false,
  verificationDid = null,
  spacing = 'gap-2',
  opacity = 100,
  delay = 0,
}) => {
  return (
    <div
      className={`flex cursor-pointer flex-wrap items-center font-mono text-blue-600 ${spacing}`}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`,
      }}
    >
      {badgeText && (
        <div className='focus:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none'>
          <span className='value-content'>{badgeText}</span>
        </div>
      )}

      {showVerification && (
        <VerificationIcon showVerification={showVerification} verificationDid={verificationDid} />
      )}

      {linkText && (
        <span className='value-content cursor-pointer font-mono text-xs wrap-anywhere text-blue-600 sm:text-sm'>
          <a target={linkTarget} href={linkHref} className='transition-colors hover:text-blue-700'>
            {linkText}
          </a>
        </span>
      )}
    </div>
  );
};

interface VerificationIconProps {
  showVerification?: boolean;
  verificationDid?: string | null;
}

const VerificationIcon: React.FC<VerificationIconProps> = ({
  showVerification,
  verificationDid,
}) => {
  const { checkStatus, isError } = useCheckLinkage(verificationDid as string);

  // Author not interested to show the verication
  if (!showVerification || verificationDid == null || checkStatus == null) {
    return null;
  }

  // Network invalidation
  if (isError) {
    return null;
  }

  // DID not fully valid
  const validLinkageDomainFromDid = checkStatus!.isDidValid && checkStatus!.isDomainValid;
  if (!validLinkageDomainFromDid) {
    return null;
  }

  return (
    <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100'>
      <svg className='h-3 w-3 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  );
};

export default BadgeWithLink;
