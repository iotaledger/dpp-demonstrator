/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import IntroSlide1 from './IntroSlide1';
import IntroSlide2 from './IntroSlide2';
import IntroSlide3 from './IntroSlide3';
import IntroSlide4 from './IntroSlide4';
import IntroSlide5 from './IntroSlide5';
import IntroSlide6 from './IntroSlide6';
import IntroSlide7 from './IntroSlide7';
import IntroSlide8 from './IntroSlide8';
import IntroSlide9 from './IntroSlide9';
import IntroSlide10 from './IntroSlide10';
import IntroSlide11 from './IntroSlide11';
import IntroSlide12 from './IntroSlide12';

export const SLIDES_MAP = new Map([
  [1, <IntroSlide1 key={1} />],
  [2, <IntroSlide2 key={2} />],
  [3, <IntroSlide3 key={3} />],
  [4, <IntroSlide4 key={4} />],
  [5, <IntroSlide5 key={5} />],
  [6, <IntroSlide6 key={6} />],
  [7, <IntroSlide7 key={7} />],
  [8, <IntroSlide8 key={8} />],
  [9, <IntroSlide9 key={9} />],
  [10, <IntroSlide10 key={10} />],
  [11, <IntroSlide11 key={11} />],
  [12, <IntroSlide12 key={12} />],
]);

interface IntroSlideManagerProps {
  currentSlide?: number;
}

const IntroSlideManager: React.FC<IntroSlideManagerProps> = ({ currentSlide }) => {
  const renderComponent = (currentSlide: number) => {
    if (SLIDES_MAP.has(currentSlide)) {
      return SLIDES_MAP.get(currentSlide);
    }
    return <span>No slides</span>;
  };

  return <>{renderComponent(currentSlide!)}</>;
};

export default IntroSlideManager;
