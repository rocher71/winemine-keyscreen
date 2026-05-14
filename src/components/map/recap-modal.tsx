'use client';

/**
 * RecapModal — Flighty Passport 스타일의 와인 시음 리캡 카드.
 *
 * - 풀스크린 backdrop + 중앙 패스포트 카드
 * - 마신 와인 수 / 국가 / 지역 / 탑 품종 통계
 * - 미니 세계지도(시음 국가 와인색 강조)
 * - 국기 row, MRZ-style decoration
 * - "이미지 저장" → html-to-image PNG export
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { toPng } from 'html-to-image';
import type { Wine, TastingNote, User } from '@/types';
import { toast } from '@/hooks/use-toast';

const GEO_URL = '/world-110m.json';

type RecapStats = {
  totalBottles: number;
  uniqueWines: number;
  countries: number;
  regions: number;
  topGrape: string;
  topRegion: string;
  highestRating: number | null;
  avgRating: number | null;
  redCount: number;
  whiteCount: number;
  otherCount: number;
  isoSet: Set<string>;
  countryFlags: string[];
};

function isoNumericToAlpha2(iso: string): string | null {
  /* 자주 등장하는 와인 산지 → ISO Alpha-2. */
  const map: Record<string, string> = {
    '250': 'FR', '380': 'IT', '724': 'ES', '276': 'DE', '040': 'AT',
    '620': 'PT', '300': 'GR', '348': 'HU', '203': 'CZ', '840': 'US',
    '124': 'CA', '152': 'CL', '032': 'AR', '858': 'UY', '076': 'BR',
    '036': 'AU', '554': 'NZ', '710': 'ZA', '410': 'KR', '392': 'JP',
    '156': 'CN', '643': 'RU', '703': 'SK', '705': 'SI', '191': 'HR',
    '498': 'MD', '826': 'GB', '528': 'NL', '756': 'CH', '792': 'TR',
    '422': 'LB', '376': 'IL',
  };
  return map[iso] ?? null;
}

function alpha2ToFlag(alpha2: string): string {
  return alpha2
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1a5 + c.charCodeAt(0)))
    .join('');
}

function computeStats(notes: TastingNote[], winesById: Map<string, Wine>): RecapStats {
  const wineIds = new Set(notes.map((n) => n.wineId));
  const countries = new Set<string>();
  const regions = new Set<string>();
  const grapeCount = new Map<string, number>();
  const regionCount = new Map<string, number>();
  const isoSet = new Set<string>();
  let red = 0, white = 0, other = 0;

  for (const id of wineIds) {
    const w = winesById.get(id);
    if (!w) continue;
    countries.add(w.country.en);
    regions.add(`${w.country.en}/${w.region.en}`);
    isoSet.add(w.isoNumeric);
    if (w.wineType === 'red') red++;
    else if (w.wineType === 'white') white++;
    else other++;
    for (const g of w.grapes) {
      grapeCount.set(g.ko, (grapeCount.get(g.ko) ?? 0) + 1);
    }
    regionCount.set(w.region.ko, (regionCount.get(w.region.ko) ?? 0) + 1);
  }

  const ratings: number[] = [];
  for (const n of notes) {
    const r = n.expertFields?.rating ?? (n.beginnerFields?.rating != null ? n.beginnerFields.rating * 20 : null);
    if (r != null) ratings.push(r);
  }

  const topGrape = [...grapeCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const topRegion = [...regionCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const countryFlags = [...isoSet]
    .map(isoNumericToAlpha2)
    .filter((x): x is string => x != null)
    .slice(0, 8)
    .map(alpha2ToFlag);

  return {
    totalBottles: notes.length,
    uniqueWines: wineIds.size,
    countries: countries.size,
    regions: regions.size,
    topGrape,
    topRegion,
    highestRating: ratings.length ? Math.max(...ratings) : null,
    avgRating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
    redCount: red,
    whiteCount: white,
    otherCount: other,
    isoSet,
    countryFlags,
  };
}

export function RecapModal({
  open,
  onClose,
  user,
  notes,
  wines,
}: {
  open: boolean;
  onClose: () => void;
  user: User;
  notes: TastingNote[];
  wines: Wine[];
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [exporting, setExporting] = useState(false);

  const winesById = useMemo(() => new Map(wines.map((w) => [w.id, w])), [wines]);
  const stats = useMemo(() => computeStats(notes, winesById), [notes, winesById]);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  if (!open) return null;

  const year = new Date().getFullYear();
  const memberSince = user.joinedAt.slice(0, 10).replace(/-/g, '.');
  const displayName = user.displayName.ko || user.displayName.en;
  const nameUpper = (user.displayName.en || user.displayName.ko).toUpperCase().replace(/\s+/g, '<');

  async function handleExport() {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#1a0a1e',
      });
      const link = document.createElement('a');
      link.download = `winemine-recap-${year}.png`;
      link.href = dataUrl;
      link.click();
      toast({ message: '이미지를 저장했어요' });
    } catch {
      toast({ message: '이미지 저장에 실패했어요' });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(5, 2, 10, 0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
        paddingBottom: 16,
        overflowY: 'auto',
      }}
    >
      {/* 상단 닫기 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--color-cream)',
          zIndex: 1,
        }}
      >
        <X size={16} />
      </button>

      {/* Passport card */}
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 340,
          borderRadius: 18,
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #2D1540 0%, #5b1424 40%, #8B1A2A 75%, #1A0A1E 100%)',
          border: '1px solid rgba(201,168,76,0.4)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          color: 'var(--color-cream)',
          position: 'relative',
        }}
      >
        {/* 반복 패턴 워터마크 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            background: `repeating-linear-gradient(45deg, transparent 0 14px, rgba(245,240,232,0.6) 14px 15px)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── 상단: 미니 세계지도 ── */}
        <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(15,7,24,0.6), rgba(45,21,64,0.2))' }}>
          {/* "winemine" 반복 텍스트 패턴 */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 0,
              right: 0,
              fontFamily: 'var(--font-playfair)',
              fontSize: 11,
              color: 'rgba(201,168,76,0.45)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            · winemine · winemine · winemine · winemine ·
          </div>

          <ComposableMap
            projectionConfig={{ scale: 75, center: [10, 30] }}
            width={340}
            height={180}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso = String(geo.id).padStart(3, '0');
                  const isAntarctica = iso === '010';
                  if (isAntarctica) return null;
                  const visited = stats.isoSet.has(iso);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: visited ? '#C9A84C' : '#3D2456',
                          stroke: visited ? '#F5F0E8' : 'rgba(245,240,232,0.22)',
                          strokeWidth: visited ? 0.6 : 0.3,
                          outline: 'none',
                        },
                        hover: { fill: visited ? '#C9A84C' : '#46295F', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* 국기 행 */}
          {stats.countryFlags.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                fontSize: 18,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
              }}
            >
              {stats.countryFlags.map((f, i) => (
                <span key={i}>{f}</span>
              ))}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div style={{ height: 1, background: 'rgba(201,168,76,0.35)' }} />

        {/* ── 본문 ── */}
        <div style={{ padding: '16px 20px 14px', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#F5F0E8',
            }}
          >
            {year} winemine PASSPORT
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'rgba(245,240,232,0.55)',
              marginTop: 4,
              textTransform: 'uppercase',
            }}
          >
            PASSPORT · PASS · パスポート
          </div>

          {/* Big stat + meta */}
          <div style={{ display: 'flex', gap: 14, marginTop: 14, alignItems: 'flex-end' }}>
            <div style={{ flex: '0 0 auto' }}>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 52,
                  fontWeight: 700,
                  lineHeight: 0.95,
                  color: '#F5F0E8',
                  letterSpacing: '-0.03em',
                }}
              >
                {stats.totalBottles}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 18,
                  color: '#F5F0E8',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                bottles
              </div>
            </div>

            <div style={{ flex: 1, fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(245,240,232,0.85)', lineHeight: 1.5 }}>
              <PassportMetaRow label="Holder"        value={displayName} />
              <PassportMetaRow label="Top Region"    value={stats.topRegion} />
              <PassportMetaRow label="Top Grape"     value={stats.topGrape} />
              <PassportMetaRow label="Member Since"  value={memberSince} />
            </div>
          </div>

          {/* Bottom stat grid */}
          <div
            style={{
              marginTop: 16,
              padding: '12px 0 4px',
              borderTop: '1px dashed rgba(201,168,76,0.35)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
            }}
          >
            <StatCell label="Wines"       value={String(stats.uniqueWines)} />
            <StatCell label="Countries"   value={String(stats.countries)} />
            <StatCell label="Regions"     value={String(stats.regions)} />
            <StatCell label="Top Score"   value={stats.highestRating != null ? `${Math.round(stats.highestRating)}` : '—'} />
          </div>

          {/* 와인 타입 비율 바 */}
          <TypeBar red={stats.redCount} white={stats.whiteCount} other={stats.otherCount} />

          {/* MRZ-style 하단 라인 */}
          <div
            style={{
              marginTop: 14,
              padding: '8px 10px',
              borderTop: '1px solid rgba(201,168,76,0.35)',
              borderBottom: '1px solid rgba(201,168,76,0.35)',
              fontFamily: 'monospace',
              fontSize: 9,
              color: 'rgba(245,240,232,0.7)',
              letterSpacing: '0.02em',
              wordBreak: 'break-all',
              lineHeight: 1.5,
            }}
          >
            <div>{year}&lt;&lt;{nameUpper}&lt;&lt;MEMBER{memberSince.replace(/\./g, '')}&lt;&lt;@WINEMINE&lt;&lt;&lt;</div>
            <div>WINES{String(stats.uniqueWines).padStart(3, '0')}&lt;COUNTRIES{String(stats.countries).padStart(2, '0')}&lt;&lt;WINEMINE.APP&lt;</div>
          </div>
        </div>
      </div>

      {/* Action 버튼 */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          gap: 10,
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 12,
            background: '#C9A84C',
            border: '1px solid #C9A84C',
            color: '#1A0A1E',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 700,
            cursor: exporting ? 'wait' : 'pointer',
            opacity: exporting ? 0.7 : 1,
          }}
        >
          <Download size={14} strokeWidth={2.4} />
          {exporting ? '저장 중…' : '이미지 저장'}
        </button>
        <button
          type="button"
          onClick={() => toast({ message: '공유 시트는 곧 지원돼요' })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 12,
            background: 'transparent',
            border: '1px solid rgba(245,240,232,0.3)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Share2 size={14} strokeWidth={2.2} />
          공유
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── 보조 컴포넌트 ─────────────────────────── */

function PassportMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
      <span style={{ color: 'rgba(245,240,232,0.55)', minWidth: 72, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span
        style={{
          color: '#F5F0E8',
          fontWeight: 600,
          fontSize: 11,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'left' }}>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 9,
          letterSpacing: '0.08em',
          color: 'rgba(245,240,232,0.6)',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 22,
          color: '#F5F0E8',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TypeBar({ red, white, other }: { red: number; white: number; other: number }) {
  const total = red + white + other;
  if (total === 0) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          display: 'flex',
          height: 6,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'rgba(245,240,232,0.1)',
        }}
      >
        {red > 0   && <div style={{ width: `${(red   / total) * 100}%`, background: '#8B1A2A' }} />}
        {white > 0 && <div style={{ width: `${(white / total) * 100}%`, background: '#E8D89B' }} />}
        {other > 0 && <div style={{ width: `${(other / total) * 100}%`, background: '#C9A84C' }} />}
      </div>
      <div
        style={{
          marginTop: 5,
          fontFamily: 'var(--font-inter)',
          fontSize: 9,
          color: 'rgba(245,240,232,0.65)',
          display: 'flex',
          gap: 10,
        }}
      >
        <span><span style={{ display: 'inline-block', width: 6, height: 6, background: '#8B1A2A', borderRadius: 99, marginRight: 4 }} />레드 {red}</span>
        <span><span style={{ display: 'inline-block', width: 6, height: 6, background: '#E8D89B', borderRadius: 99, marginRight: 4 }} />화이트 {white}</span>
        {other > 0 && (
          <span><span style={{ display: 'inline-block', width: 6, height: 6, background: '#C9A84C', borderRadius: 99, marginRight: 4 }} />기타 {other}</span>
        )}
      </div>
    </div>
  );
}
