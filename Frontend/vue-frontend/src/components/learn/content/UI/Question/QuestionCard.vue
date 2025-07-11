<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';

Button

</script>

<template>

    <hr class="border-background border-2">
    <div class="flex flex-col gap-4 my-3 p-6">
        <p class="text-sm"><strong>Question</strong>: Sort them according to their geographical size, from largest to
            smallest: MAN, WAN, LAN, PAN.</p>
        <div>

            <div class="flex gap-2 w-xl">
                <input type="text" placeholder="Answer Format: *****>**>*****>********"
                    class="text-sm w-full px-4 py-2 rounded bg-[#2A2A3B] text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                <Button >Submit</Button>
            </div>
        </div>
    </div>
</template>