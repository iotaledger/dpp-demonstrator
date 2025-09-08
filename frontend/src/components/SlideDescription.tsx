import React from 'react';

interface SlideDescriptionProps {
  children: React.ReactNode;
  opacity?: number;
}

const SlideDescription: React.FC<SlideDescriptionProps> = ({
  children,
  opacity = 80
}) => {
  return (
    <p className={`text-base md:text-xl opacity-${opacity} mb-8 leading-relaxed`}>
      {children}
    </p>
  );
};

export default SlideDescription;