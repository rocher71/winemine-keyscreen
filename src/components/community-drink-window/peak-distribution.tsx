'use client';

import dynamic from 'next/dynamic';
import type { CommunityPeakAggregate } from '@/types';

const PeakDistributionInner = dynamic(
  () => import('./peak-distribution-inner'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: 200,
          background: 'var(--color-bg-map)',
          borderRadius: 8,
          opacity: 0.4,
        }}
        aria-hidden
      />
    ),
  },
);

type Props = {
  aggregate: CommunityPeakAggregate;
  height?: number;
  showLegend?: boolean;
};

/**
 * Recharts BarChart wrapper — SSR 불가, dynamic import.
 */
export function PeakDistribution(props: Props) {
  return <PeakDistributionInner {...props} />;
}
