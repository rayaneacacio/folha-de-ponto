export const parseDuration = (value: string): number | null => {
  const normalized = value.trim().toLowerCase();

  // Exemplos: 3h30, 3h, 45min, 3:30
  const hoursMatch = normalized.match(/^(\d+)\s*h(?:\s*(\d{1,2}))?$/);
  const minutesMatch = normalized.match(/^(\d+)\s*min$/);
  const colonMatch = normalized.match(/^(\d+):([0-5]\d)$/);
  const numberMatch = normalized.match(/^\d+$/);

  if (hoursMatch) {
    const hours = Number(hoursMatch[1]);
    const minutes = Number(hoursMatch[2] ?? 0);

    if (minutes >= 60) return null;

    return hours * 60 + minutes;
  }

  if (minutesMatch) {
    return Number(minutesMatch[1]);
  }

  if (colonMatch) {
    return Number(colonMatch[1]) * 60 + Number(colonMatch[2]);
  }

  // Número sem unidade é considerado hora
  if (numberMatch) {
    return Number(normalized) * 60;
  }

  return null;
};