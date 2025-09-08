import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  showButton?: boolean;
  cardStyle?: boolean;
  opacity?: number;
  scale?: number;
  delay?: number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  showButton = true,
  cardStyle = true,
  opacity = 100,
  scale = 100,
  delay = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const cardClasses = cardStyle
    ? 'bg-white rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-3 sm:p-4 border border-gray-200'
    : '';

  const containerStyle = {
    opacity: opacity / 100,
    transform: `scale(${scale / 100})`,
    transition: `opacity ${delay}s ease-out, transform ${delay}s ease-out`
  };

  return (
    <div
      className={cardClasses}
      style={containerStyle}
    >
      <div className="transition-all duration-500 ease-out opacity-100 scale-100">
        <div className="flex flex-col space-y-1.5 px-0.5 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
            {showButton && (
              <button
                className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                onClick={toggleExpanded}
                aria-expanded={isExpanded}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isExpanded ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"}
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div>
            <div className="p-0 space-y-6">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleSection;
