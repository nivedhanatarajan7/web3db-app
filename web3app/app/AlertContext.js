import React, { createContext, useState } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [heartAlertsEnabled, setHeartAlertsEnabled] = useState(false);

  return (
    <AlertContext.Provider value={{ heartAlertsEnabled, setHeartAlertsEnabled }}>
      {children}
    </AlertContext.Provider>
  );
};
