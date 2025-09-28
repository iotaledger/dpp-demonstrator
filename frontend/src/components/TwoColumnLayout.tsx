import clsx from 'clsx';
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
  sidebarWidth = "400",
  gap = "gap-1",
  opacity = 100,
  delay = 0
}) => {
  return (
    <>
      <TwoColumnsForLargeScreen
        sidebarWidth={sidebarWidth}
        gap={gap}
        opacity={opacity}
        delay={delay}>
        <main className="overflow-hidden transition-all duration-700 ease-out">
          <div className="h-full transition-all duration-700 ease-out">
            {mainContent}
          </div>
        </main>
        <aside className="overflow-hidden">
          {sidebarContent}
        </aside>
      </TwoColumnsForLargeScreen>
      <OneColumnOtherwise
        gap={gap}
        opacity={opacity}
        delay={delay}>
        <main className="overflow-hidden transition-all duration-700 ease-out">
          <div className="h-full transition-all duration-700 ease-out">
            {mainContent}
          </div>
        </main>
        <aside className="overflow-hidden">
          {sidebarContent}
        </aside>
      </OneColumnOtherwise>
    </>
  );
};

function OneColumnOtherwise({
  children,
  gap = "gap-1",
  opacity = 100,
  delay = 0
}) {

  return (
    <div
      className={clsx([
        'grid grid-cols-1 h-full overflow-hidden transition-all duration-700 ease-out',
        gap && gap,
      ])}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      {children}
    </div>
  );
}
function TwoColumnsForLargeScreen({
  children,
  sidebarWidth = "400",
  gap = "gap-1",
  opacity = 100,
  delay = 0
}) {

  return (
    <div
      className={clsx([
        'max-lg:hidden',
        `grid grid-cols-[1fr_${sidebarWidth}]`,
        'h-full overflow-hidden transition-all duration-700 ease-out',
        gap && gap,
      ])}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      {children}
    </div>
  );
}

export default TwoColumnLayout;
