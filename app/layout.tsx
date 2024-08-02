import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";


export const metadata: Metadata = {
  title: 'Creative Energy Boost - Personalized Content Generator',
  description: 'Get personalized encouragement, support, or creative content based on your photo. Includes mood analysis, novel writing, poem generation, lyrics creation, and more.',
  keywords: ['mood analysis', 'creative writing', 'personalized content', 'AI-generated content', 'photo analysis'],
  authors: [{ name: 'EBCHO' }],
  openGraph: {
    title: 'Creative Energy Boost - Personalized Content Generator',
    description: 'Upload your photo and get personalized creative content, encouragement, or support.',
    url: 'https://nextjs-gemini-one.vercel.app',
    siteName: 'Creative Energy Boost',
    images: [
      {
        url: 'https://nextjs-gemini-one.vercel.app/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Creative Energy Boost',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Energy Boost - Personalized Content Generator',
    description: 'Upload your photo and get personalized creative content, encouragement, or support.',
    images: ['https://nextjs-gemini-one.vercel.app/twitter-image.jpg'],
  },
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
      <GoogleAnalytics gaId="G-GS69YDBEKP" />
    </html>
  );
}
