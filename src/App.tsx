import { EmployeeProvider, useEmployees } from './contexts/employee-context';
import { Header } from './components/header';
import { EmployeeSelector } from './components/employee-selector';
import { EmployeeDetails } from './components/employee-details';
import './index.css';

const AppContent = () => {
  const {
    employees,
    selectedEmployeeId,
    isLoadingEmployees,
    selectEmployee,
  } = useEmployees();

  if (isLoadingEmployees) {
    return (
      <main className="app">
        <p>Carregando funcionários...</p>
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
    </main>
  );
};

export const App = () => {
  return (
    <EmployeeProvider>
      <AppContent />
    </EmployeeProvider>
  );
};