export type WeekDay =
  | 'Segunda-feira'
  | 'Terça-feira'
  | 'Quarta-feira'
  | 'Quinta-feira'
  | 'Sexta-feira'
  | 'Sábado'
  | 'Domingo';

export const WEEK_DAYS: WeekDay[] = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export type WeekDays = Record<WeekDay, string>;

export interface Employee {
  id: string;
  name: string;
  pixKey: string;
  hourlyRate: number;
}

export interface DayEntry {
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
}

export type DayEntryField = keyof DayEntry;

export type DailyEntries = Record<WeekDay, DayEntry>;

export type DailyMinutes = Record<WeekDay, number>;

export interface WeeklyRecord {
  id: string;
  employeeId: string;
  weekStart: string;
  hourlyRate: number;
  entries?: DailyEntries;
  minutes: DailyMinutes;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  employees: Employee[];
  weeklyRecords: WeeklyRecord[];
}