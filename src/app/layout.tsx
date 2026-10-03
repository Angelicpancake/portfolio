import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import CanvasContainer from '@/components/3d/CanvasContainer';
import Header from '@/components/ui/Header';
import Navigation from '@/components/ui/Navigation';
import FilterModal from '@/components/ui/FilterModal';
import HoverLabel from '@/components/ui/HoverLabel';
import TransitionOverlay from '@/components/ui/TransitionOverlay';
import SmoothScroll from '@/components/ui/SmoothScroll';

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export const metadata: Metadata = {
  title: 'Portfolio — Joshua Ren',
  description: 'An interactive 3D portfolio of software and creative projects.',
};

export const viewport: Viewport = { themeColor: '#07070a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body className="grain vignette font-sans">
        <SmoothScroll />
        <CanvasContainer />
        <Header />
        <main className="relative z-10">{children}</main>
        <Navigation />
        <FilterModal />
        <HoverLabel />
        <TransitionOverlay />
      </body>
    </html>
  );
}
