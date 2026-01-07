<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import type { CosmeticInventory } from '@/services/cosmeticService';
import { computed, onMounted } from 'vue';
import { useCosmeticStore } from '@/stores/cosmetic';
import Avatar from '@/components/inventory/avatar.vue'
const cosmeticStore = useCosmeticStore();
// Use computed to keep filters reactive to store updates
const avatars = computed<CosmeticInventory[]>(() =>
  cosmeticStore.inventory_items.filter(i => i.item?.type === 'avatar')
);
const backgrounds = computed<CosmeticInventory[]>(() =>
  cosmeticStore.inventory_items.filter(i => i.item?.type === 'background')
);

onMounted(async () => {
    await cosmeticStore.fetchCosmetics();
    await cosmeticStore.fetchInventory();
});
</script>
<template>
    <RouterLink :to="{ name: 'Home' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>

    <p class="text-2xl font-bold">Inventory</p>

    <Avatar :inventory_items="avatars" :category="'Avatar'" />
    <Avatar :inventory_items="backgrounds" :category="'Background'" />
</template>
