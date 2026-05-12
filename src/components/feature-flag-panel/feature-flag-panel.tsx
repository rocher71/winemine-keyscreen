'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from '@/context/locale-context';
import { useFeatureFlags, type FeatureStatus } from '@/context/feature-flag-context';

/**
 * 데스크톱 ≥1280px 우측 사이드 패널. 현재 라우트가 등록한 컴포넌트 inventory를 자동 표시.
 *
 * 각 항목: 라벨 + 3-state 토글 (planned / considering / dropped).
 * dropped → 해당 컴포넌트에 data-feature-status="dropped" 부여 → opacity 0.25 + grayscale.
 *
 * 하단에 라우트별 결정 메모 (localStorage 저장).
 */
export function FeatureFlagPanel() {
  const t = useTranslations('featureFlags');
  const { locale } = useLocale();
  const { registry, state, setStatus, note, setNote } = useFeatureFlags();

  return (
    <aside className="wm-side-panel-right" aria-label={t('title')}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          color: 'var(--color-cream)',
          margin: '0 0 12px',
        }}
      >
        {t('title')}
      </h2>

      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 8,
        }}
      >
        {t('componentsOn')}
      </div>

      {registry.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            margin: '0 0 16px',
          }}
        >
          {t('noComponents')}
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {registry.map((def) => {
            const status: FeatureStatus = state[def.id] ?? def.defaultStatus ?? 'planned';
            return (
              <li
                key={def.id}
                style={{
                  background: 'var(--color-bg-deepest)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-cream)',
                    marginBottom: 6,
                  }}
                >
                  {locale === 'en' ? def.labelEn : def.labelKo}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['planned', 'considering', 'dropped'] as FeatureStatus[]).map((opt) => {
                    const active = status === opt;
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setStatus(def.id, opt)}
                        style={{
                          flex: 1,
                          padding: '4px 6px',
                          borderRadius: 6,
                          border: `1px solid ${active ? colorForStatus(opt) : 'var(--color-border-default)'}`,
                          background: active ? colorForStatus(opt) : 'transparent',
                          color: active ? 'var(--color-bg-deepest)' : 'var(--color-text-secondary)',
                          fontFamily: 'var(--font-inter)',
                          fontWeight: 600,
                          fontSize: 10,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                      >
                        {t(`status.${opt}`)}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 6,
        }}
      >
        {t('noteLabel')}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t('notePlaceholder')}
        rows={4}
        style={{
          width: '100%',
          padding: '8px 10px',
          background: 'var(--color-bg-deepest)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 8,
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          lineHeight: 1.5,
          resize: 'vertical',
          minHeight: 60,
        }}
      />
    </aside>
  );
}

function colorForStatus(s: FeatureStatus): string {
  switch (s) {
    case 'planned':
      return 'var(--color-gold)';
    case 'considering':
      return 'var(--color-cream)';
    case 'dropped':
      return 'var(--color-text-disabled)';
  }
}
