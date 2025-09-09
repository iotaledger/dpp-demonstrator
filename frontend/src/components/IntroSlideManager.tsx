import React from "react";
import Slide1 from "./Slide1";
import Slide10 from "./Slide10";
import Slide2 from "./Slide2";
import Slide3 from "./Slide3";
import Slide4 from "./Slide4";
import Slide5 from "./Slide5";
import Slide6 from "./Slide6";
import Slide7 from "./Slide7";
import Slide8 from "./Slide8";
import Slide9 from "./Slide9";

export const SLIDES_MAP = new Map([
  [1, <Slide1 />],
  [2, <Slide2 />],
  [3, <Slide3 />],
  [4, <Slide4 />],
  [5, <Slide5 />],
  [6, <Slide6 />],
  [7, <Slide7 />],
  [8, <Slide8 />],
  [9, <Slide9 />],
  [10, <Slide10 />],
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
  }

  return (
    <>
      {renderComponent(currentSlide!)}
    </>
  );
};

export default IntroSlideManager;
