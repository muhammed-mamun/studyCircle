'use client';

import { useEffect, useRef, useState } from 'react';
import { saveState } from '@/lib/store';
import { ClassLevel, Goal, Subject, TimeSlot, StudentProfile } from '@/lib/types';
import { buildProfileSummary } from '@/lib/matchEngine';

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

// ─── Conversation script ─────────────────────────────────────────────────────
// Each step is a specific, non-generic bot message with structured choices.

type StepId =
  | 'welcome'
  | 'ask_class'
  | 'ask_goal'
  | 'ask_subjects'
  | 'ask_time'
  | 'ask_language'
  | 'profile_done';

interface ConversationStep {
  id: StepId;
  botMessage: string;
  inputType: 'choices' | 'multi_choices' | 'confirm';
  choices?: { value: string; label: string; emoji?: string }[];
  next: StepId | null;
}

const STEPS: ConversationStep[] = [
  {
    id: 'welcome',
    botMessage: 'আসসালামু আলাইকুম! 👋 আমি Shikho-র StudyCircle Concierge।\n\nআমি তোমাকে তোমার মতো শিক্ষার্থীদের সাথে মিলিয়ে দেব — যারা একই ক্লাস, একই লক্ষ্য।\n\nমাত্র ৫টি প্রশ্ন — ৬০ সেকেন্ডেই তোমার সার্কেল তৈরি। শুরু করি?',
    inputType: 'choices',
    choices: [
      { value: 'start', label: 'হ্যাঁ, শুরু করো! 🚀', emoji: '🚀' },
      { value: 'later', label: 'পরে করব', emoji: '⏱️' },
    ],
    next: 'ask_class',
  },
  {
    id: 'ask_class',
    botMessage: 'তুমি কোন ক্লাসে পড়ছ? 📚',
    inputType: 'choices',
    choices: [
      { value: 'class9', label: 'ক্লাস ৯ (SSC)', emoji: '9️⃣' },
      { value: 'class10', label: 'ক্লাস ১০ (SSC)', emoji: '🔟' },
      { value: 'class11', label: 'ক্লাস ১১ (HSC)', emoji: '1️⃣1️⃣' },
      { value: 'class12', label: 'ক্লাস ১২ (HSC)', emoji: '🎓' },
    ],
    next: 'ask_goal',
  },
  {
    id: 'ask_goal',
    botMessage: 'তোমার এই মুহূর্তে সবচেয়ে বড় লক্ষ্য কী? (একাধিক বেছে নিতে পারো)',
    inputType: 'multi_choices',
    choices: [
      { value: 'exam_prep', label: 'পরীক্ষার প্রস্তুতি নেওয়া', emoji: '📝' },
      { value: 'weak_subject', label: 'দুর্বল বিষয়গুলো শক্তিশালী করা', emoji: '💪' },
      { value: 'daily_habit', label: 'প্রতিদিন নিয়মিত পড়ার অভ্যাস তৈরি', emoji: '📅' },
      { value: 'admission_prep', label: 'ভর্তি পরীক্ষার প্রস্তুতি', emoji: '🏫' },
    ],
    next: 'ask_subjects',
  },
  {
    id: 'ask_subjects',
    botMessage: 'কোন বিষয়গুলোতে একটু বেশি সাহায্য দরকার? (যেগুলো কঠিন মনে হয়)',
    inputType: 'multi_choices',
    choices: [
      { value: 'math', label: 'গণিত', emoji: '📐' },
      { value: 'physics', label: 'পদার্থবিজ্ঞান', emoji: '⚡' },
      { value: 'chemistry', label: 'রসায়ন', emoji: '⚗️' },
      { value: 'biology', label: 'জীববিজ্ঞান', emoji: '🧬' },
      { value: 'english', label: 'ইংরেজি', emoji: '🔤' },
      { value: 'bangla', label: 'বাংলা', emoji: '📖' },
      { value: 'ict', label: 'তথ্য ও যোগাযোগ প্রযুক্তি', emoji: '💻' },
    ],
    next: 'ask_time',
  },
  {
    id: 'ask_time',
    botMessage: 'তুমি সাধারণত কখন পড়তে বসো? তোমার পড়ার সময়ের সাথে মিলিয়ে সার্কেল খুঁজে দেব।',
    inputType: 'choices',
    choices: [
      { value: 'morning', label: 'সকাল (৬টা–১২টা)', emoji: '🌅' },
      { value: 'afternoon', label: 'দুপুর/বিকাল (১২টা–৫টা)', emoji: '☀️' },
      { value: 'evening', label: 'সন্ধ্যা (৫টা–৮টা)', emoji: '🌆' },
      { value: 'night', label: 'রাত (৮টার পরে)', emoji: '🌙' },
    ],
    next: 'ask_language',
  },
  {
    id: 'ask_language',
    botMessage: 'তুমি কোন ভাষায় পড়তে স্বাচ্ছন্দ্য বোধ করো?',
    inputType: 'choices',
    choices: [
      { value: 'bangla', label: 'বাংলা মিডিয়াম', emoji: '🇧🇩' },
      { value: 'english', label: 'ইংলিশ মিডিয়াম', emoji: '🇬🇧' },
      { value: 'both', label: 'দুটোতেই ঠিক আছি', emoji: '🌐' },
    ],
    next: 'profile_done',
  },
  {
    id: 'profile_done',
    botMessage: '', // dynamically generated
    inputType: 'confirm',
    choices: [
      { value: 'find', label: 'আমার সার্কেল খুঁজে দাও! 🔍', emoji: '🔍' },
    ],
    next: null,
  },
];

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  isTyping?: boolean;
}

interface CollectedAnswers {
  classLevel?: ClassLevel;
  goals?: Goal[];
  weakSubjects?: Subject[];
  timeSlot?: TimeSlot;
  language?: 'bangla' | 'english' | 'both';
}

export default function AIConcierge({ onClose, onComplete }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<StepId>('welcome');
  const [answers, setAnswers] = useState<CollectedAnswers>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingChoice, setIsWaitingChoice] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const step = STEPS.find((s) => s.id === currentStep)!;
  const progressStep = STEPS.findIndex((s) => s.id === currentStep);
  const progressPct = Math.round((progressStep / (STEPS.length - 1)) * 100);

  // Scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isWaitingChoice]);

  // Show first bot message on mount
  useEffect(() => {
    showBotMessage(STEPS[0].botMessage, () => setIsWaitingChoice(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showBotMessage(text: string, onDone?: () => void) {
    setIsTyping(true);
    setIsWaitingChoice(false);
    const delay = Math.min(800 + text.length * 12, 2000);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: 'bot', text },
      ]);
      if (onDone) setTimeout(onDone, 200);
    }, delay);
  }

  function addUserMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text },
    ]);
  }

  // Single-choice handler
  function handleChoice(value: string, label: string) {
    if (isTyping) return;

    // Special: "later" on welcome
    if (value === 'later') {
      onClose();
      return;
    }

    addUserMessage(label);
    setIsWaitingChoice(false);

    // Collect answer
    const updatedAnswers = collectAnswer(currentStep, value, label, answers);
    setAnswers(updatedAnswers);

    // Advance
    const nextId = step.next;
    if (!nextId) return;

    const nextStep = STEPS.find((s) => s.id === nextId)!;

    if (nextId === 'profile_done') {
      const profile = buildFinalProfile(updatedAnswers);
      const summary = buildProfileSummary(profile);
      const summaryMsg = `চমৎকার! 🎉 তোমার প্রোফাইল তৈরি হয়ে গেছে:\n\n${summary}\n\nএই তথ্য দিয়ে আমি তোমার জন্য সবচেয়ে মিলে যাওয়া ৩টি StudyCircle খুঁজে বের করছি...`;
      setCurrentStep(nextId);
      showBotMessage(summaryMsg, () => {
        // Save and let user confirm
        saveState({ studentProfile: profile, hasCompletedOnboarding: true });
        setIsWaitingChoice(true);
      });
    } else {
      setCurrentStep(nextId);
      showBotMessage(nextStep.botMessage, () => setIsWaitingChoice(true));
    }
  }

  // Multi-choice toggle
  function toggleMulti(value: string) {
    setSelectedMulti((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function confirmMulti() {
    if (selectedMulti.length === 0) return;
    const step = STEPS.find((s) => s.id === currentStep)!;
    const chosenLabels = selectedMulti.map(
      (v) => step.choices?.find((c) => c.value === v)?.label || v
    );
    const displayText = chosenLabels.join(', ');
    addUserMessage(displayText);
    setIsWaitingChoice(false);

    const updatedAnswers = collectAnswer(currentStep, selectedMulti.join(','), displayText, answers);
    setAnswers(updatedAnswers);
    setSelectedMulti([]);

    const nextId = step.next;
    if (!nextId) return;
    const nextStep = STEPS.find((s) => s.id === nextId)!;
    setCurrentStep(nextId);
    showBotMessage(nextStep.botMessage, () => setIsWaitingChoice(true));
  }

  function handleConfirm() {
    onComplete();
  }

  function collectAnswer(
    stepId: StepId,
    value: string,
    _label: string,
    prev: CollectedAnswers
  ): CollectedAnswers {
    switch (stepId) {
      case 'ask_class':
        return { ...prev, classLevel: value as ClassLevel };
      case 'ask_goal':
        return { ...prev, goals: value.split(',') as Goal[] };
      case 'ask_subjects':
        return { ...prev, weakSubjects: value.split(',') as Subject[] };
      case 'ask_time':
        return { ...prev, timeSlot: value as TimeSlot };
      case 'ask_language':
        return { ...prev, language: value as 'bangla' | 'english' | 'both' };
      default:
        return prev;
    }
  }

  function buildFinalProfile(a: CollectedAnswers): StudentProfile {
    return {
      name: 'Mamun',
      classLevel: a.classLevel || 'class12',
      goals: a.goals || ['exam_prep'],
      weakSubjects: a.weakSubjects || ['math'],
      timeSlot: a.timeSlot || 'evening',
      language: a.language || 'bangla',
    };
  }

  return (
    <div className="concierge-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="concierge-modal" role="dialog" aria-label="StudyCircle AI Concierge">
        {/* Header */}
        <div className="concierge-header">
          <div className="concierge-avatar">🤖</div>
          <div className="concierge-header-text">
            <h3>StudyCircle Concierge</h3>
            <p>by Shikho AI · তোমার জন্য সঠিক সার্কেল খুঁজছি</p>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(255,255,255,0.15)',
              border: 'none', color: 'white',
              width: 28, height: 28, borderRadius: '50%',
              cursor: 'pointer', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="বন্ধ করো"
          >
            ✕
          </button>
          <div className="concierge-progress-bar">
            <div className="concierge-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Chat body */}
        <div className="concierge-body" ref={bodyRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.role}`}>
              {msg.role === 'bot' ? (
                <>
                  <div className="bubble-avatar bot">🤖</div>
                  <div className="bubble-content">
                    <div className="bubble-text" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bubble-avatar user-av">আমি</div>
                  <div className="bubble-content">
                    <div className="bubble-text">{msg.text}</div>
                    <div className="bubble-time">এইমাত্র</div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="chat-bubble bot">
              <div className="bubble-avatar bot">🤖</div>
              <div className="bubble-content">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Input area */}
          {isWaitingChoice && !isTyping && (
            <div style={{ marginTop: 4 }}>
              {step.inputType === 'choices' && (
                <div className="choices-grid">
                  {step.choices?.map((c) => (
                    <button
                      key={c.value}
                      id={`choice-${c.value}`}
                      className="choice-btn"
                      onClick={() => handleChoice(c.value, c.label)}
                    >
                      {c.emoji && <span>{c.emoji}</span>} {c.label}
                    </button>
                  ))}
                </div>
              )}

              {step.inputType === 'multi_choices' && (
                <div>
                  <div className="choices-grid">
                    {step.choices?.map((c) => (
                      <button
                        key={c.value}
                        id={`multi-${c.value}`}
                        className={`choice-btn ${selectedMulti.includes(c.value) ? 'selected' : ''}`}
                        onClick={() => toggleMulti(c.value)}
                      >
                        {c.emoji && <span>{c.emoji}</span>} {c.label}
                      </button>
                    ))}
                  </div>
                  <div className="choice-confirm">
                    <button
                      id="confirm-multi"
                      className="btn btn-primary btn-full"
                      onClick={confirmMulti}
                      disabled={selectedMulti.length === 0}
                      style={{ borderRadius: 'var(--radius-md)', padding: '10px' }}
                    >
                      নিশ্চিত করো ({selectedMulti.length} টি বাছাই) →
                    </button>
                  </div>
                </div>
              )}

              {step.inputType === 'confirm' && (
                <div className="choices-grid">
                  <button
                    id="find-circles"
                    className="btn btn-primary"
                    onClick={handleConfirm}
                    style={{ borderRadius: 'var(--radius-md)', padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    🔍 আমার সার্কেল খুঁজে দাও!
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
