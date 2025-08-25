<template>

    <span class="font-bold ">
        <CircleCheck class=" inline-block mr-3 text-green-500" />
        <span class="text-green-300">
            <slot></slot>
        </span>
    </span>
</template>

<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next';

</script>