import { StudentProfile, StudyCircle, ClassLevel, Goal, Subject, TimeSlot } from './types';
import { CIRCLES } from './circleData';

// Scoring weights
const WEIGHTS = {
  classMatch: 40,
  goalMatch: 30,
  subjectOverlap: 20,
  timeSlotMatch: 10,
};

// Class adjacency map — same level (SSC / HSC) gives partial credit
const CLASS_LEVELS: ClassLevel[] = ['class9', 'class10', 'class11', 'class12'];
const HSC = new Set<ClassLevel>(['class11', 'class12']);
const SSC = new Set<ClassLevel>(['class9', 'class10']);

function scoreClassMatch(studentClass: ClassLevel, circleClasses: ClassLevel[]): number {
  if (circleClasses.includes(studentClass)) return WEIGHTS.classMatch; // exact
  // same board (SSC/HSC) = partial
  const studentInSSC = SSC.has(studentClass);
  const circleHasSSC = circleClasses.some((c) => SSC.has(c));
  const circleHasHSC = circleClasses.some((c) => HSC.has(c));
  if ((studentInSSC && circleHasSSC) || (!studentInSSC && circleHasHSC)) {
    return Math.round(WEIGHTS.classMatch * 0.5);
  }
  return 0;
}

function scoreGoalMatch(studentGoals: Goal[], circleGoals: Goal[]): number {
  const overlap = studentGoals.filter((g) => circleGoals.includes(g)).length;
  if (overlap === 0) return 0;
  return Math.round((overlap / Math.max(studentGoals.length, 1)) * WEIGHTS.goalMatch);
}

function scoreSubjectOverlap(studentSubjects: Subject[], circleSubjects: Subject[]): number {
  if (studentSubjects.length === 0) return Math.round(WEIGHTS.subjectOverlap * 0.5); // neutral
  const overlap = studentSubjects.filter((s) => circleSubjects.includes(s)).length;
  return Math.round((overlap / studentSubjects.length) * WEIGHTS.subjectOverlap);
}

function scoreTimeSlot(studentTime: TimeSlot, circleTimes: TimeSlot[]): number {
  return circleTimes.includes(studentTime) ? WEIGHTS.timeSlotMatch : 0;
}

export interface MatchResult {
  circle: StudyCircle;
  score: number; // 0–100
  reasons: string[]; // human-readable explanations
}

const CLASS_LABELS: Record<ClassLevel, string> = {
  class9: 'ক্লাস ৯',
  class10: 'ক্লাস ১০',
  class11: 'ক্লাস ১১',
  class12: 'ক্লাস ১২',
};

const GOAL_LABELS: Record<Goal, string> = {
  exam_prep: 'পরীক্ষার প্রস্তুতি',
  weak_subject: 'দুর্বল বিষয়',
  daily_habit: 'প্রতিদিনের অভ্যাস',
  admission_prep: 'ভর্তি প্রস্তুতি',
};

const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'গণিত',
  physics: 'পদার্থবিজ্ঞান',
  chemistry: 'রসায়ন',
  biology: 'জীববিজ্ঞান',
  bangla: 'বাংলা',
  english: 'ইংরেজি',
  ict: 'তথ্য ও যোগাযোগ প্রযুক্তি',
  accounting: 'হিসাববিজ্ঞান',
  economics: 'অর্থনীতি',
};

const TIME_LABELS: Record<TimeSlot, string> = {
  morning: 'সকাল',
  afternoon: 'বিকাল',
  evening: 'সন্ধ্যা',
  night: 'রাত',
};

function buildReasons(profile: StudentProfile, circle: StudyCircle): string[] {
  const reasons: string[] = [];

  // Class
  if (circle.class.includes(profile.classLevel)) {
    reasons.push(`${CLASS_LABELS[profile.classLevel]}-এর জন্য তৈরি`);
  } else {
    const sameBoard =
      (SSC.has(profile.classLevel) && circle.class.some((c) => SSC.has(c))) ||
      (HSC.has(profile.classLevel) && circle.class.some((c) => HSC.has(c)));
    if (sameBoard) reasons.push('একই বোর্ডের শিক্ষার্থী');
  }

  // Goals
  const matchedGoals = profile.goals.filter((g) => circle.goals.includes(g));
  if (matchedGoals.length > 0) {
    reasons.push(`লক্ষ্য মিলেছে: ${matchedGoals.map((g) => GOAL_LABELS[g]).join(', ')}`);
  }

  // Subjects
  const matchedSubjects = profile.weakSubjects.filter((s) => circle.subjects.includes(s));
  if (matchedSubjects.length > 0) {
    reasons.push(`বিষয় মিলেছে: ${matchedSubjects.map((s) => SUBJECT_LABELS[s]).join(', ')}`);
  }

  // Time
  if (circle.timeSlot.includes(profile.timeSlot)) {
    reasons.push(`পড়ার সময় মিলেছে: ${TIME_LABELS[profile.timeSlot]}`);
  }

  return reasons;
}

export function matchCircles(profile: StudentProfile): MatchResult[] {
  const scored = CIRCLES.map((circle) => {
    const classScore = scoreClassMatch(profile.classLevel, circle.class);
    const goalScore = scoreGoalMatch(profile.goals, circle.goals);
    const subjectScore = scoreSubjectOverlap(profile.weakSubjects, circle.subjects);
    const timeScore = scoreTimeSlot(profile.timeSlot, circle.timeSlot);

    const total = classScore + goalScore + subjectScore + timeScore;
    // Add slight jitter to avoid ties (based on member activity proxy)
    const jitter = (circle.members.reduce((acc, m) => acc + m.streak, 0) % 5);
    const finalScore = Math.min(100, total + jitter);

    return {
      circle,
      score: finalScore,
      reasons: buildReasons(profile, circle),
    };
  });

  // Sort descending, return top 3
  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

// Rule-based profile narration for the AI summary card
export function buildProfileSummary(profile: StudentProfile): string {
  const classLabel = CLASS_LABELS[profile.classLevel];
  const goalLabel = profile.goals.map((g) => GOAL_LABELS[g]).join(' ও ');
  const subjectLabel =
    profile.weakSubjects.length > 0
      ? profile.weakSubjects.map((s) => SUBJECT_LABELS[s]).join(', ')
      : 'সব বিষয়';
  const timeLabel = TIME_LABELS[profile.timeSlot];

  return `তুমি ${classLabel}-এর একজন শিক্ষার্থী যে ${goalLabel}-এ মনোযোগী। ${subjectLabel}-এ একটু বেশি মনোযোগ দিতে চাও এবং ${timeLabel}ে পড়তে পছন্দ করো।`;
}
