import { EmployeeForm } from '../employee-form';
import { locales } from './locales';
import './styles.css';

export const Header = () => {
  const {subtitle, title, description} = locales;
  return (
    <header className="header">
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <EmployeeForm />
    </header>
  );
};