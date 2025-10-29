'use client';

import React from 'react';

interface PanelContentProps {
  children: React.ReactNode;
  title?: string;
  badge?: React.ReactNode;
  panelState?: 'default' | 'selected';
}

const PanelContent: React.FC<PanelContentProps> = ({
  children,
  title,
  badge,
  panelState = 'default',
}) => {
  const getPanelStateStyle = () => {
    switch (panelState) {
      case 'selected':
        return 'border-blue-600 animate-[ripple_2s_both]';
      case 'default':
      default:
        return 'border-gray-200';
    }
  };

  const hasTitle = () => {
    if (title != null && title.trim() !== '') {
      return true;
    }
    return false;
  };

  const hasBadge = () => {
    if (badge != null) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`panel space-y-4 border-1 rounded-lg p-4 transition-all duration-300 ease-out ${getPanelStateStyle()}`}
    >
      {!hasBadge() && hasTitle() && <h3 className='font-medium text-gray-900'>{title}</h3>}
      {hasBadge() && (
        <div className='flex items-center gap-2 mb-3'>
          {hasTitle() && <h3 className='font-medium text-gray-900'>{title}</h3>}
          {badge}
        </div>
      )}
      {children}
    </div>
  );
};

export default PanelContent;
