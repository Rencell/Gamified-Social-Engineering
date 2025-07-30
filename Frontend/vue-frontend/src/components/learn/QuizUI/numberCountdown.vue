<template>
    <div class="number-container">
        <span class="final">{{ props.finalCoins }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    finalCoins: {
        type: Number,
        default: 8,
    },
});
</script>

<style scoped>
@keyframes scaleLoop {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.3);
    }
}

.final {
    animation: scaleLoop 1s infinite alternate;
}
</style>
