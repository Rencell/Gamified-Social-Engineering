<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { Rive, StateMachineInput } from '@rive-app/canvas';
import { useCosmeticStore } from '@/stores/cosmetic';


const props = defineProps ({
    boost: {
        type: Boolean,
        default: true,
    },
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let riveInstance: Rive | null = null;

let boostInput: StateMachineInput | null = null;

onMounted(() => {
  if (!canvasRef.value) return; // Ensure the canvas is mounted

  riveInstance = new Rive({
    src: '/MiniGames/Rocket.riv', // Path to your Rive file
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
        boostInput = inputs.find((i) => i.name === 'boost') || null;

        // Set default values if inputs exist
        if (boostInput) {
            boostInput.value = props.boost;
        } else {
          console.warn("State machine input 'numColor' not found.");
        }
      }
    },
  });
});

watch(
    () => props.boost,
    (newValue) => {
        if (boostInput) {
            boostInput.value = newValue;
        }
    }
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