// Procedural Web Audio API Sound Generator (Zero external assets, 100% offline)

interface ToneOptions {
  /** Start frequency in Hz. */
  freq: number;
  /** Optional glide target — the tone ramps here over its lifetime. */
  slideTo?: number;
  type?: OscillatorType;
  /** Seconds from now. */
  at?: number;
  dur?: number;
  gain?: number;
  /** Cents of pitch offset, applied on top of a small random humanising jitter. */
  detune?: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public enabled: boolean = true;

  /** Master volume, 0..1. Every voice routes through this. */
  public setEnabled(value: boolean) {
    this.enabled = value;
    if (!this.ctx) return;
    if (value) {
      this.ctx.resume();
    } else {
      // Actually stop the audio clock instead of merely refusing to schedule notes.
      this.ctx.suspend();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        this.master.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.master.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private out(): AudioNode | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    return this.master ?? ctx.destination;
  }

  /** One oscillator voice with an exponential decay envelope. */
  private tone(o: ToneOptions) {
    const ctx = this.getContext();
    const dest = this.out();
    if (!ctx || !dest) return;

    const t = ctx.currentTime + (o.at ?? 0);
    const dur = o.dur ?? 0.15;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.slideTo), t + dur);
    }
    // A few cents of jitter per voice — identical repeated tones fatigue the ear fast,
    // and this game plays the same click dozens of times per session.
    osc.detune.setValueAtTime((o.detune ?? 0) + (Math.random() * 2 - 1) * 8, t);

    gain.gain.setValueAtTime(o.gain ?? 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur);
  }

  /** Short filtered noise burst — the metallic body of a weapon clash. */
  private noise(at: number, dur: number, gainValue: number, filterHz: number) {
    const ctx = this.getContext();
    const dest = this.out();
    if (!ctx || !dest) return;

    if (!this.noiseBuffer) {
      const len = Math.floor(ctx.sampleRate * 0.4);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;
    }

    const t = ctx.currentTime + at;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterHz, t);
    filter.Q.setValueAtTime(1.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    src.start(t);
    src.stop(t + dur);
  }

  // ---------------------------------------------------------------- UI feedback

  public playClick() {
    this.tone({ freq: 440, slideTo: 880, dur: 0.05, gain: 0.1 });
  }

  public playHire() {
    // Coin chime: two quick bright partials
    this.tone({ freq: 587.33, type: 'triangle', dur: 0.12, gain: 0.13 });
    this.tone({ freq: 880, type: 'triangle', at: 0.06, dur: 0.16, gain: 0.11 });
  }

  public playDisband() {
    this.tone({ freq: 330, slideTo: 220, type: 'triangle', dur: 0.14, gain: 0.11 });
  }

  public playMarch() {
    this.tone({ freq: 140, slideTo: 70, dur: 0.12, gain: 0.18 });
  }

  // ---------------------------------------------------------------- Battle outcomes
  // These are played from the OUTCOME (the events the reducer produced), never from the
  // button press — a won attack and a repelled attack used to sound identical.

  /** Attack landed but the province held — the assault was thrown back. */
  public playRepelled() {
    this.noise(0, 0.22, 0.14, 1600);
    this.tone({ freq: 300, slideTo: 110, type: 'sawtooth', dur: 0.3, gain: 0.16 });
    this.tone({ freq: 196, slideTo: 130, type: 'triangle', at: 0.12, dur: 0.35, gain: 0.12 });
  }

  /** Province taken — heroic brass triad. */
  public playConquest() {
    this.noise(0, 0.16, 0.1, 2200);
    const triad = [440, 554.37, 659.25]; // A major
    triad.forEach((f, i) => {
      this.tone({ freq: f, type: 'triangle', at: i * 0.07, dur: 0.34, gain: 0.15 });
    });
    this.tone({ freq: 880, type: 'triangle', at: 0.2, dur: 0.4, gain: 0.1 });
  }

  /** Treasury emptied, troops deserted. */
  public playBankruptcy() {
    this.tone({ freq: 233.08, slideTo: 92.5, type: 'sawtooth', dur: 0.55, gain: 0.15 });
    this.tone({ freq: 155.56, slideTo: 61.7, type: 'square', at: 0.08, dur: 0.5, gain: 0.08 });
  }

  /** A lord has been wiped off the map. */
  public playElimination() {
    this.noise(0, 0.5, 0.09, 700);
    [415.3, 349.23, 261.63, 174.61].forEach((f, i) => {
      this.tone({ freq: f, type: 'triangle', at: i * 0.13, dur: 0.45, gain: 0.14 });
    });
  }

  // ---------------------------------------------------------------- Game end

  public playVictory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.tone({ freq: f, at: i * 0.12, dur: 0.5, gain: 0.18 });
    });
    this.tone({ freq: 1318.5, type: 'triangle', at: 0.5, dur: 0.7, gain: 0.12 });
  }

  public playDefeat() {
    [392, 349.23, 329.63, 261.63].forEach((f, i) => {
      this.tone({ freq: f, type: 'sawtooth', at: i * 0.16, dur: 0.4, gain: 0.13 });
    });
  }
}

export const sounds = new SoundEngine();
