'use client';

interface IntroSlideContentProps {
  children: React.ReactNode;
}

const IntroSlideContent: React.FC<IntroSlideContentProps> = ({ children }) => {
  return (
    <div
      className='max-w-8xl mx-auto grid max-h-full w-full rounded-[2.5rem] bg-transparent px-6 pt-6 pb-8 text-gray-800 backdrop-blur-sm md:px-8 md:pt-8 lg:mt-[-2%] lg:px-12 lg:pt-12'
      style={{
        transition: 'background-color 0.6s ease-out, color 0.6s ease-out',
      }}
    >
      {children}
    </div>
  );
};

export default IntroSlideContent;
