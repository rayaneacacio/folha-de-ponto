import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

import type { WeeklyRecord } from '../types';
import { api } from '../services/api';
import { getToday, getWeekStart } from '../utils/currency';

interface WeeklyRecordsContextData {
  weeklyRecords: WeeklyRecord[];
  setWeeklyRecords: Dispatch<SetStateAction<WeeklyRecord[]>>;
  isLoadingRecords: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weekStart: string;
  deleteEmployeeRecords: (employeeId: string) => Promise<void>;
}

const WeeklyRecordsContext = createContext<WeeklyRecordsContextData | undefined>(
  undefined,
);

export const WeeklyRecordsProvider = ({ children }: { children: ReactNode }) => {
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getToday);

  useEffect(() => {
    let isMounted = true;

    const fetchRecords = async () => {
      try {
        const loaded = await api.getWeeklyRecords();
        if (isMounted) setWeeklyRecords(loaded);
      } catch (error) {
        console.error('Erro ao carregar registros de ponto:', error);
      } finally {
        if (isMounted) setIsLoadingRecords(false);
      }
    };

    fetchRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  const weekStart = getWeekStart(selectedDate);

  const deleteEmployeeRecords = async (employeeId: string) => {
    const toDelete = weeklyRecords.filter((rec) => rec.employeeId === employeeId);
    const results = await Promise.allSettled(
      toDelete.map((rec) => api.deleteWeeklyRecord(rec.id)),
    );

    const deletedIds = new Set(
      toDelete.filter((_, index) => results[index].status === 'fulfilled').map((rec) => rec.id),
    );

    setWeeklyRecords((current) => current.filter((rec) => !deletedIds.has(rec.id)));

    if (deletedIds.size < toDelete.length) {
      throw new Error('Alguns registros de ponto não puderam ser excluídos');
    }
  };

  return (
    <WeeklyRecordsContext.Provider
      value={{
        weeklyRecords,
        setWeeklyRecords,
        isLoadingRecords,
        selectedDate,
        setSelectedDate,
        weekStart,
        deleteEmployeeRecords,
      }}
    >
      {children}
    </WeeklyRecordsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWeeklyRecords = () => {
  const context = useContext(WeeklyRecordsContext);

  if (!context) {
    throw new Error('useWeeklyRecords deve ser usado dentro de WeeklyRecordsProvider');
  }

  return context;
};