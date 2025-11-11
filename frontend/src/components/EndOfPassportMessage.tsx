/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { END_OF_PASSPORT_MESSAGE } from '@/contents/common';

interface EndOfPassportMessageProps {
  message?: string;
  textColor?: string;
  textSize?: string;
  paddingY?: string;
  opacity?: number;
  delay?: number;
}

const EndOfPassportMessage: React.FC<EndOfPassportMessageProps> = ({
  message = END_OF_PASSPORT_MESSAGE.content.messageDefault,
  textColor = 'text-gray-500',
  textSize = 'text-sm',
  paddingY = 'py-6 sm:py-8',
  opacity = 100,
  delay = 0,
}) => {
  return (
    <section
      className={`mx-auto max-w-7xl px-4 sm:px-6 xl:px-12 ${paddingY}`}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`,
      }}
    >
      <div className={`text-center ${textColor}`}>
        <p className={textSize}>{message}</p>
      </div>
    </section>
  );
};

export default EndOfPassportMessage;
