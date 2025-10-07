import React from 'react';
import { Metadata } from 'next';
import "./globals.css";
import { AppLayout } from '@/components/AppLayout';

export const metadata: Metadata = {
  title: "DPP with IOTA Trust Framework",
  description: "Explore the Digital Product Passport with IOTA Trust Framework",
  icons: {
    icon: '/assets/favicon-32x32.webp',
  },
    openGraph: {
    title: "DPP with IOTA Trust Framework",
    description: "Explore the Digital Product Passport with IOTA Trust Framework",
    url: "https://dpp.demo.iota.org", 
    siteName: "DPP Demo",
    images: [
      {
        url: "https://i.imgur.com/u4fnzhp.png", 
        height: 630,
        alt: "Digital Product Passport with IOTA Trust Framework",
      },
    ],
    locale: "en_US",
    type: "website",
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
