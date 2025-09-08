import React from 'react';

interface SlideTitleProps {
  children: React.ReactNode;
  size?: 'large' | 'medium';
}

const SlideTitle: React.FC<SlideTitleProps> = ({
  children,
  size = 'large'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'medium':
        return 'text-xl md:text-2xl lg:text-3xl';
      case 'large':
      default:
        return 'text-2xl md:text-3xl lg:text-4xl';
    }
  };

  return (
    <h2 className={`${getSizeClasses()} font-medium mb-6 leading-tight`}>
      {children}
    </h2>
  );
};

export default SlideTitle;