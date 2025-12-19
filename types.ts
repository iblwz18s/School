export interface Student {
  id: string;
  name: string;
  phone: string;
  baseScore: number; // 80
}

export enum ViolationLevel {
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
  Fifth = 5
}

export interface ViolationRule {
  id: string;
  level: ViolationLevel;
  description: string;
  deduction: number; // Points to deduct
  procedures: string[]; // Array of procedures
  category?: 'general' | 'staff'; // To separate staff offenses
}

export interface PositiveRule {
  id: string;
  description: string;
  points: number;
  isVariable?: boolean; // If true, points can be edited up to a max
}

export interface StudentRecord {
  id: string;
  studentId: string;
  type: 'NEGATIVE' | 'POSITIVE';
  date: string; // ISO String
  details: string; // Violation description or Positive behavior description
  points: number; // Negative for violations, Positive for rewards
  observer: string; // Who recorded it
  procedureApplied?: string; // Specific to negative behavior
  violationId?: string; // To track repetition
}

export interface AppState {
  records: StudentRecord[];
  currentUser: string | null; // 'admin' or null
}