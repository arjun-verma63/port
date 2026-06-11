import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const neueMachina = localFont({
  src: [
    {
      path: './fonts/NeueMachina-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/NeueMachina-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/NeueMachina-Ultrabold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-neue-machina',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Arjun Verma - Portfolio',
  description:
    'Full-stack web applications, advanced computer vision, and applied mathematics. A portfolio showcasing depth, precision, and aesthetic control.',
  keywords: [
    'software engineer',
    'full-stack developer',
    'computer vision',
    'react',
    'node.js',
    'YOLO',
    'Kalman filter',
    'portfolio',
  ],
  openGraph: {
    title: 'Arjun Verma - Portfolio',
    description:
      'Full-stack web applications, advanced computer vision, and applied mathematics.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${neueMachina.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
