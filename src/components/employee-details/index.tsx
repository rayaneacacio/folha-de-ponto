import { useMemo } from 'react';
import { useEmployees } from '../../contexts/employee-context';
import { useWeeklyRecords } from '../../contexts/weekly-records-context';
import { WeeklyHistory } from '../weekly-history';
import { WeeklyTimesheet } from '../weekly-timesheet';
import './styles.css';

export const EmployeeDetails = () => {
  const { selectedEmployeeId, selectedEmployee, updateEmployeeRate } = useEmployees();
  const {
    weeklyRecords,
    setWeeklyRecords,
    setSelectedDate,
    weekStart,
  } = useWeeklyRecords();

  const employeeHistory = useMemo(
    () => weeklyRecords.filter((record) => record.employeeId === selectedEmployeeId),
    [weeklyRecords, selectedEmployeeId],
  );

  if (!selectedEmployee) return null;

  return (
    <section className="employee-details">
      <WeeklyTimesheet
        key={`${selectedEmployee.id}-${weekStart}`}
        employee={selectedEmployee}
        weekStart={weekStart}
        weeklyRecords={weeklyRecords}
        onRecordsChange={setWeeklyRecords}
        onEmployeeRateChange={updateEmployeeRate}
      />

      <WeeklyHistory records={employeeHistory} onSelectWeek={setSelectedDate} />
    </section>
  );
};