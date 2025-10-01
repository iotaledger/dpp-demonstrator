'use client';

interface IntroSlideContentProps {
  children: React.ReactNode;
}

const IntroSlideContent: React.FC<IntroSlideContentProps> = ({
  children,
}) => {
  return (
    <div
      className="max-w-8xl grid w-full max-h-full lg:mt-[-2%] mx-auto backdrop-blur-sm rounded-[2.5rem] px-6 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12 pb-8 bg-transparent text-gray-800"
      style={{
        transition: 'background-color 0.6s ease-out, color 0.6s ease-out'
      }}
    >
      {children}
    </div>
  );
}

export default IntroSlideContent;
