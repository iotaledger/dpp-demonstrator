import React from 'react';

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <div
      className="p-3 overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {children}
    </div>
  );
};

export default Main;
