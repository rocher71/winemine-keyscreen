import type { NextConfig } from 'next';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 사용자 홈에 다른 lockfile이 있어 Next.js가 workspace root를 잘못 추론하는 것 방지.
  outputFileTracingRoot: path.join(__dirname),
};

export default withNextIntl(nextConfig);
