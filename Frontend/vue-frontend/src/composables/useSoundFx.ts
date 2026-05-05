export enum SoundFx {
    Button,
    Error,
    Correct,
    Transition,
    TransitionUp,
    TransitionDown,
    Celebration,
    LevelUp,
    Notification,
    NewExp,
    Calling,
    OfficeBackground,
    failure,

}

const sounds: Record<SoundFx, string> = {
    [SoundFx.Button]: '/sounds/button.wav',
    [SoundFx.Error]: '/sounds/error.mp3',
    [SoundFx.Correct]: '/sounds/celebration.wav',
    [SoundFx.Transition]: '/sounds/select.wav',
    [SoundFx.TransitionUp]: '/sounds/transition_up.wav',
    [SoundFx.TransitionDown]: '/sounds/transition_down.wav',
    [SoundFx.Celebration]: '/sounds/fanfare_trumpets.mp3',
    [SoundFx.LevelUp]: '/sounds/level_up.mp3',
    [SoundFx.Notification]: '/sounds/notification.wav',
    [SoundFx.NewExp]: '/sounds/new_exp.mp3',
    [SoundFx.Calling]: '/sounds/ringing.mp3',
    [SoundFx.OfficeBackground]: '/sounds/office_background.mp3',
    [SoundFx.failure]: '/sounds/failure.mp3',

}

const activeAudios = new Set<HTMLAudioElement>()

export function useSoundFx(effect: SoundFx): string {
    return sounds[effect] || '';
}

export function playSoundFx(effect: SoundFx, loop: boolean = false): void {
    const path = useSoundFx(effect)
    if (!path) return
    const audio = new Audio(path)
    activeAudios.add(audio)
    audio.loop = loop
    void audio.play()
}

export function disconnectSoundFx(): void {
    for (const audio of activeAudios) {
        try {
            audio.pause()
            audio.currentTime = 0
        } catch {
        }
    }
    activeAudios.clear()
}