/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Metadata } from 'next';

import './globals.css';

import { AppLayout } from '@/components/AppLayout';
import { APP_METADATA } from '@/contents/common';

export const metadata: Metadata = {
  title: APP_METADATA.content.title,
  description: APP_METADATA.content.description,
  // See documentation at: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#icons
  icons: {
    icon: APP_METADATA.asset.iconUrl,
  },
  // See documentation at: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots
  robots: {
    index: false, // noindex
    follow: false, // nofollow
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
