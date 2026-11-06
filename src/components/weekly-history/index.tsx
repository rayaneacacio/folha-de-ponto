import { useMemo } from 'react';
import type { WeeklyRecord } from '../../types';
import { calculatePayment, formatCurrency, formatDate } from '../../utils/currency';
import { locales } from './locales';

interface WeeklyHistoryProps {
  records: WeeklyRecord[];
  onSelectWeek: (weekStart: string) => void;
}

export const WeeklyHistory = ({
  records,
  onSelectWeek,
}: WeeklyHistoryProps) => {
  const { weeklyHistoryTitleLabel, historyEmptyLabel, weekLabel, workedMinutesLabel } = locales;

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) =>
      b.weekStart.localeCompare(a.weekStart),
    );
  }, [records]);

  if (sortedRecords.length === 0) {
    return (
      <section className="history">
        <h2>{weeklyHistoryTitleLabel}</h2>
        <p>{historyEmptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="history">
      <h2>{weeklyHistoryTitleLabel}</h2>

      <div className="history-list">
        {sortedRecords.map((record) => {
          const totalMinutes = Object.values(record.minutes).reduce(
            (total, value) => total + value,
            0,
          );

          const totalPayment = calculatePayment(totalMinutes, record.hourlyRate);

          return (
            <button
              type="button"
              className="history-item"
              key={record.id}
              onClick={() => onSelectWeek(record.weekStart)}
            >
              <span>
                <strong>{weekLabel} {formatDate(record.weekStart)}</strong>
                <small>{totalMinutes} {workedMinutesLabel}</small>
              </span>

              <strong>{formatCurrency(totalPayment)}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
};