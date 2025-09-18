<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Edit2, Plus, Wrench } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLessonStore } from '@/stores/lesson';
import type { Section } from '@/services/sectionService';
import { useSectionStore } from '@/stores/sections';

const props = defineProps<{
    section: Section
}>()

const formData = ref<Partial<Section>>({
    name: props.section.name,
    description: props.section.description,
    lesson: props.section.lesson,
    id: props.section.id,
});

const sectionStore = useSectionStore();
const lessonStore = useLessonStore();

// Function to handle saving the form data
const saveSection = () => {
    formData.value.lesson = lessonStore.currentLesson?.id || 0;
    sectionStore.updateSection(formData.value as Section);
};

</script>

<template>
    <Dialog>
        <DialogTrigger>
            <Button variant="ghost" size="icon">
                <Wrench class="size-5" />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Section</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new lesson. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <!-- Form Fields -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Title</Label>
                    <Input v-model="formData.name" type="text" placeholder="Enter module title" />

                </div>
            </div>
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Description</Label>
                    <Textarea v-model="formData.description" type="text" placeholder="Enter module description" />

                </div>
            </div>

            <DialogFooter>

                <Button @click="saveSection">Save Section</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>