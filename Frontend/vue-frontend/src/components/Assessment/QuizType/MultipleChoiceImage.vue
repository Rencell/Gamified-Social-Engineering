<template>
    <div class="space-y-8">
        <h2 class="text-xl font-display font-bold text-white text-center text-pretty">
            What's the shortcut for saving the current version of a document to version history?
        </h2>
        <div class="grid grid-cols-2 gap-6">
            <div class="p-3 bg-black rounded-lg flex items-center justify-center">
                <img class="object-center" src="https://fastly.picsum.photos/id/9/5000/3269.jpg?hmac=cZKbaLeduq7rNB8X-bigYO8bvPIWtT-mh8GRXtU3vPc" alt="">
            </div>
            <div class="grid gap-4 md:gap-6 max-w-2xl mx-auto">
                <div
                    v-for="item in qaItems"
                    :key="item.number"
                    class="group relative"
                >
                    <div class="p-4 md:p-5 rounded-lg border-2 border-ternary hover:border-slate-600 bg-secondary hover:bg-slate-900 transition-all duration-200 cursor-pointer">
                        <div class="flex gap-4 md:gap-6">
                            <div class="flex-shrink-0">
                                <span class="flex h-8 w-8 md:h-5 md:w-5 items-center justify-center rounded-full border border-slate-600 text-xs md:text-xs font-semibold text-slate-300">
                                    {{ item.number }}
                                </span>
                            </div>
                            <div class=" min-w-0">
                                <p class="text-primary text-base font-bold font-display text-left">{{ item.question }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const qaItems = [
    {
        number: 1,
        question: "What's the shortcut for saving the current version of a document to version history?",
        answer: "⌘ S (Mac) and Alt S (Windows)",
    },
    {
        number: 2,
        question: "How do I save multiple versions?",
        answer: "⌘ ⌥ S (Mac) and Ctrl Alt S (Windows)",
    },
    {
        number: 3,
        question: "What about keyboard alternatives?",
        answer: "⌘ ⌘ (Mac) and Ctrl S (Windows)",
    },
    {
        number: 4,
        question: "Can I save versions manually?",
        answer: "You can't save a version manually",
    },
];
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>