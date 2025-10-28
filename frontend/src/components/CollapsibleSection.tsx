'use client';

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

const CARD_DEFAULT_STYLE = 'border border-gray-200';
const CARD_MUTED_STYLE = 'border border-gray-200 !opacity-40';
const CARD_SELECTED_STYLE = 'border-2 border-blue-500 shadow-sm  bg-blue-50 animate-[ripple_2s_both]';

interface CollapsibleSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  defaultExpanded?: boolean;
  showButton?: boolean;
  opacity?: number;
  scale?: number;
  delay?: number;
  cardState?: 'default' | 'muted' | 'selected';
  scrollIntoView?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  title,
  subtitle = '',
  showTitle = true,
  defaultExpanded = true,
  showButton = true,
  opacity = 100,
  scale = 100,
  cardState = 'default',
  scrollIntoView = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const sectionRef: React.Ref<HTMLElement | boolean> = useRef(scrollIntoView);

  // If cardState is selected, focus the section
  useEffect(() => {
    if (cardState === 'selected' && typeof sectionRef.current !== 'boolean') {
      sectionRef.current?.scrollIntoView(true);
    }
  }, [cardState]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getCardStyle = () => {
    switch (cardState) {
      case 'muted':
        return CARD_MUTED_STYLE;
      case 'selected':
        return CARD_SELECTED_STYLE;
      case 'default':
        return CARD_DEFAULT_STYLE;
    }
  }

  const hasSubtitle = () => {
    return subtitle != null && subtitle.trim() !== '';
  };

  /**
   * Show header if either title or button should be showed, no header otherwise.
   */
  const hasCardHeader = () => {
    return showTitle || showButton;
  };

  React.useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <section ref={(ref) => {
      if (sectionRef.current) {
        ref?.scrollIntoView(true);
      }
      sectionRef.current = ref;
    }} className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
      <div
        className={`bg-white rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-3 sm:p-4 ${getCardStyle()}`}
        style={{
          opacity: opacity / 100,
          transform: `scale(${scale / 100})`,
          transition: `opacity 0.4s ease-out, transform 0.4s ease-out`
        }}
      >
        <div className="transition-all duration-500 ease-out opacity-100 scale-100">
          {hasCardHeader() && (
            <div className={clsx("flex flex-col space-y-1.5 px-0.5", isExpanded && "pb-3")} >
              <div className="flex items-center justify-between">
                {showTitle && (
                  <div>
                    <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                    {hasSubtitle() && <p className="text-sm text-gray-500">{subtitle}</p>}
                  </div>
                )}
                {showButton && (
                  <button
                    className=" inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
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
          )}

          {/* TODO: Implement smooth transition to collapsable section */}
          {isExpanded && (
            <div>
              <div className="p-0 space-y-6">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollapsibleSection;
