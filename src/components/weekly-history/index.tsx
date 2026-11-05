import type { WeeklyRecord } from '../../types';
import { calculatePayment, formatCurrency, formatDate } from '../../utils/currency';

interface WeeklyHistoryProps {
  records: WeeklyRecord[];
  onSelectWeek: (weekStart: string) => void;
}

export const WeeklyHistory = ({
  records,
  onSelectWeek,
}: WeeklyHistoryProps) => {
  const sortedRecords = [...records].sort((a, b) => b.weekStart.localeCompare(a.weekStart));

  if (sortedRecords.length === 0) {
    return (
      <section className="history">
        <h2>Histórico semanal</h2>
        <p>Nenhuma semana registrada ainda.</p>
      </section>
    );
  }

  return (
    <section className="history">
      <h2>Histórico semanal</h2>

      <div className="history-list">
        {sortedRecords.map((record) => {
          const totalMinutes = Object.values(record.minutes).reduce(
            (total, value) => total + value,
            0,
          );

          const totalPayment = calculatePayment(
            totalMinutes,
            record.hourlyRate,
          );

          return (
            <button
              type="button"
              className="history-item"
              key={record.id}
              onClick={() => onSelectWeek(record.weekStart)}
            >
              <span>
                <strong>Semana de {formatDate(record.weekStart)}</strong>
                <small>{totalMinutes} minutos trabalhados</small>
              </span>

              <strong>{formatCurrency(totalPayment)}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
};