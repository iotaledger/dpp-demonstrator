import React from 'react';

interface CardHeaderProps {
  title?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonVariant?: 'default' | 'outlined';
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title = "Welcome",
  showButton = false,
  buttonText = "Button",
  onButtonClick,
  buttonVariant = "default"
}) => {
  const buttonClasses = buttonVariant === "outlined"
    ? "text-[10px] !leading-[12px] !h-auto !px-3 !py-1 !rounded-full border hover:bg-blue-50 transition-colors bg-gray-100 text-gray-600 border-gray-300"
    : "text-[10px] !leading-[12px] !h-auto !px-3 !py-1 !rounded-full";

  return (
    <div className="flex-shrink-0 bg-slate-100 px-6 py-3 border-b border-gray-200 text-xs text-gray-500">
      <div className="flex items-center justify-between w-full leading-1">
        <h4>{title}</h4>
        {showButton && (
          <button
            className={`inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 ${buttonClasses}`}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
