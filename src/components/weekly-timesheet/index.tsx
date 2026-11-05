
import {
  WEEK_DAYS,
  type DailyMinutes,
  type Employee,
  type WeekDay,
} from '../../types';

import { calculatePayment, formatCurrency } from '../../utils/currency';
import { calculateWorkedMinutes } from './utils/calculate-worked-minutes';

import './styles.css';
import { StartTime } from './components/start-time';
import { EndTime } from './components/end-time';
import { Interval } from './components/interval';
import { formatDuration } from './utils/format-duration';
import { TimesheetProvider, useTimesheet } from './context';
import { Pix } from './components/pix';

export const WeeklyTimesheet = (props: WeeklyTimesheetProps) => {
  return (
    <TimesheetProvider>
      <WeeklyTimesheetContainer {...props} />
    </TimesheetProvider>
  );
};

interface WeeklyTimesheetProps {
  employee: Employee;
  minutes: DailyMinutes;
  hourlyRate: number;
  onMinutesChange: (day: WeekDay, value: number) => void;
  onHourlyRateChange: (value: number) => void;
}

export const WeeklyTimesheetContainer = ({
  employee,
  minutes,
  hourlyRate,
  onMinutesChange,
  onHourlyRateChange,
}: WeeklyTimesheetProps) => {
  const {startTimes, endTimes} = useTimesheet();

  const workedMinutesByDay = WEEK_DAYS.reduce(
    (acc, day) => {
      acc[day] = calculateWorkedMinutes(
        startTimes[day],
        endTimes[day],
        minutes[day],
      );
    
      return acc;
    },
    {} as Record<WeekDay, number>,
  );
    
  const totalMinutes = WEEK_DAYS.reduce(
    (total, day) => total + workedMinutesByDay[day],
    0,
  );
    
  const totalPayment = calculatePayment(
    totalMinutes,
    hourlyRate,
  );

  return (
    <section className="timesheet">
      <h2>{employee.name}</h2>

      <Pix employee={employee} />

      <label className="rate-field">
        Valor da hora (R$)
        <input
          type="number"
          min="0"
          step="0.01"
          value={hourlyRate}
          onChange={(event) => {
            const value = event.target.value;

            if (value === '') return;

            const parsed = Number(value);

            if (Number.isFinite(parsed) && parsed >= 0) onHourlyRateChange(parsed);
          }}
        />
      </label>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Dia da semana</th>
              <th>Hora que iniciou</th>
              <th>Hora que terminou</th>
              <th>Quanto tempo de intervalo (almoço)</th>
              <th>Valor a pagar</th>
            </tr>
          </thead>

          <tbody>
            {WEEK_DAYS.map((day) => (
              <tr key={day}>
                <td>{day}</td>

                <td><StartTime day={day} /></td>

                <td><EndTime day={day} /></td>

                <td><Interval day={day} minutes={minutes} onMinutesChange={onMinutesChange} /></td>

                <td>{formatCurrency(calculatePayment(workedMinutesByDay[day], hourlyRate))}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td>Total semanal</td>
              <td>
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
