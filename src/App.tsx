import { useEffect, useState } from 'react';

import { EmployeeForm } from './components/employee-form/index';
import { EmployeeSelector } from './components/employee-selector/index';
import { WeeklyHistory } from './components/weekly-history/index';
import { WeeklyTimesheet } from './components/weekly-timesheet/index';

import type {
  AppData,
  DailyMinutes,
  Employee,
  WeeklyRecord,
} from './types';

import {
  getToday,
  getWeekStart,
} from './utils/currency';

import {
  loadAppData,
  saveAppData,
} from './utils/storage';

import './index.css';

function createEmptyMinutes(): DailyMinutes {
  return {
    'Segunda-feira': 0,
    'Terça-feira': 0,
    'Quarta-feira': 0,
    'Quinta-feira': 0,
    'Sexta-feira': 0,
    Sábado: 0,
    Domingo: 0,
  };
}

function createWeeklyRecord(
  employee: Employee,
  weekStart: string,
): WeeklyRecord {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    weekStart,
    hourlyRate: employee.hourlyRate,
    minutes: createEmptyMinutes(),
    createdAt: now,
    updatedAt: now,
  };
}

export default function App() {
  const [data, setData] = useState<AppData>(() => loadAppData());

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedDate, setSelectedDate] = useState(getToday());

  const weekStart = getWeekStart(selectedDate);

  const selectedEmployee = data.employees.find(
    (employee) => employee.id === selectedEmployeeId,
  );

  const currentRecord = data.weeklyRecords.find(
    (record) =>
      record.employeeId === selectedEmployeeId &&
      record.weekStart === weekStart,
  );

  const displayedMinutes =
    currentRecord?.minutes ?? createEmptyMinutes();

  const displayedHourlyRate =
    currentRecord?.hourlyRate ?? selectedEmployee?.hourlyRate ?? 0;

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  function addEmployee(employee: Employee) {
    setData((current) => ({
      ...current,
      employees: [...current.employees, employee],
    }));

    setSelectedEmployeeId(employee.id);
  }

  function updateCurrentWeek(
    update: (
      record: WeeklyRecord,
      employee: Employee,
    ) => WeeklyRecord,
  ) {
    if (!selectedEmployee) {
      return;
    }

    setData((current) => {
      const existing = current.weeklyRecords.find(
        (record) =>
          record.employeeId === selectedEmployee.id &&
          record.weekStart === weekStart,
      );

      const baseRecord =
        existing ?? createWeeklyRecord(selectedEmployee, weekStart);

      const updatedRecord = {
        ...update(baseRecord, selectedEmployee),
        updatedAt: new Date().toISOString(),
      };

      const weeklyRecords = existing
        ? current.weeklyRecords.map((record) =>
          record.id === existing.id ? updatedRecord : record,
        )
        : [...current.weeklyRecords, updatedRecord];

      return {
        ...current,
        weeklyRecords,
      };
    });
  }

  function handleMinutesChange(
    day: keyof DailyMinutes,
    value: number,
  ) {
    updateCurrentWeek((record) => ({
      ...record,
      minutes: {
        ...record.minutes,
        [day]: value,
      },
    }));
  }

  function handleHourlyRateChange(value: number) {
    if (!Number.isFinite(value) || value < 0 || !selectedEmployee) {
      return;
    }

    setData((current) => {
      const employeeExists = current.employees.some(
        (employee) => employee.id === selectedEmployee.id,
      );

      if (!employeeExists) {
        return current;
      }

      const existing = current.weeklyRecords.find(
        (record) =>
          record.employeeId === selectedEmployee.id &&
          record.weekStart === weekStart,
      );

      const baseRecord =
        existing ?? createWeeklyRecord(selectedEmployee, weekStart);

      const updatedRecord: WeeklyRecord = {
        ...baseRecord,
        hourlyRate: value,
        updatedAt: new Date().toISOString(),
      };

      return {
        employees: current.employees.map((employee) =>
          employee.id === selectedEmployee.id
            ? { ...employee, hourlyRate: value }
            : employee,
        ),
        weeklyRecords: existing
          ? current.weeklyRecords.map((record) =>
            record.id === existing.id ? updatedRecord : record,
          )
          : [...current.weeklyRecords, updatedRecord],
      };
    });
  }

  const employeeHistory = data.weeklyRecords.filter(
    (record) => record.employeeId === selectedEmployeeId,
  );

  return (
    <main className="app">
      <header className="app-header">
        <div>

          <p className="eyebrow">GESTÃO DE PAGAMENTOS</p>
          <h1>Folha de ponto</h1>
          <p>Controle os minutos trabalhados e os pagamentos semanais.</p>
        </div>
        
        <EmployeeForm onAdd={addEmployee} />
        
      </header>


      <section className="panel">
        <h2>Consultar funcionário</h2>

        <EmployeeSelector
          employees={data.employees}
          selectedId={selectedEmployeeId}
          onSelect={(id) => {
            setSelectedEmployeeId(id);
          }}
        />
      </section>

      {selectedEmployee && (
        <>
          <section className="panel week-selector">
            <label>
              Escolha uma data da semana
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>

            <p>
              Semana iniciada em{' '}
              {new Intl.DateTimeFormat('pt-BR', {
                timeZone: 'UTC',
              }).format(new Date(`${weekStart}T12:00:00Z`))}
            </p>
          </section>

          <WeeklyTimesheet
            employee={selectedEmployee}
            minutes={displayedMinutes}
            hourlyRate={displayedHourlyRate}
            onMinutesChange={handleMinutesChange}
            onHourlyRateChange={handleHourlyRateChange}
          />

          <WeeklyHistory
            records={employeeHistory}
            onSelectWeek={(date) => setSelectedDate(date)}
          />
        </>
      )}

      {data.employees.length === 0 && (
        <p className="empty-state">
          Cadastre seu primeiro funcionário para começar.
        </p>
      )}
    </main>
  );
}