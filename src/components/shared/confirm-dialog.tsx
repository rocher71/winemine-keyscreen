'use client';

import { Modal } from './modal';
import { LocaleText } from './locale-text';
import type { LocalizedString } from '@/types';

/**
 * "정말 마시기 / 즐겨찾기 해제" 같은 yes/no 확인용 다이얼로그.
 * Modal 변형.
 *
 * @example
 *   <ConfirmDialog
 *     open={open}
 *     title={{ ko: '이 와인을 마실까요?', en: 'Drink this wine?' }}
 *     description={{ ko: '셀러에서 사라지고 노트 작성 화면으로 이동해요.', en: 'It will leave the cellar and open a tasting note.' }}
 *     confirmLabel={{ ko: '마시기', en: 'Drink' }}
 *     cancelLabel={{ ko: '취소', en: 'Cancel' }}
 *     onConfirm={...}
 *     onClose={() => setOpen(false)}
 *   />
 */
type Props = {
  open: boolean;
  title: LocalizedString | string;
  description?: LocalizedString | string;
  confirmLabel: LocalizedString | string;
  cancelLabel: LocalizedString | string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  onConfirm,
  onClose,
}: Props) {
  const confirmBg = variant === 'destructive' ? 'var(--color-error)' : 'var(--color-wine-red)';

  return (
    <Modal open={open} onClose={onClose} labelledBy="wm-confirm-title">
      <LocaleText
        value={title}
        as="h2"
        className="wm-modal-title"
      />
      {description && (
        <LocaleText
          value={description}
          as="p"
          className="wm-modal-desc"
        />
      )}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 20,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            border: '1px solid var(--color-border-default)',
            background: 'transparent',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <LocaleText value={cancelLabel} />
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            border: 'none',
            background: confirmBg,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <LocaleText value={confirmLabel} />
        </button>
      </div>
    </Modal>
  );
}
