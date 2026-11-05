
export const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if(hours === 0 && minutes === 0) return '';

  if (minutes === 0) return `${hours}h`;

  return `${hours}h${String(minutes).padStart(2, '0')}`;
};
