import React from 'react';

import { CONTACT } from '@/contents/common';

import CopiedIcon from './icons/CopiedIcon';
import CopyIcon from './icons/CopyIcon';
import WebIcon from './icons/WebIcon';

interface ContactProps {
  email: string;
}

const Contact: React.FC<ContactProps> = ({ email }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 600);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };
  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex w-full flex-col gap-4 rounded-3xl border border-gray-200 bg-gradient-to-br from-white/80 to-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-6'>
        <div className='text-center md:text-left'>
          <h4 className='text-xl font-semibold text-gray-900 md:text-2xl'>
            {CONTACT.content.title}
          </h4>
        </div>
        <div className='flex items-center gap-3 self-center rounded-2xl border border-gray-200 bg-white px-4 py-3 md:gap-4 md:self-auto md:px-6 md:py-4'>
          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8'>
            <WebIcon />
          </div>
          <div className='flex min-w-0 flex-col'>
            <span className='mb-1 text-xs text-gray-500'>{email}</span>
            <a
              className='truncate text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 md:text-base'
              href='mailto://partnerships@iota.org'
            >
              {email}
            </a>
          </div>
          <button
            className='flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 md:h-8 md:w-8'
            title={CONTACT.content.copyTitle}
            onClick={handleCopy}
          >
            {copied ? <CopiedIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Contact;
