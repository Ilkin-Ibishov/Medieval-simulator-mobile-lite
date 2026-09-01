import { sounds } from './sound';
import { haptics } from './haptics';

/**
 * Player preferences that must survive app restarts. Deliberately tiny and defensive:
 * localStorage throws in private mode and in some WebViews, so every access is guarded
 * and a failure just means "use the defaults".
 */
export interface Settings {
  sound: boolean;
  haptics: boolean;
}

const KEY = 'msml.settings.v1';

export const DEFAULT_SETTINGS: Settings = { sound: true, haptics: true };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULT_SETTINGS.sound,
      haptics: typeof parsed.haptics === 'boolean' ? parsed.haptics : DEFAULT_SETTINGS.haptics,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage unavailable — the setting still applies for this session.
  }
}

/** Pushes settings into the engines that actually produce output. */
export function applySettings(s: Settings): void {
  sounds.setEnabled(s.sound);
  haptics.enabled = s.haptics;
}
