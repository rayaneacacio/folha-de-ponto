import { useRef } from 'react';
import { useWeeklyRecords } from '../../contexts/weekly-records-context';
import { formatDate } from '../../utils/currency';
import { locales } from './locales';
import './styles.css';

export const WeekSelector = () => {
  const { weekDateLabel, weekStartLabel } = locales;
  const { selectedDate, setSelectedDate, weekStart } = useWeeklyRecords();

  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    try {
      inputRef.current?.showPicker();
    } catch { /* empty */   }
  };

  return (
    <section className="week-selector">
      <label htmlFor="weekDate" onClick={openPicker}>
        {weekDateLabel}
      </label>

      <input
        ref={inputRef}
        id="weekDate"
        type="date"
        value={selectedDate}
        onClick={openPicker}
        onChange={(event) => setSelectedDate(event.target.value)}
      />

      <p>
        {weekStartLabel} {formatDate(weekStart)}
      </p>
    </section>
  );
};