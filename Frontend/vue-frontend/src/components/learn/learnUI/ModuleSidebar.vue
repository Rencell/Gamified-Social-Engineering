<script setup lang="ts">
import { ArrowLeft, ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import ModuleSidebarItem from './ModuleSidebarItem.vue';
import { useLearningStore } from '@/stores/learning';
import { ref, Transition } from 'vue';
import { useModuleStore } from '@/stores/module';

const learningStore = useLearningStore();
const moduleStore = useModuleStore();
const hideSideBar = ref(false);


</script>

<template>
    <div class="sticky top-0 self-start">
        <div class="bg-secondary rounded-lg " :class="{ 'w-70': !hideSideBar }">

            <div class="flex items-center justify-between">
                <Transition name="hideLeft" mode="out-in">
                    <RouterLink :to="{ name: 'Learn-Phishing' }" v-show="!hideSideBar"
                        class="p-4 flex gap-2 text-sm items-center text-accent border-b-1 border-background">

                        <ArrowLeft :size="15"></ArrowLeft> Back
                    </RouterLink>
                </Transition>

                <div class="p-4 animate-in" @click="hideSideBar = !hideSideBar ">
                    <PanelRightClose v-if="hideSideBar" />
                    <PanelLeftClose v-else />
                </div>
            </div>
            
            <Transition name="hideLeft" mode="out-in">
                <div v-show="!hideSideBar" class="p-4 ">
                    <div class="flex justify-between">
                        
                        <p class="font-semibold text-xl">All lessons</p>

                        <div class="gap-2 flex">
                            <Button size="sm" variant="outline" @click="moduleStore.previousModule()">
                                <ChevronLeft :size="17"></ChevronLeft>
                            </Button>
                            <Button size="sm" variant="outline" @click="moduleStore.nextModule()">
                                <ChevronRight :size="17"></ChevronRight>
                            </Button>
                        </div>
                    </div>
                    <slot></slot>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.hideLeft-enter-active,
.hideLeft-leave-active {
    transition: opacity 0.3s, width 0.3s;
    overflow: hidden;
}

.hideLeft-enter-from,
.hideLeft-leave-to {
    opacity: 0;
    width: 0;
    white-space: nowrap;
}

.hideLeft-enter-to,
.hideLeft-leave-from {
    opacity: 1;
    width: 100%;
    white-space: nowrap;
}
</style>