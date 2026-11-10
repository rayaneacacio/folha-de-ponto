import { EmployeeProvider, useEmployees } from './contexts/employee-context';
import {
  WeeklyRecordsProvider,
  useWeeklyRecords,
} from './contexts/weekly-records-context';
import { Header } from './components/header';
import { EmployeeSelector } from './components/employee-selector';
import { EmployeeDetails } from './components/employee-details';
import { WeekSelector } from './components/week-selector';
import { WeeklySummary } from './components/weekly-summary';
import './index.css';

const AppContent = () => {
  const { employees, selectedEmployeeId, isLoadingEmployees, selectEmployee } =
    useEmployees();
  const { weeklyRecords, isLoadingRecords, weekStart } = useWeeklyRecords();

  if (isLoadingEmployees || isLoadingRecords) {
    return (
      <main className="app">
        <p>Carregando dados...</p>
      </main>
    );
  }

  return (
    <main className="app">
      <Header />

      <section className="panel">
        <h2>Consultar funcionário</h2>

        <EmployeeSelector
          employees={employees}
          selectedId={selectedEmployeeId}
          onSelect={selectEmployee}
        />
      </section>

      <EmployeeDetails />

      <section className="panel">
        <WeekSelector />

        <WeeklySummary
          employees={employees}
          weeklyRecords={weeklyRecords}
          weekStart={weekStart}
        />
      </section>
    </main>
  );
};

export const App = () => {
  return (
    <EmployeeProvider>
      <WeeklyRecordsProvider>
        <AppContent />
      </WeeklyRecordsProvider>
    </EmployeeProvider>
  );
};