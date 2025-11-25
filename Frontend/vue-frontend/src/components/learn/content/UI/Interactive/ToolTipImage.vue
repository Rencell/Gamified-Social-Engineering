<template>

    <div v-if="editable" class="space-y-4">
        <Card>
            <CardContent class="flex justify-between">
                <div class="flex gap-2 items-center">
                    <Button @click.stop="toggleAddHotspot" size="sm">
                        <Plus v-if="!addHotspot"></Plus>
                        <ChevronLeft v-else></ChevronLeft>
                        {{ addHotspot ? 'Cancel' : 'Add Hotspot' }}
                    </Button>
                    <Button @click.stop="saveHandler()" class="bg-green-700" size="sm">
                        <Check></Check>
                        Save Changes
                    </Button>
                    <p v-if="successMessage" class="text-xs text-green-500" v-show="successMessage">
                        Save success!
                    </p>
                </div>

                <div>
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
                </div>
            </CardContent>
        </Card>

        <Input type="file" class="mb-4" @change="imageTool.onFileChange" />
    </div>


    <div class="relative" ref="container" @click="handleImageClick">

        <div v-show="addHotspot"
            class="rounded-lg absolute inset-0 bg-black/70 border-2 border-white border-dashed z-40 flex items-center justify-center">
            <div>Click anywhere to add a hotspot</div>
        </div>
        <img :src="imageTool.previewUrl.value! || useImageUrl(image)!" class="w-full rounded-lg" alt="Phishing Email" />
        <div v-for="area in areasData" :key="area.id"
            class="absolute bg-accent text-black size-8 rounded-full shadow-xl text-sm flex justify-center items-center border-slate-700/50 border-1 motion-preset-pop cursor-pointer hover:border-red-300 transition-all duration-150"
            :class="setAnimationDelay"
            style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
            @click="toggle(area.id)" :style="{ top: `${area.y}px`, left: `${area.x}px` }">

            <p class="font-bold text-lg text-white">+</p>

        </div>

        <div v-show="loading"
            class="absolute z-99 flex w-sm flex-col gap-5 bg-secondary text-primary p-5  rounded-xl border-accent animate-fade-in motion-preset-slide-right "
            :class="{ 'ms-10': currentArea?.position?.includes('right') || !currentArea?.position }"
            style="box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;"
            :style="getPositionStyle(currentArea)">
            <div v-if="editable" class="flex flex-col gap-5">
                <div class="flex justify-end">

                    <div class="flex gap-2">
                        <Button size="icon" class="h-6 w-6 p-0" @click="updatePosition('topleft')">
                            <MoveUpLeft class="w-4 h-4" />
                        </Button>
                        <Button size="icon" class="h-6 w-6 p-0" @click="updatePosition('topright')">
                            <MoveUpRight class="w-4 h-4" />
                        </Button>
                        <Button size="icon" class="h-6 w-6 p-0" @click="updatePosition('bottomleft')">
                            <MoveDownLeft class="w-4 h-4" />
                        </Button>
                        <Button size="icon" class="h-6 w-6 p-0" @click="updatePosition('bottomright')">
                            <MoveDownRight class="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" class="h-6 w-6 p-0" @click="deleteArea">
                            <Trash2 class="w-4 h-4" color="red" />

                        </Button>
                    </div>
                </div>
                <div v-if="currentArea" class="flex flex-col gap-2">

                    <Input v-model="currentArea.title"></Input>
                    <Textarea v-model="currentArea.description"></Textarea>
                </div>
            </div>
            <div v-else>
                <strong class="text-lg font-bold font-sans motion-preset-fade  motion-delay-300">
                    {{ currentArea?.title }}
                </strong>
                <p class="text-sm font-semibold motion-preset-fade  motion-delay-400">{{ currentArea?.description }}</p>
            </div>
            <div class="w-full flex gap-2 justify-end">
                <Button class="bg-primary text-black"
                    @click.stop="loading = !loading; toggleTooltip = null">Close</Button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TooltipData } from './types'
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronLeft, ChevronUp, MoveDownLeft, MoveDownRight, MoveUpLeft, MoveUpRight, Plus, Trash2 } from 'lucide-vue-next';
import { useImageUrl } from '@/composables/useImageUrl';
import type { Content } from '@/services/contentService';
import { useEditableText } from '@/composables/useEditableText';
import { Card, CardContent } from '@/components/ui/card';
import Input from '@/components/ui/input/Input.vue';
import { Textarea } from '@/components/ui/textarea';
import { useUploadContent } from '@/composables/useUploadContent';


const imageTool = useUploadContent();

const props = defineProps<{
    areas: TooltipData[]
    animationDelay?: number
    image?: string
    item?: Content
    siblings?: Content[];
}>()

const areasData = computed(() => props.areas);
const image = ref(props.image);
const loading = ref(false);
const addHotspot = ref(false);


async function handleUploadImage() {
    await imageTool.uploadImage(
        { item: { id: props.item?.id }, image: image.value },
        (data) => {
            if (image.value) {
                image.value = data.image;
            }
        }
    );

}

const successMessage = ref(false);
const saveHandler = async () => {
    if (imageTool.previewUrl.value) {
        await handleUploadImage();
    }
    updateProps({ areas: areasData.value, image: image.value })
    successMessage.value = true;
    setTimeout(() => {
        successMessage.value = false;
    }, 2000);
}

const updatePosition = (position: "topleft" | "topright" | "bottomleft" | "bottomright") => {
    const area = areasData.value.find(area => area.id === toggleTooltip.value);
    if (area) {
        area.position = position;
    }
};
const deleteArea = () => {
    const area = areasData.value.find(area => area.id === toggleTooltip.value);

    if (area) {
        const index = areasData.value.indexOf(area);
        areasData.value.splice(index, 1);
        toggleTooltip.value = null;
    }
    loading.value = false
};
const toggleAddHotspot = () => {
    addHotspot.value = !addHotspot.value;
    loading.value = false
}


const setAnimationDelay = computed(() => {
    const num = props.animationDelay || 15
    return `motion-delay-${num}00`
});

const toggle = (area: string) => {
    if (toggleTooltip.value === area) {
        toggleTooltip.value = null
        loading.value = false
        return
    }
    toggleTooltip.value = toggleTooltip.value === area ? null : area;
    setTimeout(() => {
        loading.value = true
    }, 100);
}
const toggleTooltip = ref<string | null>(null);

const currentArea = computed(() => {
    return areasData.value.find(area => area.id === toggleTooltip.value) || null;
});

const getPositionStyle = (area: TooltipData | null) => {
    if (!area) return {};

    const baseStyle = { top: `${area.y}px`, left: `${area.x}px` };

    switch (area.position) {
        case 'topleft':
            return { ...baseStyle, transform: 'translate(-100%, -100%)' };
        case 'topright':
            return { ...baseStyle, transform: 'translate(0, -100%)' };
        case 'bottomleft':
            return { ...baseStyle, transform: 'translate(-100%, 0)' };
        case 'bottomright':
            return { ...baseStyle, transform: 'translate(0, 0)' };
        default:
            return baseStyle; // Default to top-left alignment
    }
};


const container = ref<HTMLElement | null>(null);

const handleImageClick = (e: MouseEvent) => {
    if (!addHotspot.value) return;

    const rect = container.value?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newArea: TooltipData = {
        id: Date.now().toString(),
        title: "New Hotspot",
        description: "Click to edit",
        x,
        y,
        position: 'bottomleft',
    };

    areasData.value.push(newArea);
    addHotspot.value = false;
};

// Emits an event when an image is selected
const emit = defineEmits(['imageSelected', 'showDown', 'addComponent', 'giveProps']);

const { editable, updateProps, deleteComponent, reorderComponent }
    = useEditableText(null, emit)

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