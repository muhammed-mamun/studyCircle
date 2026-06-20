'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadState } from '@/lib/store';
import AIConcierge from '@/components/AIConcierge';
import ShikhoNav from '@/components/ShikhoNav';

export default function OnboardingPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const state = loadState();
    // If already onboarded and joined, go straight to circle
    if (state.hasCompletedOnboarding && state.joinedCircleId) {
      router.replace(`/circle/${state.joinedCircleId}`);
      return;
    }
    // If onboarded but not joined, go to recommendations
    if (state.hasCompletedOnboarding && !state.joinedCircleId) {
      router.replace('/circles');
      return;
    }
    // Fresh user — show concierge
    setShow(true);
  }, [router]);

  return (
    <>
      <ShikhoNav />
      <div className="page-wrapper">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>StudyCircle Concierge লোড হচ্ছে...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>তোমার জন্য সঠিক সার্কেল খুঁজছি</p>
          </div>
        </div>
      </div>
      {show && (
        <AIConcierge
          onClose={() => router.push('/')}
          onComplete={() => router.push('/circles')}
        />
      )}
    </>
  );
}
