export const formatDuration = (
  totalMinutes: number,
  allowZero = false,
): string => {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return '';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) {
    return allowZero ? '0h00' : '';
  }

  return `${hours}h${String(minutes).padStart(2, '0')}`;
};