import { useState } from 'react';

import type { WeekDay } from '../../../types';
import { locales } from '../locales';
import { parseDuration } from '../utils/parse-duration';
import { formatDuration } from '../utils/format-duration';
import { useTimesheet } from '../context';

interface EndTimeProps {
  day: WeekDay;
}

export const StartTime = ({ day }: EndTimeProps) => {
  const { startTimePlaceholder, startTimeLabel, invalidTimeError } = locales;

  const { startTimes, setStartTimes } = useTimesheet();
  const value = startTimes[day];
  const [error, setError] = useState('');

  const handleStartTimeChange = (day: WeekDay, value: string) => {
    setStartTimes((current) => ({
      ...current,
      [day]: value,
    }));
  };

  const handleChange = (newValue: string) => {
    handleStartTimeChange(day, newValue);
    setError('');
  };

  const handleBlur = () => {
    if (value === '') return setError('');

    const parsed = parseDuration(value);
    const timeMatch = formatDuration(parsed ? parsed : 0);

    if (!timeMatch) {
      setError(invalidTimeError);
      return;
    }

    setError('');
    setStartTimes((current) => ({
      ...current,
      [day]: timeMatch,
    }));
  };

  return (
    <div>
      <input
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        aria-label={startTimeLabel.replace('{{day}}', day)}
        aria-invalid={Boolean(error)}
        placeholder={startTimePlaceholder}
      />

      {error && (
        <small role="alert" className="field-error">
          {error}
        </small>
      )}
    </div>
  );
};