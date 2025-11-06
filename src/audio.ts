import { SoundConfig } from './types';

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private musicTimeout: number | null = null;
  private musicPattern: SoundConfig[] = [
    { freq: 523.25, duration: 0.22, type: 'triangle' }, // C5
    { freq: 659.25, duration: 0.22, type: 'triangle' }, // E5
    { freq: 783.99, duration: 0.22, type: 'triangle' }, // G5
    { freq: 659.25, duration: 0.22, type: 'triangle' },
    { freq: 587.33, duration: 0.22, type: 'triangle' },
    { freq: 698.46, duration: 0.22, type: 'triangle' },
    { freq: 880.00, duration: 0.30, type: 'triangle' }
  ];
  private sounds: Record<string, SoundConfig> = {
    move: { freq: 220, duration: 0.05, type: 'square', volume: 0.15 },
    rotate: { freq: 330, duration: 0.07, type: 'sawtooth', volume: 0.18 },
    drop: { freq: 180, duration: 0.12, type: 'sine', volume: 0.22 },
    clear: { freq: 520, duration: 0.18, type: 'square', volume: 0.3 },
    levelup: { freq: 760, duration: 0.25, type: 'triangle', volume: 0.28 },
    gameover: { freq: 130, duration: 0.7, type: 'sawtooth', volume: 0.25 }
  };

  ensureContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  unlock(): void {
    this.ensureContext();
  }

  stopMusicLoop(): void {
    if (this.musicTimeout !== null) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  playTone(config: SoundConfig): void {
    if (!this.soundEnabled || !this.audioContext) {
      return;
    }
    this.ensureContext();
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);

    const volume = config.volume || 0.2;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + config.duration + 0.05);
  }

  playSound(name: string): void {
    const sound = this.sounds[name];
    if (!sound) {
      return;
    }
    this.playTone(sound);
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopMusicLoop();
    }
    return this.soundEnabled;
  }

  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusicLoop();
    } else {
      this.stopMusicLoop();
    }
    return this.musicEnabled;
  }

  startMusicLoop(): void {
    if (!this.musicEnabled || !this.audioContext) {
      return;
    }
    this.ensureContext();
    const patternDuration = this.musicPattern.reduce((sum, note) => sum + note.duration, 0) + 0.5;

    let start = this.audioContext.currentTime;
    this.musicPattern.forEach(note => {
      const oscillator = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      oscillator.type = note.type;
      oscillator.frequency.setValueAtTime(note.freq, start);
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.duration);

      oscillator.connect(gain);
      gain.connect(this.audioContext!.destination);

      oscillator.start(start);
      oscillator.stop(start + note.duration + 0.05);
      start += note.duration;
    });

    this.stopMusicLoop();
    this.musicTimeout = window.setTimeout(() => this.startMusicLoop(), patternDuration * 1000);
  }
}
