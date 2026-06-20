'use client';

import { useRouter, usePathname } from 'next/navigation';

interface Props {
  classLabel?: string;
  hasCircle?: boolean;
  circleId?: string | null;
  onOpenConcierge?: () => void;
}

export default function ShikhoNav({ classLabel = 'ক্লাস ১২', hasCircle = false, circleId, onOpenConcierge }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="shikho-nav">
      {/* Logo */}
      <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <span style={{ fontSize: '1.6rem' }}>🐦</span>
        <span>shik<span>ho</span></span>
      </div>

      {/* Center tabs */}
      <div className="nav-tabs">
        <button
          id="nav-home"
          className={`nav-tab ${pathname === '/' ? 'active' : ''}`}
          onClick={() => router.push('/')}
        >
          🏠 হোম
        </button>
        <button
          id="nav-courses"
          className={`nav-tab ${pathname === '/courses' ? 'active' : ''}`}
          onClick={() => router.push('/')}
        >
          📚 কোর্স
        </button>
        {hasCircle && (
          <button
            id="nav-circle"
            className={`nav-tab circle-tab ${pathname.startsWith('/circle') ? 'active' : ''}`}
            onClick={() => router.push(`/circle/${circleId}`)}
            style={{ position: 'relative' }}
          >
            🤝 StudyCircle
            <span
              style={{
                position: 'absolute',
                top: 4, right: 4,
                width: 8, height: 8,
                background: 'var(--green)',
                borderRadius: '50%',
                border: '1px solid white',
              }}
            />
          </button>
        )}
        {!hasCircle && (
          <button
            id="nav-circle-join"
            className="nav-tab"
            onClick={onOpenConcierge}
            style={{ color: 'var(--shikho-magenta)' }}
          >
            ✨ StudyCircle
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="nav-actions">
        <span className="nav-class-badge">{classLabel}</span>
        <div className="nav-avatar" title="আমার প্রোফাইল">M</div>
      </div>
    </nav>
  );
}
