import type { Employee } from '../../types';

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
  return (
    <label>
      Funcionário selecionado
      <select
        value={selectedId}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="">Selecione um funcionário</option>

        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </label>
  );
};