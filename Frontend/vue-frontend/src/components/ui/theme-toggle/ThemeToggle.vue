<script setup lang="ts">
import { onMounted, ref, type HTMLAttributes } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { playSoundFx, SoundFx } from '@/composables/useSoundFx'

const THEME_STORAGE_KEY = 'theme'

type Theme = 'light' | 'dark'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  storageKey?: string
  defaultTheme?: Theme
  /** If true, skip reading OS preference when no saved theme exists */
  disableSystem?: boolean
  /** Optional icon size classes (e.g. 'w-5 h-5') */
  iconClass?: HTMLAttributes['class']
  /** Optional aria-label override */
  ariaLabel?: string
}>(), {
  storageKey: THEME_STORAGE_KEY,
  defaultTheme: 'light',
  disableSystem: false,
  iconClass: 'w-5 h-5',
  ariaLabel: 'Toggle theme',
})

const isDarkMode = ref(false)

function applyTheme(theme: Theme) {
  isDarkMode.value = theme === 'dark'
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(props.storageKey, theme)
}

function initTheme() {
  const stored = localStorage.getItem(props.storageKey)
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored)
    return
  }

  if (!props.disableSystem) {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    applyTheme(prefersDark ? 'dark' : 'light')
    return
  }

  applyTheme(props.defaultTheme)
}

function toggleTheme() {
  applyTheme(isDarkMode.value ? 'light' : 'dark')

  if(isDarkMode.value){
    playSoundFx(SoundFx.TransitionUp)
  }else{
    playSoundFx(SoundFx.TransitionDown)
  }
}

onMounted(() => {
  initTheme()
})
</script>

<template>
  <button
    type="button"
    :aria-label="props.ariaLabel"
    :class="cn('inline-flex items-center justify-center rounded-md text-ternary hover:bg-accent/20', props.class)"
    @click.stop="toggleTheme"
  >
    <Sun v-if="isDarkMode" :class="cn(props.iconClass)" />
    <Moon v-else :class="cn(props.iconClass)" />
  </button>
</template>
