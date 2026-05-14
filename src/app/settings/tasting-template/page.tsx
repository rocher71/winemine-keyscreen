'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Plus, ChevronRight, Pencil, Trash2, Globe, Bookmark } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { LocaleText } from '@/components/shared/locale-text';
import { useLocale } from '@/context/locale-context';
import { useTastingTemplates } from '@/context/tasting-template-context';
import {
  BUILTIN_BEGINNER,
  BUILTIN_EXPERT,
  COMMUNITY_TEMPLATES,
} from '@/lib/mock/tasting-templates';

/**
 * /settings/tasting-template
 *
 * 4 섹션:
 *  1. winemine 제공 (builtin 2종 — read-only)
 *  2. 내가 만든 양식 (my custom — 편집/삭제)
 *  3. 저장한 커뮤니티 양식 (saved — 저장 해제)
 *  4. + 새 양식 만들기
 */
export default function TastingTemplateSettingsPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const { myCustomTemplates, savedTemplateIds, unsaveTemplate, deleteCustomTemplate } =
    useTastingTemplates();

  const savedFromCommunity = COMMUNITY_TEMPLATES.filter((t) =>
    savedTemplateIds.includes(t.id),
  );

  return (
    <>
      <BackHeader title={{ ko: '테이스팅 노트 양식', en: 'Tasting templates' }} />
      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
        <p
          style={{
            margin: '8px 20px 18px',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            lineHeight: 1.55,
          }}
        >
          {locale === 'en'
            ? 'Edit the structure of your tasting notes. Add fields, remove what you do not use, or create your own template and share it.'
            : '내가 기록할 필드를 자유롭게 추가·삭제·재배열하세요. 직접 만든 양식은 커뮤니티에 공유할 수도 있어요.'}
        </p>

        <SectionLabel>
          {locale === 'en' ? 'Provided by winemine' : 'winemine 제공'}
        </SectionLabel>
        <BuiltinRow template={BUILTIN_BEGINNER} locale={locale} />
        <BuiltinRow template={BUILTIN_EXPERT} locale={locale} />

        <SectionLabel>
          {locale === 'en' ? 'My templates' : '내가 만든 양식'}
        </SectionLabel>
        {myCustomTemplates.length === 0 ? (
          <EmptyHint
            text={
              locale === 'en'
                ? 'No custom templates yet. Tap below to create one.'
                : '아직 만든 양식이 없어요. 아래 버튼으로 새로 만들어보세요.'
            }
          />
        ) : (
          myCustomTemplates.map((t) => (
            <div
              key={t.id}
              style={{
                margin: '6px 16px',
                padding: '12px 14px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 12,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 13,
                      color: 'var(--color-cream)',
                      fontWeight: 600,
                    }}
                  >
                    <LocaleText value={t.title} />
                  </span>
                  {t.isPublic && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 9,
                        color: 'var(--color-gold)',
                        background: 'rgba(201,168,76,0.12)',
                        padding: '2px 6px',
                        borderRadius: 999,
                      }}
                    >
                      <Globe size={9} />
                      {locale === 'en' ? 'Public' : '공개'}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    marginTop: 2,
                  }}
                >
                  {t.fields.length} {locale === 'en' ? 'fields' : '필드'}
                  {t.savesCount > 0 && (
                    <>
                      {' · '}
                      {t.savesCount} {locale === 'en' ? 'saves' : '저장'}
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/settings/tasting-template/${t.id}/edit` as Route)}
                aria-label="Edit"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'inline-flex',
                  color: 'var(--color-gold)',
                }}
              >
                <Pencil size={14} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      locale === 'en'
                        ? 'Delete this template?'
                        : '이 양식을 삭제할까요?',
                    )
                  ) {
                    deleteCustomTemplate(t.id);
                  }
                }}
                aria-label="Delete"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'inline-flex',
                  color: 'var(--color-text-muted)',
                }}
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
          ))
        )}

        <div style={{ margin: '12px 16px' }}>
          <Link
            href={'/settings/tasting-template/new' as Route}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px dashed var(--color-gold)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Plus size={16} strokeWidth={2} />
            {locale === 'en' ? 'Create new template' : '새 양식 만들기'}
          </Link>
        </div>

        <SectionLabel>
          {locale === 'en' ? 'Saved from community' : '커뮤니티에서 저장한 양식'}
        </SectionLabel>
        {savedFromCommunity.length === 0 ? (
          <EmptyHint
            text={
              locale === 'en'
                ? 'Browse community templates and save the ones you like.'
                : '커뮤니티 탭에서 마음에 드는 양식을 저장하면 여기 보여요.'
            }
          />
        ) : (
          savedFromCommunity.map((t) => (
            <div
              key={t.id}
              style={{
                margin: '6px 16px',
                padding: '12px 14px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 12,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    color: 'var(--color-cream)',
                    fontWeight: 600,
                  }}
                >
                  <LocaleText value={t.title} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    marginTop: 2,
                  }}
                >
                  {locale === 'en' ? 'by ' : 'by '}
                  <LocaleText value={t.authorName ?? { ko: '', en: '' }} />
                  {' · '}
                  {t.fields.length} {locale === 'en' ? 'fields' : '필드'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => unsaveTemplate(t.id)}
                aria-label="Unsave"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'inline-flex',
                  color: 'var(--color-gold)',
                }}
              >
                <Bookmark size={14} strokeWidth={1.75} fill="var(--color-gold)" />
              </button>
            </div>
          ))
        )}

        <div style={{ margin: '20px 16px 0' }}>
          <Link
            href={'/community/templates' as Route}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {locale === 'en'
              ? 'Browse community templates →'
              : '커뮤니티 양식 둘러보기 →'}
          </Link>
        </div>
      </div>
    </>
  );
}

function BuiltinRow({
  template,
  locale,
}: {
  template: typeof BUILTIN_BEGINNER;
  locale: 'ko' | 'en';
}) {
  return (
    <div
      style={{
        margin: '6px 16px',
        padding: '12px 14px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            color: 'var(--color-cream)',
            fontWeight: 600,
          }}
        >
          <LocaleText value={template.title} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
          <LocaleText value={template.description ?? { ko: '', en: '' }} />
        </div>
      </div>
      <span
        style={{
          padding: '3px 8px',
          borderRadius: 999,
          fontSize: 10,
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {locale === 'en' ? 'Built-in' : '기본'}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: '20px 20px 6px',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-gold)',
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div
      style={{
        margin: '6px 16px',
        padding: '14px',
        fontSize: 11,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        border: '1px dashed var(--color-border-default)',
        borderRadius: 12,
        lineHeight: 1.5,
      }}
    >
      {text}
    </div>
  );
}
