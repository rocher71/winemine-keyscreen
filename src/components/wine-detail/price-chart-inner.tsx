'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useLocale } from '@/context/locale-context';
import { getStore } from '@/lib/mock/stores';
import { getUserById } from '@/lib/mock/users';
import { getLevel } from '@/lib/mock/levels';
import type { Purchase, LocalizedString } from '@/types';

type ChartPoint = {
  ts: number;
  priceKrw: number;
  storeId: string;
  purchasedAt: string;
  userId: string;
};

type Props = {
  purchases: Purchase[];
  height?: number;
  showAvgLine?: boolean;
};

function formatMonth(ts: number, locale: 'ko' | 'en'): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return locale === 'ko' ? `${String(y).slice(2)}.${m}` : `${m}/${String(y).slice(2)}`;
}

function formatPrice(value: number): string {
  if (value >= 1_000_000) return `₩${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₩${Math.round(value / 1_000)}k`;
  return `₩${value}`;
}

/**
 * Reviewer 익명화 라벨 — 닉네임 X, "Lv·뱃지만" 정책.
 */
function anonReviewer(userId: string, locale: 'ko' | 'en'): string {
  const u = getUserById(userId);
  // me-heavy/me-first가 본인이면 "나" 표시
  if (userId === 'me-heavy' || userId === 'me-first') {
    return locale === 'ko' ? '내 등록' : 'My entry';
  }
  const lvl = u?.levelId ?? 2;
  const lvlName = getLevel(lvl).name[locale];
  return locale === 'ko' ? `L${lvl} ${lvlName}` : `L${lvl} ${lvlName}`;
}

type TooltipInner = {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  locale: 'ko' | 'en';
};

function CustomTooltip({ active, payload, locale }: TooltipInner) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  const store = getStore(p.storeId);
  const storeName: LocalizedString = store?.name ?? { ko: '매장', en: 'Store' };
  const branch = store?.branch;
  const dateLabel = p.purchasedAt;

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
        maxWidth: 240,
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--color-gold)' }}>
        ₩{p.priceKrw.toLocaleString()}
      </div>
      <div style={{ color: 'var(--color-text-secondary)', marginTop: 2 }}>
        {storeName[locale]}
        {branch ? ` · ${branch[locale]}` : ''}
      </div>
      <div style={{ color: 'var(--color-text-muted)', marginTop: 2 }}>
        {dateLabel} · {anonReviewer(p.userId, locale)}
      </div>
    </div>
  );
}

export default function PriceChartInner({
  purchases,
  height = 200,
  showAvgLine = true,
}: Props) {
  const { locale } = useLocale();

  const sorted = [...purchases].sort(
    (a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime(),
  );

  const data: ChartPoint[] = sorted.map((p) => ({
    ts: new Date(p.purchasedAt).getTime(),
    priceKrw: p.priceKrw,
    storeId: p.storeId,
    purchasedAt: p.purchasedAt,
    userId: p.userId,
  }));

  const avg =
    data.length > 0 ? data.reduce((sum, d) => sum + d.priceKrw, 0) / data.length : 0;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border-default)"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="ts"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(v: number) => formatMonth(v, locale)}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          stroke="var(--color-border-default)"
        />
        <YAxis
          tickFormatter={formatPrice}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          stroke="var(--color-border-default)"
          width={56}
        />
        <Tooltip
          content={(props: unknown) => {
            const p = props as { active?: boolean; payload?: Array<{ payload: ChartPoint }> };
            return <CustomTooltip active={p.active} payload={p.payload} locale={locale} />;
          }}
          cursor={{ stroke: 'var(--color-gold)', strokeDasharray: '4 4' }}
        />
        {showAvgLine && avg > 0 && (
          <ReferenceLine
            y={avg}
            stroke="var(--color-gold)"
            strokeDasharray="4 4"
            label={{
              value: locale === 'ko' ? '평균' : 'Avg',
              fill: 'var(--color-gold)',
              fontSize: 10,
              position: 'insideTopRight',
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="priceKrw"
          stroke="var(--color-wine-red)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-gold)', stroke: 'var(--color-gold)', r: 4 }}
          activeDot={{ fill: 'var(--color-gold)', r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
