interface Sound {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private sounds: Record<string, Sound> = {
    move: { freq: 220, duration: 0.05, type: 'square', volume: 0.15 },
    rotate: { freq: 330, duration: 0.07, type: 'sawtooth', volume: 0.18 },
    drop: { freq: 180, duration: 0.12, type: 'sine', volume: 0.22 },
    clear: { freq: 520, duration: 0.18, type: 'square', volume: 0.3 },
    levelup: { freq: 760, duration: 0.25, type: 'triangle', volume: 0.28 },
    gameover: { freq: 130, duration: 0.7, type: 'sawtooth', volume: 0.25 }
  };

  private ensureContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public unlock(): void {
    this.ensureContext();
  }

  private playTone(sound: Sound): void {
    if (!this.soundEnabled) return;
    
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.freq, this.audioContext.currentTime);

    gain.gain.setValueAtTime(sound.volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + sound.duration + 0.05);
  }

  public playSound(name: string): void {
    const sound = this.sounds[name];
    if (sound) {
      this.playTone(sound);
    }
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}
