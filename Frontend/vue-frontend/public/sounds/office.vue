<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const ringAudio = ref<HTMLAudioElement | null>(null)

onMounted(async () => {
  ringAudio.value = new Audio('/sounds/ring.mp3')
  ringAudio.value.loop = true
  ringAudio.value.volume = 0.6

  // Some browsers require a user gesture before audio can autoplay.
  // If play() fails, call it after a click (e.g., when user accepts).
  try {
    await ringAudio.value.play()
  } catch (e) {
    // autoplay blocked; you can ignore or trigger on a user click later
  }
})

onUnmounted(() => {
  ringAudio.value?.pause()
  ringAudio.value = null
})