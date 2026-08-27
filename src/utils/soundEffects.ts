// Audio and Haptic feedback utility for BringDollar
class SoundEffects {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage for user sound preference
    try {
      const savedMute = localStorage.getItem('bringdollar_sound_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public set muted(val: boolean) {
    this.isMuted = val;
    try {
      localStorage.setItem('bringdollar_sound_muted', String(val));
    } catch {
      // ignore
    }
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Plays a crisp, gentle crystalline chime for wallet payment receipt
   */
  public playPaymentChime() {
    if (this.isMuted) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Chord frequencies: C6, E6, G6, B6 (Major 7th sparkle)
      const frequencies = [1046.50, 1318.51, 1567.98, 1975.53, 2093.00];

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        // Soft bell envelope
        gain.gain.setValueAtTime(0.001, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08 / (index + 1), now + index * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.75);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Plays a subtle coin drop sound
   */
  public playCoinDrop() {
    if (this.isMuted) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.12);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  /**
   * Device haptic feedback
   */
  public triggerHaptic(pattern: number[] = [40, 30, 80, 30, 100]) {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // vibrate might not be supported
    }
  }
}

export const soundManager = new SoundEffects();
