export type Subject = 'math' | 'physics' | 'chemistry' | 'biology' | 'bangla' | 'english' | 'ict' | 'accounting' | 'economics' | 'civics';
export type ClassLevel = 'class9' | 'class10' | 'class11' | 'class12';
export type Goal = 'exam_prep' | 'weak_subject' | 'daily_habit' | 'admission_prep';
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Member {
  id: string;
  name: string;
  avatar: string; // emoji
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
  color: string; // accent color
}

export const CIRCLES: StudyCircle[] = [
  {
    id: 'hsc-physics-breakers',
    name: 'HSC Physics Breakers',
    tagline: 'পদার্থবিজ্ঞান ভয় নেই — একসাথে ভাঙব',
    class: ['class11', 'class12'],
    goals: ['exam_prep', 'weak_subject', 'admission_prep'],
    subjects: ['physics', 'math'],
    timeSlot: ['evening', 'night'],
    sharedGoal: 'HSC পদার্থবিজ্ঞান ১ম পত্র শেষ করা — ৩০ দিনে',
    nextSession: 'আজ রাত ৯টায়',
    weeklyTarget: '৩টি অধ্যায় + ৫০টি MCQ',
    coverEmoji: '⚡',
    color: '#6C3CE1',
    maxMembers: 12,
    members: [
      { id: 'm1', name: 'Rafiq Ahmed', avatar: '👨‍🎓', class: 'class12', lastActive: '২ ঘন্টা আগে', streak: 12 },
      { id: 'm2', name: 'Nadia Islam', avatar: '👩‍🎓', class: 'class12', lastActive: '৩০ মিনিট আগে', streak: 8 },
      { id: 'm3', name: 'Tariq Hossain', avatar: '🧑‍🎓', class: 'class11', lastActive: '১ ঘন্টা আগে', streak: 5 },
      { id: 'm4', name: 'Suma Akter', avatar: '👩‍💻', class: 'class12', lastActive: 'এইমাত্র', streak: 21 },
      { id: 'm5', name: 'Milon Roy', avatar: '👨‍💻', class: 'class11', lastActive: '৪ ঘন্টা আগে', streak: 3 },
    ],
    activity: [
      { id: 'a1', memberId: 'm4', memberName: 'Suma Akter', avatar: '👩‍💻', type: 'studied', content: 'তড়িৎ চৌম্বকীয় আবেশ অধ্যায় শেষ করলাম', subject: 'physics', timestamp: '১৫ মিনিট আগে', reactions: 5 },
      { id: 'a2', memberId: 'm2', memberName: 'Nadia Islam', avatar: '👩‍🎓', type: 'stuck', content: 'Kirchhoff\'s law-এ আটকে গেছি, কেউ সাহায্য করতে পারবে?', subject: 'physics', timestamp: '৩০ মিনিট আগে', reactions: 3 },
      { id: 'a3', memberId: 'm1', memberName: 'Rafiq Ahmed', avatar: '👨‍🎓', type: 'join_me', content: 'আজ রাত ৯টায় একসাথে পড়ব — আসো!', timestamp: '১ ঘন্টা আগে', reactions: 7 },
      { id: 'a4', memberId: 'm3', memberName: 'Tariq Hossain', avatar: '🧑‍🎓', type: 'completed', content: 'আলোর বিচ্ছুরণ ও বর্ণ অধ্যায়ের সব MCQ শেষ ✅', subject: 'physics', timestamp: '৩ ঘন্টা আগে', reactions: 12 },
      { id: 'a5', memberId: 'm5', memberName: 'Milon Roy', avatar: '👨‍💻', type: 'joined', content: 'এই সার্কেলে যোগ দিয়েছি', timestamp: 'গতকাল', reactions: 4 },
    ],
  },
  {
    id: 'ssc-math-squad',
    name: 'SSC Math Squad',
    tagline: 'গণিত কঠিন না — একসাথে সহজ',
    class: ['class9', 'class10'],
    goals: ['exam_prep', 'weak_subject'],
    subjects: ['math', 'ict'],
    timeSlot: ['afternoon', 'evening'],
    sharedGoal: 'SSC গণিত সব অধ্যায় + মডেল টেস্ট',
    nextSession: 'আগামীকাল বিকাল ৫টায়',
    weeklyTarget: 'বীজগণিত অধ্যায় সম্পন্ন + ২টি পরীক্ষা',
    coverEmoji: '📐',
    color: '#E91E8C',
    maxMembers: 15,
    members: [
      { id: 'm6', name: 'Rina Begum', avatar: '👩‍🎓', class: 'class10', lastActive: '১ ঘন্টা আগে', streak: 15 },
      { id: 'm7', name: 'Karim Uddin', avatar: '👨‍🎓', class: 'class10', lastActive: '৪৫ মিনিট আগে', streak: 9 },
      { id: 'm8', name: 'Puja Das', avatar: '👩‍💻', class: 'class9', lastActive: '২ ঘন্টা আগে', streak: 6 },
      { id: 'm9', name: 'Arif Khan', avatar: '🧑‍🎓', class: 'class10', lastActive: 'এইমাত্র', streak: 18 },
      { id: 'm10', name: 'Shirin Akter', avatar: '👩‍🎓', class: 'class9', lastActive: '৩ ঘন্টা আগে', streak: 4 },
      { id: 'm11', name: 'Babu Mia', avatar: '👨‍💻', class: 'class10', lastActive: '৬ ঘন্টা আগে', streak: 2 },
    ],
    activity: [
      { id: 'b1', memberId: 'm9', memberName: 'Arif Khan', avatar: '🧑‍🎓', type: 'join_me', content: 'এখন বীজগণিত practise করছি — আসো একসাথে', subject: 'math', timestamp: '১০ মিনিট আগে', reactions: 8 },
      { id: 'b2', memberId: 'm6', memberName: 'Rina Begum', avatar: '👩‍🎓', type: 'completed', content: 'ত্রিকোণমিতি অধ্যায় শেষ! ৪৫/৫০ MCQ ✅', subject: 'math', timestamp: '১ ঘন্টা আগে', reactions: 14 },
      { id: 'b3', memberId: 'm8', memberName: 'Puja Das', avatar: '👩‍💻', type: 'stuck', content: 'লগারিদম সমীকরণে সমস্যা হচ্ছে, কেউ বোঝাতে পারবে?', subject: 'math', timestamp: '২ ঘন্টা আগে', reactions: 2 },
      { id: 'b4', memberId: 'm7', memberName: 'Karim Uddin', avatar: '👨‍🎓', type: 'studied', content: 'সেট থিওরি + ফাংশন — দুটো অধ্যায় একদিনে', subject: 'math', timestamp: '৪ ঘন্টা আগে', reactions: 9 },
    ],
  },
  {
    id: 'hsc-biology-stars',
    name: 'HSC Biology Stars',
    tagline: 'জীববিজ্ঞান — মুখস্থ নয়, বোঝো',
    class: ['class11', 'class12'],
    goals: ['exam_prep', 'weak_subject', 'admission_prep'],
    subjects: ['biology', 'chemistry'],
    timeSlot: ['morning', 'afternoon'],
    sharedGoal: 'মেডিকেল ভর্তি প্রস্তুতি — জীববিজ্ঞান ১ম ও ২য় পত্র',
    nextSession: 'আজ সকাল ৮টায়',
    weeklyTarget: 'কোষ বিভাজন + উদ্ভিদ শারীরতত্ত্ব অধ্যায়',
    coverEmoji: '🧬',
    color: '#00B894',
    maxMembers: 10,
    members: [
      { id: 'm12', name: 'Fatema Khatun', avatar: '👩‍🔬', class: 'class12', lastActive: '২০ মিনিট আগে', streak: 25 },
      { id: 'm13', name: 'Nasir Hossain', avatar: '👨‍🔬', class: 'class12', lastActive: '৫০ মিনিট আগে', streak: 11 },
      { id: 'm14', name: 'Dilara Parvin', avatar: '👩‍🎓', class: 'class11', lastActive: '১.৫ ঘন্টা আগে', streak: 7 },
      { id: 'm15', name: 'Imran Ali', avatar: '🧑‍🔬', class: 'class12', lastActive: '৩ ঘন্টা আগে', streak: 14 },
    ],
    activity: [
      { id: 'c1', memberId: 'm12', memberName: 'Fatema Khatun', avatar: '👩‍🔬', type: 'join_me', content: 'সকাল ৮টায় মাইটোসিস-মিয়োসিস পড়ব একসাথে', subject: 'biology', timestamp: 'এইমাত্র', reactions: 6 },
      { id: 'c2', memberId: 'm15', memberName: 'Imran Ali', avatar: '🧑‍🔬', type: 'studied', content: 'নিউক্লিক এসিড সম্পূর্ণ নোট তৈরি করলাম', subject: 'biology', timestamp: '৩ ঘন্টা আগে', reactions: 10 },
      { id: 'c3', memberId: 'm13', memberName: 'Nasir Hossain', avatar: '👨‍🔬', type: 'stuck', content: 'ক্রেবস চক্র এখনো পুরোপুরি বুঝিনি', subject: 'biology', timestamp: '৫ ঘন্টা আগে', reactions: 4 },
      { id: 'c4', memberId: 'm14', memberName: 'Dilara Parvin', avatar: '👩‍🎓', type: 'completed', content: 'গত সপ্তাহের সব target শেষ 🎉', timestamp: 'গতকাল', reactions: 16 },
    ],
  },
  {
    id: 'ssc-science-group',
    name: 'SSC Science Warriors',
    tagline: 'বিজ্ঞান বিভাগ — একসাথে জিতব',
    class: ['class9', 'class10'],
    goals: ['exam_prep', 'daily_habit'],
    subjects: ['physics', 'chemistry', 'biology', 'math'],
    timeSlot: ['morning', 'night'],
    sharedGoal: 'SSC বিজ্ঞান বিভাগ সম্পূর্ণ প্রস্তুতি',
    nextSession: 'আজ রাত ১০টায়',
    weeklyTarget: 'রসায়ন ও পদার্থ — ২টি অধ্যায় প্রতিটি',
    coverEmoji: '🔬',
    color: '#FF6B35',
    maxMembers: 14,
    members: [
      { id: 'm16', name: 'Rakib Hassan', avatar: '👨‍🎓', class: 'class10', lastActive: '৩০ মিনিট আগে', streak: 10 },
      { id: 'm17', name: 'Mitu Akter', avatar: '👩‍🎓', class: 'class10', lastActive: '১ ঘন্টা আগে', streak: 6 },
      { id: 'm18', name: 'Joy Das', avatar: '🧑‍🎓', class: 'class9', lastActive: '২ ঘন্টা আগে', streak: 3 },
      { id: 'm19', name: 'Amena Khatun', avatar: '👩‍💻', class: 'class10', lastActive: '৪ ঘন্টা আগে', streak: 8 },
      { id: 'm20', name: 'Sajid Islam', avatar: '👨‍💻', class: 'class9', lastActive: '৬ ঘন্টা আগে', streak: 1 },
    ],
    activity: [
      { id: 'd1', memberId: 'm16', memberName: 'Rakib Hassan', avatar: '👨‍🎓', type: 'studied', content: 'অ্যাসিড-ক্ষার বিক্রিয়া অধ্যায় সম্পন্ন', subject: 'chemistry', timestamp: '৩০ মিনিট আগে', reactions: 7 },
      { id: 'd2', memberId: 'm17', memberName: 'Mitu Akter', avatar: '👩‍🎓', type: 'stuck', content: 'আলোর প্রতিসরণে সমস্যা হচ্ছে', subject: 'physics', timestamp: '১ ঘন্টা আগে', reactions: 3 },
      { id: 'd3', memberId: 'm18', memberName: 'Joy Das', avatar: '🧑‍🎓', type: 'join_me', content: 'রাত ১০টায় একসাথে পড়ি?', timestamp: '২ ঘন্টা আগে', reactions: 5 },
    ],
  },
  {
    id: 'hsc-english-masters',
    name: 'HSC English Masters',
    tagline: 'ইংরেজি ভয় দূর করি একসাথে',
    class: ['class11', 'class12'],
    goals: ['weak_subject', 'exam_prep'],
    subjects: ['english', 'bangla'],
    timeSlot: ['afternoon', 'evening'],
    sharedGoal: 'HSC ইংরেজি ১ম ও ২য় পত্র — Writing + Grammar',
    nextSession: 'আগামীকাল বিকাল ৪টায়',
    weeklyTarget: 'Essay writing + ৫০টি grammar MCQ',
    coverEmoji: '📚',
    color: '#0984E3',
    maxMembers: 12,
    members: [
      { id: 'm21', name: 'Tania Akter', avatar: '👩‍📚', class: 'class12', lastActive: '৪৫ মিনিট আগে', streak: 13 },
      { id: 'm22', name: 'Sabbir Rahman', avatar: '👨‍📚', class: 'class11', lastActive: '২ ঘন্টা আগে', streak: 7 },
      { id: 'm23', name: 'Anika Sultana', avatar: '👩‍🎓', class: 'class12', lastActive: '৩ ঘন্টা আগে', streak: 19 },
    ],
    activity: [
      { id: 'e1', memberId: 'm21', memberName: 'Tania Akter', avatar: '👩‍📚', type: 'completed', content: 'Paragraph writing ৫টি শেষ করলাম', subject: 'english', timestamp: '৪৫ মিনিট আগে', reactions: 8 },
      { id: 'e2', memberId: 'm22', memberName: 'Sabbir Rahman', avatar: '👨‍📚', type: 'stuck', content: 'Conditional sentences বুঝছি না', subject: 'english', timestamp: '২ ঘন্টা আগে', reactions: 2 },
      { id: 'e3', memberId: 'm23', memberName: 'Anika Sultana', avatar: '👩‍🎓', type: 'join_me', content: 'Grammar session — আজ বিকাল ৪টায়', timestamp: '৩ ঘন্টা আগে', reactions: 6 },
    ],
  },
  {
    id: 'class9-allrounder',
    name: 'Class 9 All-Rounders',
    tagline: 'নবম শ্রেণীর শুরু থেকে শক্ত ভিত্তি',
    class: ['class9'],
    goals: ['daily_habit', 'weak_subject'],
    subjects: ['math', 'english', 'bangla', 'ict'],
    timeSlot: ['afternoon', 'evening'],
    sharedGoal: 'নবম শ্রেণীর সব বিষয় — নিয়মিত পড়ার অভ্যাস তৈরি',
    nextSession: 'আজ বিকাল ৫:৩০টায়',
    weeklyTarget: 'প্রতিদিন ২ ঘন্টা — সব বিষয় কভার',
    coverEmoji: '🌟',
    color: '#FDCB6E',
    maxMembers: 16,
    members: [
      { id: 'm24', name: 'Mahdi Islam', avatar: '👦', class: 'class9', lastActive: '১ ঘন্টা আগে', streak: 4 },
      { id: 'm25', name: 'Rupa Begum', avatar: '👧', class: 'class9', lastActive: '২ ঘন্টা আগে', streak: 6 },
      { id: 'm26', name: 'Tomal Ahmed', avatar: '🧒', class: 'class9', lastActive: '৩ ঘন্টা আগে', streak: 2 },
    ],
    activity: [
      { id: 'f1', memberId: 'm24', memberName: 'Mahdi Islam', avatar: '👦', type: 'studied', content: 'আজকে গণিত আর ইংরেজি দুটোই পড়লাম', timestamp: '১ ঘন্টা আগে', reactions: 5 },
      { id: 'f2', memberId: 'm25', memberName: 'Rupa Begum', avatar: '👧', type: 'join_me', content: 'বিকাল ৫:৩০টায় একসাথে পড়ি?', timestamp: '২ ঘন্টা আগে', reactions: 3 },
    ],
  },
];
