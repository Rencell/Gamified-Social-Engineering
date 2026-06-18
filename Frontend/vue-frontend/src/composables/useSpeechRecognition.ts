import { watch, ref, onBeforeUnmount, unref, isRef, type Ref } from 'vue';

// Minimal typings to avoid depending on DOM lib SpeechRecognition types
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((ev: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionResultEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionErrorEventLike = { error: string };

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function useSpeechRecognition(language?: Ref<string> | string) {
  const isSupported = ref(false);
  const isListening = ref(false);
  const note = ref('');
  const finalNote = ref('');
  const error = ref<string | null>(null);
  // const mediaStream = ref<MediaStream | null>(null);
  const isAISpeaking = ref(false);

  // Resolve language: accept a string or a Ref<string>. Default to navigator.language.
  let langRef: Ref<string>;
  if (language == null) {
    const nav = typeof navigator !== 'undefined' ? (navigator.language || 'en-US') : 'en-US';
    // Prefer Filipino tag if navigator indicates Tagalog/Filipino
    const prefer = nav.startsWith('fil') || nav.startsWith('tl') ? 'fil-PH' : 'en-US';
    langRef = ref(prefer);
  } else if (isRef(language)) {
    langRef = language as Ref<string>;
  } else {
    langRef = ref(String(language));
  }

  const Ctor = getSpeechRecognitionCtor();
  const recognition = Ctor ? new Ctor() : null;
  isSupported.value = !!recognition;

  // Used to distinguish intentional stop from unexpected end/errors.
  let shouldRestart = false;
  let restartTimer: number | null = null;

  const scheduleRestart = () => {
    if (!recognition) return;
    if (!isListening.value) return;
    if (!shouldRestart) return;

    if (restartTimer != null) {
      clearTimeout(restartTimer);
      restartTimer = null;
    }

    // Small backoff prevents tight restart loops.
    restartTimer = window.setTimeout(() => {
      restartTimer = null;
      try {
        recognition.start();
      } catch {
        // If it still throws (already started), try again shortly.
        scheduleRestart();
      }
    }, 250);
  };

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = unref(langRef);

    recognition.onresult = (event) => {
      if (isAISpeaking.value) {
        return;
      }

      let interim = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = (res?.[0]?.transcript ?? '').toString();
        if (res.isFinal) finalText += text;
        else interim += text;
      }

      note.value = (finalText || interim).trim();
      if (finalText.trim()) {
        finalNote.value = finalText.trim();
      }
    };

    recognition.onerror = (event) => {
      error.value = event.error;
      scheduleRestart();
    };

    recognition.onend = () => {
      if (isListening.value && shouldRestart) {
        scheduleRestart();
        return;
      }
      isListening.value = false;
    };
  }

  const initializeAudio = async () => {
    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      return true;
    } catch (err) {
      console.error(err);
      try {
        mediaStream.value = await navigator.mediaDevices.getUserMedia({
          audio: true 
        });
        return true;
      } catch (err2) {
        console.error(err2);
        error.value = 'Microphone access denied';
        return false;
      }
    }
  };


  const start = async () => {
    if (!recognition) return;

    // const audioReady = await initializeAudio();
    // if (!audioReady) return;

    error.value = null;
    shouldRestart = true;
    // ensure recognition uses current language before starting
    try {
      recognition.lang = unref(langRef);
    } catch {
      // ignore if setting lang fails in some environments
    }
    try {
      recognition.start();
    } catch {
      scheduleRestart();
    }
  };

  const stop = () => {
    if (!recognition) return;
    shouldRestart = false;
    if (restartTimer != null) {
      clearTimeout(restartTimer);
      restartTimer = null;
    }
    // if (mediaStream.value) {
    //   mediaStream.value.getTracks().forEach((track) => track.stop());
    //   mediaStream.value = null;
    // }
    try {
      recognition.stop();
    } catch {
      // ignore
    }
  };

  const toggleListening = () => {
    isListening.value = !isListening.value;
  };

  watch(isListening, (val) => {
    if (val) start();
    else stop();
  });

  onBeforeUnmount(() => {
    stop();
  });

  return {
    isSupported,
    isListening,
    toggleListening,
    start,
    stop,
    language: langRef,
    setLanguage: (l: string) => { langRef.value = l; },
    note,
    finalNote,
    error,
    isAISpeaking
  };
}