<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import type { CosmeticInventory } from '@/services/cosmeticService';
import { CosmeticService } from '@/services';
import { onMounted, ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { useCosmeticStore } from '@/stores/cosmetic';
import Avatar from '@/components/inventory/avatar.vue'
const inventory_items = ref<CosmeticInventory[]>([]);
const filterInvetory = ref<CosmeticInventory[]>([]);
const filterBackground = ref<CosmeticInventory[]>([]);
const cosmeticStore = useCosmeticStore();

onMounted(async () => {
    await cosmeticStore.fetchCosmetics();
    await cosmeticStore.fetchInventory();
    inventory_items.value = cosmeticStore.inventory_items;
    filterInvetory.value = inventory_items.value.filter(item => item.item.type === 'avatar');
    filterBackground.value = inventory_items.value.filter(item => item.item.type === 'background');
});
   


</script>
<template>


    <RouterLink :to="{ name: 'Home' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>

    <p class="text-2xl font-bold">Inventory</p>

    <Avatar :inventory_items="filterInvetory" :category="'Avatar'" />

    
    <Avatar :inventory_items="filterBackground" :category="'Background'" />
</template>
