import { useState, type FormEvent } from 'react';
import type { Employee } from '../../types';
import './styles.css';
import { locales } from './locales';

interface EmployeeFormProps {
  onAdd: (employee: Employee) => void;
}

export const EmployeeForm = ({ onAdd }: EmployeeFormProps) => {
  const {
    addEmployeeLabel, 
    title, 
    nameLabel,
    pixKeyLabel, 
    pixKeyPlaceholder, 
    hourlyRateLabel, 
    hourlyRatePlaceholder, 
    submitButtonLabel,
  } = locales;

  const [name, setName] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedPixKey = pixKey.trim();
    const rate = Number(hourlyRate);

    if (
      !normalizedName ||
      !normalizedPixKey ||
      hourlyRate.trim() === '' ||
      !Number.isFinite(rate) ||
      rate < 0
    )
      return;

    onAdd({
      id: crypto.randomUUID(),
      name: normalizedName,
      pixKey: normalizedPixKey,
      hourlyRate: rate,
    });

    setName('');
    setPixKey('');
    setHourlyRate('');
    setModalIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>{addEmployeeLabel}</button>
      
      {modalIsOpen &&
        <div className="container">
          <div className="modal">
            <header className='header-modal'>
              <h2>{title}</h2> 
              <button onClick={() => setModalIsOpen(false)}>X</button>
            </header>

            <form className="employee-form" onSubmit={handleSubmit}>
              <label>
                {nameLabel}
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={nameLabel}
                  required
                />
              </label>

              <label>
                {pixKeyLabel}
                <input
                  value={pixKey}
                  onChange={(event) => setPixKey(event.target.value)}
                  placeholder={pixKeyPlaceholder}
                  required
                />
              </label>

              <label>
                {hourlyRateLabel}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(event.target.value)}
                  placeholder={hourlyRatePlaceholder}
                  required
                />
              </label>

              <button className='register' type="submit">{submitButtonLabel}</button>
            </form>
          </div>
        </div>
      }
    </>
  );
};
