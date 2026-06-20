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

export interface StudyCircle {
  id: string;
  name: string;
  tagline: string;
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
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  studentProfile: StudentProfile | null;
  joinedCircleId: string | null;
}
