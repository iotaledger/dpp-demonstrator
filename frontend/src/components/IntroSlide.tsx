'use client';

import React from 'react';

import IntroSlideContainer from './IntroSlideContainer';
import IntroSlideContent from './IntroSlideContent';

interface IntroSlideProps {
  children: React.ReactNode;
}

const IntroSlide: React.FC<IntroSlideProps> = ({ children }) => {
  return (
    <IntroSlideContainer>
      <IntroSlideContent>{children}</IntroSlideContent>
    </IntroSlideContainer>
  );
};

export default IntroSlide;
