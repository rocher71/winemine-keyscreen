import type { Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05020A',
};
import { AppProviders } from '@/context/app-providers';
import { PageBackground } from '@/components/shared/page-background';
import { DeviceFrame } from '@/components/device-frame/device-frame';
import { PlaceholderToast } from '@/components/shared/placeholder-toast';
import { LocaleBridge } from '@/components/i18n/locale-bridge';
import { DemoControls } from '@/components/demo-controls/demo-controls';
import { FeatureFlagPanel } from '@/components/feature-flag-panel/feature-flag-panel';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Spoqa Han Sans Neo — 한글 전용 (Thin·Light·Regular·Medium·Bold) */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css"
        />
      </head>
      <body>
        <AppProviders>
          <LocaleBridge>
            <PageBackground />
            <DemoControls />
            <DeviceFrame>{children}</DeviceFrame>
            <FeatureFlagPanel />
            <PlaceholderToast />
          </LocaleBridge>
        </AppProviders>
      </body>
    </html>
  );
}
