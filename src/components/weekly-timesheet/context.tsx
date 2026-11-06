import { useState, createContext, type ReactNode, useContext } from 'react';
import { WEEK_DAYS, type WeekDays } from '../../types';

interface TimesheetProviderProps {
  children: ReactNode;
}

interface TimesheetContextData {
  startTimes: WeekDays;
  setStartTimes: React.Dispatch<React.SetStateAction<WeekDays>>;
  endTimes: WeekDays;
  setEndTimes: React.Dispatch<React.SetStateAction<WeekDays>>;
}

const createInitialWeekDays = (): WeekDays => {
  return WEEK_DAYS.reduce((acc, day) => {
    acc[day] = '';
    return acc;
  }, {} as WeekDays);
};

const TimesheetContext = createContext<TimesheetContextData | undefined>(undefined);

export const TimesheetProvider = ({ children }: TimesheetProviderProps) => {
  const [startTimes, setStartTimes] = useState<WeekDays>(createInitialWeekDays);
  const [endTimes, setEndTimes] = useState<WeekDays>(createInitialWeekDays);

  return (
    <TimesheetContext.Provider
      value={{
        startTimes,
        setStartTimes,
        endTimes,
        setEndTimes,
      }}
    >
      {children}
    </TimesheetContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTimesheet = () => {
  const context = useContext(TimesheetContext);

  if (!context) {
    throw new Error('useTimesheet deve ser usado dentro de TimesheetProvider');
  }

  return context;
};