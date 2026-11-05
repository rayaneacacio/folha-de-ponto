import { parseDuration } from './parse-duration';

export function calculateWorkedMinutes(
  startTime: string,
  endTime: string,
  intervalMinutes: number,
): number {
  if (!startTime || !endTime) return 0;

  const start = parseDuration(startTime);
  const end = parseDuration(endTime);

  if (start === null || end === null) return 0;

  const workedMinutes = end - start - intervalMinutes;

  return Math.max(0, workedMinutes);
}