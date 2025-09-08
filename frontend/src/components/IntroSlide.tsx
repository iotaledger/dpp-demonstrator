import React from 'react';

interface IntroSlideProps {
  children: React.ReactNode;
  opacity?: number;
  scale?: number;
}

const IntroSlide: React.FC<IntroSlideProps> = ({
  children,
  opacity = 0,
  scale = 98
}) => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div
        className={`flex items-center justify-center h-full p-6 md:p-12 opacity-${opacity} scale-${scale} overflow-hidden`}
        style={{
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <div
          className="max-w-6xl grid w-full max-h-[95vh] mx-auto backdrop-blur-sm rounded-[2.5rem] p-4 md:p-8 lg:p-12 bg-white text-gray-800 overflow-y-auto"
          style={{
            transition: 'background-color 0.6s ease-out, color 0.6s ease-out'
          }}
        >
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSlide;
