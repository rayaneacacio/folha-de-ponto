import { useState, type FormEvent } from 'react';
import { useEmployees } from '../../contexts/employee-context';
import { locales } from './locales';
import './styles.css';

export const EmployeeForm = () => {
  const {
    addEmployeeLabel,
    title,
    nameLabel,
    pixKeyLabel,
    pixKeyPlaceholder,
    hourlyRateLabel,
    hourlyRatePlaceholder,
    submitButtonLabel,
    addEmployeeError,
    isSubmittingLabel,
  } = locales;

  const { createEmployee } = useEmployees();

  const [name, setName] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createEmployee({
        name: normalizedName,
        pixKey: normalizedPixKey,
        hourlyRate: rate,
      });

      setName('');
      setPixKey('');
      setHourlyRate('');
      setModalIsOpen(false);
    } catch {
      alert(addEmployeeError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setModalIsOpen(true)}>
        {addEmployeeLabel}
      </button>

      {modalIsOpen && (
        <div className="container">
          <div className="modal">
            <header className="header-modal">
              <h2>{title}</h2>
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                disabled={isSubmitting}
              >
                X
              </button>
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

              <button className="register" type="submit" disabled={isSubmitting}>
                {isSubmitting ? isSubmittingLabel : submitButtonLabel}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};