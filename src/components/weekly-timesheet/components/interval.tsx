import { useState } from 'react';

import { type DailyMinutes, type WeekDay } from '../../../types';
import { locales } from '../locales';
import '../styles.css';
import { formatDuration } from '../utils/format-duration';
import { parseDuration } from '../utils/parse-duration';

interface IntervalProps {
  day: WeekDay;
  minutes: DailyMinutes;
  onMinutesChange: (day: WeekDay, value: number) => void;
}

export const Interval = ({
  day,
  minutes,
  onMinutesChange,
}: IntervalProps) => {
  const { intervalPlaceholder, invalidDurationError } = locales;

  const currentMinutes = minutes[day] ?? 0;

  const [prevMinutes, setPrevMinutes] = useState(currentMinutes);
  const [inputValue, setInputValue] = useState(() => formatDuration(currentMinutes));
  const [error, setError] = useState<string | null>(null);

  if (prevMinutes !== currentMinutes) {
    setPrevMinutes(currentMinutes);
    setInputValue(formatDuration(currentMinutes));
    setError(null);
  }

  const handleChange = (value: string) => {
    setInputValue(value);
    if (error) setError(null);

    if (value.trim() === '') onMinutesChange(day, 0);
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();

    if (trimmed === '') {
      setError(null);
      onMinutesChange(day, 0);
      return;
    }

    const parsed = parseDuration(trimmed);

    if (parsed === null) {
      setError(invalidDurationError);
      return;
    }

    setError(null);
    setInputValue(formatDuration(parsed));
    onMinutesChange(day, parsed);
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        placeholder={intervalPlaceholder}
        aria-invalid={Boolean(error)}
      />

      {error && (
        <small role="alert" className="field-error">
          {error}
        </small>
      )}
    </div>
  );
};