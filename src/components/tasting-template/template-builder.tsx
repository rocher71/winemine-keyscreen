'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { useTastingTemplates } from '@/context/tasting-template-context';
import { toast } from '@/hooks/use-toast';
import type { TastingTemplate, TemplateField, TemplateFieldType } from '@/types';

/**
 * 커스텀 템플릿 빌더 — 신규 생성 + 기존 편집 공용.
 *
 * 필드 단위로 add/remove/up/down + 라벨/타입/옵션 편집.
 * '커뮤니티에 공유' 토글로 isPublic 설정.
 */

interface Props {
  /** 편집할 기존 템플릿 — 없으면 신규 모드 */
  existing?: TastingTemplate;
}

const FIELD_TYPE_LABELS: Record<TemplateFieldType, { ko: string; en: string }> = {
  slider: { ko: '슬라이더 (1~5)', en: 'Slider (1~5)' },
  wsetScale: { ko: 'WSET 5단계', en: 'WSET 5-scale' },
  chipsSingle: { ko: '칩 (단일 선택)', en: 'Chips (single)' },
  chipsMulti: { ko: '칩 (다중 선택)', en: 'Chips (multi)' },
  text: { ko: '메모 (긴 텍스트)', en: 'Memo (long text)' },
  number: { ko: '숫자', en: 'Number' },
  rating: { ko: '별점 (0~5)', en: 'Rating (0~5)' },
  checkbox: { ko: '체크박스', en: 'Checkbox' },
};

const FIELD_TYPES: TemplateFieldType[] = [
  'slider',
  'wsetScale',
  'rating',
  'chipsSingle',
  'chipsMulti',
  'text',
  'number',
  'checkbox',
];

export function TemplateBuilder({ existing }: Props) {
  const { locale } = useLocale();
  const router = useRouter();
  const { createCustomTemplate, updateCustomTemplate, deleteCustomTemplate } =
    useTastingTemplates();

  const [titleKo, setTitleKo] = useState(existing?.title.ko ?? '');
  const [titleEn, setTitleEn] = useState(existing?.title.en ?? '');
  const [descKo, setDescKo] = useState(existing?.description?.ko ?? '');
  const [descEn, setDescEn] = useState(existing?.description?.en ?? '');
  const [fields, setFields] = useState<TemplateField[]>(existing?.fields ?? []);
  const [isPublic, setIsPublic] = useState(existing?.isPublic ?? false);

  const isEditing = !!existing;

  function addField() {
    const id = `f_${Date.now()}`;
    setFields((arr) => [
      ...arr,
      {
        id,
        type: 'slider',
        label: { ko: '새 필드', en: 'New field' },
        min: 1,
        max: 5,
      },
    ]);
  }

  function updateField(idx: number, patch: Partial<TemplateField>) {
    setFields((arr) => arr.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }

  function removeField(idx: number) {
    setFields((arr) => arr.filter((_, i) => i !== idx));
  }

  function moveField(idx: number, dir: -1 | 1) {
    setFields((arr) => {
      const next = [...arr];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  function addFieldOption(idx: number) {
    setFields((arr) =>
      arr.map((f, i) => {
        if (i !== idx) return f;
        const opts = f.options ?? [];
        return {
          ...f,
          options: [
            ...opts,
            {
              id: `o_${Date.now()}`,
              label: {
                ko: locale === 'ko' ? '새 옵션' : 'New option',
                en: 'New option',
              },
            },
          ],
        };
      }),
    );
  }

  function updateOption(
    fieldIdx: number,
    optIdx: number,
    patch: Partial<NonNullable<TemplateField['options']>[number]>,
  ) {
    setFields((arr) =>
      arr.map((f, i) => {
        if (i !== fieldIdx) return f;
        const opts = (f.options ?? []).map((o, oi) =>
          oi === optIdx ? { ...o, ...patch } : o,
        );
        return { ...f, options: opts };
      }),
    );
  }

  function removeOption(fieldIdx: number, optIdx: number) {
    setFields((arr) =>
      arr.map((f, i) => {
        if (i !== fieldIdx) return f;
        const opts = (f.options ?? []).filter((_, oi) => oi !== optIdx);
        return { ...f, options: opts };
      }),
    );
  }

  function handleSave() {
    if (!titleKo.trim() || !titleEn.trim()) {
      toast({
        message: {
          ko: '제목을 한/영 모두 채워주세요',
          en: 'Fill in title in both ko/en',
        },
      });
      return;
    }
    if (fields.length === 0) {
      toast({
        message: {
          ko: '필드를 1개 이상 추가해주세요',
          en: 'Add at least one field',
        },
      });
      return;
    }
    if (isEditing && existing) {
      updateCustomTemplate(existing.id, {
        title: { ko: titleKo.trim(), en: titleEn.trim() },
        description: { ko: descKo.trim(), en: descEn.trim() },
        fields,
        isPublic,
      });
      toast({
        message: {
          ko: '양식이 저장됐어요',
          en: 'Template saved',
        },
      });
    } else {
      createCustomTemplate({
        title: { ko: titleKo.trim(), en: titleEn.trim() },
        description: { ko: descKo.trim(), en: descEn.trim() },
        fields,
        isPublic,
      });
      toast({
        message: {
          ko: isPublic ? '양식이 커뮤니티에 공유됐어요' : '내 양식이 추가됐어요',
          en: isPublic ? 'Template shared to community' : 'Template added',
        },
      });
    }
    router.push('/settings/tasting-template');
  }

  return (
    <div style={{ padding: '14px 16px 80px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 제목/설명 */}
      <section>
        <Label>{locale === 'en' ? 'Title (Korean)' : '제목 (한국어)'}</Label>
        <Input value={titleKo} onChange={setTitleKo} placeholder={locale === 'en' ? 'e.g. Daily wine note' : '예: 데일리 와인 노트'} />
        <div style={{ height: 8 }} />
        <Label>{locale === 'en' ? 'Title (English)' : '제목 (영어)'}</Label>
        <Input value={titleEn} onChange={setTitleEn} placeholder="e.g. Daily wine note" />
      </section>

      <section>
        <Label>{locale === 'en' ? 'Description' : '설명'}</Label>
        <Textarea value={descKo} onChange={setDescKo} placeholder={locale === 'en' ? 'Korean description' : '한국어 설명'} />
        <div style={{ height: 8 }} />
        <Textarea value={descEn} onChange={setDescEn} placeholder="English description" />
      </section>

      {/* 필드 목록 */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Label noMargin>
            {locale === 'en' ? `Fields (${fields.length})` : `필드 (${fields.length})`}
          </Label>
          <button
            type="button"
            onClick={addField}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid var(--color-gold)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={12} strokeWidth={2} />
            {locale === 'en' ? 'Add field' : '필드 추가'}
          </button>
        </div>

        {fields.length === 0 ? (
          <div
            style={{
              padding: 16,
              fontSize: 12,
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              border: '1px dashed var(--color-border-default)',
              borderRadius: 12,
            }}
          >
            {locale === 'en'
              ? 'No fields yet. Tap "Add field" to start.'
              : '아직 필드가 없어요. 위의 "필드 추가"를 눌러 시작하세요.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fields.map((field, idx) => (
              <FieldCard
                key={field.id}
                field={field}
                index={idx}
                total={fields.length}
                locale={locale}
                onUpdate={(patch) => updateField(idx, patch)}
                onRemove={() => removeField(idx)}
                onMoveUp={() => moveField(idx, -1)}
                onMoveDown={() => moveField(idx, 1)}
                onAddOption={() => addFieldOption(idx)}
                onUpdateOption={(oi, patch) => updateOption(idx, oi, patch)}
                onRemoveOption={(oi) => removeOption(idx, oi)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 공개 토글 */}
      <section
        style={{
          padding: '14px 16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
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
            {locale === 'en' ? 'Share with community' : '커뮤니티에 공유'}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginTop: 2,
              lineHeight: 1.45,
            }}
          >
            {locale === 'en'
              ? "Other users can save your template and use it for their notes."
              : '다른 사람들이 이 양식을 저장해서 자기 노트에 쓸 수 있게 됩니다.'}
          </div>
        </div>
        <Toggle on={isPublic} onChange={setIsPublic} />
      </section>

      {/* 저장 / 삭제 */}
      <div style={{ display: 'flex', gap: 8 }}>
        {isEditing && existing && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(locale === 'en' ? 'Delete this template?' : '이 양식을 삭제할까요?')) {
                deleteCustomTemplate(existing.id);
                router.push('/settings/tasting-template');
              }
            }}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-wine-red-hover, #A02030)',
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Trash2 size={14} strokeWidth={1.75} />
            {locale === 'en' ? 'Delete' : '삭제'}
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'var(--color-wine-red)',
            border: '1px solid var(--color-wine-red)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEditing
            ? locale === 'en'
              ? 'Save changes'
              : '변경 저장'
            : locale === 'en'
              ? 'Create template'
              : '양식 만들기'}
        </button>
      </div>
    </div>
  );
}

function FieldCard({
  field,
  index,
  total,
  locale,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: {
  field: TemplateField;
  index: number;
  total: number;
  locale: 'ko' | 'en';
  onUpdate: (patch: Partial<TemplateField>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddOption: () => void;
  onUpdateOption: (oi: number, patch: Partial<NonNullable<TemplateField['options']>[number]>) => void;
  onRemoveOption: (oi: number) => void;
}) {
  const needsOptions = field.type === 'chipsSingle' || field.type === 'chipsMulti';
  return (
    <div
      style={{
        padding: 12,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: 'var(--color-wine-red)',
            color: 'var(--color-cream)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 11,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-inter)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {locale === 'en' ? 'Field' : '필드'}
        </span>
        <IconBtn aria-label="Move up" onClick={onMoveUp} disabled={index === 0}>
          <ArrowUp size={14} strokeWidth={1.75} />
        </IconBtn>
        <IconBtn aria-label="Move down" onClick={onMoveDown} disabled={index === total - 1}>
          <ArrowDown size={14} strokeWidth={1.75} />
        </IconBtn>
        <IconBtn aria-label="Remove" onClick={onRemove}>
          <X size={14} strokeWidth={1.75} />
        </IconBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Input
          value={field.label.ko}
          onChange={(v) => onUpdate({ label: { ...field.label, ko: v } })}
          placeholder={locale === 'en' ? 'Korean label' : '한글 라벨'}
        />
        <Input
          value={field.label.en}
          onChange={(v) => onUpdate({ label: { ...field.label, en: v } })}
          placeholder="English label"
        />
      </div>

      <div>
        <Label noMargin>{locale === 'en' ? 'Type' : '입력 타입'}</Label>
        <select
          value={field.type}
          onChange={(e) => {
            const type = e.target.value as TemplateFieldType;
            const patch: Partial<TemplateField> = { type };
            if (type === 'slider' && !field.max) {
              patch.min = 1;
              patch.max = 5;
            }
            if ((type === 'chipsSingle' || type === 'chipsMulti') && !field.options) {
              patch.options = [];
            }
            onUpdate(patch);
          }}
          style={{
            width: '100%',
            padding: '8px 10px',
            marginTop: 4,
            background: 'var(--color-bg-deep)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 8,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
          }}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>
              {FIELD_TYPE_LABELS[t][locale]}
            </option>
          ))}
        </select>
      </div>

      {needsOptions && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <Label noMargin>{locale === 'en' ? 'Options' : '선택 옵션'}</Label>
            <button
              type="button"
              onClick={onAddOption}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: 'transparent',
                border: '1px solid var(--color-gold)',
                color: 'var(--color-gold)',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + {locale === 'en' ? 'Option' : '옵션'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(field.options ?? []).map((opt, oi) => (
              <div key={opt.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Input
                  value={opt.label.ko}
                  onChange={(v) => onUpdateOption(oi, { label: { ...opt.label, ko: v } })}
                  placeholder={locale === 'en' ? 'KO' : '한글'}
                  small
                />
                <Input
                  value={opt.label.en}
                  onChange={(v) => onUpdateOption(oi, { label: { ...opt.label, en: v } })}
                  placeholder="EN"
                  small
                />
                <IconBtn aria-label="Remove option" onClick={() => onRemoveOption(oi)}>
                  <X size={12} strokeWidth={1.75} />
                </IconBtn>
              </div>
            ))}
            {(field.options?.length ?? 0) === 0 && (
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                {locale === 'en'
                  ? 'No options yet — add at least one.'
                  : '옵션을 1개 이상 추가하세요.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children, noMargin = false }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div
      style={{
        fontSize: 10,
        color: 'var(--color-gold)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontWeight: 600,
        marginBottom: noMargin ? 0 : 6,
      }}
    >
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  small = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  small?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: small ? '6px 8px' : '8px 10px',
        background: 'var(--color-bg-deep)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        color: 'var(--color-cream)',
        fontFamily: 'var(--font-inter)',
        fontSize: small ? 12 : 13,
        outline: 'none',
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      style={{
        width: '100%',
        padding: '8px 10px',
        background: 'var(--color-bg-deep)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        color: 'var(--color-cream)',
        fontFamily: 'var(--font-inter)',
        fontSize: 13,
        outline: 'none',
        resize: 'vertical',
      }}
    />
  );
}

function IconBtn({
  children,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  'aria-label': string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        all: 'unset',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 6,
        display: 'inline-flex',
        color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        background: on ? 'var(--color-wine-red)' : 'var(--color-bg-deep)',
        border: `1px solid ${on ? 'var(--color-wine-red)' : 'var(--color-border-default)'}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 21 : 2,
          width: 18,
          height: 18,
          borderRadius: 999,
          background: 'var(--color-cream)',
          transition: 'left 0.15s',
        }}
      />
    </button>
  );
}
