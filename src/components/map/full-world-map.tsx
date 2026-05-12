'use client';

/**
 * Full World Map — /map 페이지 풀스크린 지도.
 *
 * react-simple-maps + topojson world-110m.
 * 마신 와인 있는 국가는 Wine Red graduated fill.
 * 핀 클릭 시 onCountrySelect 콜백 — 부모(/map page)가 BottomSheet 오픈.
 *
 * SSR 불가 — 부모에서 dynamic(() => import('@/components/map/full-world-map'), { ssr: false })로 마운트.
 */

import { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import type { Wine } from '@/types';

type Props = {
  wines: Wine[];
  onCountrySelect: (isoNumeric: string) => void;
};

const GEO_URL = '/world-110m.json';

function fillForCount(count: number): string {
  if (count <= 0) return '#1A0A1E';
  // 1 bottle: 0.3 → 5+ bottles: 1.0 opacity (mix with deeper red)
  const t = Math.min(1, 0.3 + (count - 1) * 0.15);
  // Wine Red #8B1A2A with t opacity over Map Dark #1A0A1E
  return `rgba(139,26,42,${t.toFixed(2)})`;
}

export default function FullWorldMap({ wines, onCountrySelect }: Props) {
  const wineCountByIso = useMemo(() => {
    const map = new Map<string, number>();
    wines.forEach((w) => {
      map.set(w.isoNumeric, (map.get(w.isoNumeric) ?? 0) + 1);
    });
    return map;
  }, [wines]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 90, center: [10, 25] }}
        width={390}
        height={520}
        style={{ width: '100%', height: '100%', background: 'var(--color-bg-map)' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const iso = String(geo.id).padStart(3, '0');
              const count = wineCountByIso.get(iso) ?? 0;
              const fill = fillForCount(count);
              const interactive = count > 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (interactive) onCountrySelect(iso);
                  }}
                  style={{
                    default: {
                      fill,
                      stroke: 'rgba(45,21,64,0.6)',
                      strokeWidth: 0.4,
                      outline: 'none',
                      cursor: interactive ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: interactive ? 'rgba(139,26,42,1)' : fill,
                      stroke: 'rgba(201,168,76,0.6)',
                      strokeWidth: 0.6,
                      outline: 'none',
                    },
                    pressed: {
                      fill: 'rgba(139,26,42,1)',
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Wine pins */}
        {wines.map((w) => (
          <Marker
            key={w.id}
            coordinates={w.coords}
            onClick={() => onCountrySelect(w.isoNumeric)}
          >
            <circle
              r={3}
              fill="#C9A84C"
              stroke="#05020A"
              strokeWidth={1}
              style={{ cursor: 'pointer' }}
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
