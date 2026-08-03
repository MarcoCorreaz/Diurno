import { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Converts a raw Firestore document (with possible missing fields)
 * into a fully-typed Task with safe defaults.
 */
export function toTask(id: string, data: Record<string, unknown>): Task {
  return {
    id,
    title: (data.title as string) || "",
    completed: (data.completed as boolean) ?? false,
    time: (data.time as string) || "",
    category: data.category as string | undefined,
    dayOfWeek: data.dayOfWeek as string | undefined,
    userId: (data.userId as string) || "",
    currentStreak: (data.currentStreak as number) ?? 0,
    maxStreak: (data.maxStreak as number) ?? 0,
    totalCompletions: (data.totalCompletions as number) ?? 0,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
  };
}
