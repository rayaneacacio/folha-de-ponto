import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Employee } from '../types';
import { api } from '../services/api';

interface EmployeeContextData {
  employees: Employee[];
  selectedEmployeeId: string;
  selectedEmployee: Employee | undefined;
  isLoadingEmployees: boolean;
  selectEmployee: (id: string) => void;
  createEmployee: (data: Omit<Employee, 'id'>) => Promise<Employee>;
  updateEmployeeRate: (id: string, newRate: number) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextData>(
  {} as EmployeeContextData,
);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const loaded = await api.getEmployees();
        setEmployees(loaded);
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const selectedEmployee = employees.find(
    (emp) => emp.id === selectedEmployeeId,
  );

  const createEmployee = async (data: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...data,
      id: crypto.randomUUID(),
    };

    const created = await api.createEmployee(newEmployee);
    setEmployees((current) => [...current, created]);
    setSelectedEmployeeId(created.id);
    return created;
  };

  const updateEmployeeRate = async (id: string, newRate: number) => {
    try {
      await api.updateEmployeeRate(id, newRate);
      setEmployees((current) =>
        current.map((emp) =>
          emp.id === id ? { ...emp, hourlyRate: newRate } : emp,
        ),
      );
    } catch (error) {
      console.error('Erro ao atualizar taxa cadastral do funcionário:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    await api.deleteEmployee(id);
    setEmployees((current) => current.filter((emp) => emp.id !== id));
    setSelectedEmployeeId((current) => (current === id ? '' : current));
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        selectedEmployeeId,
        selectedEmployee,
        isLoadingEmployees,
        selectEmployee: setSelectedEmployeeId,
        createEmployee,
        updateEmployeeRate,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees deve ser usado dentro de um EmployeeProvider');
  }
  return context;
};