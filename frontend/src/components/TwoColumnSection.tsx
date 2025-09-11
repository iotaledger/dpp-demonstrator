import React from 'react';

interface TwoColumnSectionProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  columns?: string;
  gap?: string;
}

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({
  leftColumn,
  rightColumn,
  columns = 'grid-cols-1 md:grid-cols-2',
  gap = "gap-4"
}) => {
  return (
    <div className={`grid ${columns} ${gap}`}>
      {leftColumn}
      {rightColumn}
    </div>
  );
};

export default TwoColumnSection;
