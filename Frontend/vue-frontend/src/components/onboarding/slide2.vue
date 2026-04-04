<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { onMounted, ref } from 'vue';
import RivePlayer from '../RivePlayer.vue'
import { useCosmeticStore } from '@/stores/cosmetic';
import { useRouter } from 'vue-router';
import { ThemeToggle } from '../ui/theme-toggle';


const selectedColor = ref('red');
const changeColor = (color: string) => {
  // Logic to change avatar color can be added here
  selectedColor.value = color;
  updateCosmetic();
}

const cosmeticStore = useCosmeticStore();

const router = useRouter()
const goToAvatarSelection = () => {
  router.push('/onboarding/email-simulation')
}

const updateCosmetic = () => {
  // cosmeticStore.setCosmetic()
  if(selectedColor.value === 'purple') {
    const item = cosmeticStore.inventory_items.find(item => item.item.rive_code === 0)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
  else if(selectedColor.value === 'green') {
    const item = cosmeticStore.inventory_items.find(item => item.item.rive_code === 3)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
  else if(selectedColor.value === 'gray') {
    const item = cosmeticStore.inventory_items.find(item => item.item.rive_code === 2)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
  else {
    const item = cosmeticStore.inventory_items.find(item => item.item.rive_code === 1)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
}

// Theme toggle is handled by <ThemeToggle />
const THEME_STORAGE_KEY = 'theme'

onMounted(() => {
  cosmeticStore.fetchCosmetics();
  cosmeticStore.fetchInventory();
});
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
      <div class="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[420px]">
        <RivePlayer />
      </div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
      <h1 class="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        Meet your digital guardian
      </h1>

      <div class="font-display space-y-4 text-sm font-semibold text-muted-foreground">
        <p>
          Your avatar will represent you in the game, guiding you through various challenges and scenarios to enhance your cybersecurity skills.
        </p>
      </div>
    </div>

    <div class="w-full">
      <div class="flex flex-wrap justify-center gap-3">
        <div
          class="size-8 rounded-full bg-purple-600"
          @click="changeColor('purple')"
          :class="{ 'border-2 border-black': selectedColor === 'purple' }"
        ></div>
        <div
          class="size-8 rounded-full bg-orange-600"
          @click="changeColor('orange')"
          :class="{ 'border-2 border-black': selectedColor === 'orange' }"
        ></div>
        <div
          class="size-8 rounded-full bg-green-600"
          @click="changeColor('green')"
          :class="{ 'border-2 border-black': selectedColor === 'green' }"
        ></div>
        <div
          class="size-8 rounded-full bg-slate-600"
          @click="changeColor('gray')"
          :class="{ 'border-2 border-black': selectedColor === 'gray' }"
        ></div>
      </div>
    </div>

    <!-- Navigation -->
    <Button size="lg" class="mt-6 w-full max-w-md sm:mt-8" @click="goToAvatarSelection()">
      Continue
    </Button>
  </div>
</template>