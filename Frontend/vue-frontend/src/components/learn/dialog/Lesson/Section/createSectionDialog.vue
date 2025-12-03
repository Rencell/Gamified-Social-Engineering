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
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
const lessonStore = useLessonStore();
const sectionStore = useSectionStore();
const route = useRoute();


const formData = ref<Partial<Section>>({
    name: '',
    description: '',
    lesson: 0,
});

// Add validation state
const errors = ref<{ name?: string; description?: string }>({});
const touched = ref<{ name: boolean; description: boolean }>({ name: false, description: false });

const validate = () => {
    const e: typeof errors.value = {};
    if (!formData.value.name || formData.value.name.trim().length === 0) {
        e.name = 'Title is required.';
    }
    const descLen = (formData.value.description || '').trim().length;
    if (descLen < 5) {
        e.description = 'Description must be at least 5 characters.';
    }
    errors.value = e;
    return Object.keys(e).length === 0;
};

// Function to handle saving the form data
const saveSection = () => {
    touched.value = { name: true, description: true };
    if (!validate()) return;

    formData.value.lesson = lessonStore.currentLesson?.id || 0;
    sectionStore.createSection(formData.value as Section);
    formData.value.name = '';
    formData.value.description = '';
    errors.value = {};
    touched.value = { name: false, description: false };
};

</script>

<template>
    
    <Dialog>
        <DialogTrigger>
            <Button>
                <Plus /> Create Section
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
                    <Input v-model="formData.name" type="text" placeholder="Enter module title"
                           @blur="touched.name = true; validate()"
                           @input="touched.name && validate()" />
                    <p v-if="touched.name && errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                </div>
            </div>
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Description</Label>
                    <Textarea v-model="formData.description" type="text" placeholder="Enter module description"
                              @blur="touched.description = true; validate()"
                              @input="touched.description && validate()" />
                    <p v-if="touched.description && errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
                </div>
            </div>

            <DialogFooter>
                <DialogClose as-child>
                    <Button @click="saveSection" :disabled="!validate()" :class="[{ 'opacity-50 cursor-not-allowed': !validate() }]">Save Section</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    
</template>