import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../../contexts/employee-context';
import { WeeklyHistory } from '../weekly-history';
import { WeeklyTimesheet } from '../weekly-timesheet';
import type { WeeklyRecord } from '../../types';
import { getToday, getWeekStart } from '../../utils/currency';
import { api } from '../../services/api';
import { locales } from './locales';
import './styles.css';

export const EmployeeDetails = () => {
  const { loadingRecords, loadRecordsError, weekDateLabel, weekStartLabel } = locales;

  const {
    selectedEmployeeId,
    selectedEmployee,
    updateEmployeeRate,
  } = useEmployees();

  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRecords = async () => {
      try {
        const loaded = await api.getWeeklyRecords();

        if (isMounted) {
          setWeeklyRecords(loaded);
        }
      } catch (error) {
        console.error(loadRecordsError, error);
      } finally {
        if (isMounted) {
          setIsLoadingRecords(false);
        }
      }
    };

    fetchRecords();

    return () => {
      isMounted = false;
    };
  }, [loadRecordsError]);

  const weekStart = getWeekStart(selectedDate);

  const employeeHistory = useMemo(
    () =>
      weeklyRecords.filter(
        (record) => record.employeeId === selectedEmployeeId,
      ),
    [weeklyRecords, selectedEmployeeId],
  );

  if (!selectedEmployee) return null;

  if (isLoadingRecords) {
    return (
      <section className="employee-details">
        <p>{loadingRecords}</p>
      </section>
    );
  }

  return (
    <section className="employee-details">
      <section className="week-selector">
        <label>
          {weekDateLabel}

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>

        <p>
          {weekStartLabel}{' '}
          {new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'UTC',
          }).format(new Date(`${weekStart}T12:00:00Z`))}
        </p>
      </section>

      <WeeklyTimesheet
        key={`${selectedEmployee.id}-${weekStart}`}
        employee={selectedEmployee}
        weekStart={weekStart}
        weeklyRecords={weeklyRecords}
        onRecordsChange={setWeeklyRecords}
        onEmployeeRateChange={updateEmployeeRate}
      />

      <WeeklyHistory
        records={employeeHistory}
        onSelectWeek={setSelectedDate}
      />
    </section>
  );
};