'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useLocale } from '@/context/locale-context';
import type { CommunityPeakAggregate } from '@/types';

type Props = {
  aggregate: CommunityPeakAggregate;
  height?: number;
  showLegend?: boolean;
};

type BarPt = { year: number; count: number };

function TooltipBody({
  active,
  payload,
  locale,
}: {
  active?: boolean;
  payload?: Array<{ payload: BarPt }>;
  locale: 'ko' | 'en';
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-gold)',
        borderRadius: 10,
        padding: '8px 10px',
        boxShadow: '0 8px 22px rgba(0,0,0,0.6)',
        color: 'var(--color-cream)',
        fontFamily: 'var(--font-inter)',
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--color-gold)' }}>{p.year}</div>
      <div style={{ marginTop: 2, color: 'var(--color-text-secondary)' }}>
        {locale === 'ko'
          ? `가중 응답 수: ${p.count.toFixed(1)}`
          : `Weighted votes: ${p.count.toFixed(1)}`}
      </div>
    </div>
  );
}

export default function PeakDistributionInner({
  aggregate,
  height = 200,
  showLegend = false,
}: Props) {
  const { locale } = useLocale();

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={aggregate.distribution}
          margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border-default)"
            opacity={0.4}
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
            stroke="var(--color-border-default)"
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
            stroke="var(--color-border-default)"
            allowDecimals={false}
          />
          <Tooltip
            content={(props: unknown) => {
              const p = props as { active?: boolean; payload?: Array<{ payload: BarPt }> };
              return <TooltipBody active={p.active} payload={p.payload} locale={locale} />;
            }}
            cursor={{ fill: 'rgba(201,168,76,0.06)' }}
          />
          <Bar dataKey="count" fill="var(--color-wine-red)" radius={[4, 4, 0, 0]} />
          {aggregate.systemPeakYear > 0 && (
            <ReferenceLine
              x={aggregate.systemPeakYear}
              stroke="var(--color-gold)"
              strokeDasharray="4 4"
              label={{
                value: locale === 'ko' ? '시스템' : 'System',
                fill: 'var(--color-gold)',
                fontSize: 9,
                position: 'top',
              }}
            />
          )}
          {aggregate.meanPeakYear > 0 && (
            <ReferenceLine
              x={Math.round(aggregate.meanPeakYear)}
              stroke="var(--color-wine-red-hover)"
              strokeWidth={2}
              label={{
                value: locale === 'ko' ? '평균' : 'Mean',
                fill: 'var(--color-wine-red-hover)',
                fontSize: 9,
                position: 'top',
              }}
            />
          )}
          {aggregate.medianPeakYear > 0 && (
            <ReferenceLine
              x={aggregate.medianPeakYear}
              stroke="var(--color-cream)"
              strokeDasharray="2 2"
              label={{
                value: locale === 'ko' ? '중앙값' : 'Median',
                fill: 'var(--color-cream)',
                fontSize: 9,
                position: 'top',
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
      {showLegend && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 8,
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            color: 'var(--color-text-muted)',
          }}
        >
          <LegendDot color="var(--color-gold)" dashed>
            {locale === 'ko' ? '시스템 추정' : 'System estimate'}
          </LegendDot>
          <LegendDot color="var(--color-wine-red-hover)">
            {locale === 'ko' ? '커뮤니티 평균' : 'Community mean'}
          </LegendDot>
          <LegendDot color="var(--color-cream)" dashed>
            {locale === 'ko' ? '중앙값' : 'Median'}
          </LegendDot>
        </div>
      )}
    </div>
  );
}

function LegendDot({
  color,
  dashed,
  children,
}: {
  color: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          width: 14,
          height: 2,
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 3px, transparent 3px 6px)`
            : color,
          display: 'inline-block',
        }}
      />
      <span>{children}</span>
    </span>
  );
}
