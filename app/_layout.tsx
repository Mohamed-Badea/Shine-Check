import { Slot } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

type AppConfigContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  profile: { userName: string; phone: string; pass: string };
  updateProfile: (key: 'userName' | 'phone' | 'pass', value: string) => boolean | string;
};

const globalConfigurationState: {
  stateInstance: any;
  listeners: Set<(config: any) => void>;
} = (global as any).__CONFIG_ENGINE__ || {
  stateInstance: { 
    theme: 'light',
    profile: { userName: 'Admin User', phone: '01018075889', pass: 'Password123' },
    lastUpdateTimestamps: { userName: 0, phone: 0, pass: 0 }
  },
  listeners: new Set(),
};
(global as any).__CONFIG_ENGINE__ = globalConfigurationState;

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [currentConfig, setCurrentConfig] = useState(globalConfigurationState.stateInstance);

  const contextMethods: AppConfigContextType = {
    theme: currentConfig.theme,
    profile: currentConfig.profile,
    setTheme: (newTheme: 'light' | 'dark') => {
      globalConfigurationState.stateInstance = { ...globalConfigurationState.stateInstance, theme: newTheme };
      globalConfigurationState.listeners.forEach((l) => l(globalConfigurationState.stateInstance));
    },
    updateProfile: (key: 'userName' | 'phone' | 'pass', value: string): boolean | string => {
      const now = Date.now();
      const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
      const lastUpdate = globalConfigurationState.stateInstance.lastUpdateTimestamps[key];

      if (now - lastUpdate < fifteenDaysInMs) {
        const remainingDays = Math.ceil((fifteenDaysInMs - (now - lastUpdate)) / (24 * 60 * 60 * 1000));
        return `You can only change this once every 15 days. Try again in ${remainingDays} days.`;
      }

      if (key === 'userName') {
        const structuralParts = value.trim().split(/\s+/);
        if (structuralParts.length < 2) {
          return 'Name must contain at least 2 parts (First and Last name).';
        }
      }

      if (key === 'phone') {
        if (value.length !== 11 || !value.startsWith('01')) {
          return 'Phone number must be exactly 11 digits and start with 01';
        }
      }

      globalConfigurationState.stateInstance.profile[key] = value;
      globalConfigurationState.stateInstance.lastUpdateTimestamps[key] = now;
      globalConfigurationState.listeners.forEach((l) => l(globalConfigurationState.stateInstance));
      return true;
    }
  };

  React.useEffect(() => {
    const componentUpdateListener = (latestConfig: any) => setCurrentConfig({ ...latestConfig });
    globalConfigurationState.listeners.add(componentUpdateListener);
    return () => {
      globalConfigurationState.listeners.delete(componentUpdateListener);
    };
  }, []);

  return (
    <AppConfigContext.Provider value={contextMethods}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
}

export default function RootLayout() {
  return (
    <AppConfigProvider>
      <Slot />
    </AppConfigProvider>
  );
}