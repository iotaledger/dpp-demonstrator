/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import { REPOSITORY } from '@/contents/common';

import GithubIcon from './icons/GithubIcon';

interface RepositoryProps {
  repositoryHostname: string;
  repositoryUrl: string;
  repositoryName: string;
}

const Repository: React.FC<RepositoryProps> = ({
  repositoryHostname,
  repositoryUrl,
  repositoryName,
}) => {
  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex w-full flex-col gap-4 rounded-3xl border border-gray-200 bg-gradient-to-br from-white/80 to-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-6'>
        <div className='text-center md:text-left'>
          <h4 className='text-xl font-semibold text-gray-900 md:text-2xl'>
            {REPOSITORY.content.title}
          </h4>
        </div>
        <div className='flex items-center gap-3 self-center rounded-2xl border border-gray-200 bg-white px-4 py-3 md:gap-4 md:self-auto md:px-6 md:py-4'>
          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8'>
            <GithubIcon />
          </div>
          <div className='flex min-w-0 flex-col'>
            <span className='mb-1 text-xs text-gray-500'>{repositoryHostname}</span>
            <a
              className='truncate text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 md:text-base'
              href={repositoryUrl}
              target='_blank'
            >
              {repositoryName}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repository;
