import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: "contents" }}>
      <div
        className="bg-gray-100 flex flex-col"
        style={{
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
