'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState } from '@/lib/store';
import { AppState } from '@/lib/types';
import AIConcierge from '@/components/AIConcierge';
import ShikhoNav from '@/components/ShikhoNav';

const COURSES = [
  { title: 'জটিল সংখ্যা', teacher: 'Md. Iqbal Hossain', subject: 'গণিত', duration: '3:16:56', emoji: '🔢', color: '#2d1b69,#6C3CE1' },
  { title: 'সোনার তরী + ভাষারীতি + উচ্চারণ', teacher: 'Abdullah Al Mehedi', subject: 'বাংলা', duration: '2:38:46', emoji: '📖', color: '#1a0533,#E91E8C' },
  { title: '১৯৬৯, বচন ও সমার্থক বিশ্লেষণ', teacher: 'Hironmoy Bowali', subject: 'বাংলা', duration: '2:28:22', emoji: '📝', color: '#0d2137,#0984E3' },
];

const SUBJECTS = [
  { id: 'all', label: 'সব', emoji: '📚' },
  { id: 'bangla', label: 'বাংলা', emoji: '🇧🇩' },
  { id: 'gk', label: 'সাধারণ জ্ঞান', emoji: '🌍' },
  { id: 'math', label: 'গণিত', emoji: '📐' },
  { id: 'chemistry', label: 'রসায়ন', emoji: '⚗️' },
  { id: 'biology', label: 'জীববিজ্ঞান', emoji: '🧬' },
  { id: 'physics', label: 'পদার্থবিজ্ঞান', emoji: '⚡' },
  { id: 'english', label: 'ইংরেজি', emoji: '🔤' },
];

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [showConcierge, setShowConcierge] = useState(false);
  const [activeSubject, setActiveSubject] = useState('all');

  useEffect(() => {
    const s = loadState();
    setState(s);
    // Auto-show concierge for first-time visitors who haven't onboarded
    if (!s.hasCompletedOnboarding) {
      const timer = setTimeout(() => setShowConcierge(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowConcierge(false);
    const s = loadState();
    setState(s);
    router.push('/circles');
  };

  const handleJoinCircle = () => {
    if (state?.joinedCircleId) {
      router.push(`/circle/${state.joinedCircleId}`);
    } else {
      setShowConcierge(true);
    }
  };

  const classLabel = (() => {
    switch (state?.studentProfile?.classLevel) {
      case 'class9': return 'ক্লাস ৯';
      case 'class10': return 'ক্লাস ১০';
      case 'class11': return 'ক্লাস ১১';
      case 'class12': return 'ক্লাস ১২';
      default: return 'ক্লাস ১২';
    }
  })();

  return (
    <>
      <ShikhoNav
        classLabel={classLabel}
        hasCircle={!!state?.joinedCircleId}
        circleId={state?.joinedCircleId}
        onOpenConcierge={() => setShowConcierge(true)}
      />

      <div className="page-wrapper">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                  <h1 className="section-title">মোস্ট ইমপর্ট্যান্ট ক্লাস</h1>
                  <p className="section-subtitle">আজকের লিমিট ০/২</p>
                </div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--shikho-purple)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'Hind Siliguri, sans-serif',
                  }}
                >
                  আরো দেখো →
                </button>
              </div>

              {/* Subject filter tabs */}
              <div className="subject-tabs">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    className={`subject-pill ${activeSubject === s.id ? 'active' : ''}`}
                    onClick={() => setActiveSubject(s.id)}
                  >
                    <span>{s.emoji}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Course grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {COURSES.map((c, i) => (
                  <div key={i}>
                    <div className="course-card">
                      <div
                        className="course-thumbnail"
                        style={{
                          background: `linear-gradient(160deg, #${c.color.split(',')[0].replace('#','')}, ${c.color.split(',')[1]})`,
                        }}
                      >
                        <span style={{ fontSize: '2.2rem', opacity: 0.3, position: 'absolute', top: 8, left: 8 }}>{c.emoji}</span>
                        <span style={{ position: 'relative', zIndex: 1 }}>{c.title}</span>
                      </div>
                      <div className="course-duration">{c.duration}</div>
                      <div
                        className="course-play"
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)' }}
                      >
                        ▶
                      </div>
                    </div>
                    <div className="course-info">
                      <div className="course-title">{c.title}</div>
                      <div className="course-teacher">
                        👤 {c.teacher} · <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>{c.subject}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Most important chapters playlist button */}
              <div style={{ marginTop: 20 }}>
                <button
                  className="btn btn-outline"
                  style={{ width: '100%', maxWidth: 320, borderRadius: 'var(--radius-md)', padding: '12px 20px' }}
                >
                  📋 মোস্ট ইমপর্ট্যান্ট চ্যাপ্টার্স প্লেলিস্ট →
                </button>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-6">
              {/* StudyCircle CTA or banner */}
              {state?.joinedCircleId ? (
                <div
                  className="sc-banner"
                  onClick={() => router.push(`/circle/${state.joinedCircleId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="sc-banner-bg">🔵</div>
                  <div className="sc-banner-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>🤝</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>তোমার StudyCircle</span>
                    </div>
                    <h3>তোমার সার্কেল এখন সক্রিয়!</h3>
                    <p>বন্ধুরা পড়ছে — তুমিও যোগ দাও</p>
                    <button className="sc-banner-btn">সার্কেল দেখো →</button>
                  </div>
                </div>
              ) : (
                <div className="sc-banner" onClick={() => setShowConcierge(true)} style={{ cursor: 'pointer' }}>
                  <div className="sc-banner-bg">👥</div>
                  <div className="sc-banner-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>✨</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>নতুন — StudyCircle</span>
                    </div>
                    <h3>একা পড়া কঠিন?</h3>
                    <p>AI তোমার জন্য সঠিক স্টাডি গ্রুপ খুঁজে দেবে — মাত্র ১ মিনিটে।</p>
                    <button className="sc-banner-btn">শুরু করো →</button>
                  </div>
                </div>
              )}

              {/* Shikho AI card */}
              <div className="ai-card">
                <div className="ai-card-header">
                  <div className="ai-icon">🤖</div>
                  <div>
                    <h4>Shikho AI</h4>
                    <p className="text-secondary" style={{ fontSize: '0.78rem' }}>ডাউট সলভ করো</p>
                  </div>
                </div>
                <p className="text-secondary" style={{ fontSize: '0.82rem' }}>
                  তোমার পড়ালেখা সম্পর্কিত যেকোনো ডাউট সলভ করতে SHIKHO AI ব্যবহার করে দেখো এখনই।
                </p>
                <button className="ai-cta-btn">Shikho AI →</button>
              </div>

              {/* App download nudge */}
              <div
                className="card"
                style={{
                  marginTop: 16,
                  padding: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>📱</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>শিখো অ্যাপ ডাউনলোড করো!</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    তোমার মোবাইলে QR কোড স্ক্যান করে শিখো অ্যাপ ডাউনলোড করো
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>📲 Google Play</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Concierge overlay */}
      {showConcierge && (
        <AIConcierge
          onClose={() => setShowConcierge(false)}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  );
}
