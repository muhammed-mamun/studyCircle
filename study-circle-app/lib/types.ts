export type Subject = 'math' | 'physics' | 'chemistry' | 'biology' | 'bangla' | 'english' | 'ict' | 'accounting' | 'economics';
export type ClassLevel = 'class9' | 'class10' | 'class11' | 'class12';
export type Goal = 'exam_prep' | 'weak_subject' | 'daily_habit' | 'admission_prep';
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface StudentProfile {
  name: string;
  classLevel: ClassLevel;
  goals: Goal[];
  weakSubjects: Subject[];
  timeSlot: TimeSlot;
  language: 'bangla' | 'english' | 'both';
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  class: ClassLevel;
  lastActive: string;
  streak: number;
  role?: 'captain' | 'member';
}

export interface ActivityItem {
  id: string;
  memberId: string;
  memberName: string;
  avatar: string;
  type: 'joined' | 'studied' | 'stuck' | 'join_me' | 'completed';
  content: string;
  subject?: Subject;
  timestamp: string;
  reactions: number;
}

export interface Milestone {
  label: string;
  achieved: boolean;
  emoji: string;
}

export interface StudyCircle {
  id: string;
  name: string;
  tagline: string;
  description: string;          // What this circle is actually about
  studyApproach: string[];      // How they study together
  rules: string[];              // Group norms (2-3 lines)
  tags: string[];               // Quick-scan labels
  class: ClassLevel[];
  goals: Goal[];
  subjects: Subject[];
  timeSlot: TimeSlot[];
  members: Member[];
  maxMembers: number;
  sharedGoal: string;
  nextSession: string;
  activity: ActivityItem[];
  weeklyTarget: string;
  coverEmoji: string;
  color: string;
  weeklyStreak: number;         // Consecutive active weeks
  milestones: Milestone[];
  founded: string;              // e.g. "৩ সপ্তাহ আগে"
  language: 'bangla' | 'english' | 'both';
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  studentProfile: StudentProfile | null;
  joinedCircleId: string | null;
}
