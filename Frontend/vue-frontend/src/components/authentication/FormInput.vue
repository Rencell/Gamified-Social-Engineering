<script setup lang="ts">
import { computed } from 'vue';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const emit = defineEmits(['update:modelValue', 'clear']);

const model = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})


const props = defineProps<{
    modelValue: string;
    id: string;
    type: string;
    error?: string;
}>();

</script>
<template>

    <div class="space-y-2">
        <Label :for="id" class="text-white font-bold text-xs">
            {{ id }}
        </Label>
        <Input v-model="model" :id="id" :type="type" :placeholder="id" @input="emit('clear')"
            class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
        <transition name="fade">
            <p v-if="error" class="text-red-500 text-xs transition-all duration-100">{{ error }}</p>
        </transition>
    </div>


</template>



<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
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

