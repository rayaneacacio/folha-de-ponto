import { useState } from 'react';

import { type Employee } from '../../../types';
import { locales } from '../locales';

interface WeeklyTimesheetProps {
  employee: Employee;
}

export const Pix = ({ employee }: WeeklyTimesheetProps) => {
  const { pixLabel, copyButton, pixCopied, pixError } = locales;

  const [pixMessage, setPixMessage] = useState('');

  const handleCopyPix = async() => {
    if (!employee) return;

    try {
      await navigator.clipboard.writeText(employee.pixKey);
      setPixMessage(pixCopied);
      setTimeout(() => setPixMessage(''), 2000);
    } catch {
      setPixMessage(pixError);
    }
  };

  return (
    <div className="pix">
      <div className="pix-details">
        <div>
          <span>{pixLabel}</span>
          <strong className="pix-key">{employee.pixKey}</strong>
        </div>

        <button
          type="button"
          className="secondary"
          onClick={handleCopyPix}
        >
          {copyButton}
        </button>
      </div>

      {pixMessage && (
        <p role="status">{pixMessage}</p>
      )}
    </div>
  );
};