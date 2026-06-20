'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        flexDirection: 'column',
        gap: 16,
        fontFamily: 'Hind Siliguri, sans-serif',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3.5rem' }}>🔍</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>পেজ পাওয়া যায়নি</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 320 }}>
        তুমি যে পেজটি খুঁজছ সেটি নেই বা সরানো হয়েছে।
      </p>
      <button
        onClick={() => router.push('/')}
        style={{
          background: 'linear-gradient(135deg, #6C3CE1, #E91E8C)',
          color: 'white',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          fontFamily: 'Hind Siliguri, sans-serif',
        }}
      >
        হোমে ফিরে যাও
      </button>
    </div>
  );
}
