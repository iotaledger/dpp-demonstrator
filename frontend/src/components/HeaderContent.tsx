import React from 'react';

const HeaderContent: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Empowered by IOTA</span>
      </div>
      <div className="text-sm text-gray-500">IOTA Trust Framework</div>
    </div>
  );
};

export default HeaderContent;