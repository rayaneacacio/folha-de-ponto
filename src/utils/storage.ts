
import type { AppData } from '../types';

const STORAGE_KEY = 'folha-de-ponto';

const INITIAL_DATA: AppData = {
  employees: [],
  weeklyRecords: [],
};

export function loadAppData(): AppData {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return {
      employees: [],
      weeklyRecords: [],
    };
  }

  try {
    const parsed: unknown = JSON.parse(storedData);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'employees' in parsed &&
      'weeklyRecords' in parsed &&
      Array.isArray(parsed.employees) &&
      Array.isArray(parsed.weeklyRecords)
    ) {
      return parsed as AppData;
    }
  } catch {
    // Se os dados estiverem inválidos, inicia sem dados.
  }

  return INITIAL_DATA;
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data),
  );
}
