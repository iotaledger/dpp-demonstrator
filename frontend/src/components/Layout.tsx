/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'contents' }}>
      <div
        className='flex flex-col bg-gray-100'
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
