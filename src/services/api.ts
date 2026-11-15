import type { AppData, Employee, WeeklyRecord } from '../types';

const STORAGE_KEY = 'folha-de-ponto:data';

const emptyData = (): AppData => ({ employees: [], weeklyRecords: [] });

const readData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();

    const parsed = JSON.parse(raw) as Partial<AppData>;

    return {
      employees: Array.isArray(parsed.employees) ? parsed.employees : [],
      weeklyRecords: Array.isArray(parsed.weeklyRecords) ? parsed.weeklyRecords : [],
    };
  } catch (error) {
    console.error('Dados do localStorage corrompidos ou inacessíveis:', error);
    return emptyData();
  }
};

const writeData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    throw new Error('Não foi possível salvar os dados no navegador', { cause: error });
  }
};

const clone = <T>(value: T): T => structuredClone(value);

export const api = {
  async getEmployees(): Promise<Employee[]> {
    return clone(readData().employees);
  },

  async createEmployee(employee: Employee): Promise<Employee> {
    const data = readData();

    if (data.employees.some((emp) => emp.id === employee.id)) {
      throw new Error('Funcionário já cadastrado');
    }

    data.employees.push(employee);
    writeData(data);
    return clone(employee);
  },

  async updateEmployeeRate(id: string, hourlyRate: number): Promise<Employee> {
    const data = readData();
    const employee = data.employees.find((emp) => emp.id === id);

    if (!employee) throw new Error('Funcionário não encontrado');

    employee.hourlyRate = hourlyRate;
    writeData(data);
    return clone(employee);
  },

  async deleteEmployee(id: string): Promise<void> {
    const data = readData();

    if (!data.employees.some((emp) => emp.id === id)) {
      throw new Error('Funcionário não encontrado');
    }

    data.employees = data.employees.filter((emp) => emp.id !== id);
    data.weeklyRecords = data.weeklyRecords.filter((rec) => rec.employeeId !== id);
    writeData(data);
  },

  async getWeeklyRecords(): Promise<WeeklyRecord[]> {
    return clone(readData().weeklyRecords);
  },

  async createWeeklyRecord(record: WeeklyRecord): Promise<WeeklyRecord> {
    const data = readData();

    const duplicated = data.weeklyRecords.some(
      (rec) =>
        rec.id === record.id ||
        (rec.employeeId === record.employeeId && rec.weekStart === record.weekStart),
    );
    if (duplicated) throw new Error('Já existe registro para essa semana');

    data.weeklyRecords.push(record);
    writeData(data);
    return clone(record);
  },

  async updateWeeklyRecord(
    id: string,
    updates: Partial<WeeklyRecord>,
  ): Promise<WeeklyRecord> {
    const data = readData();
    const index = data.weeklyRecords.findIndex((rec) => rec.id === id);

    if (index === -1) throw new Error('Registro não encontrado');

    const updated: WeeklyRecord = {
      ...data.weeklyRecords[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    data.weeklyRecords[index] = updated;
    writeData(data);
    return clone(updated);
  },

  async deleteWeeklyRecord(id: string): Promise<void> {
    const data = readData();
    data.weeklyRecords = data.weeklyRecords.filter((rec) => rec.id !== id);
    writeData(data);
  },
};