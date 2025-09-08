import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
  hidden?: boolean;
}

const Header: React.FC<HeaderProps> = ({ children, hidden = false }) => {
  return (
    <header 
      className={`flex-shrink-0 border-b border-gray-200 px-12 py-3 ${hidden ? 'hidden' : ''}`}
    >
      {children}
    </header>
  );
};

export default Header;