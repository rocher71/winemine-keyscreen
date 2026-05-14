'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check } from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { LocaleText } from '@/components/shared/locale-text';
import { toast } from '@/hooks/use-toast';
import type {
  TastingTemplate,
  TemplateField,
  CustomFieldValue,
  WSETScale,
  Wine,
} from '@/types';

/**
 * 커스텀 템플릿 기반 동적 노트 작성 폼.
 *
 * template.fields[]를 walk하면서 type별 적절한 입력 컨트롤 렌더.
 * 모든 응답은 Record<fieldId, CustomFieldValue> 형태로 관리.
 * 제출 시 toast로 placeholder 저장 동작 — 실제 저장은 prototype 범위 밖.
 */

interface Props {
  template: TastingTemplate;
  wine: Wine | null;
}

const WSET_VALUES: WSETScale[] = ['low', 'mediumMinus', 'medium', 'mediumPlus', 'high'];
const WSET_LABEL_KO: Record<WSETScale, string> = {
  low: '낮음',
  mediumMinus: '중−',
  medium: '중',
  mediumPlus: '중+',
  high: '높음',
};
const WSET_LABEL_EN: Record<WSETScale, string> = {
  low: 'Low',
  mediumMinus: 'M−',
  medium: 'Med',
  mediumPlus: 'M+',
  high: 'High',
};

export function DynamicTemplateForm({ template, wine }: Props) {
  const { locale } = useLocale();
  const router = useRouter();
  const [values, setValues] = useState<Record<string, CustomFieldValue>>({});
  const [sharing, setSharing] = useState(false);

  function setValue(fieldId: string, value: CustomFieldValue) {
    setValues((v) => ({ ...v, [fieldId]: value }));
  }

  function handleSubmit() {
    toast({
      message: {
        ko: sharing
          ? '노트가 저장되고 커뮤니티에 공유됐어요'
          : '노트가 저장됐어요',
        en: sharing ? 'Note saved and shared with community' : 'Note saved',
      },
    });
    router.push('/cellar');
  }

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <header>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
          }}
        >
          <LocaleText value={template.title} />
        </p>
        <h3
          style={{
            margin: '4px 0 4px',
            fontFamily: 'var(--font-playfair)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {wine?.name || (locale === 'ko' ? '오늘의 한 잔' : "Today's glass")}
        </h3>
        {wine && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
            <LocaleText value={wine.producer} /> · {wine.vintage}
          </p>
        )}
        {template.description && (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
            }}
          >
            <LocaleText value={template.description} />
          </p>
        )}
      </header>

      {template.fields.map((field, idx) => (
        <FieldStep
          key={field.id}
          number={idx + 1}
          field={field}
          value={values[field.id]}
          onChange={(v) => setValue(field.id, v)}
          locale={locale}
        />
      ))}

      {/* 공유 토글 */}
      <label
        style={{
          padding: '12px 14px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={sharing}
          onChange={(e) => setSharing(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: 'var(--color-wine-red)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--color-cream)', fontWeight: 600 }}>
            {locale === 'en' ? 'Share to community' : '커뮤니티에 공유'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {locale === 'en'
              ? 'Others can see this note on the community tab.'
              : '커뮤니티 탭에서 다른 사람이 이 노트를 볼 수 있어요.'}
          </div>
        </div>
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: 'var(--color-wine-red)',
          border: '1px solid var(--color-wine-red)',
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {locale === 'en' ? 'Save note' : '노트 저장'}
      </button>
    </section>
  );
}

function FieldStep({
  number,
  field,
  value,
  onChange,
  locale,
}: {
  number: number;
  field: TemplateField;
  value: CustomFieldValue | undefined;
  onChange: (v: CustomFieldValue) => void;
  locale: 'ko' | 'en';
}) {
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <h4
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-cream)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            background: 'var(--color-wine-red)',
            color: 'var(--color-cream)',
            width: 22,
            height: 22,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {number}
        </span>
        <LocaleText value={field.label} />
      </h4>
      {field.description && (
        <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
          <LocaleText value={field.description} />
        </p>
      )}
      <FieldControl field={field} value={value} onChange={onChange} locale={locale} />
    </section>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  locale,
}: {
  field: TemplateField;
  value: CustomFieldValue | undefined;
  onChange: (v: CustomFieldValue) => void;
  locale: 'ko' | 'en';
}) {
  switch (field.type) {
    case 'slider': {
      const min = field.min ?? 1;
      const max = field.max ?? 5;
      const current = value?.kind === 'slider' ? value.value : Math.floor((min + max) / 2);
      return (
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => {
            const active = current === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ kind: 'slider', value: n })}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 8,
                  background: active ? 'var(--color-wine-red)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border-default)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      );
    }
    case 'wsetScale': {
      const current = value?.kind === 'wsetScale' ? value.value : null;
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          {WSET_VALUES.map((w) => {
            const active = current === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => onChange({ kind: 'wsetScale', value: w })}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 8,
                  background: active ? 'var(--color-wine-red)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border-default)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {locale === 'ko' ? WSET_LABEL_KO[w] : WSET_LABEL_EN[w]}
              </button>
            );
          })}
        </div>
      );
    }
    case 'chipsSingle': {
      const current = value?.kind === 'chipsSingle' ? value.value : null;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(field.options ?? []).map((opt) => {
            const active = current === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ kind: 'chipsSingle', value: opt.id })}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: active ? 'rgba(201,168,76,0.18)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <LocaleText value={opt.label} />
              </button>
            );
          })}
        </div>
      );
    }
    case 'chipsMulti': {
      const current = value?.kind === 'chipsMulti' ? value.value : [];
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(field.options ?? []).map((opt) => {
            const active = current.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  const next = active
                    ? current.filter((x) => x !== opt.id)
                    : [...current, opt.id];
                  onChange({ kind: 'chipsMulti', value: next });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: active ? 'rgba(201,168,76,0.18)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {active && <Check size={10} strokeWidth={2.5} />}
                <LocaleText value={opt.label} />
              </button>
            );
          })}
        </div>
      );
    }
    case 'text': {
      const current = value?.kind === 'text' ? value.value : '';
      return (
        <textarea
          value={current}
          onChange={(e) => onChange({ kind: 'text', value: e.target.value })}
          rows={3}
          placeholder={locale === 'en' ? 'Write a memo...' : '메모를 적어보세요...'}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--color-bg-deep)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            outline: 'none',
            resize: 'vertical',
          }}
        />
      );
    }
    case 'number': {
      const current = value?.kind === 'number' ? value.value : '';
      return (
        <input
          type="number"
          value={current === '' ? '' : current}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onChange({ kind: 'number', value: 0 });
              return;
            }
            const n = Number(raw);
            if (!Number.isNaN(n)) onChange({ kind: 'number', value: n });
          }}
          placeholder={locale === 'en' ? '0' : '0'}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--color-bg-deep)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            outline: 'none',
          }}
        />
      );
    }
    case 'rating': {
      const current = value?.kind === 'rating' ? value.value : 0;
      return (
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= current;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ kind: 'rating', value: n })}
                style={{
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  color: filled ? 'var(--color-gold)' : 'var(--color-border-default)',
                  display: 'inline-flex',
                  padding: 2,
                }}
                aria-label={`${n} stars`}
              >
                <Star size={28} strokeWidth={1.5} fill={filled ? 'var(--color-gold)' : 'none'} />
              </button>
            );
          })}
        </div>
      );
    }
    case 'checkbox': {
      const current = value?.kind === 'checkbox' ? value.value : false;
      return (
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={current}
            onChange={(e) => onChange({ kind: 'checkbox', value: e.target.checked })}
            style={{ width: 18, height: 18, accentColor: 'var(--color-wine-red)' }}
          />
          <span style={{ fontSize: 13, color: 'var(--color-cream)' }}>
            <LocaleText value={field.label} />
          </span>
        </label>
      );
    }
  }
}
