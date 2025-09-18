import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide3: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/map.webp"
        alt="Products Move, Data Doesn't"
      />

      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">{"Products Move, Data Doesn't"}</SlideTitle>
        <SlideDescription>
          {"Products move between companies, countries, and lifecycles. But their data is often siloed, overwritten, or lost. This creates inefficiencies, greenwashing, and missed chances for circularity. And it leaves little incentive for stakeholders to contribute meaningful lifecycle data."}
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide3;
