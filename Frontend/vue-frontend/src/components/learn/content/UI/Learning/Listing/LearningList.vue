<template>
  <div class="p-4 rounded-xl">
    <ul class="list-none p-0 m-0 animate-parent">
      <slot></slot>
    </ul>
  </div>
</template>

<script setup lang="ts">
// No props needed anymore
</script>


<style scoped>
@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-parent > * {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

/* Optional: staggered effect */
.animate-parent > *:nth-child(1) {
  animation-delay: 0.6s;
}
.animate-parent > *:nth-child(2) {
  animation-delay: 0.8s;
}
.animate-parent > *:nth-child(3) {
  animation-delay: 1.2s;
}
.animate-parent > *:nth-child(4) {
  animation-delay: 1.4s;
}
.animate-parent > *:nth-child(5) {
  animation-delay: 1.6s;
}
/* ...you can extend this further or use JS for dynamic staggering */
</style>