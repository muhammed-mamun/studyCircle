'use client';

import { use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadState, saveState } from '@/lib/store';
import { CIRCLES } from '@/lib/circleData';
import { StudyCircle, ActivityItem } from '@/lib/types';
import ShikhoNav from '@/components/ShikhoNav';

const TYPE_LABELS: Record<ActivityItem['type'], string> = {
  studied: 'পড়েছি',
  stuck: 'আটকেছি',
  join_me: 'আসো পড়ি',
  completed: 'শেষ করেছি',
  joined: 'যোগ দিয়েছি',
};

const TYPE_CLASS: Record<ActivityItem['type'], string> = {
  studied: 'type-studied',
  stuck: 'type-stuck',
  join_me: 'type-join_me',
  completed: 'type-completed',
  joined: 'type-joined',
};

const ACTION_EMOJIS: Record<ActivityItem['type'], string> = {
  studied: '📖',
  stuck: '🤔',
  join_me: '👋',
  completed: '✅',
  joined: '🎉',
};

export default function CircleHomePage() {
  const params = useParams() as { id?: string };
  const router = useRouter();
  
  // Safe decoding in case it's URI encoded
  const id = params?.id ? decodeURIComponent(params.id) : '';

  const [circle, setCircle] = useState<StudyCircle | null>(null);
  const [feed, setFeed] = useState<ActivityItem[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [postConfirm, setPostConfirm] = useState<ActivityItem['type'] | null>(null);
  const [joinedCircleId, setJoinedCircleId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ReturnType<typeof loadState>['studentProfile']>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'about'>('feed');

  useEffect(() => {
    const state = loadState();
    setJoinedCircleId(state.joinedCircleId);
    setProfile(state.studentProfile);

    if (!id) return; // Wait for router params to be ready

    const found = CIRCLES.find((c) => c.id === id);
    if (!found) { 
      console.warn("Circle not found for id:", id);
      // Clear invalid joinedCircleId and redirect to circles page
      if (state.joinedCircleId === id) {
        saveState({ joinedCircleId: null });
      }
      router.replace('/circles'); 
      return; 
    }
    setCircle(found);
    setFeed(found.activity);
    const initReactions: Record<string, number> = {};
    found.activity.forEach((a) => { initReactions[a.id] = a.reactions; });
    setReactions(initReactions);
  }, [id, router]);

  const handleReact = (itemId: string) => {
    setReacted((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        setReactions((r) => ({ ...r, [itemId]: (r[itemId] || 1) - 1 }));
      } else {
        next.add(itemId);
        setReactions((r) => ({ ...r, [itemId]: (r[itemId] || 0) + 1 }));
      }
      return next;
    });
  };

  const confirmPost = (type: ActivityItem['type']) => {
    setPostConfirm(null);
    const newItem: ActivityItem = {
      id: `new-${Date.now()}`,
      memberId: 'me',
      memberName: profile?.name || 'আমি',
      avatar: '🧑‍🎓',
      type,
      content: getPostContent(type),
      timestamp: 'এইমাত্র',
      reactions: 0,
    };
    setFeed((prev) => [newItem, ...prev]);
    setReactions((r) => ({ ...r, [newItem.id]: 0 }));
    showToast(getToastText(type));
  };

  const getPostContent = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'studied': return 'আজকের পড়া শেষ করলাম!';
      case 'stuck': return 'একটু সাহায্য দরকার, কেউ আছ?';
      case 'join_me': return 'এখন পড়ছি — একসাথে পড়বে?';
      default: return '';
    }
  };

  const getToastText = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'studied': return '✅ সার্কেলকে জানানো হয়েছে!';
      case 'stuck': return '🤔 সাহায্যের অনুরোধ পাঠানো হয়েছে!';
      case 'join_me': return '👋 আমন্ত্রণ পাঠানো হয়েছে!';
      default: return '✅ পোস্ট করা হয়েছে!';
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLeave = () => {
    saveState({ joinedCircleId: null });
    setJoinedCircleId(null);
    showToast('সার্কেল ছেড়ে দিয়েছ');
    setShowLeaveConfirm(false);
    setTimeout(() => router.push('/circles'), 1200);
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

  if (!circle) {
    return (
      <>
        <ShikhoNav classLabel="ক্লাস ১২" hasCircle={false} />
        <div className="page-wrapper">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>লোড হচ্ছে...</h3>
            </div>
          </div>
        </div>
      </>
    );
  }

  const activeCount = circle.members.filter(
    (m) => m.lastActive === 'এইমাত্র' || m.lastActive.includes('মিনিট')
  ).length;
  const isMyCircle = joinedCircleId === id;
  const totalStreak = circle.members.reduce((acc, m) => acc + m.streak, 0);
  const captain = circle.members.find((m) => m.role === 'captain');
  const achievedCount = circle.milestones.filter((m) => m.achieved).length;

  return (
    <>
      <ShikhoNav classLabel={classLabel} hasCircle={!!joinedCircleId} circleId={joinedCircleId} />

      <div className="page-wrapper">
        <div className="container">

          {/* ── Hero ── */}
          <div
            className="circle-hero"
            style={{ background: `linear-gradient(135deg, ${circle.color} 0%, ${circle.color}bb 100%)` }}
          >
            <div className="circle-hero-bg" />
            <div className="circle-hero-content">
              <span className="circle-hero-emoji">{circle.coverEmoji}</span>

              {/* Tags row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {circle.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255,255,255,0.18)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 9px',
                      borderRadius: '999px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <h1>{circle.name}</h1>
                {isMyCircle && (
                  <span style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
                    তোমার সার্কেল ✓
                  </span>
                )}
              </div>
              <div className="tagline" style={{ marginBottom: 16 }}>{circle.tagline}</div>

              {/* Stats row */}
              <div className="circle-hero-stats">
                <div className="hero-stat">
                  <div className="value">{circle.members.length}</div>
                  <div className="label">সদস্য</div>
                </div>
                <div className="hero-stat">
                  <div className="value">{activeCount}</div>
                  <div className="label">এখন সক্রিয়</div>
                </div>
                <div className="hero-stat">
                  <div className="value">{circle.weeklyStreak}</div>
                  <div className="label">সাপ্তাহিক streak</div>
                </div>
                <div className="hero-stat">
                  <div className="value">{achievedCount}/{circle.milestones.length}</div>
                  <div className="label">মাইলস্টোন</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Meta row: goal + session ── */}
          <div
            className="card"
            style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}
          >
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>🎯 সার্কেলের লক্ষ্য</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.93rem' }}>{circle.sharedGoal}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16, minWidth: 150 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>📅 সাপ্তাহিক লক্ষ্য</div>
              <div style={{ fontWeight: 600, color: circle.color, fontSize: '0.88rem' }}>{circle.weeklyTarget}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16, minWidth: 120 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>📆 প্রতিষ্ঠিত</div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{circle.founded}</div>
            </div>
          </div>

          {/* ── Session banner ── */}
          <div className="session-banner" style={{ marginBottom: 24 }}>
            <div className="session-banner-left">
              <div className="session-pulse" />
              <div>
                <div className="session-text">পরবর্তী সেশন</div>
                <div className="session-time">{circle.nextSession}</div>
              </div>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '999px' }}
            >
              রিমাইন্ডার সেট করো 🔔
            </button>
          </div>

          {/* ── Main 2-col ── */}
          <div className="flex flex-col-reverse lg:flex-row gap-6">

            {/* ── Left sidebar ── */}
            <div className="w-full lg:w-80 shrink-0">

              {/* Members card */}
              <div className="card members-card">
                <h3>
                  👥 সদস্যরা
                  <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>
                    {activeCount} সক্রিয়
                  </span>
                </h3>

                {/* You */}
                {isMyCircle && (
                  <div className="member-row" style={{ background: 'var(--shikho-purple-light)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 4 }}>
                    <div className="member-row-avatar" style={{ borderColor: 'var(--shikho-purple)' }}>
                      🧑‍🎓
                      <div className="member-online-dot" />
                    </div>
                    <div className="member-info">
                      <div className="member-name" style={{ color: 'var(--shikho-purple)' }}>{profile?.name || 'তুমি'} (তুমি)</div>
                      <div className="member-last-active">এইমাত্র যোগ দিয়েছ</div>
                    </div>
                    <div className="member-streak">🔥 1</div>
                  </div>
                )}

                {circle.members.map((member) => {
                  const isOnline = member.lastActive === 'এইমাত্র' || member.lastActive.includes('মিনিট');
                  return (
                    <div key={member.id} className="member-row">
                      <div className="member-row-avatar">
                        {member.avatar}
                        {isOnline && <div className="member-online-dot" />}
                      </div>
                      <div className="member-info">
                        <div className="member-name" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {member.name}
                          {member.role === 'captain' && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, background: circle.color + '22', color: circle.color, padding: '1px 6px', borderRadius: '999px', border: `1px solid ${circle.color}44` }}>
                              ক্যাপ্টেন
                            </span>
                          )}
                        </div>
                        <div className="member-last-active">{member.lastActive}</div>
                      </div>
                      <div className="member-streak">🔥 {member.streak}</div>
                    </div>
                  );
                })}
              </div>

              {/* Milestones card */}
              <div className="card" style={{ padding: 20, marginTop: 16 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  🏆 মাইলস্টোন
                  <span className="badge badge-purple" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                    {achievedCount}/{circle.milestones.length}
                  </span>
                </h3>
                {/* Progress bar */}
                <div className="goal-bar-wrap" style={{ marginBottom: 14 }}>
                  <div className="goal-bar-fill" style={{ width: `${Math.round((achievedCount / circle.milestones.length) * 100)}%`, background: circle.color }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {circle.milestones.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: m.achieved ? 1 : 0.55 }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{m.emoji}</span>
                      <span style={{ fontSize: '0.83rem', fontWeight: m.achieved ? 600 : 400, color: m.achieved ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: m.achieved ? 'none' : 'none' }}>
                        {m.label}
                      </span>
                      {m.achieved && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--green)', fontWeight: 700 }}>সম্পন্ন</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave */}
              {isMyCircle && (
                <div style={{ marginTop: 12 }}>
                  {showLeaveConfirm ? (
                    <div className="card" style={{ padding: 16 }}>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                        সত্যিই সার্কেল ছেড়ে যাবে? পরে আবার যোগ দিতে পারবে।
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm" style={{ flex: 1, background: 'var(--red)', color: 'white', border: 'none' }} onClick={handleLeave}>হ্যাঁ, ছেড়ে যাও</button>
                        <button className="btn btn-sm btn-ghost" style={{ flex: 1 }} onClick={() => setShowLeaveConfirm(false)}>না, থাকো</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-full btn-sm"
                      onClick={() => setShowLeaveConfirm(true)}
                      style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                    >
                      সার্কেল ছেড়ে দাও
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── Main column ── */}
            <div className="flex-1 min-w-0">

              {/* Tab switcher */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'white', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
                {(['feed', 'about'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '7px 18px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Hind Siliguri, sans-serif',
                      background: activeTab === tab ? circle.color : 'transparent',
                      color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab === 'feed' ? '📊 ফিড' : 'ℹ️ সম্পর্কে'}
                  </button>
                ))}
              </div>

              {/* ── FEED TAB ── */}
              {activeTab === 'feed' && (
                <div className="card" style={{ overflow: 'hidden' }}>
                  {isMyCircle && (
                    <div className="action-bar">
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'center', marginRight: 4 }}>
                        সার্কেলকে জানাও:
                      </span>
                      <button id="post-studied" className="action-btn studied" onClick={() => setPostConfirm('studied')}>📖 পড়েছি</button>
                      <button id="post-stuck" className="action-btn stuck" onClick={() => setPostConfirm('stuck')}>🤔 আটকেছি</button>
                      <button id="post-join-me" className="action-btn join-me" onClick={() => setPostConfirm('join_me')}>👋 আসো পড়ি</button>
                    </div>
                  )}

                  {postConfirm && (
                    <div style={{ padding: '12px 20px', background: 'var(--shikho-purple-light)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontSize: '0.88rem', color: 'var(--shikho-purple)' }}>
                        {ACTION_EMOJIS[postConfirm]} &ldquo;{getActionLabel(postConfirm)}&rdquo; পোস্ট করবে?
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => confirmPost(postConfirm)}>হ্যাঁ</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setPostConfirm(null)}>না</button>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '4px 20px 20px' }}>
                    <div className="activity-header">
                      <h3>📊 সার্কেল ফিড</h3>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{feed.length} আপডেট</span>
                    </div>

                    {feed.map((item) => (
                      <div key={item.id} className="activity-item">
                        <div className="activity-avatar">{item.avatar}</div>
                        <div className="activity-content">
                          <div className="activity-top">
                            <span className="activity-name">{item.memberName === 'আমি' ? (profile?.name || 'তুমি') : item.memberName}</span>
                            <span className={`activity-type-badge ${TYPE_CLASS[item.type]}`}>
                              {ACTION_EMOJIS[item.type]} {TYPE_LABELS[item.type]}
                            </span>
                          </div>
                          <div className="activity-text">{item.content}</div>
                          <div className="activity-footer">
                            <span className="activity-time">{item.timestamp}</span>
                            <button
                              className={`reaction-btn ${reacted.has(item.id) ? 'reacted' : ''}`}
                              onClick={() => handleReact(item.id)}
                            >
                              {reacted.has(item.id) ? '❤️' : '🤍'} {reactions[item.id] || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ABOUT TAB ── */}
              {activeTab === 'about' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Description */}
                  <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10 }}>📖 এই সার্কেল সম্পর্কে</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{circle.description}</p>
                  </div>

                  {/* Study approach */}
                  <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>🎓 কীভাবে পড়া হয়</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {circle.studyApproach.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ width: 22, height: 22, background: circle.color + '22', color: circle.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                            {i + 1}
                          </span>
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>📜 সার্কেলের নিয়মকানুন</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {circle.rules.map((rule, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${circle.color}` }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Captain info */}
                  {captain && (
                    <div className="card" style={{ padding: 20 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>👑 সার্কেল ক্যাপ্টেন</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: circle.color + '22', border: `2px solid ${circle.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          {captain.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{captain.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            🔥 {captain.streak} দিনের streak · {captain.lastActive}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* All tags */}
                  <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>🏷️ বিষয় ও ট্যাগ</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {circle.tags.map((tag) => (
                        <span key={tag} className="badge badge-purple" style={{ fontSize: '0.82rem' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

function getActionLabel(type: ActivityItem['type']): string {
  switch (type) {
    case 'studied': return 'আজকের পড়া শেষ করলাম!';
    case 'stuck': return 'একটু সাহায্য দরকার, কেউ আছ?';
    case 'join_me': return 'এখন পড়ছি — একসাথে পড়বে?';
    default: return '';
  }
}
