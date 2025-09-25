import React from 'react';
import { Metadata } from 'next';
import "./globals.css";
import { AppLayout } from '@/components/AppLayout';

export const metadata: Metadata = {
  title: "DPP with IOTA Trust Framework",
  description: "Explore the Digital Product Passport with IOTA Trust Framework",
  // See documentation at: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#icons
  icons: {
    icon: '/assets/favicon-32x32.webp',
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
    <html lang="en">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
