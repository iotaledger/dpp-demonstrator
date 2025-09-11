import React from 'react';

interface ActionButtonsProps {
  primaryButton: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  primaryButton,
  secondaryButton
}) => {
  const getButtonClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'secondary':
        return 'w-full bg-white/20 text-current hover:bg-white/30 border border-current/30 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl';
      case 'primary':
      default:
        return 'w-fit bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full text-lg font-medium transition-all cursor-pointer duration-300  hover:shadow-lg transform hover:scale-102'
    }
  };

  return (
    <div className="pt-6 flex flex-col md:flex-row gap-6 items-center">
      {secondaryButton && (
        <button
          className={getButtonClasses(secondaryButton.variant)}
          onClick={secondaryButton.onClick}
        >
          {secondaryButton.text}
        </button>
      )}

      <button
        className={getButtonClasses(primaryButton.variant)}
        onClick={primaryButton.onClick}
      >
        {primaryButton.text}
      </button>
    </div>
  );
};

export default ActionButtons;
