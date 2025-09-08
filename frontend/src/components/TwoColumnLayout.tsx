import React from 'react';

interface TwoColumnLayoutProps {
  mainContent: React.ReactNode;
  sidebarContent: React.ReactNode;
  sidebarWidth?: string;
  gap?: string;
  opacity?: number;
  delay?: number;
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  mainContent,
  sidebarContent,
  sidebarWidth = "400px",
  gap = "gap-1",
  opacity = 100,
  delay = 0
}) => {
  return (
    <div 
      className={`h-full grid overflow-hidden transition-all duration-700 ease-out ${gap}`}
      style={{
        gridTemplateColumns: `1fr ${sidebarWidth}`,
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <main className="overflow-hidden transition-all duration-700 ease-out">
        <div className="h-full transition-all duration-700 ease-out pr-2">
          {mainContent}
        </div>
      </main>
      
      <aside className="overflow-hidden">
        {sidebarContent}
      </aside>
    </div>
  );
};

export default TwoColumnLayout;