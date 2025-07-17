<template>
    <div class="relative w-full h-[200px] overflow-hidden shadow-lg">
        <!-- Background Image -->
        <img src="https://picsum.photos/1200/800?grayscale" alt="Phishing awareness background"
            class="absolute inset-0 w-full h-full object-cover" />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40"></div>

        <!-- Text Content -->
        <div class="relative z-10 h-full flex items-center px-10 md:px-20 text-white">
            <div class="max-w-xl">
                <div class="h-1 w-10 bg-white mb-4"></div>
                <p class="text-2xl leading-relaxed font-light">
                    Phishing scams are popular because they work. However
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// No logic needed unless you're passing props (e.g. text or image)
</script>