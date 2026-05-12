import { Playfair_Display, Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/context/app-providers';
import { PageBackground } from '@/components/shared/page-background';
import { DeviceFrame } from '@/components/device-frame/device-frame';
import { PlaceholderToast } from '@/components/shared/placeholder-toast';
import { LocaleBridge } from '@/components/i18n/locale-bridge';
import { DemoControls } from '@/components/demo-controls/demo-controls';
import { FeatureFlagPanel } from '@/components/feature-flag-panel/feature-flag-panel';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-kr',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${playfair.variable} ${inter.variable} ${notoKr.variable}`}>
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
