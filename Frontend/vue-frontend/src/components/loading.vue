<script setup lang="ts">
import { Spinner } from './ui/spinner';

</script>

<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="flex gap-3 items-center font-display">
            <Spinner></Spinner>
            <p class="font-semibold text-xl">Fetching Data</p>
        </div>
    </div>
</template>