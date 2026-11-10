import { useState } from 'react';

import { locales } from '../locales';
import { formatTime, parseTime } from '../utils/time';

interface TimeInputProps {
  value: string;
  label: string;
  placeholder: string;
  error?: string;
  onCommit: (value: string) => void;
}

export const TimeInput = ({
  value,
  label,
  placeholder,
  error,
  onCommit,
}: TimeInputProps) => {
  const { invalidTimeError } = locales;

  const [prevValue, setPrevValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);
  const [formatError, setFormatError] = useState('');

  if (prevValue !== value) {
    setPrevValue(value);
    setInputValue(value);
    setFormatError('');
  }

  const handleBlur = () => {
    const trimmed = inputValue.trim();

    if (trimmed === '') {
      setFormatError('');
      setInputValue('');
      if (value !== '') onCommit('');
      return;
    }

    const parsed = parseTime(trimmed);

    if (parsed === null) {
      setFormatError(invalidTimeError);
      return;
    }

    const formatted = formatTime(parsed);
    setFormatError('');
    setInputValue(formatted);

    if (formatted !== value) onCommit(formatted);
  };

  const message = formatError || error;

  return (
    <div>
      <input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          if (formatError) setFormatError('');
        }}
        onBlur={handleBlur}
        aria-label={label}
        aria-invalid={Boolean(message)}
        placeholder={placeholder}
        inputMode="numeric"
      />

      {message && (
        <small role="alert" className="field-error">{message}</small>
      )}
    </div>
  );
};