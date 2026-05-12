'use client';

import { Lock, Plus } from 'lucide-react';
import { useAppMode } from '@/context/app-mode-context';
import { LocaleText } from '@/components/shared/locale-text';
import { toast } from '@/hooks/use-toast';
import { getMockUser } from '@/lib/mock/users';

type Props = {
  wineId: string;
};

/**
 * "내 추정 추가" — 하단 고정 CTA.
 * L3 미만(level < 3) 사용자: disabled + 안내 카피.
 */
export function AddMyEstimateCta({ wineId }: Props) {
  void wineId;
  const { demoMode } = useAppMode();
  const user = getMockUser(demoMode);
  const allowed = user.levelId >= 3;

  const handleClick = () => {
    if (!allowed) {
      toast({
        message: {
          ko: 'L3 Connoisseur부터 추정 입력 가능',
          en: 'Available from L3 Connoisseur',
        },
      });
      return;
    }
    // 시안 mock — 노트 작성 흐름으로 이동 placeholder
    toast({
      variant: 'xp',
      xp: 20,
      message: {
        ko: '전문가 노트에서 추정을 입력하면 분포에 즉시 반영돼요',
        en: 'Add your estimate in an expert note — it appears here instantly',
      },
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        padding: '0 16px',
        zIndex: 5,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-disabled={!allowed}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          height: 52,
          borderRadius: 14,
          background: allowed ? 'var(--color-wine-red)' : 'var(--color-text-disabled)',
          color: 'var(--color-cream)',
          border: 'none',
          fontFamily: 'var(--font-inter)',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          opacity: allowed ? 1 : 0.85,
          boxShadow: allowed ? '0 6px 18px rgba(139, 26, 42, 0.45)' : 'none',
        }}
      >
        {allowed ? <Plus size={18} strokeWidth={2} /> : <Lock size={16} strokeWidth={2} />}
        {allowed ? (
          <LocaleText value={{ ko: '내 추정 추가', en: 'Add my estimate' }} />
        ) : (
          <LocaleText
            value={{
              ko: 'L3 Connoisseur부터 추정 입력 가능',
              en: 'Available from L3 Connoisseur',
            }}
          />
        )}
      </button>
    </div>
  );
}
