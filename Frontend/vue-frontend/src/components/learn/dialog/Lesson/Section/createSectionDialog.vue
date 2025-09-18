<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
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
import { Plus } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLessonStore } from '@/stores/lesson';
import type { ModuleTest } from '@/services/moduleService';
import { Checkbox } from '@/components/ui/checkbox';
import { useSectionStore } from '@/stores/sections';
import { useRoute } from 'vue-router';
import type { Section } from '@/services/sectionService';   
const lessonStore = useLessonStore();
const sectionStore = useSectionStore();
const route = useRoute();


const formData = ref<Partial<Section>>({
    name: '',
    description: '',
    lesson: 0,
});


// Function to handle saving the form data
const saveSection = () => {
    formData.value.lesson = lessonStore.currentLesson?.id || 0;
    sectionStore.createSection(formData.value as Section);
    formData.value.name = '';
    formData.value.description = '';
};

</script>

<template>
    
    <Dialog>
        <DialogTrigger>
            <Button>
                <Plus /> Section
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Section</DialogTitle>
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