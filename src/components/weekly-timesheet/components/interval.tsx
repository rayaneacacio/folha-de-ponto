import { useState } from 'react';

import {
  WEEK_DAYS,
  type DailyMinutes,
  type WeekDay,
} from '../../../types';

import { locales } from '../locales';
import '../styles.css';
import { formatDuration } from '../utils/format-duration';
import { parseDuration } from '../utils/parse-duration';

interface WeeklyTimesheetProps {
  day: WeekDay;
  minutes: DailyMinutes;
  onMinutesChange: (day: WeekDay, value: number) => void;
}

export const Interval = ({
  day,
  minutes,
  onMinutesChange,
}: WeeklyTimesheetProps) => {
  const { intervalPlaceholder, invalidDurationError } = locales;

  const [durationInputs, setDurationInputs] = useState<
    Record<WeekDay, string>
  >(() => {
    return Object.fromEntries(
      WEEK_DAYS.map((day) => [day, formatDuration(minutes[day])]),
    ) as Record<WeekDay, string>;
  });

  const [durationErrors, setDurationErrors] = useState<
    Partial<Record<WeekDay, string>>
  >({});

  const handleDurationChange = (day: WeekDay, value: string) => {
    setDurationInputs((current) => ({
      ...current,
      [day]: value,
    }));

    if (value.trim() === '') {
      setDurationErrors((current) => ({ ...current, [day]: undefined }));
      onMinutesChange(day, 0);
      return;
    }

    setDurationErrors((current) => ({ ...current, [day]: undefined }));
  };

  const handleDurationFocus = (day: WeekDay) => {
    if (durationInputs[day] === '') {
      setDurationInputs((current) => ({
        ...current,
        [day]: '',
      }));
    }
  };

  const handleDurationBlur = (day: WeekDay) => {
    const value = durationInputs[day].trim();

    if (value === '') {
      setDurationInputs((current) => ({
        ...current,
      }));

      setDurationErrors((current) => ({
        ...current,
        [day]: undefined,
      }));

      onMinutesChange(day, 0);
      return;
    }

    const parsed = parseDuration(value);

    if (parsed === null) {
      setDurationErrors((current) => ({
        ...current,
        [day]: invalidDurationError,
      }));
      return;
    }

    setDurationInputs((current) => ({
      ...current,
      [day]: formatDuration(parsed),
    }));

    setDurationErrors((current) => ({
      ...current,
      [day]: undefined,
    }));

    onMinutesChange(day, parsed);
  };

  return (
    <div>
      <input
        value={durationInputs[day]}
        onChange={(event) =>
          handleDurationChange(day, event.target.value)
        }
        onFocus={() => handleDurationFocus(day)}
        onBlur={() => handleDurationBlur(day)}
        placeholder={intervalPlaceholder}
      />

      {durationErrors[day] && (
        <small role="alert" className="field-error">
          {durationErrors[day]}
        </small>
      )}
    </div>
  );
};