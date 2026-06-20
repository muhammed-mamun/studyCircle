export default function Loading() {
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
      }}
    >
      <div style={{ fontSize: '2.5rem', animation: 'spin 1s linear infinite' }}>⚙️</div>
      <p style={{ color: 'var(--text-secondary)', fontFamily: 'Hind Siliguri, sans-serif' }}>লোড হচ্ছে...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
