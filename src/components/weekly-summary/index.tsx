import { useMemo, useState } from 'react';
import { WEEK_DAYS, type Employee, type WeeklyRecord } from '../../types';
import { calculatePayment, formatCurrency } from '../../utils/currency';
import { formatDuration } from '../weekly-timesheet/utils/format-duration';
import { toDailyMinutes } from '../weekly-timesheet/utils/time';
import { locales } from './locales';
import './styles.css';

interface WeeklySummaryProps {
  employees: Employee[];
  weeklyRecords: WeeklyRecord[];
  weekStart: string;
}

interface SummaryRow {
  employee: Employee;
  hasRecord: boolean;
  minutes: number;
  hourlyRate: number;
  payment: number;
}

export const WeeklySummary = ({
  employees,
  weeklyRecords,
  weekStart,
}: WeeklySummaryProps) => {
  const {
    title,
    employeeHeader,
    hoursHeader,
    rateHeader,
    paymentHeader,
    totalLabel,
    noRecord,
  } = locales;

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const rows = useMemo<SummaryRow[]>(() => {
    return employees.map((employee) => {
      const record = weeklyRecords.find(
        (rec) => rec.employeeId === employee.id && rec.weekStart === weekStart,
      );

      const dailyMinutes = record?.entries ? toDailyMinutes(record.entries) : null;
      const minutes = dailyMinutes
        ? WEEK_DAYS.reduce((sum, day) => sum + dailyMinutes[day], 0)
        : 0;
      const hourlyRate = record?.hourlyRate ?? employee.hourlyRate ?? 0;

      return {
        employee,
        hasRecord: Boolean(record?.entries),
        minutes,
        hourlyRate,
        payment: calculatePayment(minutes, hourlyRate),
      };
    });
  }, [employees, weeklyRecords, weekStart]);

  const totalMinutes = rows.reduce((sum, row) => sum + row.minutes, 0);
  const totalPayment = rows.reduce((sum, row) => sum + row.payment, 0);

  return (
    <div className='container-weekly-summary'>
      {/* <button
        type="button"
        onClick={() => setIsSummaryOpen((open) => !open)}
        aria-expanded={isSummaryOpen}
        aria-controls="weekly-summary"
      >
        {isSummaryOpen ? 'Ocultar total' : 'Ver total'}
      </button>
      {isSummaryOpen && ( */}

      <section className="weekly-summary">
        <h2>{title}</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>{employeeHeader}</th>
                <th>{hoursHeader}</th>
                <th>{rateHeader}</th>
                <th>{paymentHeader}</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(({ employee, hasRecord, minutes, hourlyRate, payment }) => (
                <tr key={employee.id} className={hasRecord ? undefined : 'no-record'}>
                  <td>{employee.name}</td>
                  <td>{hasRecord ? formatDuration(minutes, true) : noRecord}</td>
                  <td>{formatCurrency(hourlyRate)}</td>
                  <td>{formatCurrency(payment)}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td>{totalLabel}</td>
                <td colSpan={2}>{formatDuration(totalMinutes, true)}</td>
                <td>{formatCurrency(totalPayment)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      {/* )} */}
    </div>
  );
};