<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'


const emit = defineEmits(['next', 'prev'])

const router = useRouter()
const goToAvatarSelection = () => {
  router.push('/onboarding/avatar')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-7 px-6 py-12 text-center motion-preset-fade ">
    <!-- Avatar Grid -->
    <div class="mb-8 flex justify-center w-md">
        <img src="/Guides/ransomware.webp" alt="">
    </div>

    <!-- Content -->
    <div class="max-w-2xl space-y-6 w-md">
      <h1 class="text-2xl font-bold leading-tight text-foreground md:text-3xl font-display">
        Cybercrime is a growing threat affecting everyone
      </h1>

      <div class="space-y-4 text-sm text-muted-foreground font-semibold font-display">
        <p>
          Empower yourself with the knowledge to protect yourself against cyber threats in the most fun way with
          Priventi.
        </p>
        <p>It is time to take a stand and join the fight to protect our digital world.</p>
      </div>
    </div>

    <!-- Navigation -->
    <Button size="lg" class="mt-8 w-full max-w-md" @click="goToAvatarSelection()">
      Continue
    </Button>
  </div>
</template>