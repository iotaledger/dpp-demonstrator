import { useTransitionTrigger } from "@/hooks/useTransitionTrigger";

interface IntroSlideContentProps {
  children: React.ReactNode;
}

const IntroSlideContent: React.FC<IntroSlideContentProps> = ({
  children,
}) => {
  return (
    <div
      className="max-w-8xl grid w-full max-h-[95vh] mx-auto backdrop-blur-sm rounded-[2.5rem] p-4 md:p-8 lg:p-12 bg-transparent text-gray-800 overflow-y-auto"
      style={{
        transition: 'background-color 0.6s ease-out, color 0.6s ease-out'
      }}
    >
      {children}
    </div>
  );
}

export default IntroSlideContent;
