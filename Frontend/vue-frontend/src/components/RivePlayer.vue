<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { Rive, StateMachineInput } from '@rive-app/canvas';
import { useCosmeticStore } from '@/stores/cosmetic';
const cosmeticStore = useCosmeticStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let riveInstance: Rive | null = null;

let numberInput = null;
let blinkInput: StateMachineInput | null | undefined = null;

onMounted(() => {
  if (!canvasRef.value) return; // ensure the canvas is mounted
  riveInstance = new Rive({
    src: '/Home/robot-idle-try.riv', // path to your Rive file
    canvas: canvasRef.value,
    autoplay: true,
    stateMachines: ['State Machine 1'],
    onLoad: () => {
      console.log('Rive animation loaded');
      if (riveInstance) {
        const inputs = riveInstance.stateMachineInputs('State Machine 1');
        blinkInput = inputs.find(i => i.name === 'blink');
        numberInput = inputs.find(i => i.name === 'numColor');

        if (numberInput) {
          numberInput.value = cosmeticStore.avatarRive || 0;
        }
      }

      setInterval(() => {
        if (!blinkInput)
          return;
        blinkInput.value = true; 

        setTimeout(() => {
          if (!blinkInput)
            return;
          blinkInput.value = false;
        }, 600); 

      }, 6000); 

    }
  });
});

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