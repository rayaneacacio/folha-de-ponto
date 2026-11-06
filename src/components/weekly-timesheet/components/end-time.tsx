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
  const contextValue = endTimes[day] ?? '';

  const [prevValue, setPrevValue] = useState(contextValue);
  const [inputValue, setInputValue] = useState(contextValue);
  const [error, setError] = useState('');

  if (prevValue !== contextValue) {
    setPrevValue(contextValue);
    setInputValue(contextValue);
    setError('');
  }

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    if (error) setError('');

    setEndTimes((current) => ({
      ...current,
      [day]: newValue,
    }));
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();

    if (trimmed === '') {
      setError('');
      setEndTimes((current) => ({
        ...current,
        [day]: '',
      }));
      return;
    }

    const parsed = parseDuration(trimmed);

    if (parsed === null) {
      setError(invalidTimeError);
      return;
    }

    const formatted = formatDuration(parsed, true);
    setError('');
    setInputValue(formatted);
    setEndTimes((current) => ({
      ...current,
      [day]: formatted,
    }));
  };

  return (
    <div>
      <input
        value={inputValue}
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