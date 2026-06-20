'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState } from '@/lib/store';
import { matchCircles, MatchResult } from '@/lib/matchEngine';
import { StudentProfile } from '@/lib/types';
import ShikhoNav from '@/components/ShikhoNav';

export default function CirclesPage() {
  const router = useRouter();
  const [results, setResults] = useState<MatchResult[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [joining, setJoining] = useState<string | null>(null);
  const [alreadyJoined, setAlreadyJoined] = useState<string | null>(null);

  useEffect(() => {
    const state = loadState();
    if (!state.studentProfile) {
      router.replace('/');
      return;
    }
    setProfile(state.studentProfile);
    setAlreadyJoined(state.joinedCircleId);
    const matches = matchCircles(state.studentProfile);
    setResults(matches);
  }, [router]);

  const handleJoin = (circleId: string) => {
    setJoining(circleId);
    setTimeout(() => {
      saveState({ joinedCircleId: circleId });
      router.push(`/circle/${circleId}`);
    }, 800);
  };

  const classLabel = (() => {
    switch (profile?.classLevel) {
      case 'class9': return 'ক্লাস ৯';
      case 'class10': return 'ক্লাস ১০';
      case 'class11': return 'ক্লাস ১১';
      case 'class12': return 'ক্লাস ১২';
      default: return 'ক্লাস ১২';
    }
  })();

  if (results.length === 0) {
    return (
      <>
        <ShikhoNav classLabel={classLabel} hasCircle={false} />
        <div className="page-wrapper">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>সার্কেল খুঁজছি...</h3>
              <p>একটু অপেক্ষা করো</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ShikhoNav classLabel={classLabel} hasCircle={!!alreadyJoined} circleId={alreadyJoined} />

      <div className="page-wrapper">
        <div className="container">
          {/* Header */}
          <div className="reco-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                🎯 AI ম্যাচ সম্পন্ন
              </span>
            </div>
            <h1>তোমার জন্য ৩টি সার্কেল পাওয়া গেছে!</h1>
            <p>
              তোমার ক্লাস, লক্ষ্য, দুর্বল বিষয় ও পড়ার সময়ের উপর ভিত্তি করে এই সার্কেলগুলো বেছে নেওয়া হয়েছে।
            </p>
          </div>

          {/* Cards grid */}
          <div className="reco-cards">
            {results.map((result, index) => (
              <CircleRecoCard
                key={result.circle.id}
                result={result}
                isTopPick={index === 0}
                joining={joining === result.circle.id}
                alreadyJoined={alreadyJoined === result.circle.id}
                onJoin={() => handleJoin(result.circle.id)}
              />
            ))}
          </div>

          {/* Re-do option */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              কোনোটা মনে ধরেনি?
            </p>
            <button
              className="btn btn-ghost"
              onClick={() => { saveState({ studentProfile: null, hasCompletedOnboarding: false }); router.replace('/'); }}
              style={{ fontSize: '0.88rem', color: 'var(--shikho-purple)' }}
            >
              🔄 আবার খুঁজে দাও
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CircleRecoCard({
  result,
  isTopPick,
  joining,
  alreadyJoined,
  onJoin,
}: {
  result: MatchResult;
  isTopPick: boolean;
  joining: boolean;
  alreadyJoined: boolean;
  onJoin: () => void;
}) {
  const { circle, score, reasons } = result;

  const scoreColor =
    score >= 80 ? 'var(--shikho-magenta)' :
    score >= 60 ? 'var(--shikho-purple)' :
    'var(--text-secondary)';

  const seatsPct = Math.round((circle.members.length / circle.maxMembers) * 100);

  return (
    <div className={`circle-reco-card ${isTopPick ? 'top-pick' : ''}`}>
      {isTopPick && (
        <div className="top-pick-ribbon">⭐ সবচেয়ে ভালো মিল</div>
      )}

      <div className="circle-reco-header">
        <div
          className="circle-emoji-wrap"
          style={{ background: circle.color + '22' }}
        >
          <span style={{ fontSize: '1.6rem' }}>{circle.coverEmoji}</span>
        </div>
        <div className="circle-reco-info">
          <h3>{circle.name}</h3>
          <p>{circle.tagline}</p>
        </div>
        <div
          className="match-score-pill"
          style={{ borderColor: scoreColor, color: scoreColor }}
        >
          {score}% মিল
        </div>
      </div>

      <div className="circle-reco-body">
        {/* Match reasons */}
        <div className="circle-reco-reasons">
          {reasons.map((r, i) => (
            <div key={i} className="reason-item">{r}</div>
          ))}
        </div>

        {/* Shared goal */}
        <div
          style={{
            background: 'var(--bg)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginTop: 12,
            display: 'flex',
            gap: 6,
          }}
        >
          <span>🎯</span>
          <span>{circle.sharedGoal}</span>
        </div>

        {/* Session info */}
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>📅</span>
          <span>পরবর্তী সেশন: <strong style={{ color: circle.color }}>{circle.nextSession}</strong></span>
        </div>

        {/* Members row */}
        <div className="circle-meta-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="member-avatars">
              {circle.members.slice(0, 4).map((m) => (
                <div key={m.id} className="member-avatar-mini" title={m.name}>
                  {m.avatar}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {circle.members.length}/{circle.maxMembers} জন
            </span>
          </div>
          <div className="circle-meta-item">
            <span>🔥</span>
            <span>সক্রিয় সার্কেল</span>
          </div>
        </div>

        {/* Seats bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>আসন পূর্ণতা</span>
            <span>{seatsPct}%</span>
          </div>
          <div className="goal-bar-wrap">
            <div className="goal-bar-fill" style={{ width: `${seatsPct}%`, background: circle.color }} />
          </div>
        </div>

        {/* Join CTA */}
        <div style={{ marginTop: 16 }}>
          {alreadyJoined ? (
            <button className="btn btn-primary btn-full" disabled style={{ borderRadius: 'var(--radius-md)' }}>
              ✅ যোগ দিয়েছ
            </button>
          ) : (
            <button
              id={`join-${circle.id}`}
              className="btn btn-full"
              onClick={onJoin}
              disabled={joining}
              style={{
                background: joining
                  ? 'var(--border)'
                  : isTopPick
                    ? `linear-gradient(135deg, ${circle.color}, var(--shikho-magenta))`
                    : circle.color,
                color: 'white',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              {joining ? '⏳ যোগ হচ্ছে...' : 'এই সার্কেলে যোগ দাও →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
