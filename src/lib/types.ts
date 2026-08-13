export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: string;
  category?: string;
  dayOfWeek?: string;
  userId: string;
  currentStreak: number;
  maxStreak: number;
  totalCompletions: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  goal?: string;
  energy?: string;
  routineDetails?: string;
  plan?: 'free' | 'pro' | 'lifetime';
  asaasCustomerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Converts a raw database document/row into a fully-typed Task with safe defaults.
 */
export function toTask(id: string, data: Record<string, any>): Task {
  return {
    id,
    title: (data.title as string) || "",
    completed: (data.completed as boolean) ?? false,
    time: (data.time as string) || "",
    category: data.category as string | undefined,
    dayOfWeek: (data.dayOfWeek || data.day_of_week) as string | undefined,
    userId: (data.userId || data.user_id) as string || "",
    currentStreak: (data.currentStreak || data.current_streak) ?? 0,
    maxStreak: (data.maxStreak || data.max_streak) ?? 0,
    totalCompletions: (data.totalCompletions || data.total_completions) ?? 0,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
    completedAt: data.completedAt || data.completed_at || undefined,
  };
}
