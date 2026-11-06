import type { Employee, WeeklyRecord } from '../types';

const BASE_URL = 'http://localhost:3333';

export const api = {
  async getEmployees(): Promise<Employee[]> {
    const res = await fetch(`${BASE_URL}/employees`);
    if (!res.ok) throw new Error('Erro ao listar funcionários');
    return res.json();
  },

  async createEmployee(employee: Employee): Promise<Employee> {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Erro ao cadastrar funcionário');
    return res.json();
  },

  async updateEmployeeRate(id: string, hourlyRate: number): Promise<Employee> {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hourlyRate }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar taxa do funcionário');
    return res.json();
  },

  async getWeeklyRecords(): Promise<WeeklyRecord[]> {
    const res = await fetch(`${BASE_URL}/weeklyRecords`);
    if (!res.ok) throw new Error('Erro ao buscar registros semanais');
    return res.json();
  },

  async createWeeklyRecord(record: WeeklyRecord): Promise<WeeklyRecord> {
    const res = await fetch(`${BASE_URL}/weeklyRecords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Erro ao salvar registro de ponto');
    return res.json();
  },

  async updateWeeklyRecord(
    id: string,
    updates: Partial<WeeklyRecord>,
  ): Promise<WeeklyRecord> {
    const res = await fetch(`${BASE_URL}/weeklyRecords/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar registro');
    return res.json();
  },
};