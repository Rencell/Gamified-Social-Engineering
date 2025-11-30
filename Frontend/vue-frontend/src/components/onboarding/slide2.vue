<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { onMounted, ref } from 'vue';
import RivePlayer from '../RivePlayer.vue'
import { useCosmeticStore } from '@/stores/cosmetic';
import { useRouter } from 'vue-router';


const emit = defineEmits(['next', 'prev'])

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
    const item = cosmeticStore.inventory_items.find(item => item.item.id === 3)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
  else if(selectedColor.value === 'green') {
    const item = cosmeticStore.inventory_items.find(item => item.item.id === 7)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
  else {
    const item = cosmeticStore.inventory_items.find(item => item.item.id === 4)
    if (item) {
      cosmeticStore.setCosmetic(item);
    } else {
      console.error('Item not found in inventory.');
    }
  }
}

onMounted(() => {
  cosmeticStore.fetchCosmetics();
  cosmeticStore.fetchInventory();
});
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-7 px-6 py-12 text-center motion-preset-fade ">
    <!-- Avatar Grid -->
    <div class="mb-8 flex justify-center w-70">
        <RivePlayer />
    </div>

    <!-- Content -->
    <div class="max-w-2xl space-y-6 w-md">
      <h1 class="text-2xl font-bold leading-tight text-foreground md:text-3xl font-display">
        Meet your digital guardian
      </h1>

      <div class="space-y-4 text-sm text-muted-foreground font-semibold font-display">
        <p>
          Your avatar will represent you in the game, guiding you through various challenges and scenarios to enhance your cybersecurity skills.
        </p>
      </div>
    </div>

    <div>
      <div class="flex gap-3">
        <div class="size-8 rounded-full bg-purple-600" @click="changeColor('purple')" :class="{'border-2 border-black': selectedColor === 'red'}"></div>
        <div class="size-8 rounded-full bg-orange-600" @click="changeColor('orange')" :class="{'border-2 border-black': selectedColor === 'blue'}"></div>
        <div class="size-8 rounded-full bg-green-600" @click="changeColor('green')" :class="{'border-2 border-black': selectedColor === 'green'}"></div>
      </div>
      
    </div>
    <!-- Navigation -->
    <Button size="lg" class="mt-8 w-full max-w-md" @click="goToAvatarSelection()">
      Continue
    </Button>
  </div>
</template>