'use client';

/**
 * Full World Map — /map 페이지 풀스크린 인터랙티브 지도.
 *
 * - ZoomableGroup: 마우스 휠 / 터치 핀치 줌 + 드래그 팬
 * - 줌 버튼 (+/-/리셋): 우하단 고정
 * - France (isoNumeric '250') 클릭 시 자동 줌인
 * - zoom ≥ 4 + 중심이 프랑스 범위: 부르고뉴 코뮌 마커 표시
 * - zoom ≥ 6.5 + 부르고뉴 범위: 코뮌 한글 라벨 + 꼬뜨 레이블 표시
 */

import { useCallback, useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import type { Wine } from '@/types';

const GEO_URL = '/world-110m.json';
const FRANCE_ISO = '250';
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const WORLD_CENTER: [number, number] = [10, 25];
const FRANCE_CENTER: [number, number] = [2.5, 46.8];
const FRANCE_ZOOM = 5;

/* ── 부르고뉴 주요 코뮌 [lon, lat] ────────────────────────────────────── */
const BURGUNDY_COMMUNES = [
  { id: 'chablis',   ko: '샤블리',        name: 'Chablis',           coords: [3.798, 47.815] as [number, number], type: 'white' },
  { id: 'gevrey',    ko: '주브레-샹베르탱', name: 'Gevrey-Chambertin', coords: [4.979, 47.225] as [number, number], type: 'red'   },
  { id: 'morey',     ko: '모레-생-드니',   name: 'Morey-Saint-Denis', coords: [4.966, 47.207] as [number, number], type: 'red'   },
  { id: 'chambolle', ko: '샹볼-뮈지니',   name: 'Chambolle-Musigny', coords: [4.949, 47.190] as [number, number], type: 'red'   },
  { id: 'vosne',     ko: '본-로마네',      name: 'Vosne-Romanée',    coords: [4.957, 47.163] as [number, number], type: 'red'   },
  { id: 'nsg',       ko: '뉘-생-조르주',   name: 'Nuits-Saint-Georges', coords: [4.958, 47.120] as [number, number], type: 'red' },
  { id: 'beaune',    ko: '본',            name: 'Beaune',            coords: [4.840, 47.020] as [number, number], type: 'both'  },
  { id: 'pommard',   ko: '포마르',         name: 'Pommard',           coords: [4.792, 46.994] as [number, number], type: 'red'   },
  { id: 'volnay',    ko: '볼네',          name: 'Volnay',            coords: [4.777, 46.976] as [number, number], type: 'red'   },
  { id: 'meursault', ko: '뫼르소',         name: 'Meursault',         coords: [4.769, 46.978] as [number, number], type: 'white' },
  { id: 'puligny',   ko: '퓔리니-몽라셰',  name: 'Puligny',           coords: [4.757, 46.949] as [number, number], type: 'white' },
] as const;

/* ── 꼬뜨 배경 라벨 ─────────────────────────────────────────────────── */
const COTE_LABELS = [
  { id: 'chablis', label: 'Chablis',        coords: [3.798, 48.04] as [number, number], color: 'rgba(201,168,76,0.75)' },
  { id: 'nuits',   label: 'Côte de Nuits',  coords: [5.06,  47.32] as [number, number], color: 'rgba(139,26,42,0.80)'  },
  { id: 'beaune',  label: 'Côte de Beaune', coords: [4.65,  47.00] as [number, number], color: 'rgba(139,26,42,0.65)'  },
] as const;

/* ── 헬퍼 ─────────────────────────────────────────────────────────── */
/** 빈 국가(시음 0병) 기본 fill — 테마 토큰 사용.
 *  다크: 와인 보라(#3A2440)  /  라이트: 더스티 라벤더(#C8B8D8). */
const EMPTY_LAND_FILL = 'var(--color-map-country)';

function fillForCount(count: number): string {
  if (count <= 0) return EMPTY_LAND_FILL;
  /* 1병 → 0.10, 10+병 → 1.0. 단계마다 ~0.10 증가해서 한눈에 대비. */
  const t = Math.min(1, 0.08 + (count - 1) * 0.103);
  return `rgba(139,26,42,${t.toFixed(2)})`;
}

function isFranceFocused(center: [number, number], zoom: number): boolean {
  return zoom >= 4 && center[0] > -6 && center[0] < 10 && center[1] > 42 && center[1] < 52;
}

function isBurgundyFocused(center: [number, number], zoom: number): boolean {
  return zoom >= 6.5 && center[0] > 2.5 && center[0] < 6.5 && center[1] > 45 && center[1] < 49;
}

/* ── 컴포넌트 ─────────────────────────────────────────────────────── */
type Props = {
  wines: Wine[];
  onCountrySelect: (isoNumeric: string) => void;
};

export default function FullWorldMap({ wines, onCountrySelect }: Props) {
  const [position, setPosition] = useState<{ zoom: number; center: [number, number] }>({
    zoom: 1,
    center: WORLD_CENTER,
  });

  /* 국가별 와인 수 */
  const wineCountByIso = useMemo(() => {
    const map = new Map<string, number>();
    wines.forEach((w) => { map.set(w.isoNumeric, (map.get(w.isoNumeric) ?? 0) + 1); });
    return map;
  }, [wines]);

  /* 부르고뉴 코뮌별 와인 수 — 좌표 근접 클러스터링 */
  const burgundyCountByCommune = useMemo(() => {
    const frenchWines = wines.filter((w) => w.isoNumeric === FRANCE_ISO);
    const map = new Map<string, number>();
    BURGUNDY_COMMUNES.forEach((commune) => {
      const count = frenchWines.filter((w) => {
        const dLon = Math.abs(w.coords[0] - commune.coords[0]);
        const dLat = Math.abs(w.coords[1] - commune.coords[1]);
        return dLon < 0.09 && dLat < 0.07;
      }).length;
      if (count > 0) map.set(commune.id, count);
    });
    return map;
  }, [wines]);

  /* ZoomableGroup 콜백 */
  const handleMoveEnd = useCallback(
    ({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => {
      setPosition({ zoom, center: coordinates });
    },
    [],
  );

  /* 줌 버튼 */
  const zoomIn  = useCallback(() => setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.6, MAX_ZOOM) })), []);
  const zoomOut = useCallback(() => setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.6, MIN_ZOOM) })), []);
  const reset   = useCallback(() => setPosition({ zoom: 1, center: WORLD_CENTER }), []);

  /* 국가 클릭 */
  const handleCountryClick = useCallback(
    (iso: string) => {
      if (iso === FRANCE_ISO) {
        setPosition({ zoom: FRANCE_ZOOM, center: FRANCE_CENTER });
      }
      onCountrySelect(iso);
    },
    [onCountrySelect],
  );

  const cs            = 1 / Math.pow(position.zoom, 0.6); // counter-scale: 줌해도 마커 너무 작아지지 않게
  const franceFocused = isFranceFocused(position.center, position.zoom);
  const burgFocused   = isBurgundyFocused(position.center, position.zoom);
  const isZoomed      = position.zoom > 1.25;

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    background: 'var(--color-glass-bg-strong)',
    border: '1px solid rgba(45,21,64,0.9)',
    borderRadius: 9,
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'opacity 150ms',
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 90, center: WORLD_CENTER }}
        width={390}
        height={520}
        style={{ width: '100%', height: '100%', background: 'var(--color-map-ocean)' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.center}
          onMoveEnd={handleMoveEnd}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
          {/* 세계 지도 국가 */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso       = String(geo.id).padStart(3, '0');
                /* 남극(010) — 와인 산지가 아니므로 바다 색으로 숨김 */
                const isAntarctica = iso === '010';
                const count     = wineCountByIso.get(iso) ?? 0;
                const isFrance  = iso === FRANCE_ISO;
                const fill      = isAntarctica
                  ? 'var(--color-map-ocean)'
                  : isFrance && franceFocused
                  ? 'rgba(139,26,42,0.18)'
                  : fillForCount(count);
                const clickable = !isAntarctica && (count > 0 || isFrance);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => { if (clickable) handleCountryClick(iso); }}
                    style={{
                      default: {
                        fill,
                        stroke: isAntarctica ? 'transparent' : 'rgba(245,240,232,0.18)',
                        strokeWidth: 0.45,
                        outline: 'none',
                        cursor: clickable ? 'pointer' : 'default',
                      },
                      hover: {
                        fill: clickable
                          ? (isFrance ? 'rgba(139,26,42,0.38)' : 'rgba(139,26,42,1)')
                          : fill,
                        stroke: 'rgba(201,168,76,0.55)',
                        strokeWidth: 0.55,
                        outline: 'none',
                      },
                      pressed: { fill: 'rgba(139,26,42,0.8)', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* 전역 와인 핀 — 프랑스 줌 시 프랑스 와인은 코뮌 마커로 대체 */}
          {wines
            .filter((w) => !franceFocused || w.isoNumeric !== FRANCE_ISO)
            .map((w) => (
              <Marker
                key={w.id}
                coordinates={w.coords}
                onClick={() => handleCountryClick(w.isoNumeric)}
              >
                <circle
                  r={3 * cs}
                  fill="#C9A84C"
                  stroke="#1B1126"
                  strokeWidth={1 * cs}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}

          {/* 부르고뉴 코뮌 마커 (프랑스 줌 시) */}
          {franceFocused &&
            BURGUNDY_COMMUNES.map((commune) => {
              const count    = burgundyCountByCommune.get(commune.id) ?? 0;
              const hasWines = count > 0;
              const pinColor =
                commune.type === 'white'
                  ? (hasWines ? '#C9A84C' : 'rgba(201,168,76,0.22)')
                  : commune.type === 'both'
                  ? (hasWines ? '#A0405A' : 'rgba(160,64,90,0.22)')
                  : (hasWines ? '#8B1A2A' : 'rgba(139,26,42,0.22)');
              return (
                <Marker key={commune.id} coordinates={commune.coords}>
                  {/* 핀 */}
                  <circle
                    r={(hasWines ? 4.2 : 2.8) * cs}
                    fill={pinColor}
                    stroke={hasWines ? 'rgba(245,240,232,0.45)' : 'rgba(201,168,76,0.18)'}
                    strokeWidth={0.7 * cs}
                    style={{ cursor: hasWines ? 'pointer' : 'default' }}
                  />

                  {/* 와인 수 뱃지 */}
                  {hasWines && (
                    <>
                      <circle
                        cx={5 * cs}
                        cy={-5 * cs}
                        r={3.4 * cs}
                        fill="#C9A84C"
                        stroke="#1B1126"
                        strokeWidth={0.5 * cs}
                      />
                      <text
                        x={5 * cs}
                        y={-3.6 * cs}
                        textAnchor="middle"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: `${4.2 * cs}px`,
                          fontWeight: 700,
                          fill: '#1B1126',
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}
                      >
                        {count}
                      </text>
                    </>
                  )}

                  {/* 코뮌 한글 라벨 (충분히 줌됐을 때만) */}
                  {burgFocused && (
                    <text
                      x={6.5 * cs}
                      y={1.8 * cs}
                      textAnchor="start"
                      style={{
                        fontFamily: 'Inter, "Noto Sans KR", sans-serif',
                        fontSize: `${7 * cs}px`,
                        fill: hasWines ? 'rgba(245,240,232,0.92)' : 'rgba(245,240,232,0.38)',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {commune.ko}
                    </text>
                  )}
                </Marker>
              );
            })}

          {/* 꼬뜨 라벨 (부르고뉴 줌 시) */}
          {burgFocused &&
            COTE_LABELS.map((cote) => (
              <Marker key={cote.id} coordinates={cote.coords}>
                <text
                  textAnchor="middle"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: `${9.5 * cs}px`,
                    fill: cote.color,
                    letterSpacing: '0.04em',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {cote.label}
                </text>
              </Marker>
            ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* ── 줌 컨트롤 (우하단, BottomNav 83px 위) ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 96,
          right: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          zIndex: 15,
        }}
      >
        {isZoomed && (
          <button type="button" onClick={reset} style={btnBase} title="세계 지도로 돌아가기">
            <RotateCcw size={14} strokeWidth={2} />
          </button>
        )}
        <button
          type="button"
          onClick={zoomIn}
          style={{ ...btnBase, opacity: position.zoom >= MAX_ZOOM ? 0.35 : 1 }}
          disabled={position.zoom >= MAX_ZOOM}
          title="확대"
        >
          <Plus size={17} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          style={{ ...btnBase, opacity: position.zoom <= MIN_ZOOM ? 0.35 : 1 }}
          disabled={position.zoom <= MIN_ZOOM}
          title="축소"
        >
          <Minus size={17} strokeWidth={2} />
        </button>
      </div>

      {/* ── 지역 라벨 (좌상단) ─────────────────────────────────────── */}
      {franceFocused && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: '4px 10px',
            background: 'var(--color-glass-bg)',
            border: '1px solid rgba(45,21,64,0.85)',
            borderRadius: 8,
            color: burgFocused ? 'rgba(139,26,42,0.95)' : 'rgba(201,168,76,0.9)',
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 10,
            letterSpacing: '0.01em',
          }}
        >
          {burgFocused ? 'Bourgogne' : 'France'}
        </div>
      )}
    </div>
  );
}
