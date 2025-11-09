<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';


defineProps<{
    from: string;
    subject: string;
    link: string;
    date: string;
    body: string[];
    footer: string;
}>();

const auth = useAuthStore();

</script>
<template>
    <div class="w-full rounded-2xl mx-auto">
        <div class="space-y-2 bg-green-600/50 p-6 rounded-tr-sm rounded-tl-sm border-b border-gray-300 font-display">
            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">From:</span>
                <span class="rounded px-1">
                    {{from}}
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">To:</span>
                <span class="rounded px-1">
                    {{auth.User?.email}}
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">Subject:</span>
                <span class="rounded px-1">
                    {{subject}}
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">Date:</span>
                <span class="rounded px-1">
                    {{date}}
                </span>
            </div>
        </div>


        <div class="space-y-4 bg-gray-100 p-6 font-display  rounded-br-sm rounded-bl-sm">
            <div class="whitespace-pre-line leading-relaxed  text-gray-700">
                
                <div class="space-y-3">
                    <template v-for="value in body" :key="value">
                        <a v-if="value.charAt(0) === '#'" :href="link" class="text-blue-800 underline inline-block" @click.prevent>
                            {{ value.trim().substring(1) }}
                        </a>
                        <p v-else>{{ value }}</p>
                    </template>
                    

                </div>
            </div>
            <hr class="border-t border-gray-300" />

            <p class=" text-gray-700">{{footer}}</p>
        </div>
    </div>
</template>