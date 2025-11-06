// Gestionnaire audio avec TypeScript
type SoundName = 'move' | 'rotate' | 'drop' | 'clear' | 'levelup' | 'gameover';

interface Sound {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

interface Note {
  freq: number;
  duration: number;
  type: OscillatorType;
}

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private musicTimeout: number | null = null;

  private readonly musicPattern: Note[] = [
    { freq: 523.25, duration: 0.22, type: 'triangle' }, // C5
    { freq: 659.25, duration: 0.22, type: 'triangle' }, // E5
    { freq: 783.99, duration: 0.22, type: 'triangle' }, // G5
    { freq: 659.25, duration: 0.22, type: 'triangle' },
    { freq: 587.33, duration: 0.22, type: 'triangle' },
    { freq: 698.46, duration: 0.22, type: 'triangle' },
    { freq: 880.00, duration: 0.30, type: 'triangle' }
  ];

  private readonly sounds: Record<SoundName, Sound> = {
    move: { freq: 220, duration: 0.05, type: 'square', volume: 0.15 },
    rotate: { freq: 330, duration: 0.07, type: 'sawtooth', volume: 0.18 },
    drop: { freq: 180, duration: 0.12, type: 'sine', volume: 0.22 },
    clear: { freq: 520, duration: 0.18, type: 'square', volume: 0.3 },
    levelup: { freq: 760, duration: 0.25, type: 'triangle', volume: 0.28 },
    gameover: { freq: 130, duration: 0.7, type: 'sawtooth', volume: 0.25 }
  };

  constructor() {
    this.registerAudioUnlock();
    this.addAudioControls();
  }

  private ensureContext(): void {
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

  private stopMusicLoop(): void {
    if (this.musicTimeout !== null) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  private playTone({ freq, duration, type, volume = 0.2 }: Sound): void {
    if (!this.soundEnabled) return;

    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.05);
  }

  playSound(name: SoundName): void {
    const sound = this.sounds[name];
    if (sound) {
      this.playTone(sound);
    }
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

  private startMusicLoop(): void {
    if (!this.musicEnabled) return;

    this.ensureContext();
    if (!this.audioContext) return;

    const patternDuration = this.musicPattern.reduce((sum, note) => sum + note.duration, 0) + 0.5;

    let start = this.audioContext.currentTime;
    this.musicPattern.forEach(note => {
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      oscillator.type = note.type;
      oscillator.frequency.setValueAtTime(note.freq, start);
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.duration);

      oscillator.connect(gain);
      gain.connect(this.audioContext.destination);

      oscillator.start(start);
      oscillator.stop(start + note.duration + 0.05);
      start += note.duration;
    });

    this.stopMusicLoop();
    this.musicTimeout = window.setTimeout(() => this.startMusicLoop(), patternDuration * 1000);
  }

  private addAudioControls(): void {
    const audioControls = document.createElement('div');
    audioControls.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 10px;
    `;

    const soundBtn = document.createElement('button');
    soundBtn.textContent = '🔊 Son';
    soundBtn.className = 'btn btn-secondary';
    soundBtn.onclick = () => {
      const enabled = this.toggleSound();
      soundBtn.textContent = enabled ? '🔊 Son' : '🔇 Son';
    };

    const musicBtn = document.createElement('button');
    musicBtn.textContent = '🎵 Musique';
    musicBtn.className = 'btn btn-secondary';
    musicBtn.onclick = () => {
      const enabled = this.toggleMusic();
      musicBtn.textContent = enabled ? '🎵 Musique (ON)' : '🎵 Musique (OFF)';
    };

    audioControls.appendChild(soundBtn);
    audioControls.appendChild(musicBtn);

    const container = document.querySelector('.game-container');
    if (container) {
      container.appendChild(audioControls);
    }
  }

  private registerAudioUnlock(): void {
    const unlock = () => {
      this.unlock();
    };

    const onceOptions: AddEventListenerOptions = { once: true, capture: false };
    document.addEventListener('pointerdown', unlock, onceOptions);
    document.addEventListener('keydown', unlock, onceOptions);
  }
}
