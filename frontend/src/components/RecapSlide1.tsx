import React from 'react';
import CheckmarkList from './CheckmarkList';

interface RecapSlide1Props {
  title?: string;
  description?: string;
  checkmarkItems?: string[];
  buttonText?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide1: React.FC<RecapSlide1Props> = ({
  title = "What You Just Experienced",
  description = "You stepped into the role of a certified service technician and experienced how IOTA infrastructure enables verifiable and incentivized lifecycle actions:",
  checkmarkItems = [
    "Verified manufacturer identity via domain linkage",
    "Became certified through IOTA Hierarchies",
    "Added a signed health snapshot using IOTA Notarization",
    "Received a token payout via IOTA Tokenization",
    "Paid no fees thanks to IOTA Gas Station",
    "Connected securely via a browser or mobile wallet"
  ],
  buttonText = "Back to DPP",
  opacity = 100,
  delay = 0.2
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `scale(${opacity === 100 ? 1 : 0.95})`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`
  };

  // TODO: implement nativation back to DPP (introduction?)
  const handleBackToDpp = () => { };

  return (
    <div
      className="max-w-6xl mx-auto p-6 md:p-12"
      style={containerStyle}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex justify-start">
              <button
                className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 border border-gray-700 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                onClick={handleBackToDpp}
              >
                {buttonText}
              </button>
            </div>
          </div>
          <div className="text-gray-900 text-3xl md:text-4xl lg:text-5xl tracking-[-0.56px]">
            <p className="leading-[1.2]">{title}</p>
          </div>
          <div className="text-gray-600 text-lg md:text-xl tracking-[0.1px] max-w-3xl">
            <p className="leading-[28px]">{description}</p>
          </div>
        </div>
        <CheckmarkList
          items={checkmarkItems}
          opacity={100}
          delay={delay + 0.2}
        />
      </div>
    </div>
  );
};

export default RecapSlide1;
