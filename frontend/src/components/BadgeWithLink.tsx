'use client';

import { useCheckLinkage } from '@/hooks/useCheckLinkage';
import React from 'react';

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
  linkHref = "#",
  linkTarget = "_blank",
  showVerification = true,
  verificationIcon = 'check',
  verificationDid = null,
  spacing = "gap-2",
  opacity = 100,
  delay = 0
}) => {
  return (
    <div
      className={`text-blue-600 font-mono cursor-pointer flex items-center ${spacing}`}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      {badgeText && (
        <div
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <span className="value-content">{badgeText}</span>
        </div>
      )}

      {showVerification &&
        <VerificationIcon
          showVerification={showVerification}
          verificationIcon={verificationIcon}
          verificationDid={verificationDid} />}

      {linkText && (
        <span className="text-blue-600 font-mono cursor-pointer text-xs sm:text-sm value-content">
          <a target={linkTarget} href={linkHref} className="hover:text-blue-700 transition-colors">
            {linkText}
          </a>
        </span>
      )}
    </div>
  );
};

interface VerificationIconProps {
  showVerification?: boolean;
  verificationIcon?: 'check' | 'none';
  verificationDid?: string | null;
}

// TODO: Getting an error while calling the check linkage API endpoint
const VerificationIcon: React.FC<VerificationIconProps> = ({ showVerification, verificationIcon, verificationDid }) => {
  const { checkStatus, isSuccess } = useCheckLinkage(verificationDid as string);

  if (!showVerification || verificationIcon === 'none' || !isSuccess) return null;

  return (
    <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default BadgeWithLink;
