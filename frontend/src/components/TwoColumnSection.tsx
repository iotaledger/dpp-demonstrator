import React from 'react';

interface TwoColumnSectionProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  gap?: string;
}

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({
  leftColumn,
  rightColumn,
  gap = "gap-10"
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-[2fr_1fr] ${gap} max-w-5xl`}>
      <div>
        {leftColumn}
      </div>
      <div>
        {rightColumn}
      </div>
    </div>
  );
};

export default TwoColumnSection;
