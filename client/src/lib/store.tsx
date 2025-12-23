import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './i18n';
import { toast } from '@/hooks/use-toast';

export interface Device {
  id: string;
  name: string;
  isOn: boolean;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  fakeMode: boolean;
  toggleFakeMode: () => void;
  devices: Device[];
  addDevice: (name: string) => void;
  removeDevice: (id: string) => void;
  toggleDevice: (id: string) => void;
  updateDeviceName: (id: string, name: string) => void;
  connectionStatus: string;
  setConnectionStatus: (status: string) => void;
  t: typeof translations.MN;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('MN');
  const [fakeMode, setFakeMode] = useState(true);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Arzetk 1', isOn: false },
    { id: '2', name: 'Smart Light', isOn: true },
  ]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const t = translations[language];

  // Initial status
  useEffect(() => {
    setConnectionStatus(t.status.noConnection);
  }, [language]);

  const toggleFakeMode = () => {
    setFakeMode(prev => !prev);
    toast({
      title: fakeMode ? "Real Mode Enabled" : "Fake Mode Enabled",
      description: fakeMode ? "HTTP requests will be sent" : "Simulating responses",
    });
  };

  const checkStatus = () => {
    const baseUrl = "https://euphemistic-krista-included.ngrok-free.dev";
    setConnectionStatus(t.status.connecting);
    fetch(`${baseUrl}/api/status`)
      .then(res => res.text()) // Assuming text or json
      .then(data => {
        setConnectionStatus("Device Online: " + data);
      })
      .catch(() => {
        setConnectionStatus(t.status.noConnection);
      });
  };

  useEffect(() => {
    if (!fakeMode) {
      checkStatus();
    }
  }, [fakeMode]);

  const addDevice = (name: string) => {
    const newDevice = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isOn: false,
    };
    setDevices(prev => [newDevice, ...prev]);
    setConnectionStatus(t.status.added);
  };

  const removeDevice = (id: string) => {
    const device = devices.find(d => d.id === id);
    setDevices(prev => prev.filter(d => d.id !== id));
    if (device) {
      toast({ description: `${device.name} ${t.status.deleted}` });
    }
  };

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newState = !d.isOn;
        // Side effect for status
        if (fakeMode) {
          setConnectionStatus(`${d.name}${newState ? t.status.deviceOn : t.status.deviceOff}`);
          setTimeout(() => {
            setConnectionStatus(t.status.ready);
          }, 1500);
        } else {
          // Real mode: Send request to ngrok URL
          const baseUrl = "https://abcd-1234.ngrok-free.app";
          fetch(`${baseUrl}/api/${newState ? 'on' : 'off'}`)
            .then(res => {
              if (res.ok) setConnectionStatus(`${d.name} turned ${newState ? 'on' : 'off'}`);
              else setConnectionStatus("Failed to communicate with device");
            })
            .catch(err => {
              console.error(err);
              setConnectionStatus("Connection error");
            });
        }
        return { ...d, isOn: newState };
      }
      return d;
    }));
  };

  const updateDeviceName = (id: string, name: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, name } : d));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      fakeMode,
      toggleFakeMode,
      devices,
      addDevice,
      removeDevice,
      toggleDevice,
      updateDeviceName,
      connectionStatus,
      setConnectionStatus,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
