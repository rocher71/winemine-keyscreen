'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useMockUser } from '@/hooks/use-mock-user';
import { useMyNoteForWine } from '@/hooks/use-merged-data';

type Props = {
  wineId: string;
};

/**
 * 내 노트가 없을 때만 렌더되는 "노트 작성" CTA 카드.
 * MyTastingNoteCard와 쌍을 이룸:
 *  - 노트 있음 → MyTastingNoteCard 노출, WriteNoteCta null
 *  - 노트 없음 → MyTastingNoteCard null, WriteNoteCta 노출
 */
export function WriteNoteCta({ wineId }: Props) {
  const { user } = useMockUser();
  const note = useMyNoteForWine(user.id, wineId);
  const router = useRouter();

  if (note) return null;

  return (
    <section
      style={{
        margin: '0 16px',
        padding: 16,
        borderRadius: 16,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* 와인잔 SVG 아이콘 */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          background: 'rgba(139,26,42,0.15)',
          border: '1px solid rgba(139,26,42,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--color-wine-red)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 3h8s0 6-4 8c-4-2-4-8-4-8z" />
          <path d="M12 11v9M9 20h6" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-cream)',
            marginBottom: 2,
          }}
        >
          아직 노트가 없어요
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
          }}
        >
          이 와인의 시음 경험을 기록해보세요
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          router.push(`/notes/new/write?from=newEntry&wineId=${encodeURIComponent(wineId)}` as Route)
        }
        style={{
          padding: '8px 14px',
          borderRadius: 999,
          background: 'var(--color-wine-red)',
          border: '1px solid rgba(201,168,76,0.4)',
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(139,26,42,0.35)',
        }}
      >
        노트 작성
      </button>
    </section>
  );
}
