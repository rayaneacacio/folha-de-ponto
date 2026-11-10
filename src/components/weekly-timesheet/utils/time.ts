import {
  WEEK_DAYS,
  type DailyEntries,
  type DailyMinutes,
  type DayEntry,
} from '../../../types';

/**
 * Converte o texto digitado em minutos desde 00:00.
 * Aceita: "7", "7h", "7h30", "7:30", "07:30", "730", "0730", "7h30min".
 * Retorna null se o horário for inválido.
 */
export const parseTime = (raw: string): number | null => {
  const value = raw.trim().toLowerCase().replace(/\s+/g, '');
  if (!value) return null;

  let hours: number;
  let minutes: number;

  const compact = value.match(/^(\d{1,2})(\d{2})$/); // 730, 0730
  const regular = value.match(/^(\d{1,2})(?:[:h.](\d{0,2}))?(?:min|m)?$/);

  if (compact) {
    hours = Number(compact[1]);
    minutes = Number(compact[2]);
  } else if (regular) {
    hours = Number(regular[1]);
    minutes = regular[2] ? Number(regular[2]) : 0;
  } else {
    return null;
  }

  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
};

export const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/** Minutos entre início e fim. Período incompleto ou invertido conta 0. */
export const calculatePeriodMinutes = (start: string, end: string): number => {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);

  if (startMinutes === null || endMinutes === null) return 0;
  if (endMinutes <= startMinutes) return 0;

  return endMinutes - startMinutes;
};

/** True quando os dois horários estão preenchidos e o segundo não é depois do primeiro. */
export const isOutOfOrder = (first: string, second: string): boolean => {
  const a = parseTime(first);
  const b = parseTime(second);
  return a !== null && b !== null && b <= a;
};

export const calculateDayMinutes = (entry: DayEntry): number =>
  calculatePeriodMinutes(entry.morningStart, entry.morningEnd) +
  calculatePeriodMinutes(entry.afternoonStart, entry.afternoonEnd);

/** Horário padrão: 07:00–11:00 e 13:00–17:00. */
export const DEFAULT_DAY_ENTRY: DayEntry = {
  morningStart: '07:00',
  morningEnd: '11:00',
  afternoonStart: '13:00',
  afternoonEnd: '17:00',
};

export const createEmptyEntry = (): DayEntry => ({
  morningStart: '',
  morningEnd: '',
  afternoonStart: '',
  afternoonEnd: '',
});

/** Garante todos os dias/campos, mesmo para registros antigos ou incompletos. */
export const normalizeEntries = (entries?: Partial<DailyEntries>): DailyEntries =>
  WEEK_DAYS.reduce((acc, day) => {
    acc[day] = { ...createEmptyEntry(), ...entries?.[day] };
    return acc;
  }, {} as DailyEntries);

export const toDailyMinutes = (entries: DailyEntries): DailyMinutes =>
  WEEK_DAYS.reduce((acc, day) => {
    acc[day] = calculateDayMinutes(entries[day]);
    return acc;
  }, {} as DailyMinutes);