
import { useState } from 'react';
import {type Employee} from '../../../types';

interface WeeklyTimesheetProps {
  employee: Employee;
}

export const Pix = ({
  employee,
}: WeeklyTimesheetProps) => {
  const [pixMessage, setPixMessage] = useState('');
  
  async function handleCopyPix() {
    if (!employee) return;

    try {
      await navigator.clipboard.writeText(employee.pixKey);
      setPixMessage('Chave Pix copiada!');
      setTimeout(() => setPixMessage(''), 2000);
    } catch {
      setPixMessage('Não foi possível copiar. Verifique a permissão do navegador.');
    }
  };

  return (
    <div className='pix'>
      <div className="pix-details">
        <div>
          <span>Chave Pix</span>
          <strong className="pix-key">{employee.pixKey}</strong>
        </div>

        <button type="button" className="secondary" onClick={handleCopyPix}>
          Copiar Pix
        </button>
      </div>

      {pixMessage && (
        <p role="pix-status">{pixMessage}</p>
      )}
    </div>
  );
};
