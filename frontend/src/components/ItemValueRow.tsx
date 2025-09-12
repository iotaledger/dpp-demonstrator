import React from 'react';

interface ItemValueRowProps {
  label: string;
  value: string | React.ReactNode;
  isLink?: boolean;
  linkHref?: string;
  linkTarget?: '_blank' | '_self';
  columnMaxWidth?: number;
  fontMono?: boolean;
  valueColor?: string;
  showBorder?: boolean;
  opacity?: number;
  delay?: number;
  rowState?: 'default' | 'selected' | 'muted';
}

const ItemValueRow: React.FC<ItemValueRowProps> = ({
  label,
  value,
  isLink = false,
  linkHref = "#",
  linkTarget = "_blank",
  columnMaxWidth = 150,
  fontMono = false,
  valueColor = "text-gray-900",
  showBorder = false,
  opacity = 100,
  delay = 0,
  rowState = 'default',
}) => {
  const renderValue = () => {
    if (React.isValidElement(value)) {
      return value;
    }

    if (isLink && typeof value === 'string') {
      return (
        <a
          target={linkTarget}
          href={linkHref}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          {value}
        </a>
      );
    }

    return value;
  };

  const valueClasses = [
    fontMono ? 'font-mono' : '',
    isLink ? 'text-blue-600 cursor-pointer' : valueColor,
    'value-content'
  ].filter(Boolean).join(' ');

  const getRowStateStyle = () => {
    switch (rowState) {
      case 'selected':
        return 'border-1 bg-blue-100 rounded-sm border px-2 border-blue-600 animate-[smallRipple_2s_both]';
      case 'muted':
        return 'border-1 border-transparent blur-[2px] opacity-60';
      case 'default':
      default:
        return '';
    }
  };

  return (
    <div className={`grid-cols-1 sm:grid-cols-[minmax(max-content,${columnMaxWidth}px)_auto] gap-1 grid-flow-col  grid items-center ${getRowStateStyle()}`}
      style={{
        opacity: opacity / 100,
        transition: 'filter 0.3s ease,opacity 0.3s ease',
      }}
    >
      <span className="text-gray-500 font-medium">{label}</span>
      <div className={valueClasses}>
        {renderValue()}
      </div>
    </div>
  );
};

export default ItemValueRow;
