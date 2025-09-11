import React from 'react';

interface DataGridProps {
  children: React.ReactNode;
  columns?: string;
  gap?: string;
  textSize?: string;
  opacity?: number;
  delay?: number;
}

const DataGrid: React.FC<DataGridProps> = ({
  children,
  columns = "",
  gap = "gap-y-1.5 gap-x-6",
  textSize = "text-sm",
  opacity = 100,
  delay = 0
}) => {
  return (
    <div
      className={`grid ${columns} ${gap} ${textSize}`}
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      {children}
    </div>
  );
};

export default DataGrid;
