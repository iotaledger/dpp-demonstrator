import React from 'react';

interface SlideContentProps {
  children: React.ReactNode;
  textAlign?: 'center' | 'left';
  order?: string;
  opacity?: number;
  translateY?: number;
  translateX?: number;
  delay?: number;
}

const SlideContent: React.FC<SlideContentProps> = ({
  children,
  textAlign = 'left',
  order = "order-1 md:order-2",
  opacity = 0,
  translateY = 4,
  translateX = 4,
  delay = 0.25
}) => {
  const getTextAlignClass = () => {
    return textAlign === 'center' ? 'text-center' : 'text-center md:text-left';
  };

  const getTransformClass = () => {
    if (textAlign === 'center') {
      return `opacity-${opacity} translate-y-${translateY} opacity-100 translate-y-0`;
    }
    return `opacity-${opacity} translate-y-${translateY} md:translate-y-0 md:translate-x-${translateX} opacity-100 translate-y-0 md:translate-x-0`;
  };

  return (
    <div className={`${getTextAlignClass()} ${order} pt-6 md:pt-0`}>
      <div
        style={{
          transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`
        }}
        className={getTransformClass()}
      >
        {children}
      </div>
    </div>
  );
};

export default SlideContent;