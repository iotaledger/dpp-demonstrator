'use client';

import React, { useState } from 'react';

interface ContactSectionProps {
  title?: string;
  email?: string;
  emailLabel?: string;
  onCopy?: (email: string) => void;
  opacity?: number;
  delay?: number;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title = 'Contact us',
  email = 'partnerships@iota.org',
  emailLabel = 'Email Address',
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(email);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex w-full flex-col gap-4 rounded-3xl border border-gray-200 bg-gradient-to-br from-white/80 to-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-6'>
        <div className='text-center md:text-left'>
          <h4 className='text-xl font-semibold text-gray-900 md:text-2xl'>{title}</h4>
        </div>
        <div className='flex items-center gap-3 self-center rounded-2xl border border-gray-200 bg-white px-4 py-3 md:gap-4 md:self-auto md:px-6 md:py-4'>
          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8'>
            <svg
              className='h-4 w-4 text-blue-600 md:h-5 md:w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
              />
            </svg>
          </div>
          <div className='flex min-w-0 flex-col'>
            <span className='mb-1 text-xs text-gray-500'>{emailLabel}</span>
            <a
              className='truncate text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 md:text-base'
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </div>
          <button
            className='flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 md:h-8 md:w-8'
            title={copied ? 'Copied!' : 'Copy email address'}
            onClick={handleCopy}
          >
            {copied ? (
              <svg
                className='h-4 w-4 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            ) : (
              <svg
                className='h-4 w-4 text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
