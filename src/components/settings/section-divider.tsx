'use client';

export function SectionDivider({ title }: { title: string }) {
  return (
    <h2
      style={{
        margin: '20px 20px 8px',
        padding: 0,
        fontFamily: 'var(--font-inter)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {title}
    </h2>
  );
}
