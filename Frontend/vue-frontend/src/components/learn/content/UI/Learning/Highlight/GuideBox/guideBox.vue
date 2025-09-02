<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    code: string
    language?: string
    label?: string
}>()

const copied = ref(false)

async function copy() {
    try {
        await navigator.clipboard.writeText(props.code)
        copied.value = true
        setTimeout(() => (copied.value = false), 1400)
    } catch (e) {
        console.error('Copy failed', e)
    }
}
</script>

<template>
    <div class="group relative overflow-hidden rounded-2xl border border-ternary bg-secondary/60">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-ternary px-4 py-2">
            <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-red-500/80"></span>
                <span class="size-2 rounded-full bg-yellow-500/80"></span>
                <span class="size-2 rounded-full bg-green-500/80"></span>
            </div>
            <span class="text-xs text-zinc-400">{{ props.label || props.language || 'bash' }}</span>

            <button
                @click="copy"
                class="rounded-xl border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition
                             hover:bg-zinc-800 active:scale-[0.98]">
                <span v-if="!copied">Copy</span>
                <span v-else>Copied!</span>
            </button>
        </div>

        <!-- Code -->
        <pre class="m-0 overflow-x-auto p-4 text-sm leading-6 text-zinc-200">
            <code class="text-sm">{{ props.code }}</code>
        </pre>
    </div>
</template>

<style scoped>
pre::-webkit-scrollbar { height: 8px; }
pre::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 9999px; }
</style>
