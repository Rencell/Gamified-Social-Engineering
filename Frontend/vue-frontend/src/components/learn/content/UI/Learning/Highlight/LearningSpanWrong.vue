<template>

    <span class="font-bold">
        <CircleX class=" inline-block mr-3 text-red-500" />
        <span class="text-red-300">
            <slot></slot>
        </span>
    </span>
</template>

<script setup lang="ts">
import { CircleX } from 'lucide-vue-next';

</script>