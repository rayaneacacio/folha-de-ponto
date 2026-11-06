import type { Employee } from '../../types';
import { locales } from './locales';

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const EmployeeSelector = ({
  employees,
  selectedId,
  onSelect,
}: EmployeeSelectorProps) => {
  const {employeeSelectedLabel, selectAnEmployeeLabel} = locales;
  
  return (
    <label>
      {employeeSelectedLabel}
      <select
        value={selectedId}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="">{selectAnEmployeeLabel}</option>

        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </label>
  );
};