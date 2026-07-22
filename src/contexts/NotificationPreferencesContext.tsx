import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SOUND_STORAGE_KEY = 'condomanager.soundEnabled';
const VIBRATION_STORAGE_KEY = 'condomanager.vibrationEnabled';

const DEFAULT_SOUND_ENABLED = true;
const DEFAULT_VIBRATION_ENABLED = false;

type NotificationPreferencesContextValue = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  setVibrationEnabled: (value: boolean) => void;
  playNotificationSound: () => void;
  vibrateNotification: () => void;
};

const NotificationPreferencesContext = createContext<NotificationPreferencesContextValue | undefined>(undefined);

function readBooleanStorage(key: string, fallback: boolean) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const saved = window.localStorage.getItem(key);
  if (saved === null) {
    return fallback;
  }

  return saved === 'true';
}

export function NotificationPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(() => readBooleanStorage(SOUND_STORAGE_KEY, DEFAULT_SOUND_ENABLED));
  const [vibrationEnabled, setVibrationEnabledState] = useState(() => readBooleanStorage(VIBRATION_STORAGE_KEY, DEFAULT_VIBRATION_ENABLED));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(VIBRATION_STORAGE_KEY, String(vibrationEnabled));
    }
  }, [vibrationEnabled]);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    try {
      const audio = new Audio('/sounds/Type.wav');
      audio.volume = 0.7;
      void audio.play();
    } catch {
      // Silent fallback for unsupported browsers
    }
  }, [soundEnabled]);

  const vibrateNotification = useCallback(() => {
    if (!vibrationEnabled) {
      return;
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([80]);
      } catch {
        // Silent fallback for unsupported browsers
      }
    }
  }, [vibrationEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const originalAlert = window.alert.bind(window);

    const wrappedAlert = (message?: string) => {
      playNotificationSound();
      vibrateNotification();
      originalAlert(message);
    };

    const globalWindow = window as Window & typeof globalThis & {
      playNotificationSound: () => void;
      vibrateNotification: () => void;
      soundEnabled: boolean;
      vibrationEnabled: boolean;
    };

    window.alert = wrappedAlert as typeof window.alert;
    globalWindow.playNotificationSound = playNotificationSound;
    globalWindow.vibrateNotification = vibrateNotification;
    globalWindow.soundEnabled = soundEnabled;
    globalWindow.vibrationEnabled = vibrationEnabled;

    return () => {
      window.alert = originalAlert;
    };
  }, [playNotificationSound, vibrateNotification, soundEnabled, vibrationEnabled]);

  const value = useMemo<NotificationPreferencesContextValue>(() => ({
    soundEnabled,
    vibrationEnabled,
    setSoundEnabled: setSoundEnabledState,
    setVibrationEnabled: setVibrationEnabledState,
    playNotificationSound,
    vibrateNotification,
  }), [soundEnabled, vibrationEnabled, playNotificationSound, vibrateNotification]);

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error('useNotificationPreferences must be used within a NotificationPreferencesProvider');
  }

  return context;
}








