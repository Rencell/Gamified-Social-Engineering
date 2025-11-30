<script setup lang="ts">
import { ref } from 'vue';
import type { CosmeticInventory } from '@/services/cosmeticService';
import { useCosmeticStore } from '@/stores/cosmetic';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-vue-next';
const cosmeticStore = useCosmeticStore();

const isOpen = ref(true);

defineProps<{
    inventory_items: CosmeticInventory[];
    category?: 'Avatar' | 'Background';
}>();

const isAvatarEquipped = (item: string) => {
    return item === cosmeticStore.equipAvatar?.name;
};
const isBackgroundEquipped = (item: string) => {
    return item === cosmeticStore.equipBackground?.name;
};

</script>

<template>
    <div class="mt-4 p-4 flex justify-between items-center hover:bg-secondary rounded-lg cursor-pointer" @click="isOpen = !isOpen">
        <p class="font-bold">{{ category }}</p>
        <ChevronDown class="w-5 h-5 transition-transform" :class="{'rotate-180': !isOpen}" />

    </div>
    <transition name="slide-fade">
        <div v-if="isOpen">
            <hr>
            <div class="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-3 md:gap-6 pt-5">
                <div v-for="(value, index) in inventory_items" :key="index" class="p-2 space-y-4 bg-secondary rounded-lg">

                    <div>
                        <img :src="String(value.item.image)" class="rounded-lg h-45 w-full object-cover object-top" alt="">
                    </div>
                    <div
                        class="bg-linear-to-r from-transparent via-blue-500/40 to-transparent py-1 md:py2 px-20 mb-3 text-center text-xs uppercase font-semibold text-blue-500 mx-auto">
                        <span>Common</span>
                    </div>

                    <div class="text-center space-y-2">
                        <h1 class="text-sm font-bold">{{ value.item.name }}</h1>
                    </div>

                    <div>
                        <Button class="w-full bg-background" @click="cosmeticStore.setCosmetic(value); cosmeticStore.toast_notification('Inventory has been updated')" :class="[
                            value.item.type === 'avatar'
                                ? (isAvatarEquipped(value.item.name) ? 'bg-accent/20' : 'text-white')
                                : (isBackgroundEquipped(value.item.name) ? 'bg-accent/20' : 'text-white')
                        ]">
                            <p>
                                {{
                                    value.item.type === 'avatar'
                                        ? (isAvatarEquipped(value.item.name) ? 'Equipped' : 'Equip')
                                        : (isBackgroundEquipped(value.item.name) ? 'Equipped' : 'Equip')
                                }}
                            </p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>