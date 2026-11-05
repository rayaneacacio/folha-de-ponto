export function calculatePayment(
  minutes: number,
  hourlyRate: number,
): number {
  return (minutes / 60) * hourlyRate;
}

export function formatCurrency(value: number): string {
  console.log('🚀 ~ formatCurrency ~ value:', value);
  const tetse=  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
  console.log('🚀 ~ formatCurrency ~ tetse:', tetse);
  return tetse;
}

export function getWeekStart(date: string): string {
  const result = new Date(`${date}T12:00:00`);
  const day = result.getDay();

  // Domingo (0) volta seis dias; os demais voltam até segunda.
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);

  const year = result.getFullYear();
  const month = String(result.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(result.getDate()).padStart(2, '0');

  return `${year}-${month}-${dayOfMonth}`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}