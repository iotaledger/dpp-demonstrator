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
  delay = 0
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

  const borderClasses = showBorder
    ? 'border-1 border-transparent'
    : '';

  return (
    <div className={`grid-cols-1 sm:grid-cols-[minmax(max-content,${columnMaxWidth}px)_auto] gap-1 grid-flow-col  grid items-center ${borderClasses}`}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
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
