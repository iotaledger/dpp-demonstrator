/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { clsx } from 'clsx';

import { ITEM_VALUE_ROW } from '@/contents/common';

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
            <span className='font-mono text-sm text-blue-600'>
              {ITEM_VALUE_ROW.content.addressPlaceholder}
            </span>
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
          className='text-blue-600 transition-colors hover:text-blue-700'
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
        'gap-1 max-sm:flex max-sm:flex-col',
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
      <span className='font-medium text-gray-500'>{label}</span>
      <div className={getValueStyle()}>{renderValue()}</div>
    </div>
  );
};

export default ItemValueRow;
