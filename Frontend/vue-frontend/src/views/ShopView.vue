<template>


    <RouterLink :to="{ name: 'Home' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>
    <div class="space-y-4">
        <div>
            <div class="p-4 w-full bg-blue-600 rounded-tr-lg rounded-tl-lg">
                <p class="text-2xl font-bold text-white text-center">Welcome to Cyber Shop</p>
            </div>
            <div class="h-3 bg-[#6070A3]"></div>
            <div class="h-6 bg-[#9EACDA] w-full"></div>
        </div>

        <!-- Empty state -->
        <div v-if="shop_list.length === 0" class="p-4 text-center text-sm text-muted-foreground">
            No displayed items
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-3 md:gap-6">
            <div v-for="value in shop_list" :key="value.id" class="p-2 space-y-4 bg-secondary rounded-lg ">
                <div class="flex mb-2 gap-2 justify-center">
                    <DeleteItems :cosmetic-id="value.id" />
                    <UpdateItems :data="value" />
                </div>
                <div>
                    <img :src="String(value.image)" class="rounded-lg h-35 md:h-45 w-full object-top object-cover" alt="">
                </div>
                <div
                    class="bg-linear-to-r from-transparent via-blue-500/40 to-transparent py-1 md:py-2 mb-3 text-center text-xs uppercase font-semibold text-blue-500 mx-auto">
                    <span>Common</span>
                </div>

                <div class="text-center space-y-2">
                    <h1 class="text-sm font-bold">{{ value.name }}</h1>
                    <p class="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet.
                    </p>
                </div>

                <div>
                    <div v-if="authStore.User.is_admin" class="mb-2 text-center text-sm font-medium bg-accent rounded py-2">
                        Price: {{ value.price }} Coins
                    </div>

                    <Button v-else class="w-full" :disabled="value.price > authStore.User.coin"
                        :class="value.price > authStore.User.coin ? 'bg-background' : ''" @click="buyItem(value)">

                        <template v-if="value.purchased">
                            <p class="font-bold text-sm text-green-500">Owned</p>
                        </template>
                        <template v-else>
                            <img :src="coin" class="w-6 h-6" alt="">
                            <p class="font-bold text-sm -ms-1">{{ value.price }}</p>
                        </template>
                    </Button>

                </div>

            </div>

            <AddItems />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import coin from '/Home/coin.svg';
import { onMounted, ref } from 'vue';
// import { CosmeticService } from '@/services';
import type { Cosmetic } from '@/services/cosmeticService';
import { useAuthStore } from '@/stores/auth';
import { useRewardStore } from '@/stores/reward';
import { useCosmeticStore } from '@/stores/cosmetic';
import AddItems from '@/components/home/shop/addItems.vue'
import UpdateItems from '@/components/home/shop/updateItems.vue'
import DeleteItems from '@/components/home/shop/deleteItems.vue'
const cosmeticStore = useCosmeticStore();
const purchaseItem = useRewardStore();
const authStore = useAuthStore();

// Track the current list and remove items once purchased
const shop_list = ref<(Cosmetic & { purchased: boolean })[]>([]);

const buyItem = async (item: Cosmetic & { purchased: boolean }) => {
    if (authStore.User.coin >= item.price) {
        await purchaseItem.purchaseCoinDeduct(item.price)
        await cosmeticStore.purchaseCosmetic(item);
        await cosmeticStore.updateInventory();
        authStore.User.coin -= item.price;
        item.purchased = true;
        // Remove the purchased item from the displayed list
        shop_list.value = shop_list.value.filter(i => i.id !== item.id);
        console.log('Purchase successful');
    };
}

onMounted(async () => {
    try {
        await cosmeticStore.fetchCosmeticItems()
        // Initialize list from store
        shop_list.value = cosmeticStore.item_cosmetics.map(item => ({
            ...item,
            purchased: false
        }));
    } catch (error) {
        console.error('Error fetching cosmetics:', error);
    }
});
</script>