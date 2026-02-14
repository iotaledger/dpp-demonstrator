/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { useCheckLinkage } from '@/hooks/useCheckLinkage';

import CheckIcon from './icons/CheckIcon';

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

  // Author not interested to show the verification
  if (!showVerification || verificationDid == null || checkStatus == null) {
    console.warn('Author not interested to show the verification');
    return null;
  }

  // Network invalidation
  if (isError) {
    console.error('Error on network while checking VerifiableCredential');
    return null;
  }

  // DID not fully valid
  const validLinkageDomainFromDid = checkStatus!.isDidValid && checkStatus!.isDomainValid;
  if (!validLinkageDomainFromDid) {
    console.error('Invalid DomainLinkage');
    return null;
  }

  return (
    <DidConfigurationLinkWrap didConfigUrl={checkStatus.didConfigUrl}>
      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100'>
        <CheckIcon />
      </div>
    </DidConfigurationLinkWrap>
  );
};

interface DidConfigurationLinkWrapProps {
  didConfigUrl: string | null;
  children: React.ReactNode;
}
const DidConfigurationLinkWrap: React.FC<DidConfigurationLinkWrapProps> = ({
  didConfigUrl,
  children,
}) => {
  if (didConfigUrl) {
    return (
      <a href={didConfigUrl} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    );
  }

  return children;
};

export default BadgeWithLink;
