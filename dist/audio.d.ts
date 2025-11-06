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
    playTone(config: SoundConfig): void;
    playSound(name: string): void;
    toggleSound(): boolean;
    toggleMusic(): boolean;
    startMusicLoop(): void;
}
export declare function addAudioControls(audioManager: AudioManager): void;
export declare function registerAudioUnlock(audioManager: AudioManager): void;
export {};
//# sourceMappingURL=audio.d.ts.map