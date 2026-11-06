import type React from 'react';
import { useMemo } from 'react';

import {
  WEEK_DAYS,
  type DailyMinutes,
  type Employee,
  type WeekDay,
  type WeeklyRecord,
} from '../../types';
import { calculatePayment, formatCurrency } from '../../utils/currency';
import { calculateWorkedMinutes } from './utils/calculate-worked-minutes';
import { formatDuration } from './utils/format-duration';
import { TimesheetProvider, useTimesheet } from './context';
import { StartTime } from './components/start-time';
import { EndTime } from './components/end-time';
import { Interval } from './components/interval';
import { Pix } from './components/pix';
import { locales } from './locales';
import { api } from '../../services/api';

import './styles.css';

const createEmptyMinutes = (): DailyMinutes => {
  return {
    'Segunda-feira': 0,
    'Terça-feira': 0,
    'Quarta-feira': 0,
    'Quinta-feira': 0,
    'Sexta-feira': 0,
    Sábado: 0,
    Domingo: 0,
  };
};

export interface WeeklyTimesheetProps {
  employee: Employee;
  weekStart: string;
  weeklyRecords: WeeklyRecord[];
  onRecordsChange: (records: WeeklyRecord[]) => void;
  onEmployeeRateChange: (employeeId: string, newRate: number) => void;
}

export const WeeklyTimesheet = (props: WeeklyTimesheetProps) => {
  return (
    <TimesheetProvider>
      <WeeklyTimesheetContainer {...props} />
    </TimesheetProvider>
  );
};

export const WeeklyTimesheetContainer = ({
  employee,
  weekStart,
  weeklyRecords,
  onRecordsChange,
  onEmployeeRateChange,
}: WeeklyTimesheetProps) => {
  const {
    hourlyRateLabel,
    dayOfWeekHeader,
    startTimeHeader,
    endTimeHeader,
    intervalHeader,
    paymentHeader,
    weeklyTotal,
  } = locales;

  const { startTimes, endTimes } = useTimesheet();

  const currentRecord = useMemo(() => {
    return weeklyRecords.find(
      (rec) => rec.employeeId === employee.id && rec.weekStart === weekStart,
    );
  }, [weeklyRecords, employee.id, weekStart]);

  const minutes = currentRecord?.minutes ?? createEmptyMinutes();
  const hourlyRate = currentRecord?.hourlyRate ?? employee.hourlyRate ?? 0;

  const persistRecord = async(updates: Partial<WeeklyRecord>) => {
    try {
      if (currentRecord) {
        const updated = await api.updateWeeklyRecord(currentRecord.id, updates);
        onRecordsChange(
          weeklyRecords.map((rec) => (rec.id === currentRecord.id ? updated : rec)),
        );
      } else {
        const now = new Date().toISOString();
        const newRecord: WeeklyRecord = {
          id: crypto.randomUUID(),
          employeeId: employee.id,
          weekStart,
          hourlyRate,
          minutes: createEmptyMinutes(),
          createdAt: now,
          updatedAt: now,
          ...updates,
        };

        const created = await api.createWeeklyRecord(newRecord);
        onRecordsChange([...weeklyRecords, created]);
      }
    } catch (error) {
      console.error('Erro ao sincronizar ponto:', error);
    }
  };

  const handleMinutesChange = (day: WeekDay, value: number) => {
    const updatedMinutes = {
      ...minutes,
      [day]: value,
    };
    persistRecord({ minutes: updatedMinutes });
  };

  const handleHourlyRateChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (rawValue === '') return;

    const value = Number(rawValue);
    if (!Number.isFinite(value) || value < 0) return;

    await persistRecord({ hourlyRate: value });
    onEmployeeRateChange(employee.id, value);
  };

  const workedMinutesByDay = useMemo(() => {
    return WEEK_DAYS.reduce((acc, day) => {
      acc[day] = calculateWorkedMinutes(
        startTimes[day],
        endTimes[day],
        minutes[day],
      );
      return acc;
    }, {} as Record<WeekDay, number>);
  }, [startTimes, endTimes, minutes]);

  const totalMinutes = useMemo(() => {
    return WEEK_DAYS.reduce((sum, day) => sum + workedMinutesByDay[day], 0);
  }, [workedMinutesByDay]);

  const totalPayment = calculatePayment(totalMinutes, hourlyRate);

  return (
    <section className="timesheet">
      <h2>{employee.name}</h2>

      <Pix employee={employee} />

      <label className="rate-field">
        {hourlyRateLabel}
        <input
          type="number"
          min="0"
          step="0.01"
          value={hourlyRate}
          onChange={handleHourlyRateChange}
        />
      </label>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{dayOfWeekHeader}</th>
              <th>{startTimeHeader}</th>
              <th>{endTimeHeader}</th>
              <th>{intervalHeader}</th>
              <th>{paymentHeader}</th>
            </tr>
          </thead>

          <tbody>
            {WEEK_DAYS.map((day) => (
              <tr key={day}>
                <td>{day}</td>
                <td><StartTime day={day} /></td>
                <td><EndTime day={day} /></td>
                <td>
                  <Interval
                    day={day}
                    minutes={minutes}
                    onMinutesChange={handleMinutesChange}
                  />
                </td>
                <td>
                  {formatCurrency(
                    calculatePayment(workedMinutesByDay[day], hourlyRate),
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td>{weeklyTotal}</td>
              <td colSpan={3}>
                {formatDuration(totalMinutes)} ({totalMinutes} min)
              </td>
              <td>{formatCurrency(totalPayment)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};