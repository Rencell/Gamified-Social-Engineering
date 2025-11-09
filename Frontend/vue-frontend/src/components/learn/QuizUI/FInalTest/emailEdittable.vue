<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
    from: string;
    subject: string;
    link: string;
    date: string;
    body: string[];
    footer: string;
}>();

const emit = defineEmits<{
    'update:from': [value: string];
    'update:subject': [value: string];
    'update:date': [value: string];
    'update:link': [value: string];
    'update:body': [value: string[]];
    'update:footer': [value: string];
    addBody: [];
    removeBody: [index: number];
}>();

// Create individual computed properties with setters
const from = computed({
    get: () => props.from,
    set: (value: string) => emit('update:from', value)
});

const subject = computed({
    get: () => props.subject,
    set: (value: string) => emit('update:subject', value)
});

const date = computed({
    get: () => props.date,
    set: (value: string) => emit('update:date', value)
});
const link = computed({
    get: () => props.link,
    set: (value: string) => emit('update:link', value)
});

const body = computed({
    get: () => props.body,
    set: (value: string[]) => emit('update:body', value)
});
const footer = computed({
    get: () => props.footer,
    set: (value: string) => emit('update:footer', value)
});


</script>

<template>
    <div class="w-full rounded-2xl mx-auto">
        <div class="space-y-2 bg-green-600/50 p-6 rounded-tr-sm rounded-tl-sm border-b border-gray-300 font-display">
            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">From:</span>
                <span class="rounded px-1">
                    <Input v-model="from"></Input>
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">To:</span>
                <span class="rounded px-1">
                    @User
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">Subject:</span>
                <span class="rounded px-1">
                    <Input v-model="subject"></Input>
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">Date:</span>
                <span class="rounded px-1">
                    <Input v-model="date"></Input>
                </span>
            </div>

            <div class="grid grid-cols-[60px_1fr] gap-2">
                <span class="font-bold">Link:</span>
                <span class="rounded px-1">
                    <Input v-model="link"></Input>
                </span>
            </div>
        </div>
        <!-- ... rest of template ... -->

        <div class="space-y-4 bg-gray-100 p-6 font-display  rounded-br-sm rounded-bl-sm">
            <Button @click="emit('addBody')"> <Plus></Plus> Add Content</Button>
            <div class="whitespace-pre-line leading-relaxed  text-gray-700">
                
                <div class="space-y-3">
                    <template v-for="(value, index) in body" :key="index">
                        <p v-if="value.charAt(0) == '#'" class="text-blue-800 flex items-center gap-2">
                            <Textarea v-model="body[index]" />
                            <Button @click="emit('removeBody', index)" variant="destructive"><Trash2></Trash2></Button>
                        </p>

                        <p v-else class="flex items-center gap-2">
                            <Textarea v-model="body[index]" />
                            <Button @click="emit('removeBody', index)" variant="destructive"><Trash2></Trash2></Button>
                        </p>
                    </template>
                </div>
            </div>
            <hr class="border-t border-gray-300" />
            
            <Textarea v-model="footer" />

        </div>
    </div>
</template>