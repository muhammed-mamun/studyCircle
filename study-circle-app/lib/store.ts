import { AppState } from './types';

const KEY = 'studycircle_state';

const DEFAULT_STATE: AppState = {
  hasCompletedOnboarding: false,
  studentProfile: null,
  joinedCircleId: null,
};

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: Partial<AppState>): AppState {
  const current = loadState();
  const next = { ...current, ...state };
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function resetState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY);
  }
}
