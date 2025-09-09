import React from 'react';

interface RecapSlide2Props {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide2: React.FC<RecapSlide2Props> = ({
  title = "Beyond Digital Product Passports",
  description = "While this demo used a DPPs as its example, the principles and components you just explored are not tied to one sector or regulation. All showcased IOTA components are designed to be modular, open, and industry-agnostic.",
  imageSrc = "/assets/recap/recap_1.webp",
  imageAlt = "Beyond Digital Product Passports",
  opacity = 100,
  delay = 0.3
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `translateX(${opacity === 100 ? 0 : 4}px)`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`
  };

  return (
    <div
      className="max-w-6xl mx-auto p-6 md:p-12"
      style={containerStyle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img
            className="max-w-full max-h-[250px] lg:max-h-[350px]"
            src={imageSrc}
            alt={imageAlt}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.56px]">
            <p className="leading-[1.2]">{title}</p>
          </div>
          <div className="text-gray-600 text-lg tracking-[0.1px]">
            <p className="leading-[1.6]">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecapSlide2;
