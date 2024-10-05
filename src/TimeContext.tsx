// TimeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

// Define the context type
type TimeContextType = number | null;

// Create a Context
const TimeContext = createContext<TimeContextType>(null);

// Create a Provider Component
export const TimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const nowUnix = new Date('2024-10-02T18:31:00+02:00');

  return (
    <TimeContext.Provider value={nowUnix}>{children}</TimeContext.Provider>
  );
};

// Create a custom hook to use the TimeContext
export const useTime = (): number => {
  const context = useContext(TimeContext);
  if (context === null) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
