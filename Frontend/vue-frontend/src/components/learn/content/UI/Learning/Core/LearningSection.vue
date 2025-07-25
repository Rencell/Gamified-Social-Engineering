<template>
    <div class="animate-parent flex flex-col w-2xl my-2 text-gray-200">
        <slot></slot>
    </div>
    
</template>




<style scoped>
@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-parent > * {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

/* Optional: staggered effect */
.animate-parent > *:nth-child(1) {
  animation-delay: 0.1s;
}
.animate-parent > *:nth-child(2) {
  animation-delay: 0.3s;
}
.animate-parent > *:nth-child(3) {
  animation-delay: 0.5s;
}
.animate-parent > *:nth-child(4) {
  animation-delay: 0.7s;
}
.animate-parent > *:nth-child(5) {
  animation-delay: 0.7s;
}
.animate-parent > *:nth-child(6) {
  animation-delay: 0.7s;
}
/* ...you can extend this further or use JS for dynamic staggering */
</style>
