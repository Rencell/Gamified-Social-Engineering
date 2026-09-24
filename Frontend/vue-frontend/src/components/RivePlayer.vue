<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { Rive, StateMachineInput } from '@rive-app/canvas';
import { useCosmeticStore } from '@/stores/cosmetic';

const props = defineProps({
  celebrateState: { type: Boolean, default: true },
  positionState: { type: Number, default: 0 },
  
});

const cosmeticStore = useCosmeticStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let riveInstance: Rive | null = null;

let numberInput: StateMachineInput | null = null;
let positionInput: StateMachineInput | null = null;
let celebInput: StateMachineInput | null = null;

onMounted(async () => {
  if (!canvasRef.value) return;

  await cosmeticStore.fetchCosmetics();

  // Safely resolve src from store
  const userCosmetic = cosmeticStore.cosmetics[0];
  const avatarSrc = userCosmetic?.equipped_avatar?.item;
  if (!avatarSrc) {
    return; // No avatar src available; skip initializing Rive
  }

  
  riveInstance = new Rive({
    src: String(avatarSrc.avatarfile),
    canvas: canvasRef.value,
    autoplay: true,
    stateMachines: ['State Machine 1'],
    onLoad: () => {
      if (!riveInstance) return;
      const inputs = riveInstance.stateMachineInputs('State Machine 1');

      // Find inputs
      numberInput = inputs.find((i) => i.name === 'skinColor') || null;
      positionInput = inputs.find((i) => i.name === 'position') || null;
      celebInput = inputs.find((i) => i.name === 'celeb') || null;

      // Set defaults
      if (numberInput) numberInput.value = avatarSrc.rive_code || 0;
      if (celebInput) celebInput.value = props.celebrateState;
      if (positionInput) positionInput.value = props.positionState;

    
    },
  });
});

// Update numColor when avatarRive changes
watch(
  () => cosmeticStore.avatarRive,
  (newVal) => {
    if (numberInput) numberInput.value = newVal ?? 0;
  }
);

// Reflect celebrateState prop changes
watch(
  () => props.celebrateState,
  (val) => {
    if (celebInput) celebInput.value = val;
  }
);

</script>

<template>
  <canvas ref="canvasRef" width="500" height="500" class="responsive-rive"></canvas>
</template>

<style scoped>
.responsive-rive {
  width: 100%;
  height: auto;
  max-width: 500px;
}
</style>