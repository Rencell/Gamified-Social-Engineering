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
    [SoundFx.Notification]: '/sounds/notification.wav'

}

export function useSoundFx(effect: SoundFx): string {
    return sounds[effect] || '';
}

export function playSoundFx(effect: SoundFx): void {
    const path = useSoundFx(effect)
    if (!path) return
    const audio = new Audio(path)
    void audio.play()
}
