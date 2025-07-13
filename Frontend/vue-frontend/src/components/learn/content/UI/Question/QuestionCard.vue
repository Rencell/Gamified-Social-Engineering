<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';

</script>

<template>

    <div class="flex justify-center">

        <div class="flex flex-col gap-4 p-6 w-xl">
            <p class="text-sm text-gray-300">Sort them according to their geographical size, from largest to
                smallest: MAN, WAN, LAN, PAN.</p>
            <div>
    
                <div class="flex gap-2 w-full">
                    <input type="text" placeholder="Answer Format: *****>**>*****>********"
                        class="text-sm w-full px-4 py-2 rounded bg-[#2A2A3B] text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                    <Button >Submit</Button>
                </div>
            </div>
        </div>
    </div>
</template>