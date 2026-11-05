import { useState, type FormEvent } from 'react';
import type { Employee } from '../../types';
import './styles.css';

interface EmployeeFormProps {
  onAdd: (employee: Employee) => void;
}

export const EmployeeForm = ({ onAdd }: EmployeeFormProps) => {
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
      <button onClick={() => setModalIsOpen(true)}>Adicionar funcionario</button>
      
      {modalIsOpen &&
        <div className="container">
          <div className="modal">
            <header className='header-modal'>
              <h2>Cadastrar funcionário</h2> 
              <button onClick={() => setModalIsOpen(false)}>X</button>
            </header>

            <form className="employee-form" onSubmit={handleSubmit}>
              <label>
                Nome
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome"
                  required
                />
              </label>

              <label>
                Chave Pix
                <input
                  value={pixKey}
                  onChange={(event) => setPixKey(event.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  required
                />
              </label>

              <label>
                Valor da hora (R$)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(event.target.value)}
                  placeholder="18.00"
                  required
                />
              </label>

              <button className='register' type="submit">Adicionar funcionário</button>
            </form>
          </div>
        </div>
      }
    </>
  );
};
