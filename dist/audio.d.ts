export declare class AudioManager {
    private audioContext;
    private soundEnabled;
    private musicEnabled;
    private musicTimeout;
    private musicPattern;
    private sounds;
    private ensureContext;
    unlock(): void;
    private stopMusicLoop;
    private playTone;
    playSound(name: string): void;
    toggleSound(): boolean;
    toggleMusic(): boolean;
    private startMusicLoop;
}
export declare function initAudioControls(audioManager: AudioManager): void;
//# sourceMappingURL=audio.d.ts.map