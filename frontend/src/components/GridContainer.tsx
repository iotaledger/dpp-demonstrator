import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
}

const GridContainer: React.FC<GridContainerProps> = ({ children }) => {
  return (
    <div className="h-full">
      <div
        className="h-full grid overflow-hidden transition-all duration-700 ease-out max-lg:pb-[12rem]"
        style={{ gridTemplateColumns: '1fr 0px 0px' }}
      >
        {children}
      </div>
    </div>
  );
};

export default GridContainer;
