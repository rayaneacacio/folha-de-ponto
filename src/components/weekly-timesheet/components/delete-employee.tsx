import { useState } from 'react';
import { useEmployees } from '../../../contexts/employee-context';
import { useWeeklyRecords } from '../../../contexts/weekly-records-context';
import { locales } from '../locales';
import '../styles.css';

export const DeleteEmployee = () => {
  const { deleteButton, deletingButton, deleteConfirm, deleteError, deleteRecordsError } =
    locales;
  const { selectedEmployee, deleteEmployee } = useEmployees();
  const { deleteEmployeeRecords } = useWeeklyRecords();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!selectedEmployee) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      deleteConfirm.replace('{{name}}', selectedEmployee.name),
    );
    if (!confirmed) return;

    const employeeId = selectedEmployee.id;
    setIsDeleting(true);
    setError('');

    try {
      await deleteEmployee(employeeId);
    } catch (err) {
      console.error(deleteError, err);
      setError(deleteError);
      setIsDeleting(false);
      return;
    }

    try {
      await deleteEmployeeRecords(employeeId);
    } catch (err) {
      console.error(deleteRecordsError, err);
      window.alert(deleteRecordsError);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="danger-zone">
      <button
        type="button"
        className="danger"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? deletingButton : deleteButton}
      </button>

      {error && (
        <p role="alert" className="field-error">{error}</p>
      )}
    </div>
  );
};