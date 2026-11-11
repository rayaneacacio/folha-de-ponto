import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  WEEK_DAYS,
  type DailyEntries,
  type DayEntryField,
  type Employee,
  type WeekDay,
  type WeeklyRecord,
} from '../../types';
import { calculatePayment, formatCurrency } from '../../utils/currency';
import { api } from '../../services/api';
import { formatDuration } from './utils/format-duration';
import { DEFAULT_DAY_ENTRY, isOutOfOrder, normalizeEntries, toDailyMinutes } from './utils/time';
import { TimeInput } from './components/time-input';
import { Pix } from './components/pix';
import { locales } from './locales';
import { DeleteEmployee } from './components/delete-employee';
import './styles.css';

export interface WeeklyTimesheetProps {
  employee: Employee;
  weekStart: string;
  weeklyRecords: WeeklyRecord[];
  onRecordsChange: Dispatch<SetStateAction<WeeklyRecord[]>>;
  onEmployeeRateChange: (employeeId: string, newRate: number) => Promise<void>;
}

const FIELDS: {
  field: DayEntryField;
  header: keyof typeof locales;
  placeholder: keyof typeof locales;
  label: keyof typeof locales;
}[] = [
  { field: 'morningStart', header: 'morningStartHeader', placeholder: 'morningStartPlaceholder', label: 'morningStartLabel' },
  { field: 'morningEnd', header: 'morningEndHeader', placeholder: 'morningEndPlaceholder', label: 'morningEndLabel' },
  { field: 'afternoonStart', header: 'afternoonStartHeader', placeholder: 'afternoonStartPlaceholder', label: 'afternoonStartLabel' },
  { field: 'afternoonEnd', header: 'afternoonEndHeader', placeholder: 'afternoonEndPlaceholder', label: 'afternoonEndLabel' },
];

export const WeeklyTimesheet = ({
  employee,
  weekStart,
  weeklyRecords,
  onRecordsChange,
  onEmployeeRateChange,
}: WeeklyTimesheetProps) => {
  const {
    hourlyRateLabel,
    dayOfWeekHeader,
    paymentHeader,
    weeklyTotal,
    periodOrderError,
    afternoonOverlapError,
    saveError,
    fillDefaultButton,
    fillDefaultLabel,
  } = locales;

  const currentRecord = useMemo(
    () =>
      weeklyRecords.find(
        (rec) => rec.employeeId === employee.id && rec.weekStart === weekStart,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const initialRate = currentRecord?.hourlyRate ?? employee.hourlyRate ?? 0;

  const [entries, setEntries] = useState<DailyEntries>(() =>
    normalizeEntries(currentRecord?.entries),
  );
  const [hourlyRate, setHourlyRate] = useState(initialRate);
  const [rateInput, setRateInput] = useState(String(initialRate));

  const recordIdRef = useRef<string | undefined>(currentRecord?.id);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const persist = (entriesToSave: DailyEntries, rateToSave: number) => {
    const payload = {
      entries: entriesToSave,
      minutes: toDailyMinutes(entriesToSave),
      hourlyRate: rateToSave,
    };

    saveQueueRef.current = saveQueueRef.current
      .then(async () => {
        const recordId = recordIdRef.current;

        if (recordId) {
          const updated = await api.updateWeeklyRecord(recordId, payload);
          onRecordsChange((current) =>
            current.map((rec) => (rec.id === recordId ? updated : rec)),
          );
          return;
        }

        const now = new Date().toISOString();
        const created = await api.createWeeklyRecord({
          id: crypto.randomUUID(),
          employeeId: employee.id,
          weekStart,
          createdAt: now,
          updatedAt: now,
          ...payload,
        });

        recordIdRef.current = created.id;
        onRecordsChange((current) => [...current, created]);
      })
      .catch((error) => {
        console.error(saveError, error);
      });
  };

  const handleEntryChange = (day: WeekDay, field: DayEntryField, value: string) => {
    const nextEntries: DailyEntries = {
      ...entries,
      [day]: { ...entries[day], [field]: value },
    };

    setEntries(nextEntries);
    persist(nextEntries, hourlyRate);
  };

  const handleFillDefault = (day: WeekDay) => {
    const nextEntries: DailyEntries = {
      ...entries,
      [day]: { ...DEFAULT_DAY_ENTRY },
    };

    setEntries(nextEntries);
    persist(nextEntries, hourlyRate);
  };

  const handleRateBlur = () => {
    const value = Number(rateInput);

    if (rateInput.trim() === '' || !Number.isFinite(value) || value < 0) {
      setRateInput(String(hourlyRate));
      return;
    }

    if (value === hourlyRate) return;

    setHourlyRate(value);
    persist(entries, value);
    onEmployeeRateChange(employee.id, value).catch(() => undefined);
  };

  const getFieldError = (day: WeekDay, field: DayEntryField) => {
    const entry = entries[day];

    if (field === 'morningEnd' && isOutOfOrder(entry.morningStart, entry.morningEnd)) {
      return periodOrderError;
    }
    if (field === 'afternoonStart' && isOutOfOrder(entry.morningEnd, entry.afternoonStart)) {
      return afternoonOverlapError;
    }
    if (field === 'afternoonEnd' && isOutOfOrder(entry.afternoonStart, entry.afternoonEnd)) {
      return periodOrderError;
    }
    return undefined;
  };

  const workedMinutesByDay = useMemo(() => toDailyMinutes(entries), [entries]);

  const totalMinutes = WEEK_DAYS.reduce(
    (sum, day) => sum + workedMinutesByDay[day],
    0,
  );

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
          value={rateInput}
          onChange={(event) => setRateInput(event.target.value)}
          onBlur={handleRateBlur}
        />
      </label>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{dayOfWeekHeader}</th>
              {FIELDS.map(({ field, header }) => (
                <th key={field}>{locales[header]}</th>
              ))}
              <th>{paymentHeader}</th>
            </tr>
          </thead>

          <tbody>
            {WEEK_DAYS.map((day) => (
              <tr key={day}>
                <td>
                  <div className="day-cell">
                    <span><strong>{day}</strong></span>
                    <button
                      type="button"
                      className="secondary fill-default"
                      onClick={() => handleFillDefault(day)}
                      aria-label={fillDefaultLabel.replace('{{day}}', day)}
                      title={fillDefaultLabel.replace('{{day}}', day)}
                    >
                      {fillDefaultButton}
                    </button>
                  </div>
                </td>

                {FIELDS.map(({ field, placeholder, label }) => (
                  <td key={field}>
                    <TimeInput
                      value={entries[day][field]}
                      placeholder={locales[placeholder]}
                      label={locales[label].replace('{{day}}', day)}
                      error={getFieldError(day, field)}
                      onCommit={(value) => handleEntryChange(day, field, value)}
                    />
                  </td>
                ))}

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
              <td colSpan={FIELDS.length}>
                {formatDuration(totalMinutes)} ({totalMinutes} min)
              </td>
              <td>{formatCurrency(totalPayment)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <DeleteEmployee />
    </section>
  );
};