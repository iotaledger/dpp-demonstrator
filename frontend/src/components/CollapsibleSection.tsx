'use client';

import React, { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import CaretDownIcon from './icons/CaretDownIcon';
import CaretUpIcon from './icons/CaretUpIcon';

const CARD_DEFAULT_STYLE = 'border border-gray-200';
const CARD_MUTED_STYLE = 'border border-gray-200 !opacity-40';
const CARD_SELECTED_STYLE =
  'border-2 border-blue-500 shadow-sm  bg-blue-50 animate-[ripple_2s_both]';

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
  };

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
    <section
      ref={(ref) => {
        if (sectionRef.current) {
          ref?.scrollIntoView(true);
        }
        sectionRef.current = ref;
      }}
      className='mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-3 xl:px-12'
    >
      <div
        className={`overflow-hidden rounded-lg bg-white p-3 shadow-xs transition-all duration-400 ease-out sm:p-4 ${getCardStyle()}`}
        style={{
          opacity: opacity / 100,
          transform: `scale(${scale / 100})`,
          transition: `opacity 0.4s ease-out, transform 0.4s ease-out`,
        }}
      >
        <div className='scale-100 opacity-100 transition-all duration-500 ease-out'>
          {hasCardHeader() && (
            <div className={clsx('flex flex-col space-y-1.5 px-0.5', isExpanded && 'pb-3')}>
              <div className='flex items-center justify-between'>
                {showTitle && (
                  <div>
                    <h3 className='leading-none font-semibold tracking-tight'>{title}</h3>
                    {hasSubtitle() && <p className='text-sm text-gray-500'>{subtitle}</p>}
                  </div>
                )}
                {showButton && (
                  <button
                    className='focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center rounded-full rounded-md px-3 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
                    onClick={toggleExpanded}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? <CaretUpIcon /> : <CaretDownIcon />}
                  </button>
                )}
              </div>
            </div>
          )}

          {isExpanded && (
            <div>
              <div className='space-y-6 p-0'>{children}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollapsibleSection;
