import React from 'react';

interface FeaturesGridProps {
  children: React.ReactNode;
  columns?: string;
  gap?: string;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ 
  children,
  columns = "grid-cols-2 sm:grid-cols-3",
  gap = "gap-4"
}) => {
  return (
    <div className="relative">
      <div className={`grid ${columns} ${gap}`}>
        {children}
      </div>
    </div>
  );
};

export default FeaturesGrid;