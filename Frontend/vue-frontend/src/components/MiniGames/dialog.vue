<script setup lang="ts">
defineOptions({ name: 'MiniGameDialog' })
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';




const props = defineProps<{
    MiniGame: Minigame;
}>();

const minigame = computed(() => props.MiniGame);
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-vue-next';
import type { Minigame } from '@/services/minigameService';
import { useMiniGameStore } from '@/stores/minigame';
// control dialog open state
const miniGameStore = useMiniGameStore();
const open = ref(false);

const saveMinigame = () => {
    
    miniGameStore.updateMinigames(minigame.value);
    open.value = false;
};


function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    minigame.value.thumbnail = file;
  } else {
    minigame.value.thumbnail = '';
  }
}

</script>


<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button>
                <Wrench class="fill-white size-4 me-2"></Wrench>
                        Edit
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Mini Game</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new lesson. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            
            <!-- Minigame fields -->
            <div class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <Label class="text-sm font-medium">Name</Label>
                    <Input v-model="minigame.name" placeholder="Minigame name" />
                </div>

                <div class="grid gap-2">
                    <Label class="text-sm font-medium">Required level</Label>
                    <Input v-model="minigame.required_level!" type="number" min="0" step="1" placeholder="e.g. 3" />
                </div>

                <div class="grid gap-2">
                    <Label class="text-sm font-medium">Route path</Label>
                    <Input v-model="minigame.route_path" placeholder="/minigames/example" />
                </div>

                <div class="grid gap-2">
                <div class="grid gap-2">
                    <Label class="text-sm font-medium">Thumbnail URL</Label>
                    <Input @change="onFileChange" type="file" />
                </div>
                <div class="grid gap-2">
                    <Label class="text-sm font-medium">Card color</Label>
                    <Input v-model="minigame.card_color" type="color" placeholder="#ff00aa or rgb(255,0,170)" />
                </div>
            </div>
            </div>

            <DialogFooter>
                <Button @click="saveMinigame">Save Lesson</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>