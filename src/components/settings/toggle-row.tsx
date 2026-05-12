'use client';

type Props = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  description?: string;
};

export function ToggleRow({ label, checked, onChange, description }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        margin: '6px 16px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'var(--color-cream)',
            fontWeight: 500,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: 44,
          height: 26,
          borderRadius: 13,
          background: checked ? 'var(--color-gold)' : 'var(--color-border-default)',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 200ms',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: 'var(--color-cream)',
            transition: 'left 200ms',
          }}
        />
      </button>
    </div>
  );
}
