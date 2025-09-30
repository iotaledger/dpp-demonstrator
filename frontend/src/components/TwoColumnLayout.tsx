'use client';

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
  opacity = 100,
  delay = 0
}) => {
  return (
    <>
      <TwoColumnsForLargeScreen
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

interface OneColumnOtherwiseProps {
  children: React.ReactNode;
  opacity?: number;
  delay?: number;
}

const OneColumnOtherwise: React.FC<OneColumnOtherwiseProps> = ({
  children,
  opacity = 100,
  delay = 0
}) => {
  return (
    <div
      className='lg:hidden grid grid-cols-1 h-full overflow-hidden transition-all duration-700 ease-out gap-4'
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      {children}
    </div>
  );
}

interface TwoColumnsForLargeScreenProps {
  children: React.ReactNode;
  gap?: string;
  opacity?: number;
  delay?: number;
}

const TwoColumnsForLargeScreen: React.FC<TwoColumnsForLargeScreenProps> = ({
  children,
  opacity = 100,
  delay = 0
}) => {

  return (
    <div
      className={clsx([
        'max-lg:hidden',
        `grid grid-cols-[1fr_400px]`,
        'h-full overflow-hidden transition-all duration-700 ease-out gap-4',
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
