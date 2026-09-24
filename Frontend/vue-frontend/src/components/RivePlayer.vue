<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { Rive, StateMachineInput } from '@rive-app/canvas';
import { useCosmeticStore } from '@/stores/cosmetic';

const props = defineProps({
  celebrateState: {
    type: Boolean,
    default: true,
  },
});

const cosmeticStore = useCosmeticStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let riveInstance: Rive | null = null;

let numberInput: StateMachineInput | null = null;
let celebInput: StateMachineInput | null = null;
let blinkInput: StateMachineInput | null = null;

onMounted(() => {
  if (!canvasRef.value) return; // Ensure the canvas is mounted

  riveInstance = new Rive({
    src: '/Home/robot-try-2.riv', // Path to your Rive file
    canvas: canvasRef.value,
    autoplay: true,
    stateMachines: ['State Machine 1'],
    onLoad: () => {
      console.log('Rive animation loaded');
      if (riveInstance) {
        const inputs = riveInstance.stateMachineInputs('State Machine 1');

        // Debug: Log all available inputs
        console.log('Available inputs:', inputs);

        // Find inputs and ensure they exist
        blinkInput = inputs.find((i) => i.name === 'blink') || null;
        numberInput = inputs.find((i) => i.name === 'numColor') || null;
        celebInput = inputs.find((i) => i.name === 'celeb') || null;

        // Set default values if inputs exist
        if (numberInput) {
          numberInput.value = cosmeticStore.avatarRive || 0;
        } else {
          console.warn("State machine input 'numColor' not found.");
        }

        if (celebInput) {
          celebInput.value = props.celebrateState;
        } else {
          console.warn("State machine input 'celeb' not found.");
        }
      }

      // Blink animation logic
      if (blinkInput) {
        setInterval(() => {
          if (blinkInput) {
            blinkInput.value = true;

            setTimeout(() => {
              if (blinkInput) {
                blinkInput.value = false;
              }
            }, 600); // Blink duration
          }
        }, 6000); // Blink interval
      } else {
        console.warn("State machine input 'blink' not found.");
      }
    },
  });
});

watch(
  () => cosmeticStore.avatarRive,
  (newVal) => {
    if (numberInput) {
      numberInput.value = newVal ?? 0;
    }
  },
  { immediate: false }
);

onBeforeUnmount(() => {
  riveInstance?.cleanup();
});
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