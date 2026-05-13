'use client';

import { PenLine, HelpCircle, BookOpen, Sparkles, Image } from 'lucide-react';
import type { CommunityPostType } from '@/types';

const TYPE_MAP: Record<
  CommunityPostType,
  { labelKo: string; labelEn: string; color: string; Icon: typeof PenLine }
> = {
  note:     { labelKo: '시음 노트',  labelEn: 'Tasting Note', color: '#C9A84C', Icon: PenLine   },
  question: { labelKo: '질문',       labelEn: 'Question',     color: '#a08ee0', Icon: HelpCircle },
  column:   { labelKo: '칼럼',       labelEn: 'Column',       color: '#F5F0E8', Icon: BookOpen   },
  news:     { labelKo: '소식',       labelEn: 'News',         color: '#5b9ce6', Icon: Sparkles   },
  album:    { labelKo: '사진 앨범',   labelEn: 'Album',        color: '#e8b4d2', Icon: Image      },
};

type Props = {
  type: CommunityPostType;
  locale?: 'ko' | 'en';
};

export function PostTypeBadge({ type, locale = 'ko' }: Props) {
  const spec = TYPE_MAP[type] ?? TYPE_MAP.note;
  const { Icon, color } = spec;
  const label = locale === 'en' ? spec.labelEn : spec.labelKo;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        borderRadius: 999,
        background: `${color}1a`,
        border: `1px solid ${color}55`,
        color,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      <Icon size={10} strokeWidth={2} />
      {label}
    </span>
  );
}
