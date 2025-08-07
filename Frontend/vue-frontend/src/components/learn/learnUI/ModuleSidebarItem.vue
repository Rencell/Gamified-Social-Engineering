<script setup lang="ts">
import { ChevronRight, LockKeyhole } from 'lucide-vue-next';

defineProps({
  active: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  lockedIndex: {
    type: Boolean,
    default: false
  },

});
</script>

<template>
  <div>
    <div class="space-y-5" v-if="lockedIndex">
      <hr class="border-ternary mt-5" />
      <p class="w-60 text-sm/relaxed text-white/30">When you have completed all the sections, you can take the exam.</p>
    </div>
    
    <div class="text-sm flex gap-2 items-center mt-6" :class="lockedIndex ? 'cursor-not-allowed' : 'cursor-pointer'">
      <span v-if="!lockedIndex">
        <svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="1"
          style="overflow: initial;">
          <circle cx="8" cy="8" r="7.25" class="stroke-1 stroke-secondary-foreground"></circle>
          <Transition name="fade">
            <path v-if="completed" d="M5 6L8 9L16 1" class="stroke-green-500" stroke-width="3" stroke-linecap="round"
              stroke-linejoin="round"></path>
          </Transition>
        </svg>
      </span>
      <span v-else>
        <LockKeyhole class="w-4 text-ternary"></LockKeyhole>
      </span>
      <span class="font-medium hover:text-accent/40" :class="active ? 'text-accent' : 'text-secondary-foreground'">
        <slot></slot>
      </span>
      <span v-if="active">
        <ChevronRight :class="active ? 'text-accent' : 'text-secondary-foreground'"></ChevronRight>
      </span>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
