<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { ThemeToggle } from '../ui/theme-toggle'


const router = useRouter()
const goToAvatarSelection = () => {
  router.push('/onboarding/avatar')
}

// Theme toggle is handled by <ThemeToggle />
const THEME_STORAGE_KEY = 'theme'

</script>

<template>
  <div
    class="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-4 py-8 text-center motion-preset-fade sm:gap-7 sm:px-6 sm:py-12"
  >
  <ThemeToggle
                class="h-9 w-9 absolute top-4 right-4 sm:top-6 sm:right-6"
                :storage-key="THEME_STORAGE_KEY"
              />
    <!-- Avatar Grid -->
    <div class="mb-4 flex w-full justify-center sm:mb-8">
      <img
        src="/Guides/ransomware.webp"
        alt=""
        class="h-auto w-full max-w-xs object-contain sm:max-w-sm md:max-w-md"
      >
    </div>

    <!-- Content -->
    <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
      <h1 class="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        Cybercrime is a growing threat affecting everyone
      </h1>

      <div class="font-display space-y-4 text-sm font-semibold text-muted-foreground">
        <p>
          Empower yourself with the knowledge to protect yourself against cyber threats in the most fun way with
          Priventi.
        </p>
        <p>It is time to take a stand and join the fight to protect our digital world.</p>
      </div>
    </div>

    <!-- Navigation -->
    <Button size="lg" class="mt-6 w-full max-w-md sm:mt-8" @click="goToAvatarSelection()">
      Continue
    </Button>
  </div>
</template>