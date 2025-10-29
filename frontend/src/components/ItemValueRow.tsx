'use client';

import { clsx } from 'clsx';
import React from 'react';

interface ItemValueRowProps {
  label: string;
  labelWidth?: number;
  value: string | React.ReactNode;
  isLink?: boolean;
  linkHref?: string;
  linkTarget?: '_blank' | '_self';
  fontMono?: boolean;
  valueColor?: string;
  opacity?: number;
  rowState?: 'default' | 'selected' | 'muted';
  isValuePending?: boolean;
}

const VALUE_MONO_STYLE = 'font-mono';
const VALUE_LINK_STYLE = 'text-blue-600 cursor-pointer';
const VALUE_MUTED_STYLE = 'border-1 border-transparent blur-[2px] opacity-60';

const ROW_DEFAULT_STYLE = '';
const ROW_SELECTED_STYLE =
  'border-1 bg-blue-100 rounded-sm border px-2 border-blue-600 animate-[smallRipple_2s_both]';
const ROW_MUTED_STYLE = 'border-1 border-transparent blur-[2px] opacity-60';

const ItemValueRow: React.FC<ItemValueRowProps> = ({
  label,
  labelWidth = 250,
  value,
  isLink = false,
  linkHref = '#',
  linkTarget = '_blank',
  fontMono = false,
  valueColor = 'text-gray-900',
  opacity = 100,
  rowState = 'default',
  isValuePending = false,
}) => {
  const renderValue = () => {
    if (isValuePending) {
      return <ValuePendingPlaceholder />;

      function ValuePendingPlaceholder() {
        return (
          <div className='flex items-center gap-3'>
            <span className='text-blue-600 font-mono text-sm'>0x04c...99fa</span>
          </div>
        );
      }
    }

    if (React.isValidElement(value)) {
      return value;
    }

    if (isLink && typeof value === 'string') {
      return (
        <a
          target={linkTarget}
          href={linkHref}
          className='text-blue-600 hover:text-blue-700 transition-colors'
        >
          {value}
        </a>
      );
    }

    return value;
  };

  const getRowStateStyle = () => {
    switch (rowState) {
      case 'selected':
        return ROW_SELECTED_STYLE;
      case 'muted':
        return ROW_MUTED_STYLE;
      case 'default':
      default:
        return ROW_DEFAULT_STYLE;
    }
  };

  const getValueStyle = () => {
    return clsx([
      'value-content',
      valueColor,
      isLink && VALUE_LINK_STYLE,
      fontMono && VALUE_MONO_STYLE,
      isValuePending && VALUE_MUTED_STYLE,
    ]);
  };

  const getGridTemplate = () => {
    if (labelWidth <= 150) {
      return 'sm:grid-cols-[150px_auto]';
    }
    return 'sm:grid-cols-[250px_auto]';
  };

  return (
    <div
      className={clsx([
        'max-sm:flex max-sm:flex-col gap-1',
        'sm:grid sm:grid-flow-col',
        'sm:grid-cols-2',
        getGridTemplate(),
        getRowStateStyle(),
      ])}
      style={{
        opacity: opacity / 100,
        transition: 'filter 0.3s ease,opacity 0.3s ease',
      }}
    >
      <span className='text-gray-500 font-medium'>{label}</span>
      <div className={getValueStyle()}>{renderValue()}</div>
    </div>
  );
};

export default ItemValueRow;
