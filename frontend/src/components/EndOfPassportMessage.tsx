import React from 'react';

interface EndOfPassportMessageProps {
  message?: string;
  textColor?: string;
  textSize?: string;
  paddingY?: string;
  opacity?: number;
  delay?: number;
}

const EndOfPassportMessage: React.FC<EndOfPassportMessageProps> = ({
  message = "End of Digital Product Passport",
  textColor = "text-gray-500",
  textSize = "text-sm",
  paddingY = "py-6 sm:py-8",
  opacity = 100,
  delay = 0
}) => {
  return (
    <section
      className={`px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto ${paddingY}`}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <div className={`text-center ${textColor}`}>
        <p className={textSize}>{message}</p>
      </div>
    </section>
  );
};

export default EndOfPassportMessage;
