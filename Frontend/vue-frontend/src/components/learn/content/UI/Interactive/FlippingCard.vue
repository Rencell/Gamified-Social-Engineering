<template>

    <div v-if="editable" class="mb-4">
        <Card>
            <CardContent>
                <Button v-show="canMoveUp" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Up"
                    @click="reorderComponent('up')">
                    <ChevronUp class="w-3 h-3" />
                </Button>
                <Button v-show="canMoveDown" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Down"
                    @click="reorderComponent('down')">
                    <ChevronDown class="w-3 h-3" />
                </Button>

                <Button size="sm" variant="ghost" class="h-6 w-6 p-0" @click="deleteComponent">
                    <Trash2 class="w-4 h-4" color="red" />
                </Button>
            </CardContent>
        </Card>
    </div>
    <div :class="['relative w-full h-80 perspective-1000  rounded-lg', className]">


        <div :class="[
            'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer rounded-lg',
            { 'rotate-y-180': isFlipped },
            direction === 'next' ? 'slide-next' : '',
            direction === 'prev' ? 'slide-prev' : ''
        ]" @click="handleFlip" v-for="(value, index) in cards" :key="index" v-show="index === currentIndex - 1">
            <!-- Front of card -->
            <div
                class="shadow-lg bg-secondary card absolute inset-0 w-full h-full backface-hidden flex flex-col justify-center items-center p-6 border-t-4 border-t-blue-500 rounded-lg ">
                <div class="flex-1 flex items-center justify-center text-center">

                    <div v-if="!editable" class="text-xl font-bold text-foreground">
                        <LearningBold :text="value.front">
                        </LearningBold>
                    </div>

                    <div v-else>
                        <Textarea v-model="value.front" @click.stop @input="toggleSave = true"
                            class="min-h-[60px] resize-none"></Textarea>
                    </div>
                </div>
                <div class="flex justify-end w-full">
                    <RotateCcw class="w-5 h-5 text-muted-foreground" />
                </div>
            </div>

            <!-- Back of card -->
            <div
                class="shadow-lg bg-secondary card absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6 border-t-4 border-t-green-500 rounded-lg ">
                <div class="flex-1 flex items-center justify-center text-center">
                    <div v-if="!editable" class="text-xl font-medium text-foreground">
                        <LearningBold :text="value.back">
                        </LearningBold>
                    </div>
                    <div v-else>
                        <Textarea v-model="value.back" @click.stop @input="toggleSave = true"
                            class="min-h-[60px] resize-none"></Textarea>
                    </div>
                </div>
                <div class="flex justify-end w-full">
                    <RotateCcw class="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </div>
        <!-- Buttons -->

    </div>

    <div class="w-full flex justify-between items-center">

        <div v-if="editable" class="flex gap-2">
            <Button size="icon" @click="pushCard">
                <Plus></Plus>
            </Button>
            <Button size="icon" @click="deleteCard">
                <Trash2 />
            </Button>
        </div>
        <div class="flex gap-5 max-w-sm mx-auto mt-4 ">

            <div @click="togglePrevious" class="cursor-pointer">
                <div :class="{ 'bg-accent/30': currentIndex <= 1 }" class="w-10 h-10 bg-accent rounded-full flex">
                    <ChevronLeft class="w-5 h-5 text-white m-auto"></ChevronLeft>
                </div>
            </div>

            <div class="w-full m-auto flex flex-col items-center">
                <p>{{ currentIndex }} of {{ data.length }}</p>
                <Progress class="h-1" :model-value="(currentIndex / data.length) * 100"></Progress>
            </div>

            <div class="cursor-pointer" @click="toggleNext">
                <div :class="{ 'bg-accent/30': currentIndex == data.length }"
                    class="w-10 h-10 bg-accent rounded-full flex">
                    <ChevronRight class="w-5 h-5 text-white m-auto"></ChevronRight>
                </div>
            </div>
        </div>

        <div v-if="editable" class="flex gap-2">
            <Button :disabled="!toggleSave" @click="updateProps({ data: obj })">
                <Save></Save>Save
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus, RotateCcw, Save, Trash2 } from 'lucide-vue-next'
import { Progress } from '@/components/ui/progress';
import type { FlippingCardData } from './types';
import pic from '/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/conversation.webp'
import type { Content } from '@/services/contentService';
import { useEditableText } from '@/composables/useEditableText';
import { Textarea } from '@/components/ui/textarea';
import LearningBold from '../Learning/Highlight/LearningBold.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const props = defineProps<{
    className?: string,
    data: FlippingCardData[]
    item?: Content,
    siblings?: Content[]
}>()

// Push new data
const obj = ref(props.data)

const toggleSave = ref(false)
const pushCard = () => {
    if (obj.value) {
        obj.value.push({ front: "New Front", back: "New Back" });
    }
    toggleSave.value = true
}

const deleteCard = () => {
    if (obj.value) {
        obj.value.splice(currentIndex.value - 1, 1);
    }
    toggleSave.value = true
}


const emit = defineEmits(['giveProps', 'signalDelete', 'moveOrder']);
const { editable, updateProps, deleteComponent, reorderComponent }
    = useEditableText({ data: obj }, emit)

const cards: FlippingCardData[] = props.data
const direction = ref<'next' | 'prev'>('next')
const currentIndex = ref(1)

const toggleNext = () => {
    if (currentIndex.value <= cards.length - 1) {
        currentIndex.value += 1
        direction.value = 'next'
    }
    isFlipped.value = false
}
const togglePrevious = () => {
    if (currentIndex.value > 1) {
        currentIndex.value -= 1
        direction.value = 'prev'
    }
    isFlipped.value = false
}



const isFlipped = ref(false)

const handleFlip = () => {
    isFlipped.value = !isFlipped.value
}

const canMoveUp = computed(() => {
  if (!props.item || !props.siblings) return false;
  const index = props.siblings.findIndex(sib => sib.id === props.item?.id);
  return index > 0;
});

const canMoveDown = computed(() => {
  if (!props.item || !props.siblings) return false;
  const index = props.siblings.findIndex(sib => sib.id === props.item?.id);
  return index < props.siblings.length - 1;
});
</script>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}

.transform-style-preserve-3d {
    transform-style: preserve-3d;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}

.backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}


.slide-next {
    animation: slideNext 0.7s ease-in-out;
}

@keyframes slideNext {
    0% {
        transform: translateX(20%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Animation for sliding to the previous card */
.slide-prev {
    animation: slidePrev 0.7s ease-in-out;
}

@keyframes slidePrev {
    0% {
        transform: translateX(-20%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
