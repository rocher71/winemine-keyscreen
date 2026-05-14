'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { LocaleText } from '@/components/shared/locale-text';
import { useLocale } from '@/context/locale-context';
import { useTastingTemplates } from '@/context/tasting-template-context';
import { getCommunityTemplatesSorted } from '@/lib/mock/tasting-templates';
import { toast } from '@/hooks/use-toast';

/**
 * /community/templates — 커뮤니티 양식 전용 라우트.
 * /community 탭과 같은 풀을 보여주지만 설정에서 진입할 때 single-purpose 페이지.
 */
export default function CommunityTemplatesPage() {
  const { locale } = useLocale();
  const [sort, setSort] = useState<'popular' | 'latest'>('popular');
  const { isSaved, saveTemplate, unsaveTemplate } = useTastingTemplates();

  return (
    <>
      <BackHeader title={{ ko: '커뮤니티 양식', en: 'Community templates' }} />
      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
        <p
          style={{
            margin: '8px 20px 14px',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            lineHeight: 1.55,
          }}
        >
          {locale === 'en'
            ? 'Save a template — it will appear in your note picker.'
            : '양식을 저장하면 노트 작성 화면 picker에 등장해요.'}
        </p>

        <div style={{ padding: '0 20px 10px', display: 'flex', gap: 6 }}>
          {(['popular', 'latest'] as const).map((s) => {
            const active = s === sort;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: active ? 'var(--color-wine-red)' : 'transparent',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border-default)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {s === 'popular'
                  ? locale === 'en'
                    ? 'Popular'
                    : '인기순'
                  : locale === 'en'
                    ? 'Latest'
                    : '최신순'}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {getCommunityTemplatesSorted(sort).map((tpl) => {
            const saved = isSaved(tpl.id);
            return (
              <div
                key={tpl.id}
                style={{
                  padding: 14,
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 15,
                        color: 'var(--color-cream)',
                        lineHeight: 1.3,
                      }}
                    >
                      <LocaleText value={tpl.title} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      {locale === 'en' ? 'by ' : 'by '}
                      <LocaleText value={tpl.authorName ?? { ko: '', en: '' }} />
                      {' · '}
                      {tpl.fields.length} {locale === 'en' ? 'fields' : '필드'}
                      {' · '}
                      {tpl.savesCount} {locale === 'en' ? 'saves' : '저장'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (saved) {
                        unsaveTemplate(tpl.id);
                        toast({ message: { ko: '저장 해제됐어요', en: 'Removed from saved' } });
                      } else {
                        saveTemplate(tpl.id);
                        toast({
                          message: {
                            ko: '이제 이 양식으로도 노트를 쓸 수 있어요',
                            en: 'You can now write notes with this template',
                          },
                        });
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: saved ? 'rgba(201,168,76,0.18)' : 'transparent',
                      border: `1px solid ${saved ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
                      color: saved ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Bookmark size={12} strokeWidth={1.75} fill={saved ? 'var(--color-gold)' : 'none'} />
                    {saved
                      ? locale === 'en'
                        ? 'Saved'
                        : '저장됨'
                      : locale === 'en'
                        ? 'Save'
                        : '저장'}
                  </button>
                </div>
                {tpl.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.55,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    <LocaleText value={tpl.description} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
