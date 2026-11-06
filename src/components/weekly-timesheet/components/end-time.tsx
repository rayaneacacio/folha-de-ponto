import { useState } from 'react';

import type { WeekDay } from '../../../types';
import { locales } from '../locales';
import { parseDuration } from '../utils/parse-duration';
import { formatDuration } from '../utils/format-duration';
import { useTimesheet } from '../context';

interface EndTimeProps {
  day: WeekDay;
}

export const EndTime = ({ day }: EndTimeProps) => {
  const { endTimePlaceholder, endTimeLabel, invalidTimeError } = locales;

  const { endTimes, setEndTimes } = useTimesheet();
  const value = endTimes[day];
  const [error, setError] = useState('');

  const handleEndTimeChange = (day: WeekDay, value: string) => {
    setEndTimes((current) => ({
      ...current,
      [day]: value,
    }));
  };

  const handleChange = (newValue: string) => {
    handleEndTimeChange(day, newValue);
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
    setEndTimes((current) => ({
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
        aria-label={endTimeLabel.replace('{{day}}', day)}
        aria-invalid={Boolean(error)}
        placeholder={endTimePlaceholder}
      />

      {error && (
        <small role="alert" className="field-error">
          {error}
        </small>
      )}
    </div>
  );
};