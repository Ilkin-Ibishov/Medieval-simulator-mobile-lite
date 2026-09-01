import { useEffect, useRef } from 'react';
import { App as CapApp } from '@capacitor/app';

export function useHardwareBack(onBack: () => boolean) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    let handler: { remove: () => void } | null = null;
    let isMounted = true;

    try {
      CapApp.addListener('backButton', () => {
        const handled = onBackRef.current();
        if (!handled) {
          CapApp.minimizeApp();
        }
      }).then((h) => {
        if (isMounted) {
          handler = h;
        } else {
          h.remove();
        }
      });
    } catch {
      // Browser fallback (running outside native Capacitor environment)
    }

    return () => {
      isMounted = false;
      if (handler) handler.remove();
    };
  }, []);
}
