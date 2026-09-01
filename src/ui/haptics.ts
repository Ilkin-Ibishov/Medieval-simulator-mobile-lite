import { Haptics, ImpactStyle } from '@capacitor/haptics';

class HapticsManager {
  public enabled: boolean = true;

  public async light() {
    if (!this.enabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Fallback or web environment ignores
    }
  }

  public async medium() {
    if (!this.enabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Ignore
    }
  }

  public async heavy() {
    if (!this.enabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // Ignore
    }
  }
}

export const haptics = new HapticsManager();
