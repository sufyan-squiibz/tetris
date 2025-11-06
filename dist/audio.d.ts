interface SoundConfig {
    freq: number;
    duration: number;
    type: OscillatorType;
    volume?: number;
}
export declare class AudioManager {
    private audioContext;
    private soundEnabled;
    private musicEnabled;
    private musicTimeout;
    private musicPattern;
    private sounds;
    ensureContext(): void;
    unlock(): void;
    stopMusicLoop(): void;
    playTone({ freq, duration, type, volume }: SoundConfig): void;
    playSound(name: string): void;
    toggleSound(): boolean;
    toggleMusic(): boolean;
    startMusicLoop(): void;
}
export declare const audioManager: AudioManager;
export declare function addAudioControls(): void;
export declare function registerAudioUnlock(): void;
export {};
//# sourceMappingURL=audio.d.ts.map