'use client';
import paths from '../logo-paths.json';

export function Brand({compact = false}: {compact?: boolean}) {
  return <div className={compact ? 'brand compact' : 'brand'}>
    <svg viewBox={compact ? '0 0 1170 190' : '0 0 1170 340'} role="img" aria-label="Redom Labs"
      className="brand-svg">
      {paths.filter(p => !compact || p.id !== 'signature').map((p, i) =>
        <g key={p.id} className={'letter letter-' + p.id}
          style={{ fill: i < 2 ? 'var(--brand-in)' : 'var(--brand-dom)' }}>
          <path d={p.d} transform={p.transform} fillRule="evenodd" />
        </g>)}
    </svg>
  </div>;
}
