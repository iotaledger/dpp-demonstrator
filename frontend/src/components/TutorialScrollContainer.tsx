import React from 'react';

interface TutorialScrollContainerProps {
  children: React.ReactNode;
}

const TutorialScrollContainer: React.FC<TutorialScrollContainerProps> = ({ children }) => {
  return (
    <div 
      id="tutorial-scroll-container"
      className="flex-1 overflow-y-auto overflow-x-hidden relative"
      style={{
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
        position: 'relative',
        zIndex: 1
      }}
    >
      {children}
    </div>
  );
};

export default TutorialScrollContainer;